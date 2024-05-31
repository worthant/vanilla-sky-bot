import { Router } from 'express';
import axios from 'axios';
import { AppDataSource } from '../db/database';
import { Flight } from '../entity/Flight';

const router = Router();

// All cities in stupid Vanilla sky city--code encoding
const cities = [
	{ name: 'Tbilisi', code: '1' },
	{ name: 'Ambrolauri', code: '2' },
	{ name: 'Batumi', code: '4' },
	{ name: 'Kutaisi', code: '5' },
	{ name: 'Mestia', code: '6' },
	{ name: 'Natakhtari', code: '7' },
	{ name: 'Aktau', code: '8' },
];

router.get('/', async (req, res) => {
	try {
		const flights = await AppDataSource.getRepository(Flight).find();
		res.json(flights);
	} catch (error) {
		console.error('Error fetching flights:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

router.get('/:from/:to', async (req, res) => {
	const { from, to } = req.params;
	try {
		const flights = await AppDataSource.getRepository(Flight).find({
			where: { from, to },
		});
		res.json(flights);
	} catch (error) {
		console.error('Error fetching flights: ', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

const fetchAndStoreFlights = async () => {
	const flightRepository = AppDataSource.getRepository(Flight);
	try {
		for (const departure of cities) {
			for (const arrival of cities) {
				if (departure.code !== arrival.code) {
					const url = `https://ticket.vanillasky.ge/custom/check-flight/${departure.code}/${arrival.code}`;
					const response = await axios.get(url);
					const dates = response.data.from;
					for (const date of dates) {
						const existingFlight = await flightRepository.findOne({
							where: { from: departure.name, to: arrival.name, date },
						});
						if (!existingFlight) {
							const flight = new Flight();
							flight.from = departure.name;
							flight.to = arrival.name;
							flight.date = date;
							await flightRepository.save(flight);
						}
					}
				}
			}
		}
	} catch (error) {
		console.error('Error fetching and storing flights:', error);
	}
};

// Fetch and store flights every 10 minutes
setInterval(fetchAndStoreFlights, 10 * 60 * 1000);

fetchAndStoreFlights();

export { router as flightRouter };
