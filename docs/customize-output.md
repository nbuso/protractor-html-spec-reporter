Output customization
====================

The reporter output is based on html tables:
* Main table with suites/specs execution status
* Summary table providing of counting of executed specs

You can customize the output importing or referencing your own css files.


## Import css files
Configure css files with a relative path in your project that will be imported in the report destination folder;

```javascript
    onPrepare: function() {
      jasmine.getEnv().addReporter(new HtmlSpecReporter.SpecReporter({
        importStylesheets: [
          "e2e/report/my-report-styles.css"
        ]
      }));
```

## Reference css files
Configure css urls that will be linked in the resulting html reporter:

```javascript
    onPrepare: function() {
      jasmine.getEnv().addReporter(new HtmlSpecReporter.SpecReporter({
        customStylesheets: [
          "http://my-website/somepath/my-report-styles.css",
        ],
      }));
```


## Build your display processor (no supported)

__
NOTE: This project derive from "jasmine-spec-reporter" as such it's inheriting the concept
of CustomDisplayProcessor, but it's not supported because has the possibility to invalidate
the html report generated.
__


You need to require the display processor:

```node
var DisplayProcessor = require('jasmine-spec-reporter').DisplayProcessor;
```

You can then customize the following methods:
* displayJasmineStarted(runner, log)
* displaySuite(suite, log)
* displaySpecStarted(spec, log)
* displaySuccessfulSpec(spec, log)
* displayFailedSpec(spec, log)
* displaySpecErrorMessages(spec, log)
* displaySummaryErrorMessages(spec, log)
* displayPendingSpec(spec, log)

The first argument is the jasmine object corresponding to the suite or the spec. The second argument is the log to be displayed. Those methods should return the modified log.

For our example:

```node
var DisplayProcessor = require('jasmine-spec-reporter').DisplayProcessor;

function TimeProcessor(configuration) {
}

function getTime() {
    var now = new Date();
    return now.getHours() + ':' +
           now.getMinutes() + ':' +
           now.getSeconds()
}

TimeProcessor.prototype = new DisplayProcessor();

TimeProcessor.prototype.displaySuite = function (suite, log) {
  return getTime() + ' - ' + log;
};

TimeProcessor.prototype.displaySuccessfulSpec = function (spec, log) {
  return getTime() + ' - ' + log;
};

TimeProcessor.prototype.displayFailedSpec = function (spec, log) {
  return getTime() + ' - ' + log;
};

TimeProcessor.prototype.displayPendingSpec = function (spec, log) {
  return getTime() + ' - ' + log;
};
```

## Add it to the configuration

Then you need to configure jasmine spec reporter to use your processor:

```node
var SpecReporter = require('jasmine-spec-reporter').SpecReporter;

var reporter = new SpecReporter({
    customProcessors: [TimeProcessor]
});

jasmine.getEnv().addReporter(reporter);
```

You must pass the processor constructor in the customProcessors array. Jasmine spec reporter will instantiate it with the options if you need them. You can add as many processors as you want, they will be applied in the order which they are in the customProcessors array.
