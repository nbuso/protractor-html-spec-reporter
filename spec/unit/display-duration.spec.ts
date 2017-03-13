describe("with spec duration enabled", () => {
    beforeEach(() => {
        this.reporter = new global.SpecReporter({
            spec: {
                displayDuration: true
            },
            testLog: true
        });
    });

    describe("when spec", () => {
        it("should report success", () => {
            const outputs = new Test(this.reporter, function() {
                this.describe("suite", () => {
                    this.it("successful spec", () => {
                        this.passed();
                    });
                });
            }).outputs;
            expect(outputs).contains(/successful spec/);
            expect(outputs).contains(/class=\"duration\"/);
        });

        it("should report failure", () => {
            const outputs = new Test(this.reporter, function() {
                this.describe("suite", () => {
                    this.it("failed spec", () => {
                        this.failed();
                    });
                });
            }).outputs;
            expect(outputs).contains(/failed spec/);
            expect(outputs).contains(/class=\"duration\"/);
        });
    });
});

describe("with summary duration disabled", () => {
    beforeEach(() => {
        this.reporter = new global.SpecReporter({
            summary: {
                displayDuration: false
            },
            testLog: true
        });
    });

    describe("when summary", () => {
        it("should not display execution duration", () => {
            const summary = new Test(this.reporter, function() {
                this.describe("suite", () => {
                    this.it("successful spec", () => {
                        this.passed();
                    });
                });
            }).summary;
            expect(summary).contains(/Executed.*?1/);
            expect(summary).contains(/Success.*?1/);
        });
    });
});
