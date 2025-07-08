import { Request } from "express";
import "express-session";

// Module augmentation for express-session

declare module "express-session" {
  export interface SessionData {
    passport: { user: { [key: string]: any } };
  }
}

export interface ArticleRequest extends Request {
  params: {
    id: string;
  };
}

export interface QueryParams {
  pageNumber?: string;
  resultsOnPage?: string;
}

declare module "express-session" {
  interface Session {
    csrfSecret: string;
  }
}