import { sequelize } from "@auth/config/database.config";
import { IAuthDocument } from "@jeffreybernadas/service-hub-helper";
import { DataTypes, Model, ModelDefined, Optional } from "sequelize";
import { compare, hash } from "bcrypt";

interface AuthModelInstanceMethods {
  comparePassword: (
    password: string,
    hashedPassword: string,
  ) => Promise<boolean>;
  hashPassword: (password: string) => Promise<string>;
}

type AuthUserCreationAttributes = Optional<
  IAuthDocument,
  "id" | "createdAt" | "passwordResetExpires" | "passwordResetToken"
>;

const SALT_ROUNDS = 10;

const AuthModel = sequelize.define(
  "Auth",
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    profilePicture: {
      type: DataTypes.STRING,
      defaultValue:
        "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
    },
    emailVerificationToken: {
      type: DataTypes.STRING,
      unique: true,
    },
    emailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    passwordResetToken: {
      type: DataTypes.STRING,
    },
    passwordResetExpires: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ["username"],
      },
      {
        unique: true,
        fields: ["email"],
      },
      {
        unique: true,
        fields: ["emailVerificationToken"],
      },
    ],
  },
) as ModelDefined<IAuthDocument, AuthUserCreationAttributes> & {
  prototype: AuthModelInstanceMethods;
};

AuthModel.addHook("beforeCreate", async (auth: Model) => {
  const hashedPassword = await hash(auth.dataValues.password, SALT_ROUNDS);
  auth.dataValues.password = hashedPassword;
});

AuthModel.prototype.comparePassword = async function (
  password: string,
  hashedPassword: string,
) {
  return await compare(password, hashedPassword);
};

AuthModel.prototype.hashPassword = async function (password: string) {
  return await hash(password, SALT_ROUNDS);
};

AuthModel.sync();
export default AuthModel;
