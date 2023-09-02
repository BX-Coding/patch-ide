type ProjectProfile = {
    name: string;
    id: string;
}

export enum UserRole {
    USER = "user",
    BETA_TESTER = "beta-user",
    ADMIN = "admin"
}

export type UserMeta = {
    username: string;
    role?: UserRole;
    projects: ProjectProfile[];
}