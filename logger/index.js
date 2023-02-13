const log4js = require("log4js");
log4js.configure({
  appenders: {
    dateFile: {
      type: "dateFile",
      filename: "logs/logs.log",
      pattern: "-yyyy-MM-dd",
      alwaysIncludePattern: true,
      compress: true,
    },
    console: {
        type: "console",
    },
  },
  categories: {
    default: {
      appenders: ["dateFile", 'console'],
      level: "info",
    },
  },
});

const logger = log4js.getLogger();
logger.level = "debug";

module.exports = logger;
