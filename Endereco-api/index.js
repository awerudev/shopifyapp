const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const axios = require('axios');
const app = express();
app.use(cors());

app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.post('/endereco', async (req, res) => {
	console.log(req.body)
	const response = await axios.post(
      'https://endereco-service.de/rpc/v1', 
      req.body,
      {
      	headers: { 
              'Content-Type': 'application/json',
              'X-Auth-Key': '4b82c0d90ed9b223d2bda7dd7e2a950eb3236d015fd41fd5b0bb56e55a8b5a76'
       }});
	console.log(response.status);
	res.status(200).send(response.data);
})

app.post('/countryData', async (req, res) => {
	const response = await axios.post(
      'https://sw6.endereco-qa.de/country/country-state-data',
      {countryId: req.body.countryId}
    )
   res.status(200).send(response.data);
})

const port = 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});