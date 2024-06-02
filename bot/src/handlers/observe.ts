import { Context, Markup } from 'telegraf';
import axios from 'axios';

const apiBaseUrl = 'http://api:5000/api/flights';
const observeState: { [key: number]: { from?: string; to?: string } } = {};

export const observeHandler = async (ctx: Context) => {
  await ctx.reply(
    'Choose a departure city:',
    Markup.inlineKeyboard([
      [
        Markup.button.callback('Tbilisi-1', 'departure_1'),
        Markup.button.callback('Ambrolauri-2', 'departure_2'),
      ],
      [
        Markup.button.callback('Batumi-4', 'departure_4'),
        Markup.button.callback('Kutaisi-5', 'departure_5'),
      ],
      [
        Markup.button.callback('Mestia-6', 'departure_6'),
        Markup.button.callback('Natakhtari-7', 'departure_7'),
      ],
      [Markup.button.callback('Aktau-8', 'departure_8')],
    ]),
  );
  console.log('User started observing flights:', ctx.from?.id);
};

export const handleDeparture = async (
  ctx: Context & { match: RegExpExecArray },
) => {
  const fromCode = ctx.match[1];
  const userId = ctx.from?.id;
  if (!userId) {
    return ctx.reply('User ID not found.');
  }
  observeState[userId] = { from: fromCode };
  await ctx.reply(
    'Choose an arrival city:',
    Markup.inlineKeyboard([
      [
        Markup.button.callback('Tbilisi-1', 'arrival_1'),
        Markup.button.callback('Ambrolauri-2', 'arrival_2'),
      ],
      [
        Markup.button.callback('Batumi-4', 'arrival_4'),
        Markup.button.callback('Kutaisi-5', 'arrival_5'),
      ],
      [
        Markup.button.callback('Mestia-6', 'arrival_6'),
        Markup.button.callback('Natakhtari-7', 'arrival_7'),
      ],
      [Markup.button.callback('Aktau-8', 'arrival_8')],
    ]),
  );
  console.log('User selected departure city:', userId, fromCode);
};

export const handleArrival = async (
  ctx: Context & { match: RegExpExecArray },
) => {
  const toCode = ctx.match[1];
  const userId = ctx.from?.id;
  if (!userId) {
    return ctx.reply('User ID not found.');
  }
  const userState = observeState[userId];
  if (!userState || !userState.from) {
    return ctx.reply('You need to select a departure city first.');
  }
  userState.to = toCode;
  try {
    console.log(`${apiBaseUrl}/${userState.from}/${userState.to}`);
    const response = await axios.get(
      `${apiBaseUrl}/${userState.from}/${userState.to}`,
    );
    console.log(`Response: ${response}`);
    console.log(`Data: ${response.data}`);

    const flights = response.data;
    if (flights.length === 0) {
      var cities = [];
      // TODO: Create DTO interface here for cities.
      // cities = await axios.get(`${apiBaseUrl}/cities`);
      // await ctx.reply(
      //   `No flights available from 
      //   ${cities.find((city) => city.code == userState.from)}
      //   to 
      //   ${cities.find((city) => city.code == userState.to)}`,
      // );
    } else {
      const flightList = flights
        .map(
          (flight: any) =>
            `From: ${flight.from}, To: ${flight.to}, Date: ${flight.date}`,
        )
        .join('\n');
      await ctx.reply(`Available Flights:\n\n${flightList}`);
    }
    console.log(
      'User selected arrival city and fetched flights:',
      userId,
      userState.from,
      userState.to,
      flights.length,
    );
  } catch (error) {
    console.error('Error fetching flights:', error);
    await ctx.reply('Failed to fetch flights.');
  }
};
