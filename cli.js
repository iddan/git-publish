#!/usr/bin/env node

const program = require('commander');
const {version} = require('./package.json');
const publish = require('./publish');

program
  .version(version)
  .option('-C, --cwd', 'package directory. defaults to "."')
  .parse(process.argv);

publish(program.c).catch(console.error);
