export class User{
    Id?: string;
    UserName: string;
    FirstName?: string;
    LastName?: string;
    Email?: string;
    Password?: string;
    ConfirmPassword?: string;
    Token?: string;
    Position: number;
    Role: string;

    constructor(id: string, userName: string){
        this.Id = id,
        this.UserName = userName
    }
}