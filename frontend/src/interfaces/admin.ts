export interface AdminDataLogin {
  _id: string;
  id: string;
  email: string;
  role: string;
}

export interface Admin {
  _id: string;
  id: string;
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
  phone: string;
  addedBy: string;
  lastUpdatedBy: string;
  isActive: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminBasic {
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
  phone: string;
}

export interface AdminUpdate {
  _id: string;
  id: string;
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
  phone: string;
  isActive: boolean;
}

export interface AdminUpdateBasic {
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
  phone: string;
}

export interface ChangePassword {
  currentPassword: string;
  newPassword: string;
}
