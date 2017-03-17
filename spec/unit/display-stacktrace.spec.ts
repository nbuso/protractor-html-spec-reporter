describe("With spec display stacktrace enabled", () => {
    beforeEach(() => {
        this.reporter = new global.HtmlSpecReporter({
            spec: {
                displayStacktrace: true
            },
            testLog: true
        });
    });

    describe("when failed spec", () => {
        it("should display with error messages with stacktraces", () => {
            const outputs = new Test(this.reporter, function() {
                this.describe("suite", () => {
                    this.it("failed spec", () => {
                        this.failed();
                    });
                });
            }).outputs;
            expect(outputs).not.contains(/passed assertion/);
            expect(outputs).contains([/failed spec/]);
            expect(outputs).contains([/Expected true to be false./]);
            expect(outputs).contains([/at Env\.env\.failed/, /at Object\.<anonymous>/]);
        });
    });

});
