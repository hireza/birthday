module.exports = {
  moduleFileExtensions: ["ts", "js"],
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.json",
      },
    ],
  },
  testMatch: ["**/tests/**/*.test.ts"],
  testEnvironment: "node",
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "<rootDir>/src/index.ts", // Exclude index.ts from coverage
  ],
};
