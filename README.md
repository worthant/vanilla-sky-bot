# System for parsing vanilla sky tickets

Check it by yourself: [t.me/ticket_checker_vanilla_bot](https://t.me/ticket_checker_vanilla_bot)

## Stack

- Node.js, Typescript
- Postgres, TypeORM
- Express, axios
- Telegraf
- Docker

## Architecture overview

- `Api server` - fetches data from vanilla sky website periodically and stores
  it in **postgres** database
- `Telegram bot` - interacts with user requests, uses server api's to get data
  from postgres database

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
