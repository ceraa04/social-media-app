import request from "supertest";
import app from "../app";
import { Types } from "mongoose";
import { Request, Response } from 'express';
// Types of data
import { userType } from "../types/userType";
// Models
import User from "../models/User"

import { deleteUser, editUser, getUser } from "../controllers/userController";



describe('Check "/home" route', () => {
    it('It loads home page, FAIL!', async () => {
        const response = await request(app).get('/')
        expect(response.status).toBe(404);
    });
    it('It loads home page, SUCCESS!', async () => {
        const response = await request(app).get('/home')
        expect(response.status).toBe(200);
    });
});
describe('Check "/users/api" route', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    // 1. CLIENT REQUESTS ALL USERS FROM DB
    it('Loads all users, SUCCESS!', async () => {
        const mockUsers = [{ name: 'John', age: 30 }, { name: 'Jane', age: 25 }];
        jest.spyOn(User, 'find').mockResolvedValueOnce(mockUsers);

        const response = await request(app).get('/api/users');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ users: mockUsers });
    });
    // 2. DB FAILS TO GET ALL USERS TO CLIENT
    it('Loads all users, FAIL!', async () => {
        const mockUsers = [{ name: 'John', age: 30 }, { name: 'Jane', age: 25 }];
        jest.spyOn(User, 'find').mockRejectedValueOnce(new Error('Failed to get all users!'));

        const response = await request(app).get('/failURL');
        expect(response.status).toBe(404);
    });
});


describe('Check "/api/users/:id" route', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });
    // TEST GET METHOD FOR USER

    // 1. CLIENT REQUESTS TO GET USER THAT IS NONEXISTING IN DB
    it('GET method single user, 404', async () => {
        // Wrong id
        const userId = 'sampleUserId';
        const response = await request(app).get(`/api/users/${userId}`);
        expect(response.status).toBe(404)
    });

    // 2. CLIENT REQUESTS FOR USER THAT IS IN DB
    describe('GET method single user, 200', () => {
        const userData = {
            name: 'Test',
            surname: 'User',
            age: 30,
            birthday: new Date(),
            password: 'testPassword',
            username: 'BettieChandler',
            avatar: '',
        };

        let username: string;

        beforeAll(async () => {
            // Create a user record in the database, for testing
            const user = await User.create(userData);
            username = user.username;
        });

        // Delete that user record that was made in beforeAll
        afterAll(async () => {
            await User.deleteOne({ username: username })
        })
        it('GET method single user, 200', async () => {
            const req = { params: { username: username } } as unknown as Request;
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            } as unknown as Response;

            await getUser(req, res)
            expect(res.status).toHaveBeenCalledWith(200)
        });
    })



    // TEST PATCH ( edit existing documents ) METHOD FOR USER

    // 1. CLIENT SENDS QUERY IN PATCH REQ THAT IS NOT TYPE OF OBJECTID
    it("EDIT user's profile, bad ID", async () => {
        // Wrong id
        const wrongId = 'dfgdfg';
        const req = { params: { id: wrongId } } as unknown as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        } as unknown as Response;

        await editUser(req, res)

        expect(res.status).toHaveBeenCalledWith(500);

    })
    // 2. CLIENT SENDS GOOD ID, BUT NO DOCUMENT WITH THAT ID IS FOUND IN DB
    it("EDIT user's profile, ID is good, but there is no document with that ID", async () => {
        const id = new Types.ObjectId();
        const update: Partial<userType> = {
            name: "Okp"
        }
        const req = {
            params: { id: id },
            body: update
        } as unknown as Request;

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        } as unknown as Response;

        await editUser(req, res)
        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.json).toHaveBeenCalledWith({ error: "Couldn't find document with that Id to edit" })
    })

    // 3. CLIENT SENDS GOOD ID, DOCUMENT WITH THAT ID IS FOUND
    // BUT HE DID NOT SPECIFY ANY UPDATES
    it("EDIT user's profile, ID is good, but no updates specified", async () => {
        const id = new Types.ObjectId();
        const update = null
        const req = {
            params: { id: id },
            body: update
        } as unknown as Request;

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        } as unknown as Response;

        await editUser(req, res)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({ message: "No updates were provided." })
    })

    // 4. CLIENT SPECIFIES UPDATE AND DOCUMENT IS FOUND, SO PATCH IS SUCCESS
    describe("EDIT user's profile, both ID and updates are good", () => {
        const userData = {
            name: 'Test',
            surname: 'User',
            age: 30,
            birthday: new Date(),
            password: 'testPassword',
            username: 'Ceraa04',
            avatar: '',
        };

        let userId: Types.ObjectId;

        beforeAll(async () => {
            // Create a user record in the database, for testing
            const user = await User.create(userData);
            userId = user._id;
        });

        // Delete that user record that was made in beforeAll
        afterAll(async () => {
            await User.deleteOne({ _id: userId })
        })

        it("Updates document succesful", async () => {
            const update: Partial<userType> = {
                name: "Jovan",
                age: 99
            }
            const req = {
                params: { id: userId },
                body: update
            } as unknown as Request;

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            } as unknown as Response;

            await editUser(req, res)
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledWith({ message: "Update succesful" })
        })
    })



    // TEST DELETE METHOD FOR USER

    // 1. CLIENT REQUESTS TO DELETE USER THAT IS NONEXISTENT IN DB
    it("DELETE user's profile, FAIL", async () => {

        const userId = "invalidUserID";
        jest.spyOn(User, 'deleteOne').mockRejectedValueOnce("Invalid user ID");

        const response = await request(app).delete(`/api/users/${userId}`);

        expect(response.status).toBe(404);
    });

    // 2. CLIENT REQUESTS TO DELETE USER THAT IS IN DB
    describe("DELETE user's profile, SUCCESS", () => {
        let userIdToDelete: Types.ObjectId;
        beforeAll(() => {
            userIdToDelete = new Types.ObjectId();
        });
        it("deletes user from DB", async () => {
            const req = { params: { id: userIdToDelete } } as unknown as Request;
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            } as unknown as Response;

            await deleteUser(req, res);

            expect(res.status).toHaveBeenCalledWith(204);
        });
    })

})