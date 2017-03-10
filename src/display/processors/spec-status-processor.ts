import { CustomReporterResult } from "../../custom-reporter-result";
import { DisplayProcessor } from "../display-processor";

export class SpecStatusProcessor extends DisplayProcessor {
    private displayStatus(
      spec: CustomReporterResult, log: String, status: String, withErrorMessages: boolean): String {

        let toReturn = `${log} <td class="status-${status.toLowerCase()}">`;

        if (withErrorMessages) {
          const errorId = `error-${spec.id}`;
          toReturn += `<a class="error-link" onclick="showHide('${errorId}')">${status.toUpperCase()}</a>
            <div id="${errorId}" class="hide">
            ${this.getErrorMessages(spec)}
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
      for (let i: number = 0; i < spec.failedExpectations.length; i++) {
        logs.push(`<pre class="error-message">${spec.failedExpectations[i].message}</pre>`);
        if (spec.failedExpectations[i].stack) {
          logs.push(`<pre class="error-stack">${this.configuration.stacktrace.filter(spec.failedExpectations[i].stack)}</pre>`);
        }
      }
      return logs.join("\n");
    }
}
