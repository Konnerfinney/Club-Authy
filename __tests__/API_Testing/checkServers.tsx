require('dotenv').config();
const { setupDB, tearDownDB } = require('../MockMongoDB');
const { checkServers } = require('../../app/api/getServers');
const { MongoClient } = require('mongodb');


describe('Check Servers API Endpoint Tests', () => {
  let dbClient;
  let collectionMock;

  beforeAll(async () => {
    await setupDB();
    // Initialize the mock database connection
    dbClient = new MongoClient(process.env.MONGODB_URI);
    await dbClient.connect();

    // Mock the collection
    collectionMock = {
      find: jest.fn(),
      toArray: jest.fn()
    };
    dbClient.db = jest.fn().mockReturnValue({
      collection: jest.fn().mockReturnValue(collectionMock)
    });
  });

  afterAll(async () => {
    await tearDownDB();
  });

  test('Successfully retrieves server data', async () => {
    // Setup mock return value for the MongoDB query
    collectionMock.find.mockReturnValue({
      toArray: jest.fn().mockResolvedValue([{ serverId: '123', status: 'active' }])
    });

    // Mock request and response
    const req = { /* ... */ };
    const res = new Response();

    // Call the endpoint function
    const response = await checkServers(req, res);

    // Assertions
    expect(response.status).toBe(200);
    expect(JSON.parse(response.body)).toEqual([{ serverId: '123', status: 'active' }]);
  });

  test('Handles errors correctly', async () => {
    // Mock a failure in the MongoDB query
    collectionMock.find.mockImplementation(() => {
      throw new Error('Database error');
    });

    const req = { /* ... */ };
    const res = new Response();

    // Call the endpoint function
    const response = await checkServers(req, res);

    // Assertions
    expect(response.status).toBe(500);
    expect(JSON.parse(response.body)).toEqual({ success: false, error: 'Database error' });
  });

  // ... additional tests as needed ...
});
