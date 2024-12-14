import AWS from 'aws-sdk';

import { config as _config } from 'dotenv';
_config();

const s3_bucket = process.env.AWS_S3_BUCKET_NAME;
const todo_table = process.env.TABLE_TODO;
const todo_cache = process.env.TABLE_CACHE;
const region = process.env.AWS_REGION;

// AWS Configuration
AWS.config.update({ region });

// DynamoDB Client
const dynamoDB = new AWS.DynamoDB();

async function enableTTL(tableName) {
  const params = {
    TableName: tableName,
    TimeToLiveSpecification: {
      AttributeName: 'ttl',
      Enabled: true,
    },
  };

  try {
    const result = await dynamoDB.updateTimeToLive(params).promise();
    console.log(`TTL enabled for table: ${tableName}`);
  } catch (error) {
    console.error(`Error enabling TTL for table (${tableName}):`, error.message);
  }
}

// Function to create a DynamoDB table
async function createDynamoDBTable(params) {
  try {
    const result = await dynamoDB.createTable(params).promise();
    console.log(`DynamoDB Table Created: ${result.TableDescription.TableName}`);
  } catch (error) {
    console.error(`Error creating DynamoDB Table (${params.TableName}):`, error.message);
  }
}

async function createS3Bucket() {
  const s3 = new AWS.S3(); // Create an S3 service instance

  const params = {
    Bucket: s3_bucket,
  };

  try {
    const result = await s3.createBucket(params).promise();
    console.log('S3 Bucket Created:', result.Location);
  } catch (error) {
    console.error('Error creating S3 Bucket:', error.message);
  }
}

async function setupCacheTable() {
  const cacheTableParams = {
    TableName: todo_cache, // Replace with your table name
    KeySchema: [{ AttributeName: 'cacheKey', KeyType: 'HASH' }], // Partition key
    AttributeDefinitions: [{ AttributeName: 'cacheKey', AttributeType: 'S' }],
    BillingMode: 'PAY_PER_REQUEST',
  };

  try {
    // Create the table
    await dynamoDB.createTable(cacheTableParams).promise();
    console.log(`Cache Table Created: ${cacheTableParams.TableName}`);

    // Enable TTL
    await enableTTL(cacheTableParams.TableName);
  } catch (error) {
    console.error(`Error setting up cache table:`, error.message);
  }
}

async function setup() {
  console.log('Setting up AWS resources...');

  // TodoTable
  const todoTableParams = {
    TableName: todo_table,
    KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }], // Partition key
    AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
    BillingMode: 'PAY_PER_REQUEST',
  };

  // Create both tables
  await createDynamoDBTable(todoTableParams);
  await setupCacheTable();
  // Create S3 Bucket
  await createS3Bucket();

  console.log('Setup completed.');
}

setup()
  .then(() => {
    console.info('Setup done:');
  })
  .catch((error) => {
    console.error('Setup failed:', error.message);
  });
