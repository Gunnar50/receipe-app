import mongoose from "mongoose";

export interface Session {
	expiredAt: Date;
	userId: string;
}

const SessionSchema = new mongoose.Schema({
	expireAt: { type: Date },
	userId: { type: mongoose.Schema.Types.ObjectId, ref: "users", unique: true },
});

export const SessionModel = mongoose.model("session", SessionSchema);

// return a session object by session id
export const getSessionById = (sessionId: string) =>
	SessionModel.findById(sessionId);

// create a new session based on a user id
export const createNewSession = (values: Record<string, any>) =>
	new SessionModel(values).save().then((session) => session.toObject());

// delete a session
export const deleteSession = (sessionId: string) =>
	SessionModel.findByIdAndDelete(sessionId);

// return a session by a user id
export const getSessionByUserId = (userId: string) =>
	SessionModel.findOne({ userId });
