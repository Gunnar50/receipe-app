import http from "http";
import mongoose from "mongoose";
import app from "./utils/app";

// mongodb connection
mongoose.connect(process.env.MONGO_URI, { dbName: "RECIPE_APP_DB" });
const mongodb = mongoose.connection;
mongodb.on("error", (error: Error) => console.log(error));

const server = http.createServer(app);
const port = 6001 || process.env.PORT;
server.listen(6001, () => {
	console.log("Server running on port:", port);
});
