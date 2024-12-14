import AWS from 'aws-sdk';

export class DynamodbClient {
  constructor(logger, configs) {
    this.configs = configs;
    this.logger = logger;
    console.log(this.configs.get('AWS_REGION'));
    this.dynamoDB = new AWS.DynamoDB.DocumentClient({
      region: this.configs.get('AWS_REGION'),
      accessKeyId: this.configs.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configs.get('AWS_SECRET_ACCESS_KEY'),
    });

    this.logger.info('DB initialized...');
  }
  getClient() {
    try {
      return this.dynamoDB; // todo, verify connection is singalton, node: inversify already handle it
    } catch (e) {
      this.logger.error('Error connecting to DB');

      throw new Error(e);
    }
  }
}
