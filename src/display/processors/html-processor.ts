import { browser } from "protractor";
import { CustomReporterResult } from "../../custom-reporter-result";
import { DisplayProcessor } from "../display-processor";
import fs = require("fs");
import path = require("path");

export class HtmlProcessor extends DisplayProcessor {

    public displayJasmineStarted(): string {
      const htmlStyleSheetsLinks = this.generateStylesheetLinks();
      return `
<html>
  <head>
    <title>${this.configuration.title}</title>
    <link rel="stylesheet" type="text/css" href="reports.css">
    ${htmlStyleSheetsLinks}
    <script defer="defer" src="scripts.js"></script>
  </head>
  <body>
  <h2>${this.configuration.title}</h2>
  <ul>
  <li><a href="#suite-table">Test report</a></li>
  <li><a href="#summary-table">Summary report</a></li>
  </ul>
  <table id="suites-table">
  <caption>Test Suites report</caption>
  <thead>
    <tr><td>Suite</td><td>Spec</td><td>Duration</td><td>Status</td></tr>
  </thead>
      `;
    }

    public displaySuite(suite: CustomReporterResult, log: string): string {
        return `
<tbody class="suite">
<tr class="suite">
  <td>${log}</td><td colspan="3" />
<tr>

`;
    }

    public displaySuiteDone(suite: CustomReporterResult, log: string): string {
      return `${log}
      </tbody>
      `;
    }

    public displaySpecStarted(suite: CustomReporterResult, log: string): string {
      return `<tr class="spec" id="spec-${suite.id}">${log}`;
    }

    public displaySpecDone(spec: CustomReporterResult, log: string): string {
      return "</tr>";
    }

    public displaySuccessfulSpec(spec: CustomReporterResult, log: string): string {
      return this.decorateSpec(spec, log, this.getScreenshot(spec), "SUCCESS");
    }

    public displayFailedSpec(spec: CustomReporterResult, log: string): string {
      return this.decorateSpec(spec, log, this.getScreenshot(spec), "FAILED", true);
    }

    public displayPendingSpec(spec: CustomReporterResult, log: string): string {
        return this.decorateSpec(spec, log, "", "PENDING", true);
    }

    public displaySummary(spec: CustomReporterResult, log: string): string {
      return `</table>${log}`;
    }

    public displayJasmineDone(spec: CustomReporterResult, log: string): string {
      return `${log}
      </body>
    </html>
      `;
    }

    /**
     * Get a browser screenshot from protractor browser and save on filesystem.
     * Return the filename of the saved screenshot
     */
    private getScreenshot(spec: CustomReporterResult): string {
      const cfg = this.configuration;
      if (!cfg.spec.takeScreenshot) { return ""; }
      const scrFilename = "xxxxxxxx-xxxxxxxx-xxxxxxxx.png".replace(/x/g, function(c) {
        const r = Math.floor((Math.random() * 16) + 1);
        return c === "x" ? r.toString(16) : c;
      });
      if (browser) { // maybe nothing was executed and browser is undefined
        browser.takeScreenshot().then(function(png) {
          const fileNamePath = cfg.destination.folder
          + scrFilename;
          const stream = fs.createWriteStream(fileNamePath);
          stream.write(new Buffer(png, "base64"));
          stream.end();
        });
      }
      return scrFilename;
    }

    /**
     * Create stylesheets links for imported and linked stylesheets from configuration
     */
    private generateStylesheetLinks(): string {
      const styleLinks: string[] = [];
      this.configuration.customStylesheets.forEach(function(s) {
        if (s) {
          styleLinks.push(`<link rel="stylesheet" type="text/css" href="${s}">`);
        }
      });
      this.configuration.importStylesheets.forEach(function(s) {
        if (s) {
          styleLinks.push(`<link rel="stylesheet" type="text/css" href="${s.substr(s.lastIndexOf(path.sep) + 1)}">`);
        }
      });
      return styleLinks.join("\n");
    }

    /**
     * Generate the Spec table row content
     */
    private decorateSpec(spec: CustomReporterResult, log: string, link: string, status: string,
                         withErrorMessages?: boolean): string {

      let toReturn = `<td></td><td class="description">`;
      if (link) {
        const screenshotFilename = link;
        toReturn += `<a href="${screenshotFilename}">${log}</a>`;
      } else {
        toReturn += `${log}`;
      }
      toReturn += `</td>
        ${this.generateDurationTD(spec)}
        ${this.generateStatusTD(spec, status, withErrorMessages)}
      `;
      return toReturn;
    }

    private generateDurationTD(spec: CustomReporterResult): string {
      if (this.configuration.spec.displayDuration) {
        return `<td class="duration">${spec.duration}</td>`;
      }
      // would be better to completely remove the column?
      return "<td></td>";
    }

    private generateStatusTD(spec: CustomReporterResult, status: string, withErrorMessages: boolean): string {

        let toReturn = `<td class="status">`;

        if (withErrorMessages && this.configuration.spec.displayErrorMessages) {
          const errorId = `error-${spec.id}`;
          toReturn += `
            <span class="status-${status.toLowerCase()}">
              <a class="error-link" onclick="showHide('${errorId}')">${status.toUpperCase()}</a>
            </span>
            <div id="${errorId}" class="hide">
            ${this.getErrorMessages(spec)}
            </div>
          `;
        } else {
          toReturn += `<span class="status-${status.toLowerCase()}">${status.toUpperCase()}</span>`;
        }

        toReturn += "</td>";
        return toReturn;
    }

      private getErrorMessages(spec: CustomReporterResult): string {
        const logs: string[] = [];
        for (let i: number = 0; i < spec.failedExpectations.length; i++) {
          logs.push(`<pre class="error-message">${spec.failedExpectations[i].message}</pre>`);
          if (spec.failedExpectations[i].stack) {
            logs.push(`<pre class="error-stack">${this.configuration.stacktrace.filter(
              spec.failedExpectations[i].stack)}</pre>`);
          }
        }
        return logs.join("\n");
      }
}
