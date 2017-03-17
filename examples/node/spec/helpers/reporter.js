const HtmlSpecReporter = require('protractor-html-spec-reporter').HtmlSpecReporter;

jasmine.getEnv().clearReporters();               // remove default reporter logs
jasmine.getEnv().addReporter(new HtmlSpecReporter({  // add jasmine-spec-reporter
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
