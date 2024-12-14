import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';
import ExternalUserService from '../../../src/services/external-user-service';

vi.mock('axios');

describe('ExternalUserService', () => {
  let mockLogger;
  let userService;

  beforeEach(() => {
    mockLogger = {
      info: vi.fn(),
      error: vi.fn(),
    };

    userService = new ExternalUserService(mockLogger);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch users successfully from the external API', async () => {
    const mockUsers = [
      { id: 1, name: 'John Doe', email: 'john.doe@example.com' },
      { id: 2, name: 'Jane Doe', email: 'jane.doe@example.com' },
    ];
    axios.get.mockResolvedValue({ data: mockUsers });
    const users = await userService.fetchUsers();
    expect(mockLogger.info).toHaveBeenCalledWith('Fetching users from external API');
    expect(axios.get).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/users');
    expect(users).toEqual(mockUsers);
  });

  it('should log an error and throw if the external API fails', async () => {
    const errorMessage = 'Network Error';
    axios.get.mockRejectedValue(new Error(errorMessage));

    await expect(userService.fetchUsers()).rejects.toThrow(
      'Failed to fetch users from external API'
    );

    expect(mockLogger.info).toHaveBeenCalledWith('Fetching users from external API');
    expect(mockLogger.error).toHaveBeenCalledWith('Error fetching users:', errorMessage);
  });
});
