const express = require("express");

const app = express();
const PORT = process.env.PORT || 5050;

app.use(express.json());
app.get("/", (req, res) => {
  res.send("User Service is running");
});

app.listen(PORT, () => {
  console.log(`User Service is running on port ${PORT}`);
});
