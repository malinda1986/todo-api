import request from 'supertest';
import express from 'express';
import { describe, it, beforeEach, afterEach, expect, vi } from 'vitest';
import userRoutes from '../../src/adapters/inbound/http/express/routes/users/index.js';

describe('User Routes Integration Tests', () => {
  let app;
  let mockUserController;

  beforeEach(() => {
    mockUserController = {
      list: vi.fn(),
    };
    app = express();
    app.use(express.json());
    app.use('/users', userRoutes);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return a list of users successfully', async () => {
    mockUserController.list.mockImplementation((req, res) => {
      res.status(200).json(mockUsers);
    });

    const response = await request(app).get('/users');
    expect(response.status).toBe(200);
  });
});
