export interface Role {
  id: string;
  name: string;
  description?: string;
}

export interface Person {
  dni: string;
  email: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  nationality?: string;
  phone?: string;
  address?: string;
}

export interface UserRole {
  active?: boolean;
  role: Role | string;
}

export interface User {
  id_person: string;
  username: string;
  active: boolean;
  person?: Person;
  roles?: Role[] | string[];
  user_roles?: UserRole[];
}

export interface RegisterPayload {
  password: string;
  person: Person;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  refresh_token?: string;
  user?: User;
}
