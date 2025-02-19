const app = require('../server');
const supertest = require('supertest');
const { expect } = require('@jest/globals');
const mongodb = require('../data/databaseproduct'); 
const request = supertest(app)

let db;

describe('Tables API', () => {
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

        const existingTable = await db.collection('tables').findOne({ tableNumber: 1 });
        if (!existingTable) {
            await db.collection('tables').insertMany([
                { _id: new mongodb.ObjectId(), tableNumber: 1, capacity: 4, location: 'Window', status: 'Available' },
                { _id: new mongodb.ObjectId(), tableNumber: 2, capacity: 2, location: 'Center', status: 'Reserved' }
            ]);
        }
    });

    afterAll(async () => {
        await db.collection('tables').deleteMany({ tableNumber: { $in: [1, 2] } });
    });

    test('GET /tables - should return all tables', async () => {
        const res = await request.get('/tables');
        expect(res.header['content-type']).toBe('application/json; charset=utf-8');
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
    });

    test('GET /tables/:id - should return a single table', async () => {
        const tableId = (await db.collection('tables').findOne({ tableNumber: 1 }))._id;
        const res = await request.get(`/tables/${tableId}`);
        expect(res.header['content-type']).toBe('application/json; charset=utf-8');
        expect(res.statusCode).toBe(200);
        expect(res.body.tableNumber).toBe(1);
    });

    test('GET /tables/:id - should return 404 for non-existing table', async () => {
        const nonExistingId = new mongodb.ObjectId();
        const res = await request.get(`/tables/${nonExistingId}`);
        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual({ message: 'Table not found' });
    });
});