const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const client = new Client();

client.on('qr', (qr) => {
    // Generate and scan this code with your phone
    qrcode.generate(qr, {small: true });
});

client.on('ready', () => {
    console.log('Client is ready!');
});


client.initialize();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);



async function botFunction(message){
    
    try {
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: message,
            temperature: 0.9,
            max_tokens: 150,
            top_p: 1,
            frequency_penalty: 0.0,
            presence_penalty: 0.6,
            stop: [" Human:", " AI:"],
          });

          return response.data.choices[0].text;
    } catch (error) {
        return error.body
    }
}

client.on('message', msg => {
    console.log(msg.body)
    if (msg.body[0] == '!') {
        botFunction(msg.body).then(result => msg.reply(`${result}\n\n*** By *chatGPT* through *Munawar's Key* ***`));
    }
    else
    {
        msg.reply(`Dear *User* to chat with *chatGPT* Prompt your Query with *exclamation point* " *!* "`);
    }
});