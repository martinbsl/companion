const expect = require('chai').expect;
const fs = require('fs');
const child_process = require('child_process');
const path = require("path");
const ncp = require("ncp").ncp;
const rimraf = require('rimraf');

const TEST_DIR = 'test/library';
const COMPANION_INSTALL_DIR = 'companion';

before(function (done) {
    rimraf(`${TEST_DIR}/node_modules`, function () {
        fs.mkdirSync(`${TEST_DIR}/node_modules`);
        fs.mkdirSync(`${TEST_DIR}/node_modules/${COMPANION_INSTALL_DIR}`);

        ncp(path.join('.', 'src'), path.join(TEST_DIR, 'node_modules', COMPANION_INSTALL_DIR));

        done();
    });
});

describe('Static Files', function() {
    beforeEach(function (done) {

        rimraf(`${TEST_DIR}/dist`, function () {
            done();
        });
    })

    it('should copy README.md', async function() {
        await runCompanion();
        expectExists('README.md');
    });

    it('should copy package.json', async function() {
        await runCompanion();
        expectExists('package.json');
    });
});

function expectExists(filename) {
    expect(fs.existsSync(`${TEST_DIR}/dist/${filename}`, `${filename} exists`)).to.be.true;
}

function runCompanion() {
    return new Promise((resolve, reject) => {
        const proc = child_process.spawn('node',
            ['../../node_modules/.bin/gulp', '--cwd', '.', '--gulpfile', 'node_modules/companion/gulpfile.js'],
            {cwd: TEST_DIR, stdio: 'pipe'});


        proc.stdout.on('data', (data) => {
            process.stdout.write(`    ${data.toString().trim().padEnd(process.stdout.columns-4)}\x1b[0G`);
        });

        proc.on('exit', function (event) {
            process.stdout.write(`${''.padEnd(process.stdout.columns)}\x1b[0G`);
            if (event) {
                reject(new Error('gulp-process exited with non-zero exit-code.'));
            } else {
                resolve();
            }
        });
    });
}
