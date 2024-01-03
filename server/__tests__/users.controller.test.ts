import request from "supertest";
import app from "../src/utils/app";
import { HTTP_STATUS } from "../src/utils/httpStatus";
import { loginUserGetToken } from "./helper/loginUser";
import { clearDB, closeDB, connectDB } from "./testdb";

describe.skip("RENAME ME", () => {
	beforeAll(async () => {
		await connectDB();
	});

	beforeEach(async () => {
		await clearDB();
	});

	afterAll(async () => {
		await clearDB();
		await closeDB();
	});

	it("I NEED A NEW NAME", async () => {
		const { user, sessionToken } = await loginUserGetToken();

		const res = await request(app)
			.put(`/users/${user._id}`)
			.set("Cookie", [`sessionToken=${sessionToken.data?._id}`])
			.send({
				username: "sillyemail@jester.com",
				password: "newPassddd",
			});

		expect(res.statusCode).toBe(HTTP_STATUS.OK);
	});
});
