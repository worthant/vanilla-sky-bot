import { Context } from 'telegraf';
import axios from 'axios';

const apiBaseUrl = 'http://api:5000/api/flights';

export const flightsHandler = async (ctx: Context) => {
  try {
    const response = await axios.get(`${apiBaseUrl}/`);
    const flights = response.data;
    const flightList = flights
      .map(
        (flight: any) =>
          `From: ${flight.from}, To: ${flight.to}, Date: ${flight.date}`,
      )
      .join('\n');
    if (flightList) {
      await ctx.reply(`Available Flights:\n\n${flightList}`);
    } else {
      await ctx.reply('No flights available.');
    }
    console.log('Fetched flights:', flights.length);
  } catch (error) {
    console.error('Error fetching flights:', error);
    await ctx.reply('Failed to fetch flights.');
  }
};
