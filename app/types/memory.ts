export type Memory = {
  id: string;
  title: string;
  description?: string;
  date: string;
  images: string[]; // S3 paths
  cost?: number;
  location?: string;
  createdAt: string;
};
