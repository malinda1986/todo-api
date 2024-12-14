import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid'; // Import uuid.v4 for generating UUIDs

export const STATUS = ['pending', 'in-progress', 'completed'];
export const DEFAULT_STATUS = 'pending';

// Define the canonical schema for a Todo
export const TodoSchema = z.object({
  id: z
    .string()
    .uuid()
    .default(() => uuidv4()), // ID must be a valid UUID
  title: z.string().min(5, 'Title is required'), // Title must be at least 1 character
  description: z.string().optional(), // Description is optional
  status: z.enum(STATUS).default(DEFAULT_STATUS), // Status can only be "pending" or "completed"
  createdAt: z.date().optional(), // Creation date
  updatedAt: z.date().optional(), // Updated date is optional
});

export const TodoIdSchema = z.object({
  id: z.string().uuid('Invalid ID format'), // Ensures the ID is a valid UUID
});

// Create schemas for specific use cases based on the domain model
export const CreateTodoSchema = TodoSchema.omit({ createdAt: true, updatedAt: true });
export const UpdateTodoSchema = TodoSchema.omit({ createdAt: true }).partial(); // Partial updates
