const express=require("express");
const cors=require("cors");
require("dotenv").config();

const aiRoute=require("./routes/ai");

const app=express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/ai",aiRoute);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server Running on ${PORT}`);
});