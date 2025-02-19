const app = require('../server');
const supertest = require('supertest');
const { expect } = require('@jest/globals');
const mongodb = require('../data/databaseproduct');

const request = supertest(app);

describe('Comments API', () => {
    let db;

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

        const existingComment = await db.collection('comments').findOne({ name: 'Test Comment 1' });
        if (!existingComment) {
            await db.collection('comments').insertMany([
                { _id: new mongodb.ObjectId(), name: 'Test Comment 1', rating: 5, comment: 'This is a test comment.' },
                { _id: new mongodb.ObjectId(), name: 'Test Comment 2', rating: 4, comment: 'This is another test comment.' }
            ]);
        }

    });

    afterAll(async () => {
        await db.collection('comments').deleteMany({ name: { $in: ['Test Comment 1', 'Test Comment 2'] } });
    });

    test('GET /comments - should return all comments', async () => {
        const res = await request.get('/comments');
        expect(res.header['content-type']).toBe('application/json; charset=utf-8');
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
    },1000000);

    test('GET /comments/:id - should return a single comment', async () => {
        const commentId = (await db.collection('comments').findOne({ name: 'Test Comment 1' }))._id;
        const res = await request.get(`/comments/${commentId}`);
        expect(res.header['content-type']).toBe('application/json; charset=utf-8');
        expect(res.statusCode).toBe(200);
        expect(res.body.comment).toBe('This is a test comment.');
    });

    test('GET /comments/:id - should return 404 for non-existing comment', async () => {
        const nonExistingId = new mongodb.ObjectId();
        const res = await request.get(`/comments/${nonExistingId}`);
        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual({ error: 'Comment not found' });
    });
});