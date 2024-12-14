class CacheRepository {
  constructor(logger, configs, db) {
    this.tableName = 'CacheTable'; // DynamoDB table name
    this.cacheKey = 'users_data';
    this.db = db;
    this.logger = logger;
    this.configs = configs;
  }

  async findById() {
    const params = {
      TableName: this.tableName,
      Key: { id: this.cacheKey },
    };
    const result = await this.db.getClient().get(params).promise();
    return result.Item || null;
  }

  async create(users, ttl) {
    const params = {
      TableName: this.tableName,
      Item: {
        id: this.cacheKey,
        response: users,
        ttl: ttl,
      },
    };
    await this.db.getClient().put(params).promise();
  }
}

export default CacheRepository;
