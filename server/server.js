const express=require("express");
const cors=require("cors");
require("dotenv").config();

const aiRoute=require("./routes/ai");

const app=express();

app.use(cors());
app.use(express.json());

app.use("/api/ai",aiRoute);

app.listen(5000,()=>{
console.log("Server Running");
});