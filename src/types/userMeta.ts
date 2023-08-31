type ProjectProfile = {
    name: string;
    id: string;
}

export type UserMeta = {
    username: string;
    projects: ProjectProfile[];
}