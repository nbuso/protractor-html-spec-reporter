import { CustomReporterResult } from "../../custom-reporter-result";
import { DisplayProcessor } from "../display-processor";

export class DefaultProcessor extends DisplayProcessor {
    private static displaySpecDescription(spec: CustomReporterResult): string {
        return `${spec.description}`;
    }

    public displaySuite(suite: CustomReporterResult): string {
        return `${suite.description}`;
    }

    public displaySuccessfulSpec(spec: CustomReporterResult): string {
        return DefaultProcessor.displaySpecDescription(spec);
    }

    public displayFailedSpec(spec: CustomReporterResult): string {
        return DefaultProcessor.displaySpecDescription(spec);
    }

    public displayPendingSpec(spec: CustomReporterResult): string {
        return DefaultProcessor.displaySpecDescription(spec);
    }
}
