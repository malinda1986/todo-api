import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import CreateTodoUseCase from '../../../../../src/application/use-cases/todos/create-todo-use-case';

describe('CreateTodoUseCase', () => {
  let todoValidatorMock;
  let loggerMock;
  let todoRepositoryMock;
  let fileStorageMock;
  let createTodoUseCase;

  beforeEach(() => {
    todoValidatorMock = {
      validateCreate: vi.fn(),
    };
    loggerMock = {
      info: vi.fn(),
    };
    todoRepositoryMock = {
      create: vi.fn(),
    };
    fileStorageMock = {
      uploadFile: vi.fn(),
      generateSignedUrl: vi.fn(),
    };

    createTodoUseCase = new CreateTodoUseCase(
      todoRepositoryMock,
      loggerMock,
      todoValidatorMock,
      fileStorageMock
    );
  });

  it('should create a todo without a file', async () => {
    const inputData = { title: 'Sample Todo', description: 'Description' };
    const validatedData = { ...inputData };
    const createdTodo = { data: { id: '123', ...validatedData } };

    todoValidatorMock.validateCreate.mockReturnValue(validatedData);
    todoRepositoryMock.create.mockResolvedValue(createdTodo);

    const result = await createTodoUseCase.execute(inputData, null);
    expect(todoValidatorMock.validateCreate).toHaveBeenCalledWith(inputData);
    expect(loggerMock.info).toHaveBeenCalledWith(`Create todo ${JSON.stringify(inputData)}`);
    expect(todoRepositoryMock.create).toHaveBeenCalledWith({
      ...validatedData,
      fileUrl: null,
      createdAt: expect.any(Date),
    });

    expect(result).toEqual({ ...createdTodo.data, fileUrl: null });
  });

  it('should create a todo with a file', async () => {
    const inputData = { title: 'Sample Todo', description: 'Description' };
    const validatedData = { ...inputData };
    const file = {
      originalname: 'file.txt',
      buffer: Buffer.from('file content'),
      mimetype: 'text/plain',
    };
    const fileUrl = 'https://s3.amazonaws.com/bucket/file.txt';
    const signedFileUrl = `${fileUrl}?signed`;

    const createdTodo = { data: { id: '123', ...validatedData } };

    todoValidatorMock.validateCreate.mockReturnValue(validatedData);
    fileStorageMock.uploadFile.mockResolvedValue(fileUrl);
    fileStorageMock.generateSignedUrl.mockReturnValue(signedFileUrl);
    todoRepositoryMock.create.mockResolvedValue(createdTodo);

    const result = await createTodoUseCase.execute(inputData, file);

    expect(todoValidatorMock.validateCreate).toHaveBeenCalledWith(inputData);
    expect(loggerMock.info).toHaveBeenCalledWith(`Uploading file: ${file.originalname}`);
    expect(fileStorageMock.uploadFile).toHaveBeenCalledWith(
      file.buffer,
      file.originalname,
      file.mimetype
    );
    expect(fileStorageMock.generateSignedUrl).toHaveBeenCalledWith('file.txt');
    expect(todoRepositoryMock.create).toHaveBeenCalledWith({
      ...validatedData,
      fileUrl,
      createdAt: expect.any(Date),
    });

    expect(result).toEqual({ ...createdTodo.data, fileUrl: signedFileUrl });
  });

  it('should throw an error if validation fails', async () => {
    const inputData = { title: 'Invalid Todo' };

    todoValidatorMock.validateCreate.mockImplementation(() => {
      throw new Error('Validation error');
    });

    await expect(createTodoUseCase.execute(inputData, null)).rejects.toThrow('Validation error');

    expect(todoValidatorMock.validateCreate).toHaveBeenCalledWith(inputData);
    expect(loggerMock.info).toHaveBeenCalledWith(`Create todo ${JSON.stringify(inputData)}`);
    expect(todoRepositoryMock.create).not.toHaveBeenCalled();
  });

  it('should throw an error if file upload fails', async () => {
    const inputData = { title: 'Todo with file' };
    const validatedData = { ...inputData };
    const file = {
      originalname: 'file.txt',
      buffer: Buffer.from('file content'),
      mimetype: 'text/plain',
    };

    todoValidatorMock.validateCreate.mockReturnValue(validatedData);
    fileStorageMock.uploadFile.mockRejectedValue(new Error('Upload failed'));

    await expect(createTodoUseCase.execute(inputData, file)).rejects.toThrow('Upload failed');

    expect(todoValidatorMock.validateCreate).toHaveBeenCalledWith(inputData);
    expect(loggerMock.info).toHaveBeenCalledWith(`Uploading file: ${file.originalname}`);
    expect(fileStorageMock.uploadFile).toHaveBeenCalledWith(
      file.buffer,
      file.originalname,
      file.mimetype
    );
    expect(todoRepositoryMock.create).not.toHaveBeenCalled();
  });
});
