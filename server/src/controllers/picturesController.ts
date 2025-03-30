import { Request, Response } from 'express';
import { supabaseAdmin } from '../config/supabase';

export const getPictures = async (req: Request, res: Response) => {
    console.log("Fetching pictures");
    try {
        const { data, error } = await supabaseAdmin
            .from('pictures')
            .select('*');

        if (error) throw error;

        console.log("Pictures fetched:", data);
        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching pictures:', error);
        res.status(500).json({ error: 'Failed to fetch pictures' });
    }
};