import { Sequelize } from "sequelize";
import { MYSQL_DB } from "@auth/constants/env.constants";
import { log } from "@auth/utils/logger.util";

export const sequelize = new Sequelize(MYSQL_DB, {
  dialect: "mysql",
  logging: false,
  dialectOptions: {
    multipleStatements: true,
  },
});

export async function connectToDatabase() {
  try {
    await sequelize.authenticate();
    log.info("Auth Service: Database connected");
  } catch (error) {
    log.error("Auth Service: Database connection failed", error);
  }
}
