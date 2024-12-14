class ListUserUseCase {
  constructor(logger, userService, cacheRepository) {
    this.logger = logger;
    this.userService = userService;
    this.cacheRepository = cacheRepository;
    this.TTL_SECONDS = 300; // 5 minutes
  }

  async execute(data = { limit: 100 }) {
    const currentTime = Math.floor(Date.now() / 1000);
    const cachedItem = await this.cacheRepository.findById();

    if (cachedItem) {
      this.logger.info('Serving users from cache');
      return cachedItem.response;
    } else {
      this.logger.info('Serving users from API');
      const ttl = currentTime + this.TTL_SECONDS; // Expire after 5 minutes
      const users = await this.userService.fetchUsers(data.limit);
      await this.cacheRepository.create(users, ttl);
      return users;
    }
  }
}

export default ListUserUseCase;
