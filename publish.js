const fs = require('fs');
const path = require('path');
const os = require('os');
const child_process = require('child_process');
const util = require('util');

const isGitClean = require('is-git-clean');
const npm = require('npm');
const tar = require('tar');
const ncp = require('ncp');

const exec = util.promisify(child_process.exec);
const rename = util.promisify(fs.rename);
const mkdir = util.promisify(fs.mkdir);
const realpath = util.promisify(fs.realpath);
const readFile = util.promisify(fs.readFile);

/**
 * Publish an NPM package formatted code to a dedicated git branch
 * @param {string} branch - a dedicated git branch
 */
module.exports = async function publish(branch = 'publish', cwd = process.cwd()) {
  const pkg = await getPackage(cwd);
  const tmpdir = await realpath(os.tmpdir());
  const currentBranch = await getCurrentBranch(cwd);
  if (currentBranch === branch) {
    throw new Error('Git branch must not be the publish branch');
  }
  if (!await isGitClean(cwd)) {
    throw new Error('Git working directory not clean.');
  }
  const tarball = await pack(cwd);
  const extractionDir = path.join(tmpdir, tarball.replace('.tgz', ''));
  try {
    await mkdir(extractionDir);
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  await tar.extract({file: tarball, cwd: extractionDir});
  await exec('git checkout -B ' + branch, {cwd});
  await ncp(path.join(tmpdir, tarball, 'package'), cwd);
  await rename('.npmignore', '.gitignore');
  await exec('git rm -r --cached .');
  await exec('git add -A');
  await commit(pkg.version);
  const tag = await createTag(pkg.version);
  await exec('git push --set-upstream origin ' + branch);
  await exec('git push origin ' + tag);
  await exec('git checkout ' + currentBranch);
};

/**
 * @param {string} cwd
 * @returns {string} current Git branch
 */
async function getCurrentBranch(cwd) {
  const {stdout, stderr} = await exec('git rev-parse --abbrev-ref HEAD', {
    cwd,
  });
  if (stderr) {
    throw new Error(stderr);
  }
  return stdout.trim();
}

/**
 * npm pack
 * @param {string} cwd
 * @return {string} package tarball name
 */
function pack(cwd) {
  return new Promise((resolve, reject) => {
    npm.load({}, () => {
      npm.commands.pack([cwd], true, (err, tarballs) => {
        if (err) {
          reject(err);
          return;
        }
        const [tarball] = tarballs;
        resolve(tarball);
      });
    });
  });
}

/**
 * @param {string} cwd
 * @returns {Object}
 */
async function getPackage(cwd) {
  return JSON.parse(await readFile(path.join(cwd, 'package.json')));
}

/**
 * @param {string} version
 * @returns {string}
 */
function getMessage(version) {
  return npm.config.get('message').replace(/%s/g, version);
}

/**
 * @param {string} version
 */
async function commit(version) {
  const message = getMessage(version);
  await exec('git add .');
  return exec('git commit -m ' + message);
}

/**
 * @param {string} version
 * @return {string} tag created
 */
async function createTag(version) {
  const message = getMessage(version);
  const sign = npm.config.get('sign-git-tag');
  const flagForTag = sign ? '-sm' : '-am';
  const tag = npm.config.get('tag-version-prefix') + version;
  await exec(['git tag ', tag, flagForTag, message].join(' '));
  return tag;
}
