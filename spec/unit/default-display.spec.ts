describe("with default display", () => {
    beforeEach(() => {
        this.reporter = new global.HtmlSpecReporter({
          testLog: true
        });
    });

    describe("when jasmine started", () => {
        it("should report start", () => {
            expect(new Test(this.reporter, function() {
                this.it("successful spec", () => {
                    this.passed();
                });
            }).outputs).contains([/successful spec/]);
        });
    });

    describe("when spec", () => {
        it("should report success", () => {
            expect(new Test(this.reporter, function() {
                this.describe("suite", () => {
                    this.it("successful spec", () => {
                        this.passed();
                    });
                });
            }).outputs).contains(/successful spec/);
        });

        it("should report failure", () => {
            expect(new Test(this.reporter, function() {
                this.describe("suite", () => {
                    this.it("failed spec", () => {
                        this.failed();
                    });
                });
            }).outputs).contains(/failed spec/);
        });

        it("should not report pending", () => {
            expect(new Test(this.reporter, function() {
                this.describe("suite", () => {
                    this.xit("pending spec", () => {
                        this.passed();
                    });
                });
            }).outputs).not.contains(/pending spec/);
        });
    });

    describe("when failed spec", () => {
        it("should display with error messages", () => {
            const outputs = new Test(this.reporter, function() {
                this.describe("suite", () => {
                    this.it("failed spec", () => {
                        this.expect(true).toBe(false);
                        this.passed();
                        this.expect(2).toBe(1);
                    });
                });
            }).outputs;
            expect(outputs).not.contains(/passed assertion/);
            expect(outputs).contains([/failed spec/]);
            expect(outputs).contains([/Expected true to be false\./]);
            expect(outputs).contains([/Expected 2 to be 1\./]);
        });
    });

    describe("when suite", () => {
        it("should display top level suite", () => {
            const outputs = new Test(this.reporter, function() {
                this.it("spec 1", () => {
                    this.passed();
                });
                this.it("spec 2", () => {
                    this.passed();
                });
            }).outputs;
            expect(outputs).contains([/Top level suite/]);
            expect(outputs).contains([/spec 1/]);
            expect(outputs).contains([/spec 2/]);
        });

        it("should display multiple specs", () => {
            const outputs = new Test(this.reporter, function() {
                this.describe("suite", () => {
                    this.it("spec 1", () => {
                        this.passed();
                    });
                    this.it("spec 2", () => {
                        this.passed();
                    });
                });
            }).outputs;
            expect(outputs).contains([/suite/]);
            expect(outputs).contains([/spec 1/]);
            expect(outputs).contains([/spec 2/]);
        });

        it("should display multiple suites", () => {
            const outputs = new Test(this.reporter, function() {
                this.describe("suite 1", () => {
                    this.it("spec 1", () => {
                        this.passed();
                    });
                });
                this.describe("suite 2", () => {
                    this.it("spec 2", () => {
                        this.passed();
                    });
                });
            }).outputs;
            expect(outputs).contains([/suite 1/]);
            expect(outputs).contains([/spec 1/]);
            expect(outputs).contains([/suite 2/]);
            expect(outputs).contains([/spec 2/]);
        });

        it("should display nested suite at first position", () => {
            const outputs = new Test(this.reporter, function() {
                this.describe("suite 1", () => {
                    this.describe("suite 2", () => {
                        this.it("spec 1", () => {
                            this.passed();
                        });
                    });
                    this.it("spec 2", () => {
                        this.passed();
                    });
                });
            }).outputs;
            expect(outputs).contains([/suite 1/]);
            expect(outputs).contains([/suite 2/]);
            expect(outputs).contains([/spec 1/]);
            expect(outputs).contains([/spec 2/]);
        });

        it("should display nested suite at last position", () => {
            const outputs = new Test(this.reporter, function() {
                this.describe("suite 1", () => {
                    this.it("spec 1", () => {
                        this.passed();
                    });
                    this.describe("suite 2", () => {
                        this.it("spec 2", () => {
                            this.passed();
                        });
                    });
                });
            }).outputs;
            expect(outputs).contains([/suite 1/]);
            expect(outputs).contains([/spec 1/]);
            expect(outputs).contains([/suite 2/]);
            expect(outputs).contains([/spec 2/]);
        });

        it("should display multiple nested suites", () => {
            const outputs = new Test(this.reporter, function() {
                this.describe("suite 1", () => {
                    this.describe("suite 2", () => {
                        this.it("spec 2", () => {
                            this.passed();
                        });
                    });
                    this.describe("suite 3", () => {
                        this.it("spec 3", () => {
                            this.passed();
                        });
                    });
                });
            }).outputs;
            expect(outputs).contains([/suite 1/]);
            expect(outputs).contains([/suite 2/]);
            expect(outputs).contains([/spec 2/]);
            expect(outputs).contains([/suite 3/]);
            expect(outputs).contains([/spec 3/]);
        });

        it("should not display empty suite", () => {
            const outputs = new Test(this.reporter, function() {
                this.describe("suite 1", () => {
                    this.it("spec 1", () => {
                        this.passed();
                    });
                });
                // tslint:disable-next-line:no-empty
                this.describe("empty suite", () => {
                });
            }).outputs;
            expect(outputs).contains([/suite 1/]);
            expect(outputs).contains([/spec 1/]);
            expect(outputs).not.contains(/empty suite/);
        });
    });

});
