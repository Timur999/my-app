export class Group {
    Id?: number
    GroupsName: string
    AdminGroupId?: string
    MembersOfGroup: string[]
    DateOfCreatedGroup?: Date
    IsAdmin?: boolean;
    IsMember? : boolean;
}