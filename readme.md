# Git Publish

Publish packages to a dedicated Git branch instead of to NPM

```bash
npm install --save-dev git-publish
```

_or_

```bash
yarn add --dev git-publish
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
