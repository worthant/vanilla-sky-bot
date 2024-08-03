# System for parsing vanilla sky tickets

Check it by yourself:
[t.me/ticket_checker_vanilla_bot](https://t.me/ticket_checker_vanilla_bot)

## Stack

- Node.js, Typescript
- Postgres, TypeORM
- Express, axios
- Telegraf
- Docker

## Feature request

- If you want to request any feature, feel free to go into the Issues tab and
  create a new one. I will review it, kindly respond, and ensure it's resolved
  properly.

## Contributing

1. Fork the repository:

- Click the `Fork` button on the Github repository page

2. Create a new branch:

```bash
git checkout -b feature/your-feature-name
```

3. Make your changes there

4. Create a Pull Request:

- Go to the original (this one) repo on Github and create a pull request from
  your fork
- Wait for my review, or even better - write to me in Telegram or send me an
  email (links in my profile's readme)

## Developement

### Prerequisires

- [Node.js](https://nodejs.org/en/download/package-manager) &
  [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- [Docker Desktop](https://docs.docker.com/desktop/), which is bundeled with
  everything, or just [Docker Engine](https://docs.docker.com/engine/install/) &
  [Docker Compose](https://docs.docker.com/compose/install/), which is less
  bloated way
- PostgreSQL (optional, because will be installed in docker-compose, but i
  recommend pgAdmin4 or some other tool to monitor it)

### Setting Up the Dev Environment

1. Clone repo:

```bash
git clone https://github.com/worthant/vanilla-sky-bot.git
```

2. Setup environment variables

> Create a `.env` file in the root directory and add the following variables:

```env
# Database Configuration
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=username
POSTGRES_PASSWORD=password
POSTGRES_DB=vanilla_sky

# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
```

3. Install dependencies:

```bash
# For api server
cd api
npm install
# For telegram bot
cd bot
bpm install
```

4. Build and start containers

```
docker-compose up --build
```

## Architecture overview

### Components

1. API Server:

- Fetches data from the Vanilla Sky website periodically.
- Stores only the valid data in the PostgreSQL database.
- Ensures data is never outdated.

2. Telegram Bot:

- Interacts with user requests.
- Uses the API server to get data from the PostgreSQL database.

### Architecture motivation

> Why not just fetch all data directly? Isn't this postgres an overhead?

1. Higher Throughput:

- Ensures higher throughput in case of a large number of user requests on the
  Telegram bot.

2. Reduced Delay:

- Fetching data from the API server's PostgreSQL database is faster than making
  REST API calls to the slow Vanilla Sky website, which can take over a minute.

3. Availability:

- Vanilla Sky website uptime is not 100%. If the website is down, data will
  still be available on the bot.

### Project Structure

```
vanilla-sky-bot/
├── api/
│   ├── src/
│   │   ├── db/
│   │   │   └── database.ts
│   │   ├── entity/
│   │   │   └── Flight.ts
│   │   ├── routes/
│   │   │   └── flights.ts
│   │   ├── index.ts
│   │   └── server.ts
│   ├── package-lock.json
│   ├── package.json
│   ├── tsconfig.json
│   └── Dockerfile
├── bot/
│   ├── src/
│   │   ├── handlers/
│   │   │   └── observe.ts
│   │   │   └── flights.ts
│   │   └── index.ts
│   ├── package-lock.json
│   ├── package.json
│   ├── tsconfig.json
│   └── Dockerfile
├── .env
├── docker-compose.yml
└── README.md
```
