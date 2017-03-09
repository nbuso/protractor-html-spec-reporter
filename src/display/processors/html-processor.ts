import { browser } from 'protractor';
import { CustomReporterResult } from "../../custom-reporter-result";
import { DisplayProcessor } from "../display-processor";
import fs = require('fs');


export class HtmlProcessor extends DisplayProcessor {

    private static decorateSpec(spec: CustomReporterResult, log: String, link?: string): String {
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
      return `
<html>
  <head>
    <title>TDD test reports</title>
    <link rel="stylesheet" type="text/css" href="reports.css">
    <script defer="defer" src="scripts.js"></script>
  </head>
  <body>
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
      return HtmlProcessor.decorateSpec(spec, log, true);
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
        const r = Math.random() * 16 | 0, v = c == 'x'? r : c;
        return v.toString(16);
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
}
