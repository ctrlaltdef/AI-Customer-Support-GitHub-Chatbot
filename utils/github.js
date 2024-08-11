// utils/github.js
export const fetchGitHubData = async (query) => {
    const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
    };
  
    const response = await fetch(`https://api.github.com/search/repositories?q=${query}`, { headers });
    const data = await response.json();
  
    return data;
  };
  