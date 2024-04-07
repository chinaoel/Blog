const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");
const { Octokit } = require("@octokit/rest");
require("dotenv").config();

const PORT = 8080;

const app = express();

app.use(cors());
app.use(bodyParser.json());

// because the api may delay we use async function
app.get("/getAccessToken", async function (req, res) {
  const CLIENT_ID = process.env.CLIENT_ID;
  const CLIENT_SECRET = process.env.CLIENT_SECRET;
  console.log(req.query.code);
  const param =
    "?client_id=" +
    CLIENT_ID +
    "&client_secret=" +
    CLIENT_SECRET +
    "&code=" +
    req.query.code;
  const response = await axios(
    "https://github.com/login/oauth/access_token" + param,
    {
      method: "POST",
      headers: { Accept: "application/json" },
    }
  );
  console.log(response);
  const data = await response.data;
  res.json(data);
});

app.listen(PORT, () => {
  console.log(`The backend service is listening on PORT ${PORT}`);
});
