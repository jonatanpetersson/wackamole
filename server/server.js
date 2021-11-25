require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const { MongoClient } = require('mongodb');
const client = new MongoClient(process.env.CONNECTIONSTRING);

const getHighScore = async (_, res) => {
  try {
    await client.connect();
    console.log('Connected to db');
    const data = await client
      .db("whackamole")
      .collection("highscore")
      .find()
      .toArray();
    data.sort((a, b) => parseFloat(b.score) - parseFloat(a.score));
    res.json(data);
    console.log('Got Highscore')
  } catch (err) {
    console.log(err)
    res
      .status(404)
      .send('Not found, something went wrong')
  } finally {
    await client.close();
    console.log('Connection to db closed');
  }
}

const postHighScore = async (req, res) => {
  const postedHighScore = req.body;
  postedHighScore.id = uuidv4();
  try {
    await client.connect();
    console.log('Connected to db');
    const result = await client
      .db("whackamole")
      .collection("highscore")
      .insertOne(postedHighScore);
    res
      .status(201)
      .send('Added highscore to database');
    console.log(`A document was added to database with the _id: ${result.insertedId}`);
  } catch (err) {
    console.log(err)
    res
      .status(404)
      .send('Not found, something went wrong')
  } finally {
    await client.close();
    console.log('Connection to db closed');
  }
};

app.use(cors());
app.use(express.json());
app.get('/api/highscore', getHighScore);
app.post('/api/highscore', postHighScore);
app.listen(5001, () => console.log('Server listening on port 5001'));