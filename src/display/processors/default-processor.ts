import { CustomReporterResult } from "../../custom-reporter-result";
import { DisplayProcessor } from "../display-processor";

export class DefaultProcessor extends DisplayProcessor {
    private static displaySpecDescription(spec: CustomReporterResult): String {
        return `${spec.description}`;
    }

    public displayJasmineStarted(): String {
        return "";
    }

    public displaySuite(suite: CustomReporterResult): String {
        return `${suite.description}`;
    }

    public displaySuccessfulSpec(spec: CustomReporterResult): String {
        return DefaultProcessor.displaySpecDescription(spec);
    }

    public displayFailedSpec(spec: CustomReporterResult): String {
        return DefaultProcessor.displaySpecDescription(spec);
    }

    public displayPendingSpec(spec: CustomReporterResult): String {
        return DefaultProcessor.displaySpecDescription(spec);
    }
}
