import { browser } from 'protractor';
import { CustomReporterResult } from "../../custom-reporter-result";
import { DisplayProcessor } from "../display-processor";
import fs = require("fs");
import path = require("path");

export class HtmlProcessor extends DisplayProcessor {

    private static decorateSpec(spec: CustomReporterResult, log: String, link?: String): String {
      let toReturn = `<td></td><td class="description">`;
      if (link) {
        const screenshotFilename = link;
        toReturn += `<a href="${screenshotFilename}">${log}</a>`;
      } else {
        toReturn += `${log}`;
      }
      toReturn += `</td>`;
      return toReturn;
    }

    public displayJasmineStarted(): String {
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

    public displaySuite(suite: CustomReporterResult, log: String): String {
        return `
<tr class="suite">
  <td>${log}</td><td colspan="3" />
<tr>
`;
    }

    public displaySpecStarted(suite: CustomReporterResult): String {
      return `<tr class="spec">`;
    }

    public displaySpecDone(spec: CustomReporterResult, log: String): String {
      return '</tr>';
    }

    public displaySuccessfulSpec(spec: CustomReporterResult, log: String): String {
      return HtmlProcessor.decorateSpec(spec, log, this.getScreenshot(spec));
    }

    public displayFailedSpec(spec: CustomReporterResult, log: String): String {
      this.getScreenshot(spec);
      return HtmlProcessor.decorateSpec(spec, log, this.getScreenshot(spec));
    }

    public displayPendingSpec(spec: CustomReporterResult, log: String): String {
        return HtmlProcessor.decorateSpec(spec, log);
    }

    public displayJasmineDone(spec: CustomReporterResult, log: String): String {
      return `${log}
      </table>
      </body>
      </html>
      `;
    }

    /**
     * Get a browser screenshot
     * Very bad return any in stead Promise
     */
    private getScreenshot(spec: CustomReporterResult): String {
      const cfg = this.configuration;
      const scrFilename = "xxxxxxxx-xxxxxxxx-xxxxxxxx.png".replace(/x/g, function(c) {
        const r = Math.random() * 16 | 0;
        return c === "x" ? r.toString(16) : c;
      });
      browser.takeScreenshot().then(function(png) {
        const fileNamePath = cfg.destination.folder
          + scrFilename;
        const stream = fs.createWriteStream(fileNamePath);
        stream.write(new Buffer(png, "base64"));
        stream.end();
      });
      return scrFilename;
    }

    private generateStylesheetLinks(): String {
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
}
