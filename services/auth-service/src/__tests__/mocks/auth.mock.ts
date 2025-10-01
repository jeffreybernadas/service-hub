import {
  IAuthDocument,
  IAuthPayload,
} from "@jeffreybernadas/service-hub-helper";
import { IAuthMock, IJwt } from "../types/auth.type";
import { Response } from "express";

export const authMockRequest = (
  sessionData: IJwt,
  body: IAuthMock,
  currentUser?: IAuthPayload | null,
  params?: unknown,
) => {
  return {
    session: sessionData,
    body,
    currentUser,
    params,
  };
};

export const authMockResponse = (): Response => {
  const res: Response = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

export const authUserPayload: IAuthPayload = {
  id: 1,
  email: "test@test.com",
  username: "test",
  iat: 123456789,
};

export const authMock: IAuthDocument = {
  id: 1,
  username: "test",
  email: "test@test.com",
  emailVerificationToken: "test12345",
  emailVerified: 1,
  country: "my",
  profilePicture:
    "https://res.cloudinary.com/test.png",
  passwordResetExpires: "2025-09-18T14:54:27.301Z",
  createdAt: "2025-09-18T14:54:27.301Z",
  updatedAt: "2025-09-18T14:54:27.302Z",
  comparePassword: jest.fn().mockResolvedValue(true),
  hashPassword: jest.fn().mockResolvedValue("hashedPassword"),
} as unknown as IAuthDocument;
