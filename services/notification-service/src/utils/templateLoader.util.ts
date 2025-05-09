import fs from "fs";
import path from "path";
import { log } from "./logger.util";

/**
 * Loads an HTML template from the file system and replaces placeholders with values
 * @param templateName The name of the template file (without extension)
 * @param replacements An object with key-value pairs for replacements
 * @returns The processed HTML string
 */
export const loadTemplate = (
  templateName: string,
  replacements: Record<string, string>
): string => {
  try {
    // Construct the template path
    const templatePath = path.join(
      __dirname,
      "..",
      "templates",
      "emails",
      `${templateName}.html`
    );

    // Read the template file
    let templateContent = fs.readFileSync(templatePath, "utf-8");

    // Replace all placeholders with their values
    Object.entries(replacements).forEach(([key, value]) => {
      const placeholder = new RegExp(`{{${key}}}`, "g");
      templateContent = templateContent.replace(placeholder, value);
    });

    return templateContent;
  } catch (error) {
    log.error(`Error loading template ${templateName}:`, error);
    throw new Error(`Failed to load email template: ${templateName}`);
  }
};
