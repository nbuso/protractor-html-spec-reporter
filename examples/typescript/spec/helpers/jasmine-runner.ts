import { SpecReporter } from "protractor-html-spec-reporter";
import { DisplayProcessor } from "protractor-html-spec-reporter";
const Jasmine = require("jasmine");
import SuiteInfo = jasmine.SuiteInfo;

class CustomProcessor extends DisplayProcessor {
    public displayJasmineStarted(info: SuiteInfo, log: string): string {
        return `TypeScript ${log}`;
    }
}

const jrunner = new Jasmine();
jrunner.env.clearReporters();
console.log(">>> Creating typescript example SpecReporter");
jrunner.addReporter(new SpecReporter({
    customProcessors: [CustomProcessor],
    testLog: true
}));
jrunner.loadConfigFile();
jrunner.execute();
