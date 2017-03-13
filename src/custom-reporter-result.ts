export interface CustomReporterResult extends jasmine.CustomReporterResult {
  duration?: string;
  filename?: any;
  id: any;
}
