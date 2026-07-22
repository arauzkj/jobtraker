export interface SessionDto {
  id: bigint;
  expiresAt: Date;
  token: string;
  createdAt: Date;
  updatedAt: Date;
  ipAddress?: string | null;
  userAgent?: string | null;
  userId: bigint;
}

export interface CreateSessionDto {
  expiresAt: Date;
  token: string;
  ipAddress?: string;
  userAgent?: string;
  userId: bigint;
}

export type UpdateSessionDto = Partial<CreateSessionDto>;