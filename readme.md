# Git Publish

Publish packages as Git tags instead of to NPM

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
