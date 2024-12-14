class CreateTodoUseCase {
  constructor(todoRepository, logger, todoValidator, fileStorage) {
    this.todoValidator = todoValidator;
    this.logger = logger;
    this.todoRepository = todoRepository;
    this.fileStorage = fileStorage;
  }

  async execute(data, file) {
    this.logger.info(`Create todo ${JSON.stringify(data)}`);
    const validatedData = this.todoValidator.validateCreate(data);

    let fileUrl = null;
    let signedFileUrl = null;

    // If a file is provided, upload it to S3
    if (file) {
      this.logger.info(`Uploading file: ${file.originalname}`);
      fileUrl = await this.fileStorage.uploadFile(file.buffer, file.originalname, file.mimetype);
      this.logger.info(`File uploaded successfully: ${fileUrl}`);

      // Generate a signed URL for the uploaded file
      const fileKey = fileUrl.split('/').pop(); // Extract file key from the S3 URL
      signedFileUrl = this.fileStorage.generateSignedUrl(fileKey);
      this.logger.info(`Generated signed URL: ${signedFileUrl}`);
    }

    const createTodoData = {
      ...validatedData,
      fileUrl, // Include the S3 link if a file was uploaded
      createdAt: new Date(),
    };

    const newTodo = await this.todoRepository.create(createTodoData);
    return { ...newTodo.data, fileUrl: signedFileUrl };
  }
}

export default CreateTodoUseCase;
