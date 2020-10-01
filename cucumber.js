/**
 * Command line arguments given to cucumber command `npm run cucumber`
 * 
 * Help: https://bit.ly/37DdoSc
 */
const common = [
    'features/**/*.feature', // Specify feature files to parse
    '--require-module ts-node/register', // Load TypeScript module
    '--require features/step-definitions/**/*.ts', // Load step definitions
].join(' ');

module.exports = {
    default: common
};