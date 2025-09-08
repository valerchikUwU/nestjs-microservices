import { RefreshSession } from "../../domains";

export class ReadUserDto {
    id: string;
    firstName: string;
    lastName: string;
    middleName: string;
    email: string;
    password: string;
    telegramId: number;
    telephoneNumber: string;
    avatar_url: string;
    createdAt: Date;
    updatedAt: Date;
    refreshSessions?: RefreshSession[];
}
