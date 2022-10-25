const express = require("express");
const app = express();
const fs = require("fs/promises");
const path = require("path");

app.all("/", (req, res) => {
  console.log("Bienvenidos");
  res.end();
});

const jsonPath = path.resolve("./src/data.json");
app.use(express.json());
//get
app.get("/api/v1/tasks", async (req, res) => {
  const jsonFile = await fs.readFile(jsonPath, "utf8");
  res.status(200).send(jsonFile);
});
//post
app.post("/api/v1/tasks", async (req, res) => {
  const data = req.body;
  const taskArray = JSON.parse(await fs.readFile(jsonPath, "utf8"));
  if (taskArray.length === 0) {
    taskArray.push({ id: 1, ...data });
    await fs.writeFile(jsonPath, JSON.stringify(taskArray));
  } else {
    taskArray.push({ id: taskArray[taskArray.length - 1].id + 1, ...data });
    await fs.writeFile(jsonPath, JSON.stringify(taskArray));
  }
  res.sendStatus(201);
});
//patch
app.patch("/api/v1/tasks/:id", async (req, res) => {
  const taskArray = JSON.parse(await fs.readFile(jsonPath, "utf8"));
  const id = Number(req.params.id);
  const data = req.body;
  const index = taskArray.findIndex((item) => item.id === id);
  taskArray[index] = {
    id,
    ...data,
  };
  await fs.writeFile(jsonPath, JSON.stringify(taskArray));
  res.sendStatus(201);
});
//delete
app.delete("/api/v1/tasks/:id", async (req, res) => {
  const taskArray = JSON.parse(await fs.readFile(jsonPath, "utf8"));
  const id = Number(req.params.id);
  const index = taskArray.findIndex((item) => item.id === id);
  if (!index == -1) {
    taskArray.splice(index, 1);
    await fs.writeFile(jsonPath, JSON.stringify(taskArray));
    res.sendStatus(204);
  } else {
    res.sendStatus(404).json({ message: "Invalid ID " });
  }
});

app.listen(8000, () => {
  console.log("Server started at port 8000");
});
