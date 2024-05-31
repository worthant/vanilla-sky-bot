import express from "express";
import { connectDB } from "./db/database";
import { flightRouter } from "./routes/flights";

const app = express();

app.use(express.json());
app.use("/api/flights", flightRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

connectDB();
