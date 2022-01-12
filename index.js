const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
  try {
    const owner = github.context.repo.owner;
    const repo = github.context.repo.repo;
    const token = core.getInput('token');
    const octokit = github.getOctokit(token);
    const changedColumnId = github.context.payload.changes && github.context.payload.changes.column_id;

    if (changedColumnId) {
      if (github.context.payload.project_card.content_url) {
        const issueResponse = await octokit.request(github.context.payload.project_card.content_url);
        const comment = `Heads up - this issue was moved between project columns. cc @JianOon`;

        const createCommentResponse = await octokit.issues.createComment({
          owner,
          repo,
          issue_number: issueResponse.data.number,
          body: comment
        });
      }
    }

  } catch (error) {
    console.error(error);
    core.setFailed(`The action failed with ${error}`);
  }
}

run();
