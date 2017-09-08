const expect = require('chai').expect;
const fs = require('fs');
const child_process = require('child_process');
const path = require('path');
const ncp = require('ncp').ncp;
const promisify = require('util').promisify;
const rimraf = promisify(require('rimraf'));


const TEST_DIR = 'test/hello-world';
const COMPANION_INSTALL_DIR = 'companion';

before(async function () {
    await rimraf(`${TEST_DIR}/node_modules`);

    fs.mkdirSync(`${TEST_DIR}/node_modules`);
    fs.mkdirSync(`${TEST_DIR}/node_modules/${COMPANION_INSTALL_DIR}`);

    ncp(path.join('.', 'src'), path.join(TEST_DIR, 'node_modules', COMPANION_INSTALL_DIR));
});

describe('Library Content', function() {

    before(async function () {
        this.timeout(30000);

        await rimraf(`${TEST_DIR}/dist`);
        await rimraf(`${TEST_DIR}/build`);

        return runCompanion();
    });

    describe('Static Files', function() {

        it('should copy README.md', function() {
            expectExists('README.md');
        });

        it('should copy package.json', function() {
            expectExists('package.json');
        });
    });

    describe('Entry Points', function() {

        it('should create primary entry point named as library folder', function() {
            expectExists('hello-world.d.ts');
            expectExists('public_api.d.ts');
        });

        it('should create primary entry point meta-data', function() {
            expectExists('hello-world.metadata.json');
        });
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
            process.stdout.write(`    ${data.toString().trim().padEnd(process.stdout.columns - 4)}\x1b[0G`);
        });

        proc.on('exit', (event) => {
            process.stdout.write(`${''.padEnd(process.stdout.columns)}\x1b[0G`);
            if (event) {
                reject(new Error('gulp-process exited with non-zero exit-code.'));
            } else {
                resolve();
            }
        });
    });
}
