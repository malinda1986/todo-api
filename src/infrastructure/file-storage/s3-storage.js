import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

class S3Storage {
  constructor(logger, configs) {
    this.configs = configs;
    this.logger = logger;
    this.s3 = new AWS.S3({
      region: this.configs.get('AWS_REGION'),
      accessKeyId: this.configs.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configs.get('AWS_SECRET_ACCESS_KEY'),
    });
    this.bucketName = this.configs.get('AWS_S3_BUCKET_NAME');
  }

  /**
   * Upload a file to S3
   * @param {Buffer} fileBuffer - File content
   * @param {string} fileName - Original file name
   * @param {string} mimeType - File MIME type
   * @returns {Promise<string>} - S3 file URL
   */
  async uploadFile(fileBuffer, fileName, mimeType) {
    const fileKey = `${uuidv4()}-${fileName}`; // Generate unique file name
    const params = {
      Bucket: this.bucketName,
      Key: fileKey,
      Body: fileBuffer,
      ContentType: mimeType,
    };

    await this.s3.upload(params).promise();
    return `https://${this.bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
  }

  /**
   * Generate a signed URL for a file in S3
   * @param {string} fileKey - The S3 object key
   * @param {number} expiresIn - Time in seconds before the URL expires
   * @returns {string} - Signed URL
   */
  generateSignedUrl(fileKey, expiresIn = 3600) {
    const params = {
      Bucket: this.bucketName,
      Key: fileKey,
      Expires: expiresIn,
    };

    return this.s3.getSignedUrl('getObject', params);
  }

  /**
   * Delete a file from S3
   * @param {string} fileKey - The S3 object key
   * @returns {Promise<void>}
   */
  async deleteFile(fileKey) {
    const params = {
      Bucket: this.bucketName,
      Key: fileKey,
    };

    try {
      await this.s3.deleteObject(params).promise();
      this.logger.info(`File deleted successfully: ${fileKey}`);
    } catch (error) {
      this.logger.error(`Error deleting file: ${fileKey}`, error);
      throw new Error(`Failed to delete file: ${fileKey}`);
    }
  }
}

export default S3Storage;
