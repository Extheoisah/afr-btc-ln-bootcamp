import { Octokit } from "@octokit/rest";
import { encode } from "js-base64";

if (!process.env.GITHUB_TOKEN) {
  throw new Error("GITHUB_TOKEN is not set in environment variables");
}

if (!process.env.GITHUB_REPO_OWNER || !process.env.GITHUB_REPO_NAME) {
  throw new Error("GITHUB_REPO_OWNER or GITHUB_REPO_NAME is not set in environment variables");
}

// Initialize Octokit with the GitHub token
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const REPO_OWNER = process.env.GITHUB_REPO_OWNER;
const REPO_NAME = process.env.GITHUB_REPO_NAME;
const BASE_BRANCH = "main";

interface CreatePullRequestParams {
  title: string;
  name?: string;
  body: string;
  files: {
    path: string;
    content: string;
  }[];
}

interface GitHubError {
  status: number;
  message: string;
}

export async function createPullRequest({ title, name, body, files }: CreatePullRequestParams) {
  try {
    console.log(`Creating pull request for ${files.length} files in ${REPO_OWNER}/${REPO_NAME}`);

    // Get the latest commit SHA from the base branch
    const { data: ref } = await octokit.git.getRef({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      ref: `heads/${BASE_BRANCH}`,
    });
    const latestCommitSha = ref.object.sha;
    console.log(`Latest commit SHA: ${latestCommitSha}`);

    // Create a new branch
    const branchName = `update-${title}-${name}-${Date.now()}`;
    await octokit.git.createRef({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      ref: `refs/heads/${branchName}`,
      sha: latestCommitSha,
    });
    console.log(`Created branch: ${branchName}`);

    // Update files in the new branch
    for (const file of files) {
      console.log(`Processing file: ${file.path}`);
      try {
        // Try to get the current file content
        const { data: currentFile } = await octokit.repos.getContent({
          owner: REPO_OWNER,
          repo: REPO_NAME,
          path: file.path,
          ref: branchName,
        });

        // Update existing file
        await octokit.repos.createOrUpdateFileContents({
          owner: REPO_OWNER,
          repo: REPO_NAME,
          path: file.path,
          message: `Update ${file.path}`,
          content: encode(file.content),
          sha: Array.isArray(currentFile) ? undefined : currentFile.sha,
          branch: branchName,
        });
        console.log(`Updated existing file: ${file.path}`);
      } catch (error) {
        const gitHubError = error as GitHubError;
        if (gitHubError.status === 404) {
          // File doesn't exist, create it
          await octokit.repos.createOrUpdateFileContents({
            owner: REPO_OWNER,
            repo: REPO_NAME,
            path: file.path,
            message: `Create ${file.path}`,
            content: encode(file.content),
            branch: branchName,
          });
          console.log(`Created new file: ${file.path}`);
        } else {
          throw error;
        }
      }
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
    console.log(`Created pull request: ${pullRequest.html_url}`);

    return {
      pullRequestUrl: pullRequest.html_url,
    };
  } catch (error) {
    console.error("Error creating pull request:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to create pull request: ${error.message}`);
    }
    throw new Error("Failed to create pull request");
  }
}
