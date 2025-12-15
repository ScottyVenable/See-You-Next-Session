// GitHub API Service - Fetch repo data directly into the portal
const REPO_OWNER = import.meta.env.VITE_REPO_OWNER || 'ScottyVenable';
const REPO_NAME = import.meta.env.VITE_REPO_NAME || 'See-You-Next-Session';
const BASE_URL = 'https://api.github.com';

// Cache to avoid rate limiting
const cache = new Map();
const CACHE_DURATION = 60000; // 1 minute

async function fetchWithCache(url, options = {}) {
    const cached = cache.get(url);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.data;
    }

    const response = await fetch(url, {
        ...options,
        headers: {
            Accept: 'application/vnd.github.v3+json',
            ...options.headers,
        },
    });

    if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();
    cache.set(url, { data, timestamp: Date.now() });
    return data;
}

// === Repository Info ===

export async function getRepoInfo() {
    return fetchWithCache(`${BASE_URL}/repos/${REPO_OWNER}/${REPO_NAME}`);
}

// === Commits ===

export async function getCommits(branch = 'develop', limit = 10) {
    const data = await fetchWithCache(
        `${BASE_URL}/repos/${REPO_OWNER}/${REPO_NAME}/commits?sha=${branch}&per_page=${limit}`
    );
    return data.map((commit) => ({
        sha: commit.sha,
        shortSha: commit.sha.substring(0, 7),
        message: commit.commit.message,
        author: commit.commit.author.name,
        authorAvatar: commit.author?.avatar_url,
        date: new Date(commit.commit.author.date),
        url: commit.html_url,
    }));
}

// === Branches ===

export async function getBranches() {
    const data = await fetchWithCache(
        `${BASE_URL}/repos/${REPO_OWNER}/${REPO_NAME}/branches`
    );
    return data.map((branch) => ({
        name: branch.name,
        sha: branch.commit.sha,
        protected: branch.protected,
    }));
}

// === Issues ===

export async function getIssues(state = 'open', limit = 10) {
    const data = await fetchWithCache(
        `${BASE_URL}/repos/${REPO_OWNER}/${REPO_NAME}/issues?state=${state}&per_page=${limit}`
    );
    return data
        .filter((issue) => !issue.pull_request) // Filter out PRs
        .map((issue) => ({
            number: issue.number,
            title: issue.title,
            state: issue.state,
            author: issue.user.login,
            authorAvatar: issue.user.avatar_url,
            labels: issue.labels.map((l) => ({ name: l.name, color: l.color })),
            createdAt: new Date(issue.created_at),
            updatedAt: new Date(issue.updated_at),
            url: issue.html_url,
            body: issue.body,
            comments: issue.comments,
        }));
}

// === Pull Requests ===

export async function getPullRequests(state = 'open', limit = 10) {
    const data = await fetchWithCache(
        `${BASE_URL}/repos/${REPO_OWNER}/${REPO_NAME}/pulls?state=${state}&per_page=${limit}`
    );
    return data.map((pr) => ({
        number: pr.number,
        title: pr.title,
        state: pr.state,
        author: pr.user.login,
        authorAvatar: pr.user.avatar_url,
        createdAt: new Date(pr.created_at),
        updatedAt: new Date(pr.updated_at),
        url: pr.html_url,
        head: pr.head.ref,
        base: pr.base.ref,
        mergeable: pr.mergeable,
        draft: pr.draft,
    }));
}

// === Releases ===

export async function getReleases(limit = 5) {
    const data = await fetchWithCache(
        `${BASE_URL}/repos/${REPO_OWNER}/${REPO_NAME}/releases?per_page=${limit}`
    );
    return data.map((release) => ({
        id: release.id,
        name: release.name,
        tagName: release.tag_name,
        body: release.body,
        draft: release.draft,
        prerelease: release.prerelease,
        createdAt: new Date(release.created_at),
        publishedAt: new Date(release.published_at),
        url: release.html_url,
        author: release.author.login,
        assets: release.assets.map((asset) => ({
            name: asset.name,
            size: asset.size,
            downloadUrl: asset.browser_download_url,
            downloadCount: asset.download_count,
        })),
    }));
}

// === Actions/Workflows ===

export async function getWorkflowRuns(limit = 5) {
    const data = await fetchWithCache(
        `${BASE_URL}/repos/${REPO_OWNER}/${REPO_NAME}/actions/runs?per_page=${limit}`
    );
    return data.workflow_runs.map((run) => ({
        id: run.id,
        name: run.name,
        status: run.status,
        conclusion: run.conclusion,
        branch: run.head_branch,
        event: run.event,
        createdAt: new Date(run.created_at),
        updatedAt: new Date(run.updated_at),
        url: run.html_url,
        actor: run.actor.login,
        actorAvatar: run.actor.avatar_url,
    }));
}

// === Contributors ===

export async function getContributors() {
    const data = await fetchWithCache(
        `${BASE_URL}/repos/${REPO_OWNER}/${REPO_NAME}/contributors`
    );
    return data.map((contributor) => ({
        login: contributor.login,
        avatar: contributor.avatar_url,
        contributions: contributor.contributions,
        url: contributor.html_url,
    }));
}

// === File Contents ===

export async function getFileContent(path, branch = 'develop') {
    const data = await fetchWithCache(
        `${BASE_URL}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}?ref=${branch}`
    );
    if (data.content) {
        return {
            name: data.name,
            path: data.path,
            content: atob(data.content),
            sha: data.sha,
            size: data.size,
            url: data.html_url,
        };
    }
    return data;
}

// === Directory Contents ===

export async function getDirectoryContents(path = '', branch = 'develop') {
    const data = await fetchWithCache(
        `${BASE_URL}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}?ref=${branch}`
    );
    if (Array.isArray(data)) {
        return data.map((item) => ({
            name: item.name,
            path: item.path,
            type: item.type,
            size: item.size,
            sha: item.sha,
            url: item.html_url,
        }));
    }
    return [data];
}

// === Stats ===

export async function getRepoStats() {
    const [repo, commits, issues, prs] = await Promise.all([
        getRepoInfo(),
        getCommits('develop', 1),
        getIssues('open', 100),
        getPullRequests('open', 100),
    ]);

    return {
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        watchers: repo.watchers_count,
        openIssues: issues.length,
        openPRs: prs.length,
        lastCommit: commits[0]?.date,
        defaultBranch: repo.default_branch,
        language: repo.language,
        size: repo.size,
    };
}

// Clear cache (useful after mutations)
export function clearCache() {
    cache.clear();
}

export default {
    getRepoInfo,
    getCommits,
    getBranches,
    getIssues,
    getPullRequests,
    getReleases,
    getWorkflowRuns,
    getContributors,
    getFileContent,
    getDirectoryContents,
    getRepoStats,
    clearCache,
};
