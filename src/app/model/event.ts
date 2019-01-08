export class Event {
    Id?: number;
    EventName: string;
    UserName: string;
    Text: string;
    EventDate: Date;
    IsAdmin?: boolean;
    IsSubscriber?: boolean;
    ImagePath?: string;
    ImageName?: string;
    Base64StringImage?: string;
    isEdit?: boolean;
    ArrayLength: number;
    Users: User[];
}

class User {
    Id: number;
    UserName: string;
    Role: string;
    IsSubscribe: boolean;
}