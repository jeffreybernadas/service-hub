import fs from "fs";
import path from "path";
import { loadTemplate } from "@notifications/utils/templateLoader.util";

// Mock fs and path modules
jest.mock("fs");
jest.mock("path");

describe("Template Loader Utility", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock path.join to return a predictable path
    (path.join as jest.Mock).mockReturnValue("/mocked/path/to/template.html");

    // Mock fs.readFileSync to return a template with placeholders
    (fs.readFileSync as jest.Mock).mockReturnValue(
      "<!DOCTYPE html><html><body><h1>Hello {{name}}</h1><p>Click <a href='{{url}}'>here</a></p></body></html>"
    );
  });

  it("should load a template and replace placeholders", () => {
    const result = loadTemplate("test-template", {
      data: {
        name: "John",
        url: "https://example.com",
      },
    });

    // Verify the template was loaded
    expect(fs.readFileSync).toHaveBeenCalledWith("/mocked/path/to/template.html", "utf-8");

    // Verify placeholders were replaced
    expect(result).toContain("<h1>Hello John</h1>");
    expect(result).toContain("<a href='https://example.com'>");
  });

  it("should throw an error when template loading fails", () => {
    // Mock fs.readFileSync to throw an error
    (fs.readFileSync as jest.Mock).mockImplementation(() => {
      throw new Error("File not found");
    });

    // Verify that the function throws an error
    expect(() => {
      loadTemplate("non-existent-template", { data: { name: "John" } });
    }).toThrow("Failed to load email template: non-existent-template");
  });
});
