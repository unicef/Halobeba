/**
 * Generates Cucumber snippets and copies them to clipboard.
 */
const child_process = require("child_process");
const clipboard = require('clipboardy');

// CONFIGURE
export let command = `./node_modules/.bin/cucumber-js -p default --format snippets --dry-run`;

// GENERATE SNIPPETS & COPY THEM TO CLIPBOARD
child_process.exec(
    command,
    function(error:Error, stdout:string, stderr:string) {
        if (stdout) {
            clipboard.writeSync(stdout);
            console.log('\x1b[32m%s\x1b[0m', 'SNIPPETS COPIED TO \x1b[5mCLIPBOARD\x1b[0m');
        } else {
            console.log('\x1b[31m%s\x1b[0m', 'NO SNIPPETS');
        }
    }
);