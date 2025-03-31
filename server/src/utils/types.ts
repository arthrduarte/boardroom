export type Member = {
    id: string;
    user_id: string;
    name: string;
    role: string[];
    picture: string;
    created_at: string;
}

export type History = {
    id: string;
    user_id: string;
    member_id: string;
    user_input: string;
    member_output: string;
    historyParent_id: string;
    created_at: string;
}

export type Picture = {
    id: string;
    url: string;
    created_at: string;
}