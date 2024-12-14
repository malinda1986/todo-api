import AWS from 'aws-sdk';

import { config as _config } from 'dotenv';
_config();

const todo_cache = process.env.TABLE_CACHE;
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

enableTTL(todo_cache)
  .then(() => {
    console.info('TTL Setup done:');
  })
  .catch((error) => {
    console.error('TTL Setup failed:', error.message);
  });
