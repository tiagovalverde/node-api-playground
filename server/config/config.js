var env = process.env.NODE_ENV || 'development';
console.log(`*** Env: ${env} ***`);

if(env === 'development' || env === 'test') {
    // requires parse json file auto
    var config = require('./config.json');
    var envConfig = config[env];

    // get json key names as array
    Object.keys(envConfig).forEach((key) => {
        process.env[key] = envConfig[key];
    });
}