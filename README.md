# init-module

[![Greenkeeper badge](https://badges.greenkeeper.io/jackboberg/init-module-base.svg)](https://greenkeeper.io/)

[![standard][standard-image]][standard-url]

> forkable base for creating a npm init-module

## Table of Contents

- [Install](#install)
- [Usage](#usage)
- [Contribute](#contribute)
- [License](#license)

## Install

This module is not meant to be installed and used as-is, since it duplicates 
the default behavior of the defualt [`init-module`]. Instead, you should fork 
this repo and make the customizations you want for your own `init-module`.

    npm install @studioelsa/init-module -g
    npm set init-module $(init-module)

## Usage

> TODO document usage with [`init-package-json`]

## Contribute

PRs welcome! Please read the [contributing guidelines](contributing.md) and 
the [code of conduct](code-of-conduct.md).

## License

[MIT © Jack Boberg.](LICENSE)  

[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[standard-url]: http://npm.im/standard
[`init-module`]: https://github.com/npm/init-package-json/blob/master/default-input.js
[`init-package-json`]: https://github.com/npm/init-package-json
