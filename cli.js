const program = require('commander');
const {version} = require('./package.json');
const publish = require('./publish');

program
  .version(version)
  .option('-b, --branch', 'Git branch the package published to. defaults to "publish"')
  .option('-C, --cwd', 'package directory. defaults to "."')
  .parse(process.argv);

publish(program.branch, program.c).catch(console.error);
