import { CustomReporterResult } from "../../custom-reporter-result";
import { DisplayProcessor } from "../display-processor";

export class SpecStatusProcessor extends DisplayProcessor {
    private displayStatus(
      spec: CustomReporterResult, log: String, status: String, withErrorMessages: boolean): String {

        let toReturn = `${log} <td class="status-${status.toLowerCase()}">`;

        if (withErrorMessages) {
          const errorId = `error-${spec.id}`;
          console.log("Concatenating html error message");
          toReturn += `<a class="error-link" onclick="showHide('${errorId}')">${status.toUpperCase()}</a>
            <div id="${errorId}" class="hide">
            <code>${this.getErrorMessages(spec)}<code>
            </div>
          `;
        } else {
          toReturn += `${status.toUpperCase()}`;
        }

        toReturn += "</td>";
        return toReturn;
    }

    public displaySuccessfulSpec(spec: CustomReporterResult, log: String): String {
        return this.displayStatus(spec, log, "success", false);
    }

    public displayFailedSpec(spec: CustomReporterResult, log: String): String {
        return this.displayStatus(spec, log, "failed", true);
    }

    private getErrorMessages(spec: CustomReporterResult): String {
      const logs: String[] = [];
      console.log("Genereting error message");
      for (let i: number = 0; i < spec.failedExpectations.length; i++) {
        logs.push("- ".failed + spec.failedExpectations[i].message.failed);
        if (spec.failedExpectations[i].stack) {
          logs.push(this.configuration.stacktrace.filter(spec.failedExpectations[i].stack));
        }
      }
      return logs.join("\n");
    }
}
