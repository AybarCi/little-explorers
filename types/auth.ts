export interface User {
  id: string;
  email: string;
  full_name: string;
  age_group: string;
  created_at: string;
}

export interface AuthSession {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  user: User;
}
