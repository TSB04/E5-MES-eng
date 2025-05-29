const express = require("express");
const tasksRoutes = require("./routes/tasks");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use("/tasks", tasksRoutes);

if (require.main === module) {
  app.listen(port, () => {
    console.log(`ToDo API listening at http://localhost:${port}`);
  });
}

module.exports = app; // Export the app for testing purposes
