import { Telegraf, Markup } from 'telegraf';
import dotenv from 'dotenv';
import { flightsHandler } from './handlers/flights';
import {
  observeHandler,
  handleDeparture,
  handleArrival,
} from './handlers/observe';

dotenv.config();

const bot = new Telegraf(process.env.HTTP_API_TOKEN as string);

bot.start((ctx) => {
  ctx.reply(
    'Welcome! Choose a command:',
    Markup.inlineKeyboard([
      Markup.button.callback('Flights', 'flights'),
      Markup.button.callback('Observe', 'observe'),
    ]),
  ).catch((error) => console.error('Error sending start message:', error));
  console.log('User started bot:', ctx.from?.id);
});

bot.command('flights', async (ctx) => {
  try {
    await flightsHandler(ctx);
    const markup = Markup.inlineKeyboard([
      [Markup.button.callback('Refresh Flights', 'flights')],
      [Markup.button.callback('Observe', 'observe')],
    ]);
    await ctx.reply('Choose an option:', markup);
    console.log('User requested flights via command:', ctx.from?.id);
  } catch (error) {
    console.error('Error handling /flights command:', error);
  }
});

bot.action('flights', async (ctx) => {
  try {
    await flightsHandler(ctx);
    const markup = Markup.inlineKeyboard([
      [Markup.button.callback('Refresh Flights', 'flights')],
      [Markup.button.callback('Observe', 'observe')],
    ]);
    await ctx.editMessageReplyMarkup(markup.reply_markup);
    console.log('User requested flights:', ctx.from?.id);
  } catch (error) {
    console.error('Error handling flights action:', error);
  }
});

bot.action('observe', async (ctx) => {
  try {
    await observeHandler(ctx);
    await ctx.editMessageReplyMarkup({ inline_keyboard: [] }); // Remove old buttons
    console.log('User started observe:', ctx.from?.id);
  } catch (error) {
    console.error('Error handling observe action:', error);
  }
});

bot.action(/^departure_(\d+)$/, async (ctx) => {
  try {
    await handleDeparture(ctx);
    await ctx.editMessageReplyMarkup({ inline_keyboard: [] }); // Remove old buttons
    console.log('User selected departure:', ctx.from?.id, ctx.match[1]);
  } catch (error) {
    console.error('Error handling departure action:', error);
  }
});

bot.action(/^arrival_(\d+)$/, async (ctx) => {
  try {
    await handleArrival(ctx);
    await ctx.editMessageReplyMarkup({ inline_keyboard: [] }); // Remove old buttons
    console.log('User selected arrival:', ctx.from?.id, ctx.match[1]);
  } catch (error) {
    console.error('Error handling arrival action:', error);
  }
});

bot.launch().then(() => {
  console.log('Telegram bot is running');
}).catch((error) => console.error('Error launching bot:', error));
