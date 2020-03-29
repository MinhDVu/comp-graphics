# Introduction to Computer Graphics - Test Environment
This project is aimed at creating a better dev environment for Computer Graphics (31264), replacing the horrendous all-in-one HTML files.

## Installation
1. [Clone this repository](https://help.github.com/en/github/creating-cloning-and-archiving-repositories/cloning-a-repository) using your CLI or Source Control GUI App (Source Tree, GitKraken)
2. Download [NodeJS](https://nodejs.org/en/download/) (This is a runtime for developing and building this project). This will also install npm by defaul. Confirm it's installed by typing `node -v` and `npm -v` in your CLI, the installed version will be printed
3. Open the repo on your IDE (I prefer VSCode since it's open source, has great features, and lots of customsations)
4. Run `npm i` to install the node packages this project needs to function (node packages are modules/libraries of pre-defined functions that you can import into your project)
5. Run `npm run test` to host your project on http://localhost:8080. This webpage is compiled from your project and has browser-sync enabled, meaning if you update your script, it will recompile and reload the website automatically.

## Contributing
Don't.

Okay sure, but here are some general rules for contributing to this repo

<b>DO</b>
- Create a branch using proper naming convention mention [here](https://gist.github.com/revett/88ee5abf5a9a097b4c88). For example, to create a branch for a new feature:

    ```
    git checkout master
    git fetch & git pull
    git checkout -b feature/feature-name
    git push -u origin feature/feature-name
    ```

- Before commiting a change to your branches, run your linter (`npm run lint`) and fix all linting errors. This will provide a form on code validation to enforce good coding practices. Optionally, you can add a `--fix` option at the end to handle auto-fixable warnings and errors. However, I would recommend checking these errors yourself to improve your own coding skills.

- Write short and meaningful commit messages. Example:
    > Feature: Added camera movement functionality

    > Bugfix: Fix infinite zoom in bug on mouse scroll

    > Chore: Code refactoring, fix linting errors

- Merge the latest commits from master into feature branch when making a [pull request](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/about-pull-requests)

    ```
    git checkout master
    git fetch & git pull
    git checkout local-branch-name
    git merge master
    git push
    ```

- Use squash merge and close source branch when merging branches

<b>DON'T</b>
- Commit straight to master
- Merge a branch without having it reviewed by team members
- Create multiple commits with minor changes. Instead, try `git commit --amend` to override the latest commit in local history, and `git push --force` to rewrite the remote history (if you have already pushed to remote). More info on what this is can be found [here](https://www.atlassian.com/git/tutorials/rewriting-history)
