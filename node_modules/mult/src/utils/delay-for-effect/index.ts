const ora = require('ora');


module.exports.default = (message, callback) => {
  const spinner = ora(message);
  spinner.start();
  setTimeout(() => {
    callback(spinner);
  }, 500);
};
