const request = require('supertest');
require('dotenv').config({ path: './server/.env.test' }); // Ensure this is loaded before the server is imported
const { app, server } = require('../server');
const pool = require('../config/db.config');

beforeAll((done) => {
  done();
});

afterAll((done) => {
  server.close(() => {
    pool.end();
    done();
  });
});

describe('Game Controller', () => {
  test('should return database connection successful', async () => {
    const res = await request(app).get('/api/test-db');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Database connection successful');
  });

  test('should save game results', async () => {
    const res = await request(app)
      .post('/api/game-result')
      .send([{ player: 'X', result: 'win' }, { player: 'O', result: 'loss' }]);
    expect(res.statusCode).toEqual(201);
    expect(res.text).toEqual('Game results saved');
  });

  test('should get game stats', async () => {
    const res = await request(app).get('/api/stats');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('X');
    expect(res.body).toHaveProperty('O');
  });
});
