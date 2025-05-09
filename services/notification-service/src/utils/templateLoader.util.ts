import fs from "fs";
import path from "path";
import { log } from "./logger.util";

/**
 * Loads an HTML template from the file system and replaces placeholders with values
 * @param templateName The name of the template file (without extension)
 * @param replacements An object containing the data object with replacement values
 * @returns The processed HTML string
 */
export const loadTemplate = <T extends object>(
  templateName: string,
  replacements: { data: T },
): string => {
  try {
    // Construct the template path
    const templatePath = path.join(
      __dirname,
      "..",
      "templates",
      "emails",
      `${templateName}.html`,
    );

    // Read the template file
    let templateContent = fs.readFileSync(templatePath, "utf-8");

    // Replace all placeholders with their values from the data object
    Object.entries(replacements.data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        const placeholder = new RegExp(`{{${key}}}`, "g");
        const stringValue = typeof value === "object"
          ? JSON.stringify(value)
          : String(value);
        templateContent = templateContent.replace(placeholder, stringValue);
      }
    });

    return templateContent;
  } catch (error) {
    log.error(`Error loading template ${templateName}:`, error);
    throw new Error(`Failed to load email template: ${templateName}`);
  }
};
