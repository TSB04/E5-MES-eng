const request = require('supertest');
const app = require('../app'); // or wherever your Express app is exported

describe('ToDo API', () => {
  it('GET /tasks should return 200', async () => {
    const res = await request(app).get('/tasks');
    expect(res.statusCode).toEqual(200);
  });

  it('POST /tasks should create a task', async () => {
    const newTask = { title: "Test Task", done: false };
    const res = await request(app).post('/tasks').send(newTask);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('title', 'Test Task');
  });
});
