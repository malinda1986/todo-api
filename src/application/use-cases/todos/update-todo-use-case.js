class UpdateTodoUseCase {
  constructor(todoRepository, logger, todoValidator) {
    this.todoValidator = todoValidator;
    this.logger = logger;
    this.todoRepository = todoRepository;
  }

  async execute(data) {
    this.logger.info(`Update todo ${JSON.stringify(data)}`);
    const validatedData = this.todoValidator.validateUpdate(data);
    const todos = await this.todoRepository.update(validatedData);
    return todos;
  }
}

export default UpdateTodoUseCase;
