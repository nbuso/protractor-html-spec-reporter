import { Configuration } from "./configuration";
import { CustomReporterResult } from "./custom-reporter-result";
import { DisplayProcessor } from "./display/display-processor";
import { DefaultProcessor } from "./display/processors/default-processor";
import { HtmlProcessor } from "./display/processors/html-processor";
// import { SpecColorsProcessor } from "./display/processors/spec-colors-processor";
import { SpecDurationsProcessor } from "./display/processors/spec-durations-processor";
import { SpecStatusProcessor } from "./display/processors/spec-status-processor";
// import { SpecPrefixesProcessor } from "./display/processors/spec-prefixes-processor";
import { SuiteNumberingProcessor } from "./display/processors/suite-numbering-processor";
import { SummaryProcessor } from "./display/processors/summary-processor";
import { ExecutionMetrics } from "./execution-metrics";
import SuiteInfo = jasmine.SuiteInfo;
import RunDetails = jasmine.RunDetails;
import fs = require("fs");
import path = require("path");

type ProcessFunction = (displayProcessor: DisplayProcessor, object: ProcessObject,
    log: String, metrics: ExecutionMetrics) => String;
type ProcessObject = SuiteInfo | CustomReporterResult | RunDetails;

export class ExecutionDisplay {
    private static initProcessors(configuration: Configuration): DisplayProcessor[] {
        const displayProcessors: DisplayProcessor[] = [
            new DefaultProcessor(configuration),
            // new SpecPrefixesProcessor(configuration),
            // new SpecColorsProcessor(configuration),

        ];

        if (configuration.spec.displayDuration) {
            displayProcessors.push(new SpecDurationsProcessor(configuration));
        }
        displayProcessors.push(new SpecStatusProcessor(configuration));

        if (configuration.suite.displayNumber) {
            displayProcessors.push(new SuiteNumberingProcessor(configuration));
        }

        if (configuration.customProcessors) {
            configuration.customProcessors.forEach((Processor: typeof DisplayProcessor) => {
                displayProcessors.push(new Processor(configuration));
            });
        }
        displayProcessors.push(new SummaryProcessor(configuration));

        // the HtmlProcessor needs to be last because it decorate the all message with html
        displayProcessors.push(new HtmlProcessor(configuration));

        return displayProcessors;
    }

    private static hasCustomDisplaySpecStarted(processors: DisplayProcessor[]): boolean {
        let isDisplayed: boolean = false;
        processors.forEach((processor: DisplayProcessor) => {
            const log: string = "foo";
            const result = processor.displaySpecStarted({ id: "bar", description: "bar", fullName: "bar" }, log);
            isDisplayed = isDisplayed || result !== log;
        });
        return isDisplayed;
    }

    private indent: string = "  ";
    private currentIndent: string = "";
    private suiteHierarchy: CustomReporterResult[] = [];
    private suiteHierarchyDisplayed: CustomReporterResult[] = [];
    private successfulSpecs: CustomReporterResult[] = [];
    private failedSpecs: CustomReporterResult[] = [];
    private pendingSpecs: CustomReporterResult[] = [];
    private lastWasNewLine: boolean = false;

    private hasCustomDisplaySpecStarted: boolean;

    private displayProcessors: DisplayProcessor[];

    constructor(private configuration: Configuration) {
        this.displayProcessors = ExecutionDisplay.initProcessors(this.configuration);
        this.hasCustomDisplaySpecStarted = ExecutionDisplay.hasCustomDisplaySpecStarted(this.displayProcessors);
        this.prepareDestination();
    }

    public jasmineStarted(suiteInfo: SuiteInfo): void {
      console.log(`jasmineStarted(): suiteInfo => ${JSON.stringify(suiteInfo)}`);
        this.process(suiteInfo, (displayProcessor: DisplayProcessor, object: SuiteInfo, log: String): String => {
            return displayProcessor.displayJasmineStarted(object, log);
        });
    }

    public summary(runDetails: RunDetails, metrics: ExecutionMetrics): void {

        this.process(
            runDetails,
            (displayProcessor: DisplayProcessor, object: CustomReporterResult, log: String,
              metricsObject: ExecutionMetrics): String => {

                return displayProcessor.displaySummary(object, log, metricsObject);
            },
            metrics
        );

        this.process(
          runDetails,
          (displayProcessor: DisplayProcessor, object: CustomReporterResult, log: String): String => {
            return displayProcessor.displayJasmineDone(object, log);
          }
        );

        if (metrics.random) {
            this.log(`Randomized with seed ${metrics.seed}.`);
        }
    }

    public specStarted(result: CustomReporterResult): void {
        if (this.hasCustomDisplaySpecStarted) {
            this.ensureSuiteDisplayed();
            this.process(
                result,
                (displayProcessor: DisplayProcessor, object: CustomReporterResult, log: String): String => {
                    return displayProcessor.displaySpecStarted(object, log);
                }
            );
        }
    }

    public specDone(result: CustomReporterResult): void {
      this.process(
          result,
          (displayProcessor: DisplayProcessor, object: CustomReporterResult, log: String): String => {
              return displayProcessor.displaySpecDone(object, log);
          }
      );
    }

    public successful(result: CustomReporterResult): void {
        this.successfulSpecs.push(result);
        if (this.configuration.spec.displaySuccessful) {
            this.ensureSuiteDisplayed();
            this.process(
                result,
                (displayProcessor: DisplayProcessor, object: CustomReporterResult, log: String): String => {
                    return displayProcessor.displaySuccessfulSpec(object, log);
                }
            );
        }
    }

    public failed(result: CustomReporterResult): void {
        this.failedSpecs.push(result);
        if (this.configuration.spec.displayFailed) {
            this.ensureSuiteDisplayed();
            this.process(
                result,
                (displayProcessor: DisplayProcessor, object: CustomReporterResult, log: String): String => {
                    return displayProcessor.displayFailedSpec(object, log);
                }
            );
            if (this.configuration.spec.displayErrorMessages) {
                this.increaseIndent();
                this.process(
                    result,
                    (displayProcessor: DisplayProcessor, object: CustomReporterResult, log: String): String => {
                        return displayProcessor.displaySpecErrorMessages(object, log);
                    }
                );
                this.decreaseIndent();
            }
        }
    }

    public pending(result: CustomReporterResult): void {
        this.pendingSpecs.push(result);
        if (this.configuration.spec.displayPending) {
            this.ensureSuiteDisplayed();
            this.process(
                result,
                (displayProcessor: DisplayProcessor, object: CustomReporterResult, log: String): String => {
                    return displayProcessor.displayPendingSpec(object, log);
                }
            );
        }
    }

    public suiteStarted(result: CustomReporterResult): void {
        this.suiteHierarchy.push(result);
    }

    public suiteDone(): void {
        const suite: CustomReporterResult = this.suiteHierarchy.pop();
        if (this.suiteHierarchyDisplayed[this.suiteHierarchyDisplayed.length - 1] === suite) {
            this.suiteHierarchyDisplayed.pop();
        }
        this.newLine();
        this.decreaseIndent();
    }

    private ensureSuiteDisplayed(): void {
        if (this.suiteHierarchy.length !== 0) {
            for (let i: number = this.suiteHierarchyDisplayed.length; i < this.suiteHierarchy.length; i++) {
                this.suiteHierarchyDisplayed.push(this.suiteHierarchy[i]);
                this.displaySuite(this.suiteHierarchy[i]);
            }
        } else {
            const name: string = "Top level suite";
            const topLevelSuite: CustomReporterResult = {
                description: name,
                fullName: name,
                id: name,
            };
            this.suiteHierarchy.push(topLevelSuite);
            this.suiteHierarchyDisplayed.push(topLevelSuite);
            this.displaySuite(topLevelSuite);
        }
    }

    private displaySuite(suite: CustomReporterResult): void {
        this.newLine();
        this.computeSuiteIndent();
        this.process(suite, (displayProcessor: DisplayProcessor, object: CustomReporterResult, log: String): String => {
            return displayProcessor.displaySuite(object, log);
        });
        this.increaseIndent();
    }

    private process(object: ProcessObject, processFunction: ProcessFunction, metrics?: ExecutionMetrics): void {
        let log: String = "";
        this.displayProcessors.forEach((displayProcessor: DisplayProcessor) => {
            log = processFunction(displayProcessor, object, log, metrics);
        });
        this.log(log);
    }

    private computeSuiteIndent(): void {
        this.resetIndent();
        for (let i: number = 0; i < this.suiteHierarchyDisplayed.length; i++) {
            this.increaseIndent();
        }
    }

    private log(stuff: String): void {
        fs.appendFileSync(
          this.configuration.destination.folder + this.configuration.destination.fileName,
          stuff
        );
        this.lastWasNewLine = false;
    }

    private newLine(): void {
        if (!this.lastWasNewLine) {
            console.log("");
            this.lastWasNewLine = true;
        }
    }

    private resetIndent(): void {
        this.currentIndent = "";
    }

    private increaseIndent(): void {
        this.currentIndent += this.indent;
    }

    private decreaseIndent(): void {
        this.currentIndent = this.currentIndent.substr(0, this.currentIndent.length - this.indent.length);
    }

    private prepareDestination() {
      const destFolder = this.configuration.destination.folder;
      fs.mkdir(destFolder, function(err) {
        if (err) {
          console.log(`Destination folder: ${destFolder} already exists`);
        }
      });
      const files = fs.readdirSync(destFolder);
      files.forEach(file => {
          fs.unlink(destFolder + file);
      });
      fs.createReadStream(`${__dirname}/assets/reports.css`)
        .pipe(fs.createWriteStream(`${destFolder}${path.sep}reports.css`));
      fs.createReadStream(`${__dirname}/assets/scripts.js`)
        .pipe(fs.createWriteStream(`${destFolder}${path.sep}scripts.js`));

      // import css from configuration.importStylesheets
      this.configuration.importStylesheets.forEach(function(sPath) {
        const fileName = sPath.substr(sPath.lastIndexOf(path.sep) + 1);
        if (fileName) {
          fs.createReadStream(sPath).pipe(fs.createWriteStream(`${destFolder}${path.sep}${fileName}`));
        }
      });
    }

}
