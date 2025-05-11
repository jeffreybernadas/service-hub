import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import jest from "eslint-plugin-jest";
import eslintConfigPrettier from "eslint-config-prettier";

export default [
  { ignores: ["node_modules/", "dist/", "coverage/"] },
  {
    files: [
      "src/**/*.{js,mjs,cjs,ts}",
      "src/*.{js,mjs,cjs,ts}",
      "src/__tests__/**/*.{js,mjs,cjs,ts}",
    ],
  },
  { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/__tests__/**/*.{js,mjs,cjs,ts}"],
    ...jest.configs["flat/recommended"],
    // Jest Rules
    rules: {
      ...jest.configs["flat/recommended"].rules,
      "jest/prefer-expect-assertions": "off",
    },
  },
  // Eslint Rules
  {
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "no-multiple-empty-lines": [2, { max: 2 }],
      semi: [2, "always"],
      curly: ["warn"],
      "prefer-template": ["warn"],
      "space-before-function-paren": [
        0,
        { anonymous: "always", named: "always" },
      ],
      camelcase: 0,
      "no-return-assign": 0,
      quotes: ["error", "double"],
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/no-namespace": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "import/no-unresolved": 0,
    },
  },
  // Prettier
  eslintConfigPrettier,
];
