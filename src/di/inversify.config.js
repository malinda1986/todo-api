import 'reflect-metadata';
import { Container } from 'inversify';

import { ConfigUtilAdapter } from '../configs/config-util.adapter.js';
import { DynamodbClient } from '../infrastructure/database/dynamo-db-client.js';

import {
  DATABASE_CLIENT,
  CONFIG_UTIL,
  CREATE_TODO_USECASE,
  GET_TODO_USECASE,
  LIST_TODO_USECASE,
  UPDATE_TODO_USECASE,
  DELETE_TODO_USECASE,
  STORAGE_SERVICE,
  USER_SERVICE,
  USER_CONTROLLER,
  LIST_USER_USECASE,
  CACHE_REPOSITORY,
} from './ioc.types.js';
import logger from '../adapters/outbound/logger/logger.js';
import TodoController from '../adapters/inbound/http/express/todo-controller.js';
import UserController from '../adapters/inbound/http/express/user-controller.js';

import TodoValidator from '../application/validators/todo-validator.js';
import TodoRepository from '../adapters/outbound/persistence/todo-repository.js';
import CacheRepository from '../adapters/outbound/persistence/cache-repository.js';

import CreateTodoUseCase from '../application/use-cases/todos/create-todo-use-case.js';
import UpdateTodoUseCase from '../application/use-cases/todos/update-todo-use-case.js';
import GetTodoUseCase from '../application/use-cases/todos/get-todo-use-case.js';
import ListTodoUseCase from '../application/use-cases/todos/list-todo-use-case.js';
import DeleteTodoUseCase from '../application/use-cases/todos/delete-todo-use-case.js';

import ListUserUseCase from '../application/use-cases/users/list-user-use-case.js';
import FileStorage from '../infrastructure/file-storage/s3-storage.js';
import UserService from '../services/external-user-service.js';

import { CreateTodoSchema, UpdateTodoSchema, TodoIdSchema } from '../domain/models/todo-schema.js';

const container = new Container();

// common
container.bind(CONFIG_UTIL).toConstantValue(new ConfigUtilAdapter());
container.bind('Logger').toConstantValue(logger);
container
  .bind(DATABASE_CLIENT)
  .toDynamicValue(() => new DynamodbClient(container.get('Logger'), container.get(CONFIG_UTIL)));

// validation
container.bind('TodoValidator').to(TodoValidator); // Singleton by default

container
  .bind(STORAGE_SERVICE)
  .toDynamicValue(() => new FileStorage(container.get('Logger'), container.get(CONFIG_UTIL)));

// Bind Zod schemas
container.bind('CreateTodoSchema').toConstantValue(CreateTodoSchema);
container.bind('UpdateTodoSchema').toConstantValue(UpdateTodoSchema);
container.bind('TodoIdSchema').toConstantValue(TodoIdSchema);

// services
container.bind(USER_SERVICE).toDynamicValue(() => new UserService(container.get('Logger')));

// Bind Repository
container
  .bind('TodoRepository')
  .toDynamicValue(
    () =>
      new TodoRepository(
        container.get('Logger'),
        container.get(CONFIG_UTIL),
        container.get(DATABASE_CLIENT)
      )
  );

container
  .bind(CACHE_REPOSITORY)
  .toDynamicValue(
    () =>
      new CacheRepository(
        container.get('Logger'),
        container.get(CONFIG_UTIL),
        container.get(DATABASE_CLIENT)
      )
  );

// use cases
// Bind CreateTodoUseCase dynamically with logger and repository
container
  .bind(CREATE_TODO_USECASE)
  .toDynamicValue(
    () =>
      new CreateTodoUseCase(
        container.get('TodoRepository'),
        container.get('Logger'),
        container.get('TodoValidator'),
        container.get(STORAGE_SERVICE)
      )
  );
container
  .bind(UPDATE_TODO_USECASE)
  .toDynamicValue(
    () =>
      new UpdateTodoUseCase(
        container.get('TodoRepository'),
        container.get('Logger'),
        container.get('TodoValidator'),
        container.get(STORAGE_SERVICE)
      )
  );

container
  .bind(GET_TODO_USECASE)
  .toDynamicValue(
    () =>
      new GetTodoUseCase(
        container.get('TodoRepository'),
        container.get('Logger'),
        container.get('TodoValidator'),
        container.get(STORAGE_SERVICE)
      )
  );

container
  .bind(LIST_TODO_USECASE)
  .toDynamicValue(
    () =>
      new ListTodoUseCase(
        container.get('TodoRepository'),
        container.get('Logger'),
        container.get('TodoValidator'),
        container.get(STORAGE_SERVICE)
      )
  );

container
  .bind(DELETE_TODO_USECASE)
  .toDynamicValue(
    () =>
      new DeleteTodoUseCase(
        container.get('TodoRepository'),
        container.get('Logger'),
        container.get('TodoValidator'),
        container.get(STORAGE_SERVICE)
      )
  );

container
  .bind(LIST_USER_USECASE)
  .toDynamicValue(
    () =>
      new ListUserUseCase(
        container.get('Logger'),
        container.get(USER_SERVICE),
        container.get(CACHE_REPOSITORY)
      )
  );

// controllers
container
  .bind('TodoController')
  .toDynamicValue(
    () =>
      new TodoController(
        container.get('Logger'),
        container.get(LIST_TODO_USECASE),
        container.get(UPDATE_TODO_USECASE),
        container.get(GET_TODO_USECASE),
        container.get(LIST_TODO_USECASE),
        container.get(DELETE_TODO_USECASE)
      )
  );

container
  .bind(USER_CONTROLLER)
  .toDynamicValue(
    () => new UserController(container.get('Logger'), container.get(LIST_USER_USECASE))
  );

export { container };
