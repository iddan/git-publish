<div align="center" href="">
  <p>
    <a href="https://npm.im/@iddan/git-publish">
      <img src="https://img.shields.io/npm/v/@iddan/git-publish.svg"
           alt="NPM Version" />
    </a>
    <a href="https://snyk.io/test/github/iddan/git-publish">
      <img src="https://snyk.io/test/npm/@iddan/git-publish/badge.svg"
           alt="Known Vulnerabilities"
           data-canonical-src="https://snyk.io/test/npm/@iddan/git-publish"/>
    </a>
    <!-- <a href="https://travis-ci.org/iddan/stylesheet">
      <img src="https://travis-ci.org/iddan/stylesheet.svg?branch=master" />
    </a> -->
    <!-- <a href='https://coveralls.io/github/iddan/stylesheet?branch=master'>
      <img src='https://coveralls.io/repos/github/iddan/stylesheet/badge.svg?branch=master' 
           alt='Coverage Status' />
    </a> -->
    <a href="https://app.fossa.io/projects/git%2Bgithub.com%2Fiddan%2Fgit-publish?ref=badge_shield">
      <img src="https://app.fossa.io/api/projects/git%2Bgithub.com%2Fiddan%2Fgit-publish.svg?type=shield"
           alt="FOSSA Status" />
    </a>
  </p>
  <img src="assets/git-publish.png" height="128" />
  <h1>Git Publish</h1>
  <p>Publish packages as Git tags instead of to NPM</p>
</div>

```bash
npm install --save-dev @iddan/git-publish
```

_or_

```bash
yarn add --dev @iddan/git-publish
```

### Why?

To allow publishing private node modules for free

### Usage

```bash
$(npm bin)/git-publish
```

_or_

```bash
yarn run git-publish
```

And then install it by

```bash
npm install $GIT_REPOSITORY"#v"$VERSION
```

_or_

```bash
yarn add $GIT_REPOSITORY"#v"$VERSION
```

### Prior Art

* [npm-git-publish](https://github.com/theoy/npm-git-publish)
