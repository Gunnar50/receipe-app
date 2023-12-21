import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

let mongoServer: MongoMemoryServer;

export async function connectDB() {
	mongoServer = await MongoMemoryServer.create();
	const uri = mongoServer.getUri();

	// see that these options are deprecated, but the docs are still using them with the ts-ignore.
	await mongoose.connect(uri, {
		// @ts-ignore
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
}

export async function closeDB() {
	if (!mongoServer) return;
	await mongoose.connection.dropDatabase();
	await mongoose.connection.close();
	await mongoServer.stop();
}

export async function clearDB() {
	if (!mongoServer) return;
	const collections = mongoose.connection.collections;
	for (const key in collections) {
		await collections[key].deleteMany();
	}
}
