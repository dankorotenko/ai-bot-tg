import TelegramBot from "node-telegram-bot-api";
import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { Configuration, OpenAIApi } from "openai";

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const bot = new TelegramBot(process.env.TELEGRAM_API_KEY, { polling: true });
const app = express();

app.use(cors());
app.use(express.json());

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  // if (text === '/start') {
  //     await bot.sendMessage(chatId, "Fill the form below", {
  //         reply_markup: {
  //             keyboard: [
  //                 [{ text: 'Fill the from', web_app: { url: webAppUrl + '/form' } }]
  //             ]
  //         }
  //     })

  //     await bot.sendMessage(chatId, "Enter our shop by pressing the button below!", {
  //         reply_markup: {
  //             inline_keyboard: [
  //                 [{ text: 'Make an order', web_app: { url: webAppUrl } }]
  //             ]
  //         }
  //     })
  // }
  try {

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${text}`,
      temperature: 0,
      max_tokens: 3000,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0,
    });
    bot.sendMessage(chatId, response.data.choices[0].text);
  } catch (err) {
    console.log(err);

    bot.sendMessage(chatId, err);
  }
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
