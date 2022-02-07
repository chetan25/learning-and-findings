# Git Basics

Git is a DevOps tool used for source code management. It is a free and open-source version control system used to handle small to very large projects efficiently. Git is used to tracking changes in the source code, enabling multiple developers to work together on non-linear development.

## Basic Git Commands

All commands are run from terminal.

#### config

- To configure the author name and email address, to be used in the commits, we use the config command.

```js
// to configure user name
git config -- global user.name "your name"

// to consigure email address
git config --global user.email "your@email.com"

// to know option availabel for config
git config
```

#### clone

- To create a working copy of a repository locally we can use the `clone` command to either clone a remote or a local repository.

```js
git clone <repository payh>
// git clone https://github.com/chetan25/TestDemos.git
```

- Clone for a remote repository can be done by copying the URL from the `Code` dropdown menu of the repository page you wish to clone.
- Clone can be done using `SSH` or `HTTPS` URL. Both method requires user to authenticate in different ways. More on that later.

#### fork

- Just like `clone` you can use the `fork` command to copy the repository locally, but in this case the original remote connection to the repo is removed and you have your own copy with the remote that you have under you GitHub account.
- The fork command copies the repo under your GitHub account too.
- Note that the `–clone` option is added to force the remote repository to be cloned locally, otherwise it will only be cloned in your GitHub account server.

```js
git repo fork https://github.com/chetan25/TestDemos.git --clone
```

#### checkout

- The checkout commands can be used to
  - create a new branch from the current state of the default(master/main) branch or can be from a different branch. `git checkout -b <brnach-name>`
  - or checkout to a specific branch. `git checkout <branch-name>`

```js
// creating a new branch from the default(main/master) branch
git checkout -b "brnach-name"

// creating form an existign branch
git checkout -b "branch-name" "existing-branch-name"

// checking out to a any branch
git checkout "test-branch"
```

#### commit

- Once you are done with the changes and would like to commit your work so that it can be pushed to remote server,use the add command followed by commit.
- Without adding the files, the commit command is of no use as git won't konw what files to be added to the commit.

```js
// to add all the changes
git add .

// or
// to add single file only
git add <fileName>

// after that commit
git commit -m "Descriptive commit message"
```

#### push

- Once you are happy with the changes and have committed it, its time to push your changes.
- `push` assumes the remote repository exists and upstream branch has been setup.
- For the `first` time pushing to a remote branch would require to set up the upstream for the local branch. (Upstream branches define the branch tracked on the remote repository by your local remote branch (also called the remote tracking branch)). `git push --set-upstream <remote> <branch>`

```js
// set upstream branch if first push
// git push --set-upstream <remote> <branch>
git push --set-upstream origin test-branch

// implicitliy pushes to remote repository
git push

// but if we have multiple remotes, we speicfy the remote we want to push the changes to, in this case 'origin' and to default branch (main or master)
git push origin

// to push to specifc branch in a remote
// git push <remote> <branch-name>

git push origin test-branch
```

#### pull

- Is a command to update the local version of a repository from a remote.
- It does two things
  - Update the current local working branch(checked out) by fetching all the commits and merging it.
  - Updates the remote tracking branches for all other branches.
- In the simplest terms, git pull does a git fetch followed by a git merge.

```js
// to pull changes for a checked out branch
git pull
```

#### fetch

- The command tells your local git to retrieve the latest meta-data info from the remote.
- It does not do any merge. It’s more like just checking to see if there are any changes available.
- You can do a git fetch at any time to update your remote-tracking branches under `refs/remotes/<remote>`. This operation never changes any of your own local branches under `refs/heads`, and is safe to do without changing your working copy.

```js
git fetch
```

#### merge

- It allows you to merge branches from git into your current branch.
- Git merging combines sequences of commits into one unified history of commits.
- Git can automatically merge commits unless there are changes that conflict in both commit sequences.

```js
// to merge master into your local checkout branch
git merge master

// to merge another branch
git merge <branch-name>
```

#### rebase

- Its based on similar concept as the merge but it keeps the project history intact, where as merging would create a new commit for the merge, rebase will play the commits and put them in order.
- Used to integrate changes from upstream into a local repository. Like getting changes from the remote to a local feature branch.

```js
// getting the new changes from master to local brnach
git rebase master
```

#### delete branches

- We might also require to delete the local or the remote branch once in a while, for that we can use the delete command with different options.

- For deleting the remote branch:

```js
 git push origin --delete <your_branch>
```

- For deleting the local branch, you have following ways

```js
git branch -D <branch_name>
// Same as -D
git branch --delete --force <branch_name>
```

#### delete a remote

- We can also delete the remote attach to the local repository if we need.

```js
// To confirm what is the remote repository linked
git remote -v

// delete the remote attached
// git remote remove <name of the remote>
git remote remove origin
```

#### add/update a new remote

- We can also add or update a new remote to a local repo

```js
// updating the current remote to point to new one
git remote set-url origin https://github.com/user/example.git

// addind a new remote, this will keep other remotes if present
git remote add origin https://github.com/user/example.git
```

### Authentication

- We can authenticate into our GitHub account using two ways:
  - PAT - Personal Access Token
  - SSH - Setting a public private key.

#### PAT

- PAT is the simplest one, we just create a new PAT from the GitHub UI and then when we try to perform any GitHub action for the first time it would prompt us to add our `usename` and `password`.
- For username use your GitHub username
- For password paste in the PAT token you copied from GitHub.(Note it won't be visible on screen so, once you pasted it press enter)
- This would work but the problem is it will prompt each time to enter the credentials, we can bypass this by using the cache.

- Note with PAT you can only clone repo using the HTTPS URL from the repository.

```js
// run this command and it will cache the credentials next time you enter those
git config --global credential.helper cache
```

- If ever you want to update the credentials you can nuke the cache by running

```js
git config --global --unset credential.helper
```

- To check your global config run

```js
git config --global --list
```

#### SSH

- Instead of using the credentials you can add the SSH keys to your GitHub account.
- Note with SSH you can only clone repo using the SSH URL from the repository.
- For windows user install the git for Windows(Git Bash) to create a SSH key and install it with default setting.
- To check if you have the SSH key run `cat ~/.ssh/id_rsa.pub`.
- If not let's create a new one by running `ssh-keygen -t rsa`
- When prompted, to enter the file location, you can leave it empty. For passphrase also its optional to fill it.
- Now you can see the SSH generated by running the command `cat ~/.ssh/id_rsa.pub`.
- Copy the SSH and head to your GitHub account and in the `SSH and GPG Keys` section enter your key.
