import { Request, Response } from 'express';
import { supabaseAdmin } from '../config/supabase';

export const getAllMembersFromUser = (req: Request, res: Response) => {
  try {
    const { user_id } = req.params;
    
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
  } catch (error) {
    console.error('Error fetching member:', error);
    res.status(500).json({ error: 'Failed to fetch member' });
  }
};

export const createMember = (req: Request, res: Response) => {
  try {
    supabaseAdmin
      .from('members')
      .insert([req.body])
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

export const updateMember = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    supabaseAdmin
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

export const deleteMember = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    supabaseAdmin
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