export interface JwtPayload {
  user: {
    id: string;
    email: string;
    firstname: string;
    lastname: string;
  };
  iat?: number;
}
