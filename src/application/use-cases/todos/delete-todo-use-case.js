class DeleteTodoUseCase {
  constructor(todoRepository, logger, todoValidator, fileStorage) {
    this.todoValidator = todoValidator;
    this.logger = logger;
    this.todoRepository = todoRepository;
    this.fileStorage = fileStorage;
  }

  async execute(data) {
    this.logger.info(`Delete todo ${JSON.stringify(data)}`);
    const validatedData = this.todoValidator.validateId(data);

    // Fetch the todo item to get the file URL
    const todo = await this.todoRepository.findById(id);

    if (!todo) {
      throw new Error(`Todo with id ${id} not found`);
    }

    // Extract fileKey and delete from S3 if a file exists
    if (todo.fileUrl) {
      const fileKey = todo.fileUrl.split('/').pop();
      await this.fileStorage.deleteFile(fileKey);
    }
    const todos = await this.todoRepository.deleteById(validatedData);
    return todos;
  }
}

export default DeleteTodoUseCase;
