import { DisplayProcessor } from "./display/display-processor";

export class Configuration {
    public destination?: {
      folder: string,
      fileName: string
    };
    public suite?: {
        /**
         * display each suite number (hierarchical)
         */
        displayNumber?: boolean;
    };
    public spec?: {
        /**
         * display error messages for each failed assertion
         */
        displayErrorMessages?: boolean;

        /**
         * display stacktrace for each failed assertion
         */
        displayStacktrace?: boolean;

        /**
         * display each successful spec
         */
        displaySuccessful?: boolean;

        /**
         * display each failed spec
         */
        displayFailed?: boolean;

        /**
         * display each pending spec
         */
        displayPending?: boolean;

        /**
         * display each spec duration
         */
        displayDuration?: boolean;
    };
    public stacktrace?: {
        /**
         * Customize stacktrace filtering
         */
        filter?(stacktrace: String): String;
    };
    public summary?: {
        /**
         * display error messages for each failed assertion
         */
        displayErrorMessages?: boolean;

        /**
         * display stacktrace for each failed assertion
         */
        displayStacktrace?: boolean;

        /**
         * display summary of all successes after execution
         */
        displaySuccessful?: boolean;

        /**
         * display summary of all failures after execution
         */
        displayFailed?: boolean;

        /**
         * display summary of all pending specs after execution
         */
        displayPending?: boolean;

        /**
         * display execution duration
         */
        displayDuration?: boolean;
    };
    /**
     * Title used in the HTML report
     */
    public title?: string;
    /**
     * list of display processor to customize output
     * see https://github.com/bcaudan/jasmine-spec-reporter/blob/master/docs/customize-output.md
     */
    public customProcessors?: Array<typeof DisplayProcessor>;
    /**
     * options for custom processors
     */
    public customOptions?: any;
    /**
     * List of custom stylesheets to in the html. These stylesheets are absolute URL, if you want to import
     * a stylesheet from your project use 'importStylesheets'
     */
    public customStylesheets?: string[];
    /**
     * List of stylesheet path relative to the project folder that will be imported in the destination folder
     * and added to the html
     */
    public importStylesheets?: string[];
}
