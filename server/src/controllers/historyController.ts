import { Request, Response } from 'express';
import { supabaseAdmin } from '../config/supabase';
import { z } from 'zod';
import gemini from '../config/gemini';
import { getMemberUsingId } from './memberController';
import clientOpenai from '../config/openai';

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

// Function to fetch history for a specific member and user
const getMemberHistory = async (req: Request, res: Response) => {
    try {
        const { memberId, userId } = req.params;

        const { data, error } = await supabaseAdmin
            .from('history')
            .select('*')
            .eq('member_id', memberId)
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            throw new Error('Failed to fetch history');
        }

        res.status(200).json(data);
    } catch (error: any) {
        console.error('Error fetching history:', error);
        res.status(500).json({ error: error.message || 'Failed to fetch history' });
    }
};

// Function to create history for a user
const createHistory = async (req: Request, res: Response) => {
    try {
        const userInfo = userInfoSchema.parse(req.body);
        const allMembers = await allMembersFromUser(userInfo.user_id);
        const generateResponses = await fetchResponseOfMembers(allMembers, userInfo);
        const saveAllResponses = await saveAllResponsesOnDatabase(generateResponses);

        if (!saveAllResponses) {
            throw new Error('Failed to save responses on database');
        }

        res.status(200).json({ message: 'History created successfully' });
    } catch (error: any) {
        console.error('Error creating history:', error);
        res.status(500).json({ error: error.message || 'Failed to create history' });
    }
};

// create a history with a specific member
const createHistoryWithSpecificMember = async (req: Request, res: Response) => {
   try {
        const memberInfo = await getMemberUsingId(req.params.memberId);

        const userInfo = userInfoSchema.parse(req.body);

        const generateResponse: ResponseSchema = await fechResponseOfMember(memberInfo, userInfo);

        const saveAllResponses = await saveResponseOnDatabase(generateResponse);

        if (!saveAllResponses) {
            throw new Error('Failed to save responses on database');
        }

        res.status(200).json({ message: 'History created successfully' });
    } catch (error: any) {
        console.error('Error creating history:', error);
        res.status(500).json({ error: error.message || 'Failed to create history' });
    }
};

type ResponseSchema = {
    user_id: string;
    member_id: string;
    user_input: string;
    member_output: string; 
}

// Save all responses on the database
const saveAllResponsesOnDatabase = async (responses: ResponseSchema[]) => {
    try {
        const { data, error } = await supabaseAdmin.from('history').insert(responses);

        if (error) {
            console.error('Error saving responses on database:', error);
            throw new Error('Failed to save responses on database');
        }
        return true; 
    } catch (error) {
        console.error('Error saving responses on database:', error);
        throw new Error('Failed to save responses on database');
    }
}

// Save a response on the database
const saveResponseOnDatabase = async (response: ResponseSchema) => {
    try {
        const data = await supabaseAdmin.from('history').insert(response);
            if (data.error) {
                console.error('Error saving response on database:', data.error);
                throw new Error('Failed to save response on database');
             }
        return true;
    } catch (error) {
        throw new Error('Failed to save response on database');
    }
}

// fech a response of a unique member
const fechResponseOfMember = async (member: MemberInfoSchema, userInfo: UserInfoSchema) => {
    const response = await createResponseOfMember(member, userInfo.user_input);

    if (!response) {
        throw new Error('Failed to create response');
    }

    return {
        user_id: userInfo.user_id,
        member_id: member.id,
        user_input: userInfo.user_input,
        member_output: response || '',
    };
}

// Function to fetch responses for all members
const fetchResponseOfMembers = async (members: MemberInfoSchema[], userInfo: UserInfoSchema) => {
    const responses: ResponseSchema[] = [];

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
        const systemPrompt = `
        Your name is ${member.name}, and you serve as a member of the user's personal board.
        The user seeks guidance from the board whenever they need expert insight, advice, or different perspectives on important matters.

        Your current role is ${member.role}.
        You have a ${member.description} personality.
        Your background is ${member.background}.

        When responding, stay true to your given role, personality, and background. 
        Provide insightful, thoughtful, and relevant answers tailored to who you are. 
        Offer advice, opinions, or analysis based on your unique expertise and personal experiences.
        Don't bullshit the user with numered lists. You must give the answer of your true self, as if you're talking to a beloved one.

        User input: ${user_input}
        `;

        const response = await clientOpenai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: systemPrompt
                },
                {
                    role: "user",
                    content: user_input
                }
            ]
        });
        console.log("System prompt ", systemPrompt);
        console.log("Response ", response.choices[0].message.content);
        
        return response.choices[0].message.content;
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

const historySchema = z.object({
    id: z.string(),
    user_id: z.string(),
    member_id: z.string(),
    user_input: z.string(),
    member_output: z.string(),
    created_at: z.string(),
    historyParent_id: z.string().optional().default(""),
});

type HistorySchema = z.infer<typeof historySchema>;

// Create a new history using a history
const createHistoryUsingHistory = async (req: Request, res: Response) => {
    try {
        const { historyId, memberId } = req.params;

        if(!historyId || !memberId) {
            res.status(400).json({ error: 'Missing parameters' });
        }

        const dataHistory: HistorySchema = await getDataOfSpecificHistory(historyId);

        if (!dataHistory) {
            res.status(404).json({ error: 'History not found' });
        }

        const newHistory = await createHistoryUsingHistoryAndMember(dataHistory, memberId);

        if (!newHistory) {
            res.status(500).json({ error: 'Failed to create history' });
        }

        await saveResponseOnDatabase(newHistory);

        res.status(200).json({ message: 'History created successfully',
            "history": newHistory
         });
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Failed to create history' });
    }
};

// Create a new history using a history and a member
const createHistoryUsingHistoryAndMember = async (dataHistory: HistorySchema, memberId: string) => {
    const generateResponse = await fetchResponseOfMemberUsingHistory(dataHistory, memberId);

    if(!generateResponse) {
        throw new Error('Failed to create response');
    }

    return {
        user_id: dataHistory.user_id,
        member_id: memberId,
        user_input: dataHistory.user_input,
        member_output: generateResponse || '',
        historyParent_id: dataHistory.id,
    };
}

// fetch a responde of History using a specific member
const fetchResponseOfMemberUsingHistory = async (dataHistory: HistorySchema, memberId: string) => {
    try {
        const member: MemberInfoSchema = await getMemberUsingId(memberId);

        const memberResponseHistory = await getMemberUsingId(dataHistory.member_id);

        let systemPrompt: string = `
        Your name is ${member.name}, and you serve as a member of the user's personal board.
        The user seeks guidance from the board whenever they need expert insight, advice, or different perspectives on important matters.

        Your current role is ${member.role}.
        You have a ${member.description} personality.
        Your background is ${member.background}.

        When responding, stay true to your given role, personality, and background. 
        Provide insightful, thoughtful, and relevant answers tailored to who you are. 
        Offer advice, opinions, or analysis based on your unique expertise and personal experiences.
        Don't bullshit the user with numered lists. You must give the answer of your true self, as if you're talking to a beloved one.

        User input: ${dataHistory.user_input}
        
        ${memberResponseHistory.name} reponse: ${dataHistory.member_output}
            
        What do you think about this, ${member.name}?`

        const response = await fetchUsingClientGemini(systemPrompt);

        if(!response) {
            throw new Error('Failed to create response');
        }
        
        return response;
        
    } catch (error: any) {
        console.error('Error creating response:', error);
        throw new Error(error.message || 'Failed to create response');
    }
}


// fech using Gemini
const fetchUsingClientGemini = async (input: string) => {
    try {
           const response = await gemini.models.generateContent({
            model: "gemini-2.0-flash",
            contents: input
        });
        
        return response.text
    } catch (error) {
        console.error('Error creating response:', error);
        throw new Error('Failed to create response');
    }
}

// fetch using OpenAI
const fetchUsingClientOpenai = async (input: string) => {
    try {
        const response = await clientOpenai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: input
                },
                {
                    role: "user",
                    content: input
                }
            ]
        });
        
        return response.choices[0].message.content
    } catch (error) {
        console.error('Error creating response:', error);
        throw new Error('Failed to create response');
    }
}

// helper to get data of a specific history
const getDataOfSpecificHistory = async (historyId: string) => {
    const { data, error } = await supabaseAdmin.from('history').select('*').eq('id', historyId).single();

    if (error || !data) {
        console.error('Error fetching history from database:', error);
        throw new Error('History not found');
    }

    return data
};

const createMessage = async (req: Request, res: Response) => {
    try {
        const { member_1, member_2, user_input, member_output, history_id } = req.body;
        console.log("Member 1: ", member_1);
        console.log("Member 2: ", member_2);
        console.log("User input: ", user_input);
        console.log("Member output: ", member_output);

        let systemPrompt: string = `
        Your name is ${member_1.name}, and you serve as a member of the user's personal board.
        The user seeks guidance from the board whenever they need expert insight, advice, or different perspectives on important matters.

        Your current role is ${member_1.role}.
        You have a ${member_1.description} personality.
        Your background is ${member_1.background}.

        When responding, stay true to your given role, personality, and background. 
        Provide insightful, thoughtful, and relevant answers tailored to who you are.
        You must either agree or disagree with the other member based on your personality and opinions.
        Offer advice, opinions, or analysis based on your unique expertise and personal experiences.
        Don't bullshit the user with numered lists. You must give the answer of your true self, as if you're talking to a beloved one.

        User input: ${user_input}
        
        ${member_2.name} reponse: ${member_output}
            
        What do you think about this, ${member_1.name}?`

        console.log("System prompt: ", systemPrompt);

        const response = await fetchUsingClientOpenai(systemPrompt);

        if(!response) {
            throw new Error('Failed to create response');
        }

        // First get the current history entry to access existing chat
        const { data: currentHistory, error: fetchError } = await supabaseAdmin
            .from('history')
            .select('chat')
            .eq('id', history_id)
            .single();

        if (fetchError) {
            throw new Error('Failed to fetch current history');
        }

        // Prepare the new chat array by combining existing messages with the new one
        const updatedChat = [
            ...(currentHistory.chat || []),
            {
                message: response,
                member_id: member_1.id
            }
        ];

        // Update with the combined chat array
        const { data, error } = await supabaseAdmin
            .from('history')
            .update({
                chat: updatedChat
            })
            .eq('id', history_id);

        if (error) {
            throw new Error('Failed to save message to database');
        }
        
        res.status(200).json({ response });
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Failed to create message' });
    }
}



export { createHistory, fetchResponseOfMembers, createHistoryWithSpecificMember, getMemberHistory, createHistoryUsingHistory, createMessage };
