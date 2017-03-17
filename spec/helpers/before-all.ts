declare namespace NodeJS {
    export interface Global {
        HtmlSpecReporter;
        DisplayProcessor;
        TestProcessor;
    }
}

global.HtmlSpecReporter = require("../../built/main").HtmlSpecReporter;
global.DisplayProcessor = require("../../built/main").DisplayProcessor;
global.TestProcessor = require("./test-processor").TestProcessor;

beforeAll(() => {
    const addMatchers = require("./test-helper").addMatchers;
    addMatchers();
});
