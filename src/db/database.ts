import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Flight } from '../entity/Flight';
import dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
	type: 'postgres',
	host: process.env.POSTGRES_HOST,
	port: Number(process.env.POSTGRES_PORT),
	username: process.env.POSTGRES_USER,
	password: process.env.POSTGRES_PASSWORD,
	database: process.env.POSTGRES_DB,
	entities: [Flight],
	synchronize: true,
});

export const connectDB = async () => {
	const maxRetries = 20;
	let retries = 0;

	while (retries < maxRetries) {
		try {
			await AppDataSource.initialize();
			console.log('PostgreSQL connected');
			break;
		} catch (error) {
			console.error(
				`Error connecting to PostgreSQL (attempt ${retries + 1}/${maxRetries}):`,
				error,
			);
			retries += 1;
			await new Promise((res) => setTimeout(res, 5000));
		}
	}
};
