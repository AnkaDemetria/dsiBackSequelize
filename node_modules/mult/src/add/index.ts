const fs = require('fs');
const packageConfig = require('../utils/package-config/index.ts').default;
const delayForEffect = require('../utils/delay-for-effect/index.ts').default;

module.exports.default = (name, remote) => {
  delayForEffect(`Adding ${name} to ${packageConfig.configFileName}`, spinner => {
    // TODO: Verify Remote URL
    const configExists = fs.existsSync(`./${packageConfig.configFileName}`);
    if (!configExists) {
      spinner.fail('No config file found try calling \'mult init\'');
    } else {
      const rawConfig = fs.readFileSync(`./${packageConfig.configFileName}`);
      const config = JSON.parse(rawConfig);
      const exists = config.repositories.find(repo => repo.name === name);
      if (exists) {
        spinner.fail('A repository with that name already exists');
      } else {
        config.repositories.push({ name, remote });
        fs.writeFileSync(`./${packageConfig.configFileName}`, JSON.stringify(config, null, 4));
        spinner.succeed(`${name} added to ${packageConfig.configFileName}`);
      }
    }
  });
};
