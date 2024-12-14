import {
  CreateTodoSchema,
  UpdateTodoSchema,
  TodoIdSchema,
  TodoSchema,
} from '../../domain/models/todo-schema.js';

class TodoValidator {
  validateCreate(data) {
    return CreateTodoSchema.safeParse(data);
  }

  validateUpdate(data) {
    return UpdateTodoSchema.parse(data);
  }

  validateId(data) {
    return TodoIdSchema.safeParse(data);
  }

  validateOutput(data) {
    return TodoSchema.parse(data); // Ensures service output is valid
  }
}

export default TodoValidator;
