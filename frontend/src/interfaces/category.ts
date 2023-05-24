export interface Category {
  _id: string;
  id: string;
  name: string;
  description: string;
  addedBy: string;
  lastUpdatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryBasic {
  name: string;
  description: string;
}

export interface CategoryUpdate {
  _id: string;
  id: string;
  name: string;
  description: string;
}
