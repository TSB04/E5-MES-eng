const express = require('express');
const fs = require('fs');
const router = express.Router();
const filePath = './tasks.json';

function loadTasks() {
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath));
}

function saveTasks(tasks) {
  fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));
}

// GET /tasks
router.get('/', (req, res) => {
  const tasks = loadTasks();
  res.json(tasks);
});

// POST /tasks
router.post('/', (req, res) => {
  const tasks = loadTasks();
  const newTask = { id: Date.now(), ...req.body };
  tasks.push(newTask);
  saveTasks(tasks);
  res.status(201).json(newTask);
});

// PUT /tasks/:id
router.put('/:id', (req, res) => {
  let tasks = loadTasks();
  const id = parseInt(req.params.id);
  const index = tasks.findIndex(task => task.id === id);
  if (index === -1) return res.status(404).json({ error: 'Not found' });

  tasks[index] = { id, ...req.body };
  saveTasks(tasks);
  res.json(tasks[index]);
});

// DELETE /tasks/:id
router.delete('/:id', (req, res) => {
  let tasks = loadTasks();
  const id = parseInt(req.params.id);
  const filtered = tasks.filter(task => task.id !== id);
  if (tasks.length === filtered.length) return res.status(404).json({ error: 'Not found' });

  saveTasks(filtered);
  res.status(204).send();
});

module.exports = router;
