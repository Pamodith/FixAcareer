import { FileWithPath } from "@mantine/dropzone";

export interface Category {
  _id: string;
  id: string;
  name: string;
  description: string;
  addedBy: string;
  lastUpdatedBy: string;
  createdAt: string;
  updatedAt: string;
  image: string;
}

export interface CategoryBasic {
  name: string;
  description: string;
  image: FileWithPath;
}

export interface CategoryUpdate {
  _id: string;
  id: string;
  name: string;
  description: string;
  image: FileWithPath;
}
