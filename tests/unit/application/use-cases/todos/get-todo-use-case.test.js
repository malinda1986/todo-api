import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import GetTodoUseCase from '../../../../../src/application/use-cases/todos/get-todo-use-case';

const setup = () => {
  const mockTodoRepository = {
    findById: vi.fn(),
  };

  const mockLogger = {
    info: vi.fn(),
  };

  const mockTodoValidator = {
    validateId: vi.fn(),
  };

  const mockFileStorage = {
    generateSignedUrl: vi.fn(),
  };

  return {
    useCase: new GetTodoUseCase(mockTodoRepository, mockLogger, mockTodoValidator, mockFileStorage),
    mocks: { mockTodoRepository, mockLogger, mockTodoValidator, mockFileStorage },
  };
};

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('GetTodoUseCase', () => {
  it('should return the todo with a signed file URL if fileUrl exists', async () => {
    const { useCase, mocks } = setup();

    const data = { id: '123' };
    const validatedData = { id: '123' };
    const todo = {
      id: '123',
      title: 'Test Todo',
      fileUrl: 'https://s3.amazonaws.com/bucket/file-key',
    };
    const signedUrl = 'https://s3.amazonaws.com/bucket/file-key?signature=abc';

    mocks.mockTodoValidator.validateId.mockReturnValue(validatedData);
    mocks.mockTodoRepository.findById.mockResolvedValue(todo);
    mocks.mockFileStorage.generateSignedUrl.mockReturnValue(signedUrl);

    const result = await useCase.execute(data);

    expect(mocks.mockTodoValidator.validateId).toHaveBeenCalledWith(data);
    expect(mocks.mockTodoRepository.findById).toHaveBeenCalledWith(validatedData);
    expect(mocks.mockFileStorage.generateSignedUrl).toHaveBeenCalledWith('file-key');
    expect(result).toEqual({ ...todo, fileUrl: signedUrl });
  });

  it('should return the todo without a signed file URL if fileUrl does not exist', async () => {
    const { useCase, mocks } = setup();

    const data = { id: '124' };
    const validatedData = { id: '124' };
    const todo = { id: '124', title: 'Test Todo without File' };

    mocks.mockTodoValidator.validateId.mockReturnValue(validatedData);
    mocks.mockTodoRepository.findById.mockResolvedValue(todo);

    const result = await useCase.execute(data);

    expect(mocks.mockTodoValidator.validateId).toHaveBeenCalledWith(data);
    expect(mocks.mockTodoRepository.findById).toHaveBeenCalledWith(validatedData);
    expect(mocks.mockFileStorage.generateSignedUrl).not.toHaveBeenCalled();
    expect(result).toEqual({ ...todo, fileUrl: null });
  });

  it('should throw an error if validation fails', async () => {
    const { useCase, mocks } = setup();

    const data = { id: null };
    const errorMessage = 'Invalid ID';

    mocks.mockTodoValidator.validateId.mockImplementation(() => {
      throw new Error(errorMessage);
    });

    await expect(useCase.execute(data)).rejects.toThrow(errorMessage);

    expect(mocks.mockTodoValidator.validateId).toHaveBeenCalledWith(data);
    expect(mocks.mockTodoRepository.findById).not.toHaveBeenCalled();
    expect(mocks.mockFileStorage.generateSignedUrl).not.toHaveBeenCalled();
  });

  it('should throw an error if the todo is not found', async () => {
    const { useCase, mocks } = setup();
    const data = { id: '125' };
    const validatedData = { id: '125' };

    mocks.mockTodoValidator.validateId.mockReturnValue(validatedData);
    mocks.mockTodoRepository.findById.mockResolvedValue(null);
    await useCase.execute(data);
    expect(mocks.mockTodoValidator.validateId).toHaveBeenCalledWith(data);
    expect(mocks.mockTodoRepository.findById).toHaveBeenCalledWith(validatedData);
    expect(mocks.mockFileStorage.generateSignedUrl).not.toHaveBeenCalled();
  });
});
