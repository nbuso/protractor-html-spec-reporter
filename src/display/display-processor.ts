import { Configuration } from "../configuration";
import { CustomReporterResult } from "../custom-reporter-result";
import { ExecutionMetrics } from "../execution-metrics";
import SuiteInfo = jasmine.SuiteInfo;

export class DisplayProcessor {
    protected configuration: Configuration;

    constructor(configuration: Configuration) {
        this.configuration = configuration;
    }

    public displayJasmineStarted(info?: SuiteInfo, log?: string): string {
        return log;
    }

    public displaySuite(suite: CustomReporterResult, log: string): string {
        return log;
    }

    public displaySuiteDone(suite: CustomReporterResult, log: string): string {
      return log;
    }

    public displaySpecStarted(spec: CustomReporterResult, log: string): string {
        return log;
    }

    public displaySpecDone(spec: CustomReporterResult, log: string): string {
      return log;
    }

    public displaySuccessfulSpec(spec: CustomReporterResult, log: string): string {
        return log;
    }

    public displayFailedSpec(spec: CustomReporterResult, log: string): string {
        return log;
    }

    public displaySpecErrorMessages(spec: CustomReporterResult, log: string): string {
        return log;
    }

    public displaySummaryErrorMessages(spec: CustomReporterResult, log: string): string {
        return log;
    }

    public displayPendingSpec(spec: CustomReporterResult, log: string): string {
        return log;
    }

    public displaySummary(spec: CustomReporterResult, log: string, metrics: ExecutionMetrics): string {
      return log;
    }

    public displayJasmineDone(spec: CustomReporterResult, log: string): string {
      return log;
    }
}
