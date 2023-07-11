const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const bodyParser = require('body-parser');
const Routes = require('./routes/Routes');

const app = express();

const uri = "mongodb+srv://mn-pandey:9219591303Am%40n@cluster0.mov0c.mongodb.net/?retryWrites=true&w=majority";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db('NerveSparkData');

    // Set up middleware
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    // Add database reference to the request object
    app.use((req, res, next) => {
      req.db = db;
      next();
    });

    // Define routes
    app.use('/', Routes);

    // Start the server
    const port = 3000;
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1); // Exit the process with an error code
  }
}

run().catch(console.error);
