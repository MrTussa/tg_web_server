"use strict";

import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";
console.log(process.env.WEB_APP_URL);
const bot = new Telegraf(process.env.BOT_TOKEN);
bot.command("quit", async (ctx) => {
  await ctx.leaveChat();
});
bot.command("start", async (ctx) => {
  await ctx.telegram.sendMessage(
    ctx.message.chat.id,
    `Hello ${ctx.message.from.first_name} \nFirstly you need to fill the form`,
    {
      reply_markup: {
        inline_keyboard: [
          [{ text: "Open form", web_app: { url: process.env.WEB_APP_URL } }],
        ],
      },
    }
  );
});

bot.on(message("text"), async (ctx) => {
  await ctx.telegram.sendMessage(
    ctx.message.chat.id,
    `Hello ${ctx.message.from.first_name}`
  );
});

bot.on("callback_query", async (ctx) => {
  // Explicit usage
  await ctx.telegram.answerCbQuery(ctx.callbackQuery.id);

  // Using context shortcut
  await ctx.answerCbQuery();
});

bot.on("inline_query", async (ctx) => {
  const result = [];
  // Explicit usage
  await ctx.telegram.answerInlineQuery(ctx.inlineQuery.id, result);

  // Using context shortcut
  await ctx.answerInlineQuery(result);
});

bot.launch();

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
