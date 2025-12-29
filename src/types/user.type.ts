export enum EUserType {
  GUEST = 'GUEST',
  USER = 'USER',
  WORKER = 'WORKER',
  CREATOR = 'CREATOR',
}

export enum EUserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
}

export type UserTypeBlockReason =
  | 'NEED_CODE'
  | 'NEED_BRAND'
  | 'NOT_ALLOWED'
  | null;

export interface IUser {
  id: string;
  username: string;
  email: string | null;
  phone: string | null;
  firstName: string | null;
  lastName: string | null;
  image: string | null;
  coverImage: string | null;
  role: EUserType;
  status: EUserStatus;
  emailVerified: boolean;
  phoneNumberVerified: boolean;
  language: string | null;
  country: string | null;
  state: string | null;
  city: string | null;
  street: string | null;
  postalCode: string | null;
  detailedAddress: string | null;
  preferredLocation: string | null;
  createdAt: string;
  updatedAt: string;
}
