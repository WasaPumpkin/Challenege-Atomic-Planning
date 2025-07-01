// jest.config.js
// jest.config.js
// jest.config.js
export default {
  testEnvironment: "jsdom",
  

  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
  },

 
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js',    
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },

  setupFilesAfterEnv: ['<rootDir>/setupTest.js'],

  // This is still needed for ESM packages in node_modules
  transformIgnorePatterns: ['node_modules/(?!(.*\\.mjs$))'],
};