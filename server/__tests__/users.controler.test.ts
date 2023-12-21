import { connectDB, clearDB, closeDB } from "./testdb";
import request from "supertest";
import app from "../src/utils/app";
import { createTestUser } from "./factories/users.factory";
import { HTTP_STATUS } from "../src/utils/httpStatus";
import { tryPromise } from "../src/utils/inlineHandlers";
import { getSessionByUserId } from "../src/models/session.model";


describe.only("RENAME ME", () => {
    beforeAll(async () => {
		await connectDB();
	});

	beforeEach(async () => {
		await clearDB()
	})

	afterAll(async () => {
		await clearDB();
		await closeDB();
	});
    
    it("I NEED A NEW NAME", async () => {
        const { user, sessionToken } = await logInUserAndGetSessionToken();

        const res = await request(app)
            .put(`/users/${user._id}`)
            .set("Cookie", [`sessionToken=${sessionToken.data?._id}`])
            .send({
                "username": "sillyemail@jester.com",
                "password": "newPassddd"
            });

        expect(res.statusCode).toBe(HTTP_STATUS.OK)
    })
})

// Maybe refactor this a bit and move to a helper func
async function logInUserAndGetSessionToken() {
    const user = await createTestUser();

    const login = await request(app).post("/auth/login").send({
        "email": user.email,
        "password": "password123"
    });

    expect(login.statusCode).toBe(HTTP_STATUS.OK);

    const sessionToken = await tryPromise(getSessionByUserId(user._id as unknown as string));
    return { user, sessionToken };
}
