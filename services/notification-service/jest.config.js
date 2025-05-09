module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  verbose: true,
  coverageDirectory: "<rootDir>/coverage",
  collectCoverage: true,
  testPathIgnorePatterns: ["/node_modules"],
  roots: ["<rootDir>/src/__tests__"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  modulePathIgnorePatterns: ["<rootDir>/src/__tests__/helpers/*"],
  collectCoverageFrom: ["src/**/*.ts"],
  testRegex: "(/__tests__/(?!setup).*(\\.|/)(unit|integration|acceptance|test))\\.ts?$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/src/__tests__/",
    "/src/__mocks__/"
  ],
  moduleNameMapper: {
    "@notifications/(.*)": ["<rootDir>/src/$1"],
  },
  coverageThreshold: {
    global: {
      branches: 1,
      functions: 1,
      lines: 1,
      statements: 1,
    },
  },
  setupFilesAfterEnv: ["<rootDir>/src/__tests__/setup.ts"],
};
