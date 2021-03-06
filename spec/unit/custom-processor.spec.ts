describe("spec reporter", () => {
    describe("with custom processor", () => {
        beforeEach(() => {
            this.reporter = new global.HtmlSpecReporter({
                customOptions: {
                    test: " TEST"
                },
                customProcessors: [global.TestProcessor],
                spec: {
                    displayPending: true
                },
                testLog: true
            });
        });

        describe("when jasmine started", () => {
            it("should report start with custom display", () => {
                expect(new Test(this.reporter, function() {
                    this.describe("suite", () => {
                        this.it("successful spec", () => {
                            this.passed();
                        });
                    });
                }).outputs).contains(/successful spec TEST/);
            });
        });

        describe("when suite", () => {
            it("should report suite with custom display", () => {
                expect(new Test(this.reporter, function()  {
                    this.describe("suite", () => {
                        this.it("successful spec", () => {
                            this.passed();
                        });
                    });
                }).outputs).contains(/suite TEST/);
            });
        });

        describe("when spec started", () => {
            it("should report start", () => {
                const outputs = new Test(this.reporter, function()  {
                    this.describe("suite", () => {
                        this.it("spec to be started", () => {
                            this.passed();
                        });
                    });
                }).outputs;
                expect(outputs).contains(/spec to be started TEST/);
                expect(outputs).contains(/suite TEST/);
            });
        });

        describe("when spec done", () => {
            it("should report success with custom display", () => {
                expect(new Test(this.reporter, function()  {
                    this.describe("suite", () => {
                        this.it("successful spec", () => {
                            this.passed();
                        });
                    });
                }).outputs).contains(/successful spec TEST/);
            });

            it("should report failure with custom display", () => {
                expect(new Test(this.reporter, function()  {
                    this.describe("suite", () => {
                        this.it("failed spec", () => {
                            this.failed();
                        });
                    });
                }).outputs).contains([/failed spec TEST/]);
            });

            it("should display spec error messages with custom display", () => {
                const outputs = new Test(this.reporter, function()  {
                    this.describe("suite", () => {
                        this.it("failed spec", () => {
                            this.failed();
                        });
                    });
                }).outputs;
                expect(outputs).contains([/Expected true to be false\./]);
                expect(outputs).contains([/TEST/]);
            });

            it("should report pending with custom display", () => {
                expect(new Test(this.reporter, function()  {
                    this.describe("suite", () => {
                        this.xit("pending spec", () => {
                            this.passed();
                        });
                    });
                }).outputs).contains(/pending spec TEST/);
            });
        });
    });
});
