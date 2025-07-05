import { Model, Op } from "sequelize";
import { omit } from "lodash";
import { sign } from "jsonwebtoken";
import {
  IAuthDocument,
  IAuthCustomerMessageDetails,
  appAssert,
  NOT_FOUND,
  firstLetterUppercase,
  lowerCase,
  CONFLICT,
  BAD_REQUEST,
} from "@jeffreybernadas/service-hub-helper";
import AuthModel from "@auth/models/auth.model";
import { publishDirectMessage } from "@auth/handlers/queues/auth.producer";
import { _channel } from "@auth/index";
import { JWT_TOKEN_SECRET, SERVICE_NAME } from "@auth/constants/env.constants";

export const createAuthUser = async (
  data: IAuthDocument,
): Promise<IAuthDocument> => {
  const existingUser: Model = (await AuthModel.findOne({
    where: {
      [Op.or]: [
        { username: firstLetterUppercase(data?.username as string) },
        { email: lowerCase(data?.email as string) },
      ],
    },
  })) as Model;

  appAssert(
    !existingUser,
    CONFLICT,
    "Email or username already in use.",
    SERVICE_NAME,
    "error",
  );

  const result: Model = await AuthModel.create(data);
  const messageDetails: IAuthCustomerMessageDetails = {
    username: result.dataValues.username,
    email: result.dataValues.email,
    profilePicture: result.dataValues.profilePicture,
    country: result.dataValues.country,
    createdAt: result.dataValues.createdAt,
    type: "auth",
  };

  const userData: IAuthDocument = omit(result.dataValues, [
    "password",
  ]) as IAuthDocument;

  appAssert(
    _channel,
    BAD_REQUEST,
    "Provider createAuthUser() error: Channel is undefined.",
    SERVICE_NAME,
    "error",
  );

  await publishDirectMessage(
    _channel,
    "service-hub-customer-update",
    "user-customer",
    JSON.stringify(messageDetails),
    "Customer details sent to customer service",
  );
  return userData;
};

export const getAuthUserById = async (
  id: number,
): Promise<Model<IAuthDocument>> => {
  const user: Model = (await AuthModel.findByPk(id, {
    attributes: {
      exclude: ["password"],
    },
  })) as Model;

  appAssert(
    user,
    NOT_FOUND,
    `User with id of ${id} not found`,
    SERVICE_NAME,
    "error",
  );

  return user.dataValues;
};

export const getUserByUsernameOrEmail = async ({
  username,
  email,
}: {
  username: string;
  email: string;
}): Promise<Model<IAuthDocument>> => {
  const user: Model = (await AuthModel.findOne({
    where: {
      [Op.or]: [
        { username: firstLetterUppercase(username) },
        { email: lowerCase(email) },
      ],
    },
    attributes: {
      exclude: ["password"],
    },
  })) as Model;

  appAssert(
    user,
    NOT_FOUND,
    `User with username of ${username} or email of ${email} not found`,
    SERVICE_NAME,
    "error",
  );

  return user.dataValues;
};

export const getUserByUsername = async (
  username: string,
): Promise<Model<IAuthDocument>> => {
  const user: Model = (await AuthModel.findOne({
    where: {
      username: firstLetterUppercase(username),
    },
    attributes: {
      exclude: ["password"],
    },
  })) as Model;

  appAssert(
    user,
    NOT_FOUND,
    `User with username of ${username} not found`,
    SERVICE_NAME,
    "error",
  );

  return user.dataValues;
};

export const getUserByEmail = async (
  email: string,
): Promise<Model<IAuthDocument>> => {
  const user: Model = (await AuthModel.findOne({
    where: {
      email: lowerCase(email),
    },
    attributes: {
      exclude: ["password"],
    },
  })) as Model;

  appAssert(
    user,
    NOT_FOUND,
    `User with email of ${email} not found`,
    SERVICE_NAME,
    "error",
  );

  return user.dataValues;
};

export const getAuthUserByVerificationToken = async (
  token: string,
): Promise<Model<IAuthDocument>> => {
  const user: Model = (await AuthModel.findOne({
    where: { emailVerificationToken: token },
    attributes: {
      exclude: ["password"],
    },
  })) as Model;

  appAssert(
    user,
    NOT_FOUND,
    `User with verification token of ${token} not found`,
    SERVICE_NAME,
    "error",
  );

  return user.dataValues;
};

export const getAuthUserByPasswordResetToken = async (
  token: string,
): Promise<Model<IAuthDocument>> => {
  const user: Model = (await AuthModel.findOne({
    where: {
      [Op.and]: [
        { passwordResetToken: token },
        { passwordResetExpires: { [Op.gt]: new Date() } },
      ],
    },
  })) as Model;

  appAssert(
    user,
    NOT_FOUND,
    `User with the password reset token not found or has expired`,
    SERVICE_NAME,
    "error",
  );

  return user.dataValues;
};

export const updateEmailVerification = async ({
  id,
  emailVerified,
  emailVerificationToken,
}: {
  id: number;
  emailVerified: number;
  emailVerificationToken: string;
}): Promise<void> => {
  await AuthModel.update(
    { emailVerified, emailVerificationToken },
    { where: { id } },
  );
};

export const updatePasswordResetToken = async ({
  id,
  passwordResetToken,
  passwordResetExpires,
}: {
  id: number;
  passwordResetToken: string;
  passwordResetExpires: Date;
}): Promise<void> => {
  await AuthModel.update(
    { passwordResetToken, passwordResetExpires },
    { where: { id } },
  );
};

export const updatePassword = async ({
  id,
  password,
}: {
  id: number;
  password: string;
  passwordResetToken: string;
  passwordResetExpires: Date;
}): Promise<void> => {
  await AuthModel.update(
    { password, passwordResetToken: "", passwordResetExpires: new Date() },
    { where: { id } },
  );
};

export const signToken = ({
  id,
  email,
  username,
}: {
  id: number;
  email: string;
  username: string;
}): string => {
  return sign({ id, email, username }, JWT_TOKEN_SECRET as string);
};
