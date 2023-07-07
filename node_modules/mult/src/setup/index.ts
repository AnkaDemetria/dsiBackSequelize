const fs = require('fs');
const { exec } = require('child_process');
const packageConfig = require('../utils/package-config/index.ts').default;
const delayForEffect = require('../utils/delay-for-effect/index.ts').default;

module.exports.default = () => {
  delayForEffect('Verifying Config', spinner => {
    const configExists = fs.existsSync(`./${packageConfig.configFileName}`);
    if (!configExists) {
      spinner.fail('No config file found try calling \'mult init\'');
    } else {
      spinner.stop();
      const rawConfig = fs.readFileSync(`./${packageConfig.configFileName}`);
      const config = JSON.parse(rawConfig);
      config.repositories.map(repo => {
        delayForEffect(`Setting up ${repo.name}`, spinner2 => {
          if (fs.existsSync(`./${repo.name}`)) {
            spinner2.info(`Skipped setting up ${repo.name} as it is already setup`);
          } else {
            exec(`git clone ${repo.remote} ${repo.name}`, (err, stdout, stderr) => {
              if (err) {
                spinner2.fail();
              } else {
                spinner2.succeed();
              }
            });
          }
        });
      });
    }
  });
};
