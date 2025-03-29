import { Request, Response } from 'express';
import { supabaseAdmin } from '../config/supabase';
import { z } from 'zod';
import gemini from '../config/gemini';

type MemberInfoSchema = {
    id: string;
    name: string;
    description: string;
    background: string;
    role: string[];
};

const userInfoSchema = z.object({
    user_id: z.string(),
    user_input: z.string(),
});

type UserInfoSchema = z.infer<typeof userInfoSchema>;

// Function to create history for a user
const createHistory = async (req: Request, res: Response) => {
    try {
        const userInfo = userInfoSchema.parse(req.body);

        const allMembers = await allMembersFromUser(userInfo.user_id);

        const generateResponses = await fetchResponseOfMember(allMembers, userInfo);

        const saveAllResponses = await saveAllResponsesOnDatabase(generateResponses);

        if (!saveAllResponses) {
            throw new Error('Failed to save responses on database');
        }

        res.status(200).json({ message: 'History created successfully' });
    } catch (error) {
        console.error('Error fetching members:', error);
        res.status(500).json({ error: 'Failed to fetch members' });
    }
};

type responseSchema = {
    user_id: string;
    member_id: string;
    user_input: string;
    member_output: string; 
}

// Save all responses on the database
const saveAllResponsesOnDatabase = async (responses: responseSchema[]) => {
    try {
        for (const response of responses) {
            await supabaseAdmin.from('history').insert(response).select().then(({ data, error }) => {
                if (error) throw error; 
                console.log('Response saved on database:', data);
            });
        }

        return responses;
    } catch (error) {
        console.error('Error saving responses on database:', error);
        throw new Error('Failed to save responses on database');
    }
}

// Function to fetch responses for all members
const fetchResponseOfMember = async (members: MemberInfoSchema[], userInfo: UserInfoSchema) => {
    const responses = [];

    for (const member of members) {
        const response = await createResponseOfMember(member, userInfo.user_input);
        responses.push({
            user_id: userInfo.user_id,
            member_id: member.id,
            user_input: userInfo.user_input,
            member_output: response || '',
        });
    }

    return responses; 
};

// Function to create a response using the AI model
const createResponseOfMember = async (member: MemberInfoSchema, user_input: string) => {
    try {
        const contents = `You are a ${member.description}. Your background is ${member.background}. Respond to the following user input: ${user_input}`;

        const response = await gemini.models.generateContent({
            model: "gemini-2.0-flash",
            contents: contents
        });
        
        return response.text; // This can be undefined if the response is not as expected
    } catch (error) {
        console.error('Error creating response:', error);
        throw new Error('Failed to create response');
    }
};

// Helper function to fetch members from the database
const allMembersFromUser = async (id_user: string) => {
    const { data, error } = await supabaseAdmin.from('members').select('*').eq('user_id', id_user);

    if (error || !data) {
        console.error('Error fetching members from database:', error);
        throw new Error('Members not found');
    }

    return data;
};

export { createHistory, createResponseOfMember };
