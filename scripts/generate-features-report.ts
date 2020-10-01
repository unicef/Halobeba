/**
 * Generates "./docs/features-report.html" file.
 * 
 * It uses [cucumber-html-reporter](https://bit.ly/2tNQglz) package.
 */
import reporter from "cucumber-html-reporter";
const fs = require("fs");
const child_process = require("child_process");

// CONFIGURE
const DOCS_FOLDER = './docs';
const FEATURES_JSON_FILE = './docs/features.json';
const FEATURES_REPORT_FILE = './docs/features-report.html';

const LAUNCH_REPORT = true;
const REPORT_METADATA = {
    "App Version": "1.0.0",
    "Test Environment": "STAGING",
    // "Platform": "Windows 10",
    // "Parallel": "Scenarios",
    // "Executed": "Remote"
};

// CREATE docs FOLDER
if (!fs.existsSync(DOCS_FOLDER)) {
    fs.mkdirSync(DOCS_FOLDER);
}

// CREATE features.json
try {
    child_process.execSync(`./node_modules/.bin/cucumber-js -p default --format json > ${FEATURES_JSON_FILE}`);
} catch(e) {
    console.log('\x1b[31m%s\x1b[0m', 'YOU HAVE UNDEFINED STEPS');
}

// GENERATE REPORT
export var options = {
    theme: 'bootstrap', // bootstrap, hierarchy, foundation, simple
    jsonFile: FEATURES_JSON_FILE,
    output: FEATURES_REPORT_FILE,
    reportSuiteAsScenarios: true,
    scenarioTimestamp: true,
    launchReport: LAUNCH_REPORT,
    metadata: REPORT_METADATA,
};

reporter.generate(options);

// DELETE features.json
fs.unlinkSync(FEATURES_JSON_FILE);