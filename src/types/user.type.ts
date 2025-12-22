export enum EUserType {
  GUEST = 'GUEST',
  USER = 'USER',
  WORKER = 'WORKER',
  CREATOR = 'CREATOR',
}

export type UserTypeBlockReason =
  | 'NEED_CODE'
  | 'NEED_BRAND'
  | 'NOT_ALLOWED'
  | null;

export interface IUser {
  type: EUserType;
  username: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  avatar: string;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}
