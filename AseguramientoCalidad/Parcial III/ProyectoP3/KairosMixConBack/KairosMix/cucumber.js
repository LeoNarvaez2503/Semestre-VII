export default {
  default: {
    import: [
      'features/step_definitions/00_env.cjs',
      'features/step_definitions/**/!(00_env).cjs'
    ],
    format: [
      'progress-bar',
      'html:test-results/cucumber-report.html',
    ],
    formatOptions: { snippetInterface: 'async-await' },
  },
};
