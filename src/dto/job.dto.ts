export interface JobDto {
  id: bigint;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  link: string;
  company: string;
  wheresApplied: string;
  applierId: bigint;
}

export interface CreateJobDto {
  title: string;
  description: string;
  link: string;
  company: string;
  wheresApplied: string;
  applierId: bigint; // O 'string'/'number' dependiendo de cómo lo recibas en el body
}

export type UpdateJobDto = Partial<CreateJobDto>;