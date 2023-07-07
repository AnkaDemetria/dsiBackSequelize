const fs = require('fs');
const packageConfig = require('../utils/package-config/index.ts').default;
const delayForEffect = require('../utils/delay-for-effect/index.ts').default;

module.exports.default = () => {
  delayForEffect('Creating config file', spinner => {
    const configExists = fs.existsSync(`./${packageConfig.configFileName}`);
    if (configExists) {
      spinner.fail('Config File Already Exists');
    } else {
      fs.open(`./${packageConfig.configFileName}`, 'w', err => {
        if (err) throw new Error('Error creating config');
        spinner.succeed('Config File Created');
      });
      fs.writeFileSync(`./${packageConfig.configFileName}`, JSON.stringify(packageConfig.template, null, 4));
    }
  });
};
