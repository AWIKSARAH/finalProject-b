import express from 'express';
import { getAllReactions, createReaction, deleteReaction } from '../controller/reactionController.js';

const router = express.Router();

router.get('/', getAllReactions);
router.post('/', createReaction);
router.delete('/:id', deleteReaction);

export default router;
