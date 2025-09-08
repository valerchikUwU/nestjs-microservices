export class ReadRefreshSessionDto {
  id: string;
  user_agent: string;
  fingerprint: string;
  ip: string;
  expiresIn: number;
  refreshToken: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
