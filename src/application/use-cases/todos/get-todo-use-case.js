class GetTodoUseCase {
  constructor(todoRepository, logger, todoValidator, fileStorage) {
    this.todoValidator = todoValidator;
    this.logger = logger;
    this.todoRepository = todoRepository;
    this.fileStorage = fileStorage;
  }

  async execute(data) {
    this.logger.info(`Get todo ${JSON.stringify(data)}`);
    const validatedData = this.todoValidator.validateId(data);
    const todos = await this.todoRepository.findById(validatedData);
    let fileUrl = null;

    if (todos && todos.fileUrl) {
      // Generate a signed URL for the uploaded file
      const fileKey = todos.fileUrl.split('/').pop(); // Extract file key from the S3 URL
      fileUrl = this.fileStorage.generateSignedUrl(fileKey);
      this.logger.info(`Generated signed URL: ${fileUrl}`);
    }
    if (todos) {
      return { ...todos, fileUrl };
    }
    return null;
  }
}

export default GetTodoUseCase;
