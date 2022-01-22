const core = require("@actions/core");
// const github = require("@actions/github");

try {
  // get input and log it
  const greeterName = core.getInput("greeter-name");
  console.log(`Hello there ${greeterName}`);

  // set output
  const greetDate = new Date().toString();
  core.setOutput("greet-date", greetDate);
} catch (error) {
  core.setFailed(error.message);
}
