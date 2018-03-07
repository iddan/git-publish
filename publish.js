const fs = require('fs');
const path = require('path');
const os = require('os');
const childProcess = require('child_process');
const util = require('util');

const isGitClean = require('is-git-clean');
const npm = require('npm');
const tar = require('tar');
const ncp = require('ncp');

const exec = util.promisify(childProcess.exec);
const rename = util.promisify(fs.rename);
const mkdir = util.promisify(fs.mkdir);
const realpath = util.promisify(fs.realpath);
const readFile = util.promisify(fs.readFile);

/**
 * Publish an NPM package formatted code to a dedicated git branch
 * @param {string} cwd - package directory
 */
module.exports = async function publish(cwd = process.cwd()) {
  const pkg = await getPackage(cwd);
  const tmpdir = await realpath(os.tmpdir());
  const currentBranch = await getCurrentBranch(cwd);
  if (!await isGitClean(cwd)) {
    throw new Error('Git working directory not clean.');
  }
  const tarball = await pack(cwd);
  const extractionDir = path.join(tmpdir, tarball.replace('.tgz', ''));
  try {
    await mkdir(extractionDir);
  } catch (err) {
    if (err.code !== 'EEXIST') {
      throw err;
    }
  }
  await tar.extract({file: tarball, cwd: extractionDir});
  const publishBranch = await checkoutPublishBranch(cwd);
  await ncp(path.join(tmpdir, tarball, 'package'), cwd);
  try {
    await rename('.npmignore', '.gitignore');
  } catch (err) {
    if (err.code !== 'ENOENT') {
      throw err;
    }
  }
  await exec('git rm -r --cached .');
  await exec('git add -A');
  await commit(pkg.version);
  let tag;
  try {
    tag = await createTag(pkg.version);
  } catch (err) {
    // Tag already exists
    if (err.code === 128) {
      await exec('git checkout ' + currentBranch);
      console.error('Git tag v0.0.0 already exists. Please use different version or remove the tag before publishing');
      process.exit(128);
    }
    throw err;
  }
  await exec('git push origin ' + tag);
  await exec('git checkout ' + currentBranch);
  await exec('git branch -D ' + publishBranch);
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
  await exec('git commit -m ' + message);
}

/**
 * @param {string} cwd
 * @returns {string} checked-out publish branch
 */
async function checkoutPublishBranch(currentBranch, cwd) {
  // Assuming commit hashes are unique to avoid duplications
  const currentCommitHash = await getCurrentCommitHash();
  const publishBranch = 'publish-' + currentCommitHash;
  if (currentBranch === publishBranch) {
    throw new Error('Git branch must not be the publish branch ' + publishBranch);
  }
  await exec('git checkout -B ' + publishBranch, {cwd});
  return publishBranch;
}

/**
 * @returns {string} current commit hash
 */
async function getCurrentCommitHash() {
  const {stdout} = await exec('git rev-parse HEAD');
  return stdout.trim();
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
