export interface AuthResponse{
    token: string,
    userId: number,
    roles: string[],
    groupId: number
}