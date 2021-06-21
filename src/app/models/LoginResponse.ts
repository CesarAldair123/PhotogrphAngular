export interface LoginResponse{
    username: string,
    token: string,
    refreshToken: string,
    expirationDate: Date
}