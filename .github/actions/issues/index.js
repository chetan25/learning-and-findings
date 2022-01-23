const core = require("@actions/core");
const github = require("@actions/github");

try {
  const token = core.getInput("token");
  const title = core.getInput("title");
  const body = core.getInput("body");
  const assignees = core.getInput("assignees");

  // create a new octokit github client
  const octokitClient = github.getOctokit(token);

  const issue = octokitClient.rest.issues.create({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    title,
    body,
    assignees: assignees ? assignees.split("\n") : undefined,
  });

  // set output, it should be a string
  core.setOutput("issueCreated", JSON.stringify(issue.data));
} catch (error) {
  core.setFailed(error.message);
}
