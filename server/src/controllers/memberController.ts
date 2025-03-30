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

// Get all members for a specific user
export const getAllMembersFromUser = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.params;
    const { data, error } = await supabaseAdmin
      .from('members')
      .select('*')
      .eq('user_id', user_id);

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching members:', error);
    res.status(500).json({ error: 'Failed to fetch members' });
  }
};

// Get a member by ID
export const getMemberById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const member = await getMemberUsingId(id);

    if (!member) {
      res.status(404).json({ error: 'Member not found' });
    }
    console.log(member);

    res.status(200).json(member);
  } catch (error) {
    console.error('Error fetching member:', error);
    res.status(500).json({ error: 'Failed to fetch member' });
  }
};


export const getMemberUsingId = async (member_id: string) => {
  const { data, error } = await supabaseAdmin
    .from('members')
    .select('*')
    .eq('id', member_id)
    .single();

  if (error) throw error;

  if (!data) {
    throw new Error('Member not found');
  }

  return data;
};
// Create a new member
export const createMember = async (req: Request, res: Response) => {
  try {
    const member = memberSchema.parse(req.body);
    const { data, error } = await supabaseAdmin
      .from('members')
      .insert(member)
      .select();

    if (error) throw error;

    res.status(201).json(data[0]);
  } catch (error) {
    console.error('Error creating member:', error);
    res.status(500).json({ error: 'Failed to create member' });
  }
};

// Update a member
export const updateMember = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabaseAdmin
      .from('members')
      .update(req.body)
      .eq('id', id)
      .select();

    if (error) throw error;

    if (data.length === 0) {
      res.status(404).json({ error: 'Member not found' });
    }

    res.status(200).json(data[0]);
  } catch (error) {
    console.error('Error updating member:', error);
    res.status(500).json({ error: 'Failed to update member' });
  }
};

// Delete a member
export const deleteMember = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { error } = await supabaseAdmin
      .from('members')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.status(200).json({ message: 'Member deleted successfully' });
  } catch (error) {
    console.error('Error deleting member:', error);
    res.status(500).json({ error: 'Failed to delete member' });
  }
};
