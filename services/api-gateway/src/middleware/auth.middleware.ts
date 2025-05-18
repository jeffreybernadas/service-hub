import { NextFunction, Request, Response } from "express";
import {
  appAssert,
  IAuthPayload,
  UNAUTHORIZED,
  AppError,
  BAD_REQUEST,
} from "@jeffreybernadas/service-hub-helper";
import { verify } from "jsonwebtoken";
import { JWT_TOKEN_SECRET } from "@gateway/constants/env.constants";

export const verifyUser = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  appAssert(
    req.session?.jwt,
    UNAUTHORIZED,
    "Token is not available. Please login again.",
    "API Gateway",
    "error",
  );

  try {
    const payload: IAuthPayload = verify(
      req.session?.jwt,
      `${JWT_TOKEN_SECRET}`,
    ) as IAuthPayload;
    req.currentUser = payload;
  } catch (error) {
    throw new AppError(
      UNAUTHORIZED,
      error instanceof Error ? error.message : "Token is not available. Please login again.",
      "API Gateway",
      "error",
    );
  }
  next();
};

export const checkAuthentication = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  if (!req.currentUser) {
    throw new AppError(
      BAD_REQUEST,
      "Authentication is required to access this route.",
      "API Gateway",
      "error",
    );
  }
  next();
};
