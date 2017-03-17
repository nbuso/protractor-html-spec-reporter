Use jasmine-spec-reporter with Protractor
=========================================
The `protractor-html-spec-reporter` can be used to enhance your [Protractor](https://github.com/angular/protractor) tests execution report.

## Protractor configuration
In your Protractor configuration file:

```javascript
let HtmlSpecReporter = require('protractor-html-spec-reporter').HtmlSpecReporter;

exports.config = {
   // your config here ...

  onPrepare: function () {
    jasmine.getEnv().addReporter(new HtmlSpecReporter({
      spec: {
        displayStacktrace: true
      }
    }));
  }
}
```

## Remove protractor dot reporter
In your protractor configuration file, add the print function in the `jasmineNodeOpts` section:

```javascript
jasmineNodeOpts: {
   ...
   print: function() {}
}
```

## Example

You can find an example in this directory:

```bash
npm install
npm test
```
