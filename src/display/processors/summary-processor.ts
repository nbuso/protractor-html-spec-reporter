import { CustomReporterResult } from "../../custom-reporter-result";
import { ExecutionMetrics } from "../../execution-metrics";
import { DisplayProcessor } from "../display-processor";

export class SummaryProcessor extends DisplayProcessor {

    public displaySummary(spec: CustomReporterResult, log: string, metrics: ExecutionMetrics): string {
        let summaryHtml = `${log}
    <table id="summary-table" class="summary">
      <caption>Report summary`;
        if (this.configuration.summary.displayDuration) {
            summaryHtml += ` - Total execution time: ${metrics.duration}`;
        }
        summaryHtml += `</caption>
      <thead><tr><td>Status</td><td>Spec Count</td></tr></thead>
      <tr id="summary-success"><td>Success</td><td>${metrics.successfulSpecs}</td></tr>
      <tr id="summary-failed"><td>Failed</td><td>${metrics.failedSpecs}</td></tr>
      <tr id="summary-pending"><td>Pending</td><td>${metrics.pendingSpecs}</td></tr>
      <tr id="summary-skipped"><td>Skipped</td><td>${metrics.skippedSpecs}</td></tr>
      <tr id="summary-total" class="total"><td>Total defined</td><td>${metrics.totalSpecsDefined}</td></tr>
      <tr id="summary-executed"><td>Executed</td><td>${metrics.executedSpecs}</td></tr>
    </table>
    `;

        return summaryHtml;
    }

}
