class TodoRepository {
  constructor(logger, configs, db) {
    this.tableName = 'todo'; // DynamoDB table name
    this.db = db;
    this.logger = logger;
    this.configs = configs;
  }

  async create(todo) {
    const params = {
      TableName: this.tableName,
      Item: {
        ...todo.data,
        fileUrl: todo.fileUrl,
        createdAt: new Date().toISOString(),
      },
    };
    await this.db.getClient().put(params).promise();
    return todo;
  }

  async findById(todo) {
    const params = {
      TableName: this.tableName,
      Key: { id: todo.data.id },
    };
    const result = await this.db.getClient().get(params).promise();
    return result.Item || null;
  }

  async findAll() {
    const params = {
      TableName: this.tableName,
    };
    const result = await this.db.getClient().scan(params).promise();
    return result.Items || [];
  }

  async update(todo) {
    const { id, ...updates } = todo;
    const updateExpression = Object.keys(updates)
      .map((key, index) => `#${key} = :value${index}`)
      .join(', ');
    const expressionAttributeNames = Object.keys(updates).reduce(
      (acc, key) => ({ ...acc, [`#${key}`]: key }),
      {}
    );
    const expressionAttributeValues = Object.values(updates).reduce(
      (acc, value, index) => ({ ...acc, [`:value${index}`]: value }),
      {}
    );

    const params = {
      TableName: this.tableName,
      Key: { id: id },
      UpdateExpression: `SET ${updateExpression}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW',
    };
    const result = await this.db.getClient().update(params).promise();
    return result.Attributes;
  }

  async deleteById(todo) {
    const params = {
      TableName: this.tableName,
      Key: { id: todo.data.id },
    };
    const response = await this.db.getClient().delete(params).promise();
    return response;
  }
}

export default TodoRepository;
