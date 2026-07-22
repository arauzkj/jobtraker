export interface AccountDto {
  id: bigint;
  accountId: string;
  providerId: string;
  userId: bigint;
  accessToken?: string | null;
  refreshToken?: string | null;
  idToken?: string | null;
  accessTokenExpiresAt?: Date | null;
  refreshTokenExpiresAt?: Date | null;
  scope?: string | null;
  password?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAccountDto {
  accountId: string;
  providerId: string;
  userId: bigint;
  accessToken?: string;
  refreshToken?: string;
  idToken?: string;
  accessTokenExpiresAt?: Date;
  refreshTokenExpiresAt?: Date;
  scope?: string;
  password?: string;
}

export type UpdateAccountDto = Partial<CreateAccountDto>;