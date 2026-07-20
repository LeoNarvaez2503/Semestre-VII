import { defineConfig } from 'cypress';
import createBundler from '@bahmutov/cypress-esbuild-preprocessor';
import { addCucumberPreprocessorPlugin } from '@badeball/cypress-cucumber-preprocessor';
import { createEsbuildPlugin } from '@badeball/cypress-cucumber-preprocessor/esbuild';

export default defineConfig({
  allowCypressEnv: false,

  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: [
      'cypress/e2e/**/*.feature',
      'cypress/e2e/**/*.cy.{js,ts}'
    ],
    supportFile: 'cypress/support/e2e.js',
    env: {
      cucumber: {
        stepDefinitions: 'cypress/e2e/step_definitions/**/*.js'
      }
    },
    async setupNodeEvents(on, config) {
      // Only load cucumber preprocessor if feature files are being run
      if (config.specPattern.some(pattern => pattern.includes('feature'))) {
        await addCucumberPreprocessorPlugin(on, config);
        on(
          'file:preprocessor',
          createBundler({
            plugins: [createEsbuildPlugin(config)]
          })
        );
      }
      return config;
    }
  }
});
