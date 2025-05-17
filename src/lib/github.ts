import { Octokit } from "@octokit/rest";
import { encode } from "js-base64";

// Initialize Octokit with the GitHub token
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const REPO_OWNER = process.env.GITHUB_REPO_OWNER || "";
const REPO_NAME = process.env.GITHUB_REPO_NAME || "";
const BASE_BRANCH = "main";

interface CreatePullRequestParams {
  title: string;
  body: string;
  files: {
    path: string;
    content: string;
  }[];
}

export async function createPullRequest({
  title,
  body,
  files,
}: CreatePullRequestParams) {
  try {
    // Get the latest commit SHA from the base branch
    const { data: ref } = await octokit.git.getRef({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      ref: `heads/${BASE_BRANCH}`,
    });
    const latestCommitSha = ref.object.sha;

    // Create a new branch
    const branchName = `profile-update-${Date.now()}`;
    await octokit.git.createRef({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      ref: `refs/heads/${branchName}`,
      sha: latestCommitSha,
    });

    // Create commits for each file
    for (const file of files) {
      // Get the current file content to get its SHA
      const { data: currentFile } = await octokit.repos.getContent({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        path: file.path,
        ref: BASE_BRANCH,
      });

      // Create or update file
      await octokit.repos.createOrUpdateFileContents({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        path: file.path,
        message: `Update ${file.path}`,
        content: encode(file.content), // Base64 encode the content
        branch: branchName,
        sha: Array.isArray(currentFile) ? undefined : currentFile.sha,
      });
    }

    // Create pull request
    const { data: pullRequest } = await octokit.pulls.create({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      title,
      body,
      head: branchName,
      base: BASE_BRANCH,
    });

    return {
      pullRequestUrl: pullRequest.html_url,
      pullRequestNumber: pullRequest.number,
    };
  } catch (error) {
    console.error("Error creating pull request:", error);
    throw new Error("Failed to create pull request");
  }
} 