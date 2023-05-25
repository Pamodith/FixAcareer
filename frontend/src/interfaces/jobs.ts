import { FileWithPath } from "@mantine/dropzone";

export interface Job {
  _id: string;
  id: string;
  title: string;
  description: string;
  category: string;
  addedBy: string;
  lastUpdatedBy: string;
  createdAt: string;
  updatedAt: string;
  image: string;
}

export interface JobBasic {
  title: string;
  description: string;
  category: string;
  image: FileWithPath;
}

export interface JobUpdate {
  _id: string;
  id: string;
  title: string;
  description: string;
  category: string;
  image: FileWithPath;
}
