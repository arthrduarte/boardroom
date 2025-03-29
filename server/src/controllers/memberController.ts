import { Request, Response } from 'express';
import { supabaseAdmin } from '../config/supabase';
import { z } from 'zod';

const memberSchema = z.object({
  name: z.string(),
  user_id: z.string(),
  description: z.string(),
  background: z.string(),
  role: z.array(z.string()),
  picture: z.string().optional(),
});

export const getAllMembersFromUser = (req: Request, res: Response) => {
  try {
    const { user_id } = req.params;
<<<<<<< HEAD
    
=======
      console.log(user_id);
>>>>>>> b8f3710fe442343c857d84bada319adfab7fda85
    supabaseAdmin
      .from('members')
      .select('*')
      .eq('user_id', user_id)
      .then(({ data, error }) => {
        if (error) throw error;
        res.status(200).json(data);
      });
  } catch (error) {
    console.error('Error fetching members:', error);
    res.status(500).json({ error: 'Failed to fetch members' });
  }
};

<<<<<<< HEAD
export const getMemberById = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    supabaseAdmin
      .from('members')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
        if (error) throw error;
        
        if (!data) {
          return res.status(404).json({ error: 'Member not found' });
        }
        
        res.status(200).json(data);
      });
=======
export const getMemberById = async(req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const memberData = await getMember(id);

    res.status(200).json(memberData.data);
>>>>>>> b8f3710fe442343c857d84bada319adfab7fda85
  } catch (error) {
    console.error('Error fetching member:', error);
    res.status(500).json({ error: 'Failed to fetch member' });
  }
};

<<<<<<< HEAD
=======
// Get a member by id
export const getMember = async (id_member: string) => {
  const member = await supabaseAdmin.from('members').select('*').eq('id', id_member).single();

  if(!member) {
   throw new Error('Member not found');
  }

  return member;
}


>>>>>>> b8f3710fe442343c857d84bada319adfab7fda85
export const createMember = async (req: Request, res: Response) => {
  try {
    const member = memberSchema.parse(req.body);
     await supabaseAdmin
      .from('members')  
      .insert(member)
      .select()
      .then(({ data, error }) => {
        if (error) throw error; 
        res.status(201).json(data[0]);
      });
  } catch (error) {
    console.error('Error creating member:', error);
    res.status(500).json({ error: 'Failed to create member' });
  }
};

<<<<<<< HEAD
export const updateMember = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    supabaseAdmin
=======
export const updateMember = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    await supabaseAdmin
>>>>>>> b8f3710fe442343c857d84bada319adfab7fda85
      .from('members')
      .update(req.body)
      .eq('id', id)
      .select()
      .then(({ data, error }) => {
        if (error) throw error;
        
        if (data.length === 0) {
          return res.status(404).json({ error: 'Member not found' });
        }
        
        res.status(200).json(data[0]);
      });
  } catch (error) {
    console.error('Error updating member:', error);
    res.status(500).json({ error: 'Failed to update member' });
  }
};

<<<<<<< HEAD
export const deleteMember = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    supabaseAdmin
=======
export const deleteMember = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    await supabaseAdmin
>>>>>>> b8f3710fe442343c857d84bada319adfab7fda85
      .from('members')
      .delete()
      .eq('id', id)
      .then(({ error }) => {
        if (error) throw error;
        res.status(200).json({ message: 'Member deleted successfully' });
      });
  } catch (error) {
    console.error('Error deleting member:', error);
    res.status(500).json({ error: 'Failed to delete member' });
  }
}; 