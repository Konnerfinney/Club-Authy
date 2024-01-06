const { MongoMemoryServer } = require('mongodb-memory-server');
const { MongoClient } = require('mongodb');

let mongoServer;
let dbClient;

async function setupDB() {
  mongoServer = await MongoMemoryServer.create();
  dbClient = new MongoClient(mongoServer.getUri());
  await dbClient.connect();
}

async function tearDownDB() {
  await dbClient.close();
  await mongoServer.stop();
}

module.exports = { setupDB, tearDownDB };
