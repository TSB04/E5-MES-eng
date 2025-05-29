const express = require("express");
const tasksRoutes = require("./routes/tasks");
const app = express();
const PORT = process.env.PORT || 3000;
const ENV = process.env.ENV;

app.use(express.json());
app.use("/tasks", tasksRoutes);

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`ToDo API is running on port ${PORT} in ${ENV} mode`);
  });
}

module.exports = app; // Export the app for testing purposes
