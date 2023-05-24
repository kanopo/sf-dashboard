module.exports = {
  extends: [
    "next/core-web-vitals",
    "@soluzioni-futura/eslint-config-soluzioni-futura"
  ],
  globals: {
    JSX: true
  },
  rules: {
    "@next/next/no-img-element": "off",
    "react-hooks/exhaustive-deps": "off"
  },
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      parser: "@typescript-eslint/parser",
      plugins: [
        "@typescript-eslint"
      ],
      parserOptions: {
        sourceType: "module",
        project: "./tsconfig.json"
      }
    }
  ],
  parser: "@babel/eslint-parser",
  parserOptions: {
    tsconfigRootDir: __dirname,
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 11,
    sourceType: "module",
    project: "tsconfig.json"
  },
  ignorePatterns: [
    ".eslintrc.js",
    "next-i18next.config.js",
    "next-config.js"
  ]
}