import express from 'express';
import {
  getAllMembersFromUser,
  getMemberById,
  createMember,
  updateMember,
  deleteMember
} from '../controllers/memberController';

const router = express.Router();

router.get('/user/:user_id', getAllMembersFromUser);

router.get('/:id', getMemberById);

router.post('/', createMember);

router.put('/:id', updateMember);

router.delete('/:id', deleteMember);

export default router; 