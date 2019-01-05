export class Invitation{
    Id?: number;
    GroupId: number;
    GroupsName: string;
    UserIdSender?: string;
    UserIdReceiver: string;
    IsAccepted?: boolean;
    Position?: number;
    UserNameSender?: string;
}