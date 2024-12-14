import 'reflect-metadata'; // Required for InversifyJS decorators
import BaseController from '../interfaces/base-controller.js';
import { sendResponse, HTTP_STATUS_CODES } from '../../../../utils/send-response.js';
class UserController extends BaseController {
  constructor(logger, userUsecase) {
    super();
    this.userUsecase = userUsecase;
    this.logger = logger;
  }

  async list(_req, res) {
    try {
      const users = await this.userUsecase.execute();
      sendResponse(res, users, true, HTTP_STATUS_CODES.SUCCESS.OK);
    } catch (error) {
      this.logger.error('Error fetching users:', error);
      sendResponse(res, undefined, false, HTTP_STATUS_CODES.ERROR.BAD_REQUEST);
    }
  }
}

export default UserController;
