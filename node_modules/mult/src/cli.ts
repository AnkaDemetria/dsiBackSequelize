#!/usr/bin/env node

const { program } = require('commander');
const { version } = require('../package');
const add = require('./add/index.ts').default;
const init = require('./init/index.ts').default;
const remove = require('./remove/index.ts').default;
const script = require('./scripts/index.ts').default;
const setup = require('./setup/index.ts').default;

program.version(version);

program
  .command('init')
  .description('init a new mult config')
  .action(init);

program
  .command('add <name> <remote>')
  .description('Add new repo to mult')
  .action(add);

program
  .command('remove <name>')
  .description('Remove repo from mult')
  .action(remove);

program
  .command('script <script>')
  .description('Run a script in each of your mult repos')
  .action(script);

program
  .command('setup')
  .description('Run a script in each of your mult repos')
  .action(setup);

program.parse(process.argv);
