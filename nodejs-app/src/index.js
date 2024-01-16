const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;


app.use(bodyParser.json());

require("./routes/routes")(app)


app.get("/", (req, res) => {
  res.json({ message: "Welcome to webapp application." });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
