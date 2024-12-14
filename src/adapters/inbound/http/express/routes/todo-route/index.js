import { Router } from 'express';
import { container } from '../../../../../../di/inversify.config.js'; // Import container
import { validateRequest, validateTodoId } from '../../middlewares/validators/todo-request.js';
import upload from '../../middlewares/upload/file-upload.js';

// Get the todo controller from the di
const controller = container.get('TodoController');
const CreateTodoSchema = container.get('CreateTodoSchema');
const UpdateTodoSchema = container.get('UpdateTodoSchema');
const TodoIdSchema = container.get('TodoIdSchema');

const router = Router();

router.get('/:id', validateTodoId(TodoIdSchema), (req, res) => {
  return controller.get(req, res);
});

router.get('/', (req, res) => {
  return controller.list(req, res);
});

router.post('/', upload.single('file'), validateRequest(CreateTodoSchema), (req, res) => {
  return controller.post(req, res);
});

router.patch(
  '/:id',
  upload.single('file'),
  validateTodoId(TodoIdSchema),
  validateRequest(UpdateTodoSchema),
  (req, res) => {
    return controller.patch(req, res);
  }
);

router.delete('/:id', validateTodoId(TodoIdSchema), (req, res) => {
  return controller.delete(req, res);
});

export default router;
