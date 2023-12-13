import express from "express";
import dotenv from "dotenv";
dotenv.config();

const app = express();

const port = 6001 || process.env.PORT;

app.listen(port, ()=>{
console.log("Server started on port:", port);
});