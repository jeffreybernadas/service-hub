import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { UploadApiResponse } from "cloudinary";
import {
  appAssert,
  BAD_REQUEST,
  cloudinaryFileUpload,
  CREATED,
  firstLetterUppercase,
  IAuthDocument,
  IEmailMessageDetails,
  lowerCase,
  catchErrors,
} from "@jeffreybernadas/service-hub-helper";
import crypto from "crypto";
import { signupSchema } from "@auth/schemas/auth.schema";
import { createAuthUser, signToken } from "@auth/services/auth.service";
import { CLIENT_URL, SERVICE_NAME } from "@auth/constants/env.constants";
import { publishDirectMessage } from "@auth/handlers/queues/auth.producer";
import { _channel } from "@auth/index";

export const signupHandler = catchErrors(
  async (req: Request, res: Response) => {
    const {
      username,
      password,
      country,
      email,
      profilePicture,
      browserName,
      deviceType,
    } = signupSchema.parse({
      ...req.body,
    });

    const profilePublicId = uuidv4();
    const profilePictureUpload: UploadApiResponse = (await cloudinaryFileUpload(
      profilePicture as string,
      profilePublicId,
      true,
      true,
    )) as UploadApiResponse;

    appAssert(
      profilePictureUpload.public_id,
      BAD_REQUEST,
      "Failed to upload profile picture.",
      SERVICE_NAME,
      "error",
    );

    // For email verification token
    const randomBytes: Buffer = await Promise.resolve(crypto.randomBytes(20));
    const randomCharacters: string = randomBytes.toString("hex");

    const data: IAuthDocument = {
      username: firstLetterUppercase(username),
      email: lowerCase(email),
      profilePublicId,
      password,
      country,
      profilePicture: profilePictureUpload?.secure_url,
      emailVerificationToken: randomCharacters,
      browserName,
      deviceType,
    } as IAuthDocument;

    const user = await createAuthUser(data);

    const emailVerificationLink = `${CLIENT_URL}/confirm_email?v_token=${data.emailVerificationToken}`;

    const messageDetails: IEmailMessageDetails = {
      receiverEmail: user.email,
      verifyLink: emailVerificationLink,
      template: "verify-email",
    };

    appAssert(
      _channel,
      BAD_REQUEST,
      "Provider signup() error: Channel is undefined.",
      SERVICE_NAME,
      "error",
    );

    await publishDirectMessage(
      _channel,
      "service-hub-auth-notification",
      "auth-email",
      JSON.stringify(messageDetails),
      "Verification email sent to the user. - Via Notification Service",
    );

    const userJWT: string = signToken({
      id: user.id!,
      email: user.email!,
      username: user.username!,
    });

    res.status(CREATED).json({
      message: "User created successfully",
      user,
      token: userJWT,
    });
  },
);
