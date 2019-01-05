export class Invitation{
    Id?: number;
    GroupId: number;
    GroupsName: string;
    UserIdSender?: string;
    UserIdReceiver: string;
    IsAccepted?: boolean;
}