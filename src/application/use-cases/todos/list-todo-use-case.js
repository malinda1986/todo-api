class ListTodoUseCase {
  constructor(todoRepository, logger, todoValidator, fileStorage) {
    this.todoValidator = todoValidator;
    this.logger = logger;
    this.todoRepository = todoRepository;
    this.fileStorage = fileStorage;
  }

  getSignUrl(fileUrl) {
    if (fileUrl) {
      const fileKey = fileUrl.split('/').pop();
      return this.fileStorage.generateSignedUrl(fileKey);
    } else {
      return null;
    }
  }

  async execute(data) {
    this.logger.info(`List todo ${JSON.stringify(data)}`);
    const validatedData = this.todoValidator.validateCreate(data);
    const todos = await this.todoRepository.findAll(validatedData);
    return todos.map((todo) => {
      return {
        ...todo,
        fileUrl: this.getSignUrl(todo.fileUrl),
      };
    });
  }
}

export default ListTodoUseCase;
