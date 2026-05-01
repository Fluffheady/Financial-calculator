const { createDefaultPreset } = require("ts-jest");

/** @type {import("ts-jest").JestConfigWithTsJest} */
module.exports = {
  testEnvironment: "node",
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      useESM: true,
    }],
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
};
