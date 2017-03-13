import { exec } from "child_process";
const htmlParser = require("fast-html-parser");

// https://github.com/jasmine/jasmine-npm/issues/85
process.env.JASMINE_CONFIG_PATH = "spec/support/jasmine.json";
const TIMEOUT_INCREASED = 120000;

const filter = diff => {
    const value = element => {
        return element.value;
    };
    const added = diff.filter(element => {
        // return element.value !== "\n" && element.added === true;
        return element.added === true;
    }).map(value);
    const removed = diff.filter(element => {
        // return element.value !== "\n" && element.removed === true;
        return element.removed === true;
    }).map(value);
    return { added, removed };
};

fdescribe("Integration", () => {
    it("with jasmine-npm should be ok", done => {
        exec("cd examples/node && npm test -s", (error, stdout) => {

            const doc = htmlParser.parse(stdout);
            let spec = doc.querySelector("#spec-spec0");
            expect(spec.querySelector("td.description").text).toContain("should be ok");
            expect(spec.querySelector("td.status").text).toContain("SUCCESS");

            spec = doc.querySelector("#spec-spec1");
            expect(spec.querySelector("td.description").text).toContain("should be pending");
            expect(spec.querySelector("td.status").text).toContain("PENDING");

            spec = doc.querySelector("#spec-spec2");
            expect(spec.querySelector("td.description").text).toContain("should failed");
            expect(spec.querySelector("td.status").text).toContain("FAILED");

            spec = doc.querySelector("#spec-spec3");
            expect(spec.querySelector("td.description").text).toContain("should be ok");
            expect(spec.querySelector("td.status").text).toContain("SUCCESS");

            spec = doc.querySelector("#spec-spec4");
            expect(spec.querySelector("td.description").text).toContain("should be pending");
            expect(spec.querySelector("td.status").text).toContain("PENDING");

            spec = doc.querySelector("#spec-spec5");
            expect(spec.querySelector("td.description").text).toContain("should be ok");
            expect(spec.querySelector("td.status").text).toContain("SUCCESS");

            spec = doc.querySelector("#spec-spec6");
            expect(spec.querySelector("td.description").text).toContain("should failed");
            expect(spec.querySelector("td.status").text).toContain("FAILED");

            spec = doc.querySelector("#spec-spec7");
            expect(spec.querySelector("td.description").text).toContain("should failed");
            expect(spec.querySelector("td.status").text).toContain("FAILED");

            spec = doc.querySelector("#spec-spec8");
            expect(spec.querySelector("td.description").text).toContain("should be ok");
            expect(spec.querySelector("td.status").text).toContain("SUCCESS");

            spec = doc.querySelector("#spec-spec9");
            expect(spec.querySelector("td.description").text).toContain("should failed");
            expect(spec.querySelector("td.status").text).toContain("FAILED");

            spec = doc.querySelector("#spec-spec10");
            expect(spec.querySelector("td.description").text).toContain("should be ok");
            expect(spec.querySelector("td.status").text).toContain("SUCCESS");

            // summary checks
            expect(doc.querySelector("#summary-success").text).toContain("5");
            expect(doc.querySelector("#summary-failed").text).toContain("4");
            expect(doc.querySelector("#summary-pending").text).toContain("2");
            expect(doc.querySelector("#summary-skipped").text).toContain("0");
            expect(doc.querySelector("#summary-total").text).toContain("11");

            done();
        });
    }, TIMEOUT_INCREASED);

    it("with protractor should be ok", done => {
        exec("cd examples/protractor && npm test -s", (error, stdout) => {
            const doc = htmlParser.parse(stdout);

            expect(doc.querySelector("#spec-spec0 td.description").text).toContain("should greet the named user");
            expect(doc.querySelector("#spec-spec0 td.status").text).toContain("SUCCESS");

            done();
        });
    }, TIMEOUT_INCREASED);
});
