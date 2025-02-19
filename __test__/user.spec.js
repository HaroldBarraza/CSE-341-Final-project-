const app = require('../server');
const supertest = require('supertest');
const { expect } = require('@jest/globals');
const mongodb = require('../data/databaseproduct'); 
const request = supertest(app)

let db;

describe('Users API', () => {
    beforeAll(async () => {
        await new Promise((resolve, reject) => {
            mongodb.intDb((err, database) => {
                if (err) {
                    return reject(err);
                }
                db = database;
                resolve();
            });
        });

        
        const existingUser  = await db.collection('user').findOne({ email: 'test@example.com' });
        if (!existingUser ) {
            await db.collection('user').insertMany([
                { _id: new mongodb.ObjectId(), name: 'Alice', lastname: 'Smith', email: 'test@example.com', phone: '1234567890' },
                { _id: new mongodb.ObjectId(), name: 'Bob', lastname: 'Johnson', email: 'bob@example.com', phone: '0987654321' }
            ]);
        }
    });

    afterAll(async () => {
        await db.collection('user').deleteMany({ email: { $in: ['test@example.com', 'bob@example.com'] } });
    });

    test('GET /user - should return all users', async () => {
        const res = await request.get('/user');
        expect(res.header['content-type']).toBe('application/json; charset=utf-8');
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
    });

    test('GET /user/:id - should return a single user', async () => {
        const userId = (await db.collection('user').findOne({ email: 'test@example.com' }))._id;
        const res = await request.get(`/user/${userId}`);
        expect(res.header['content-type']).toBe('application/json; charset=utf-8');
        expect(res.statusCode).toBe(200);
        expect(res.body.email).toBe('test@example.com');
    });

    test('GET /user/:id - should return 404 for non-existing user', async () => {
        const nonExistingId = new mongodb.ObjectId();
        const res = await request.get(`/user/${nonExistingId}`);
        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual({ message: 'User not found' });
    });
});