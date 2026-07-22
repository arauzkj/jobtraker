export interface UserDto {
  id: bigint;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
  username?: string | null;
  displayUsername?: string | null;
}

export interface CreateUserDto {
  name: string;
  email: string;
  image?: string;
  username?: string;
  displayUsername?: string;
}

export interface UpdateUserDto extends Partial<CreateUserDto> {
  emailVerified?: boolean;
}