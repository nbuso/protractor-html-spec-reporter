const SpecReporter = require('protractor-html-spec-reporter').SpecReporter;

jasmine.getEnv().clearReporters();               // remove default reporter logs
jasmine.getEnv().addReporter(new SpecReporter({  // add jasmine-spec-reporter
  spec: {
    displayPending: true,
    displayDuration: false,
    takeScreenshot: false
  },
  summary: {
    displayDuration: false,
  },
  testLog: true
}));
