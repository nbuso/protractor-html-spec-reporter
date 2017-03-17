let HtmlSpecReporter = require('protractor-html-spec-reporter').HtmlSpecReporter;
// https://github.com/angular/protractor/issues/1451
require('protractor/built/logger').Logger.logLevel = 1;

exports.config = {
  framework: 'jasmine2',
  jasmineNodeOpts: {
    showColors: true,
    silent: true,
    defaultTimeoutInterval: 360000,
    print: function () {
    }
  },
  specs: [
    './spec/protractor-spec.js'
  ],
  capabilities: {
    browserName: 'chrome',
    'chromeOptions': {
      args: ['--test-type']
    }
  },
  onPrepare: function () {
    jasmine.getEnv().addReporter(new HtmlSpecReporter({
      spec: {
        displayStacktrace: true
      },
      summary: {
        displayDuration: false
      },
      testLog: true
    }));
  }
};
