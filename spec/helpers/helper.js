// https://extrajs.com/blog/tutorial/learn-basic-testing-tutorial-for-jasmine-and-typescript/

const TSConsoleReporter = require("jasmine-ts-console-reporter");
jasmine.getEnv().clearReporter(); //Clear default console reporter
jasmine.getEnv().addReporter(new TSConsoleReporter());