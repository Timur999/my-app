export class Post{
    Id?: number;
    Text: string;
    DateOfPublication?: number;
    BlogId: number;
    UserName?: string;
    IsPostOwner?: boolean;
    ImagePath?: string;
    ImageName?: string;
    Base64StringImage?: string;
    PostCount?: number;
    isEdit?: boolean;
}

export class SimplePost{
    Text: string;
    BlogId: number;
}
