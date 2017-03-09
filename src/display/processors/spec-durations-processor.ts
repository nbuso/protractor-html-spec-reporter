import { CustomReporterResult } from "../../custom-reporter-result";
import { DisplayProcessor } from "../display-processor";

export class SpecDurationsProcessor extends DisplayProcessor {
    private static displayDuration(spec: CustomReporterResult, log: String): String {
        return `${log} <td class="duration">${spec.duration}</td>`;
    }

    public displaySuccessfulSpec(spec: CustomReporterResult, log: String): String {
        return SpecDurationsProcessor.displayDuration(spec, log);
    }

    public displayFailedSpec(spec: CustomReporterResult, log: String): String {
        return SpecDurationsProcessor.displayDuration(spec, log);
    }
}
