import axios from 'axios';

class ExternalUserService {
  constructor(logger) {
    this.logger = logger;
    this.apiUrl = 'https://jsonplaceholder.typicode.com/users'; // can be move to env as well
  }

  /**
   * Fetch users from the external API
   * @returns {Promise<Array>} - List of users
   */
  async fetchUsers(limit = 100) {
    try {
      this.logger.info('Fetching users from external API');
      const response = await axios.get(this.apiUrl);
      return response.data;
    } catch (error) {
      console.log(error);
      this.logger.error('Error fetching users:', error.message);
      throw new Error('Failed to fetch users from external API');
    }
  }
}

export default ExternalUserService;
