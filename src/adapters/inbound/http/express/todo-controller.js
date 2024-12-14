import 'reflect-metadata'; // Required for InversifyJS decorators
import BaseController from '../interfaces/base-controller.js';
import { sendResponse, HTTP_STATUS_CODES } from '../../../../utils/send-response.js';
export default class TaskController extends BaseController {
  constructor(
    logger,
    createTodoUseCase,
    updateTodoUseCase,
    getTodoUseCase,
    listTodoUseCase,
    deleteTodoUseCase
  ) {
    super(); // Call the constructor of BaseController
    this.logger = logger; // Injected Logger
    this.logger.info('TaskController initiated');
    this.createTodoUseCase = createTodoUseCase;
    this.getTodoUseCase = getTodoUseCase;
    this.updateTodoUseCase = updateTodoUseCase;
    this.listTodoUseCase = listTodoUseCase;
    this.deleteTodoUseCase = deleteTodoUseCase;
  }

  async get(req, res) {
    try {
      const data = await this.getTodoUseCase.execute(req.params);

      if (data) {
        sendResponse(res, data, true, HTTP_STATUS_CODES.SUCCESS.OK);
      } else {
        sendResponse(res, { error: 'Record not found' }, false, HTTP_STATUS_CODES.ERROR.NOT_FOUND);
      }
    } catch (e) {
      this.logger.error('Error in finding todo item', e);
      sendResponse(res, undefined, false, HTTP_STATUS_CODES.ERROR.BAD_REQUEST);
    }
  }

  async list(req, res) {
    try {
      const data = await this.listTodoUseCase.execute(req.query);
      sendResponse(res, data, true, HTTP_STATUS_CODES.SUCCESS.OK);
    } catch (e) {
      this.logger.error('Error in fetching todo list', e);
      sendResponse(res, undefined, false, HTTP_STATUS_CODES.ERROR.BAD_REQUEST);
    }
  }

  async post(req, res) {
    try {
      this.logger.info('[post] creating todo ');
      const data = await this.createTodoUseCase.execute(req.body, req.file);
      sendResponse(res, data, true, HTTP_STATUS_CODES.SUCCESS.CREATED);
    } catch (e) {
      console.log(e);
      this.logger.error('Error in creating todo list', e);
      sendResponse(res, undefined, false, HTTP_STATUS_CODES.ERROR.BAD_REQUEST);
    }
  }

  async patch(req, res) {
    try {
      const data = await this.updateTodoUseCase.execute({
        ...req.body,
        ...req.params,
        file: req.file,
      });
      sendResponse(res, data, true, HTTP_STATUS_CODES.SUCCESS.OK);
    } catch (e) {
      this.logger.error('Error in updating todo list', e);
      sendResponse(res, undefined, false, HTTP_STATUS_CODES.ERROR.BAD_REQUEST);
    }
  }

  async delete(req, res) {
    try {
      const data = await this.deleteTodoUseCase.execute(req.params);
      sendResponse(res, data, true, HTTP_STATUS_CODES.SUCCESS.NO_CONTENT);
    } catch (e) {
      this.logger.error('Error in deleting todo list', e);
      sendResponse(res, undefined, false, HTTP_STATUS_CODES.ERROR.BAD_REQUEST);
    }
  }
}
