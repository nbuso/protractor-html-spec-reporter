Use jasmine-spec-reporter with TypeScript
=========================================

## Configuration

```typescript
import { HtmlSpecReporter } from "protractor-html-spec-reporter";
import { DisplayProcessor } from "protractor-html-spec-reporter";
const Jasmine = require("jasmine");
import SuiteInfo = jasmine.SuiteInfo;

class CustomProcessor extends DisplayProcessor {
    public displayJasmineStarted(info: SuiteInfo, log: String): String {
        return `TypeScript ${log}`;
    }
}

const jrunner = new Jasmine();
jrunner.env.clearReporters();
jrunner.addReporter(new HtmlSpecReporter({
    customProcessors: [CustomProcessor],
}));
jrunner.loadConfigFile();
jrunner.execute();
```

## Example

You can find an example in this directory:

    npm install
    npm test
