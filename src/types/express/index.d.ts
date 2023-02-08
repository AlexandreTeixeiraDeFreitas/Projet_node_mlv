import { JWTUser } from "../../modules/auth";

declare global {
  namespace Express {
    export interface Request {
      user: JWTUser
    }
  }
}