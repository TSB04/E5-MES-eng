const request = require('supertest');
const fs = require('fs');
const path = require('path');
const app = require('../app'); // Adjust if your app is in a different location

const filePath = path.join(__dirname, '../tasks.json');

beforeEach(() => {
  fs.writeFileSync(filePath, '[]'); // Reset the tasks file before each test
});

afterAll(() => {
  fs.writeFileSync(filePath, '[]'); // Clean up after all tests
});

describe('ToDo API', () => {
  it('GET /tasks should return 200 and an array', async () => {
    const res = await request(app).get('/tasks');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /tasks should create a task', async () => {
    const newTask = { title: "Test Task", done: false };
    const res = await request(app).post('/tasks').send(newTask);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('title', 'Test Task');
    expect(res.body).toHaveProperty('done', false);
  });

  it('PUT /tasks/:id should update a task', async () => {
    const task = await request(app).post('/tasks').send({ title: "Initial Task", done: false });
    const res = await request(app)
      .put(`/tasks/${task.body.id}`)
      .send({ title: "Updated Task", done: true });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('title', 'Updated Task');
    expect(res.body).toHaveProperty('done', true);
  });

  it('PUT /tasks/:id with invalid ID should return 404', async () => {
    const res = await request(app)
      .put('/tasks/99999999')
      .send({ title: "Should Fail", done: false });

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  it('DELETE /tasks/:id should remove a task', async () => {
    const task = await request(app).post('/tasks').send({ title: "To Be Deleted", done: false });
    const res = await request(app).delete(`/tasks/${task.body.id}`);

    expect(res.statusCode).toBe(204);

    // Verify it's gone
    const getRes = await request(app).get('/tasks');
    expect(getRes.body.find(t => t.id === task.body.id)).toBeUndefined();
  });

  it('DELETE /tasks/:id with non-existent ID should return 404', async () => {
    const res = await request(app).delete('/tasks/123456789');
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error');
  });
});
