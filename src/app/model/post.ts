export class Post{
    Id?: number;
    Text: string;
    DateOfPublication?: number;
    BlogId: number;
    UserName?: string;
    IsPostOwner?: boolean;
    Photo?: any;
}

export class SimplePost{
    Text: string;
    BlogId: number;
}
