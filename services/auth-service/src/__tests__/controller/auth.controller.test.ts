import { Request, Response } from "express";
import {
  authMock,
  authMockRequest,
  authMockResponse,
  authUserPayload,
} from "@auth/__tests__/mocks/auth.mock";
import { getCurrentUser } from "@auth/controller/auth.controller";
import * as auth from "@auth/services/auth.service";

jest.mock("@jeffreybernadas/service-hub-helper", () => ({
  catchErrors: <T extends (...args: unknown[]) => unknown>(fn: T): T => fn,
  OK: 200,
  appAssert: jest.fn(),
  winstonLogger: jest.fn(() => ({
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  })),
}));
jest.mock("@auth/services/auth.service");
jest.mock("@auth/handlers/queues/auth.producer");
jest.mock("@elastic/elasticsearch");
jest.mock("@auth/models/auth.model", () => ({
  default: {
    addHook: jest.fn(),
    prototype: {
      comparePassword: jest.fn(),
      hashPassword: jest.fn(),
    },
  },
}));
jest.mock("@auth/config/database.config");
jest.mock("@auth/index", () => ({
  _channel: undefined,
  getChannel: jest.fn(() => undefined),
}));

describe("Auth Controller", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("getCurrentUser", () => {
    it("should return 200, success message and user data", async () => {
      const req: Request = authMockRequest(
        {},
        {},
        authUserPayload,
      ) as unknown as Request;
      const res: Response = authMockResponse();
      jest.spyOn(auth, "getAuthUserById").mockResolvedValue(authMock);

      await getCurrentUser(req, res, () => {});

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "User fetched successfully.",
        user: authMock,
      });
    });

    it("should return empty user", async () => {
      const req: Request = authMockRequest(
        {},
        {},
        authUserPayload,
      ) as unknown as Request;
      const res: Response = authMockResponse();
      jest.spyOn(auth, "getAuthUserById").mockResolvedValue({} as never);

      await getCurrentUser(req, res, () => {});

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "User fetched successfully.",
        user: {},
      });
    });
  });
});
