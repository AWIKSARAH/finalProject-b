import express from 'express';
import {
  getAllPersons,
  createPerson,
  getPersonById,
  updatePerson,
  deletePerson,
} from '../controller/personController.js'; // Import the controller functions
import uploader from '../middleware/imageHandlerMiddleware.js'
const router = express.Router();

// Routes for CRUD operations
router.get('/', getAllPersons);
router.post('/',uploader('person'), createPerson);
router.get('/:id', getPersonById);
router.patch('/:id', uploader('person'),updatePerson);
router.delete('/:id', deletePerson);

export default router;
