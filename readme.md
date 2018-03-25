# Git Publish
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fiddan%2Fgit-publish.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fiddan%2Fgit-publish?ref=badge_shield)


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


## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fiddan%2Fgit-publish.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fiddan%2Fgit-publish?ref=badge_large)