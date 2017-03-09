import { CustomReporterResult } from "../../custom-reporter-result";
import { ExecutionMetrics } from "../../execution-metrics";
import { DisplayProcessor } from "../display-processor";

export class SummaryProcessor extends DisplayProcessor {

      public displaySummary(spec: CustomReporterResult, log: String, metrics: ExecutionMetrics): String {
        return `${log}
        <table id="summary-table" class="summary">
          <caption>Report summary - Total execution time: ${metrics.duration}</caption>
          <thead><tr><td>Status</td><td>Spec Count</td></tr></thead>
          <tr><td>Success</td><td>${metrics.successfulSpecs}</td></tr>
          <tr><td>Failed</td><td>${metrics.failedSpecs}</td></tr>
          <tr><td>Pending</td><td>${metrics.pendingSpecs}</td></tr>
          <tr><td>Skipped</td><td>${metrics.skippedSpecs}</td></tr>
          <tr class="total"><td>Total defined</td><td>${metrics.totalSpecsDefined}</td></tr>
          <tr><td>Executed</td><td>${metrics.executedSpecs}</td></tr>
        </table>
        `;
      }
}
