const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());


require("./routes/routes")(app)


// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to webapp application." });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
