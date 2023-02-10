const GithubAPI = {
  async _getRepos(input) {
    let res = {};
    
    try {
      const partialRes = await fetch(input);
      res = await partialRes.json();
    } catch (error) {
      throw new Error(error);
    }

    return res;
  },
  async getUser(input) {
    const username = String(input);
    const endpoint = "https://api.github.com/users/";

    let res = {};
    try {
      const partialRes = await fetch(`${endpoint}${username}`);
      res = await partialRes.json();
      const repos = await this._getRepos(res.repos_url);

      const user = { ...res, repos };
      return user
    } catch (error) {
      res = error;
      return res
    }
  },
};

export { GithubAPI };
