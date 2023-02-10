import { LocalStorage } from "./localStorage";
import { GithubAPI } from "./GithubAPI";

const usernameForm = document.querySelector(".prompt");
const search = document.querySelector("#username");
const cardContainer = document.querySelector(".cardContainer");

function sanitiseString(str) {
  return str.replace(/[^A-Z 1-9 !@"£$.-]/gi, "");
}

function createCard(user) {
  // if the input is an error is invalid return an error
  if (Object.keys(user) <= 2 || user.message) {
    cardContainer.innerHTML = ` 
    <div class="card error">
      <h2>Search Error ${user.message || ""}</h2>
    </div>
    `;
  } else {
    // else render the card
    cardContainer.innerHTML = `
  <div  class="card">
  <img src="${user.avatar_url}" draggable="false" />
    <div class="metadata">
      <a href="${
        user.html_url
      }" target="_blank" rel="noopener noreferrer" ><h2>${user.login}</h2></a>
      <p>${user.bio || "no bio provided"}</p>
        <div class="stats"> 
          <p>followers: ${user.followers}</p> <p>following: ${
      user.following
    }</p> <p>repos: ${user.public_repos}</p>
        </div>

        <div class="repos"> 
          
        </div>

    </div>
  </div>
`;
    // append the repos to the card after it's rendered
    listRepos(user.repos);
  }
}

function listRepos(reposList) {
  let repos = reposList || [];
  const reposEl = document.querySelector(".repos");

  repos.forEach((repo) => {
    const repoEl = document.createElement("a");

    repoEl.classList.add("repo");
    repoEl.href = repo.html_url;
    repoEl.target = "_blank";
    repoEl.innerText = repo.name;

    reposEl.appendChild(repoEl);
  });
}

// load storage on domcontentloaded
document.addEventListener("DOMContentLoaded", () => {
  if (LocalStorage.getUser()) {
    const user = JSON.parse(LocalStorage.getUser());
    createCard(user);
    console.log("loaded storage, user: ", user.login);
  }

  // onsubmit of the form, search for the user
  usernameForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    let query = sanitiseString(search.value);
    if (!query || query === "") return;

    let user = {};

    try {
      user = await GithubAPI.getUser(query);
      LocalStorage.saveUser(user);
      createCard(user);
    } catch (err) {
      createCard(err);
    }
  });
});
