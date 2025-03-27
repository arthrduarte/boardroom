interface Database {
    members: {
        id: string;
        user_id: string;
        name: string;
        role: string[];
        picture: string;
        created_at: string;
    },
    history: {
        id: string;
        user_id: string;
        member_id: string;
        user_input: string;
        member_output: string;
        created_at: string;
    }
}

