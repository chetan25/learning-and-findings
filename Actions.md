## Github Actions

#### To enable extra debug info in Actions

- We can use the availbel github secerets to show more debugging info for our actions.
- The two available secerest are `ACTIONS_RUNNER_DEBUG` and `ACTIONS_STEP_DEBUG`. They both are boolean.
- Adding these two will add some extra debugging outputs to the github action

#### Actions

- We can triggger a workflow by following ways:

  - By event like push, pull_request etc.
  - Using a Scheduler and a Cron Job
  - Manully repository dispatch action(`repository_dispatch` event)

```js
on: repository_dispatch: types: [build];
```

- In github we can either
  - Run shell commands (uses `run` keyword)
  - Or run actions(js actions) (uses `uses` keyword)

```yml
    - name: Run Shell Command
      run: echo "Hello World"

    - name: Run Shell Command
      uses: actions/hello-world-javascript-action@v1
      // we use this key to provide input to action
      with:
        who-to-greet: World
```

- The `uses` key can take either a relative path to a local file or a remote repositroy.
- We can either specify a `branch` name or a `version` name or even a commit(hash id) after the `@` symbol
- Actions can receive input and we use the `with` keyword to pass the input required.
- Actions can also produce outputs which we might need to use in our step, so we do the following:

  - Give the action a unique ID
  - Than we can access the output using the following syntax
    `{{ steps.<stepID>.outputs.<outputVarName>}}`

  ```yml
  steps:
    - name: Simple action
      // id for reference
      id: helloworld
      uses: actions/hello-world-javascript-action@v1
      // we use this key to provide input to action
      with:
        who-to-greet: World

    - name: Get the output from action
      // time is the outout variable from the above action
      run: echo "${{  steps.helloworld.outputs.time }}"
  ```

  - Note when using the `checkout` action, if we are doing it on push, that will checkout the branch to the commit that triggered the action and run the workflow in that.

- If we want to run our workflows in a specific schedule, we could use the `schedule` keyword and pass it a cron job.
- Cron job is given like "\* \* \* \* \*" ==> "minute hour day(month) month day(week)"

```yml
on:
  schedule:
    - cron: "0/5 * * * *" # every 5 min
```

#### Filtering workflow

- We can use the filter to control when to run the workflow

```yml
  on:
    push:
      branches:
        - master # will only run on master
        - "feature/*"; # will run on any branch that starts with feature, ex feature/test1 but not feature/test1/test1
        - "feature/**"; # will match feature/test1/test1
        - "!feature/featA" # will ignore the specified branch
      branches-ignore: # cannot be used together with branches
        - master # will ignore master branch
      tags:
        - v1.*
      paths:
        - '**/.js' # only run if we update JS files
        - '!test.js' # will not run if that file changed
```

#### Environment Variables

- Env varible can be added in different levels in workflow file
  - root level availabel for all jobs
  - job level available for all steps in that job
  - step level availbe only for that step

```yml
name: Environment Variables

on: push

# availabe for all jobs in this workflow
env:
  TEST_ENV: TEST Value

jobs:
  echo-env:
    env:
      JOB_VARIABLE: Only in this job
    runs-on: ubuntu-latest
    steps:
      - name: Log Variables
        env:
          STEP_ENV: Only Step
        run: |
          echo "Environment Variable"
          echo "TEST_ENV value is:  ${TEST_ENV}"
          echo "JOB_VARIABLE value is:  ${JOB_VARIABLE}"
          echo "STEP_ENV value is: ${STEP_ENV}"
```

- There are other availbe environment variable provided by [github](https://docs.github.com/en/actions/learn-github-actions/environment-variables)

- We can also set Secret env in our github repository and to access them we just use the secrets object. This way only the action can access the secret

```yml
env:
  REPO_SECRET: ${{ secrets.REPO_SECRET }} # REPO_SECRET is the variable we set in our repo
```

- A secret variable that is automatically availbe for us is the `GITHUB_TOKEN`, which is by default present in the `secrest` object we don't need to set it.
- This token can be used to access github apis and do basic auth. Some examples can be found in [github](https://docs.github.com/en/actions/security-guides/automatic-token-authentication)

```yml
jobs:
  triage:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/labeler@v2
        with:
          repo-token: ${{ secrets.GITHUB_TOKEN }}
```

#### Conditions in workflow

- We can use `if` in the workflow to conditionally run a job/step.

```yml
runs-on: ubuntu-latest
# only runs if condition is met
if: github.event_name == 'push'
steps:
  - name: Test Condition
    run: echo "COndition was successfull"
```

- We can also use the `if` condition is we want to run the step based on the previous step success or failure

```yml
steps:
  - name: Failure Step
    run: eccccho "COndition was successfull"

  - name: Good Job
    # failure()  will return true if previous job fails
    if: failure()
    run: echo "good job"
```

- Other function available to us are `success()`, `cancelled()` and `always()`

#### Option to run Jobs in sequence

- We can use the `need` keyword and specify the ID

```yml
jobs:
  first-job: ....

  second-job:
    needs: ["first-job"]
```

#### Option to run subsequent steps if one fails

- We can set the flag called `continue-on-error`

```yml
steps:
  - name: Bad step
    run: eccccchhooo
    continue-on-error: true # all steps will run even it fails
  - name: Good job1
    ...
  - name: Good job2
    ...
```

#### Timing out Job

- By default the timout for a job or a step is `360 mins`. After that github will kill your job.
- BUt we can customise it to by setting the `timeout-minutes` flag

```yml
jobb:
  big-job:
    timeout-minutes: 500
```

### Using Strategy

- Imagine we want to run a job on different node version, by defauult our VM will have a set node version.
- We would need to configure it to use a specific node version.
- We would use the `actions/setup-node` action to configure it.

```yml
- name: Setup Node
  uses: actions/setup-node@v1
  with:
    node-version: 7 # configuring to use Version 7
```

- We can now configure the matrix to run for different versions

```yml
matrix-job:
  strategy:
    matrix:
      # any key name we like for later reference
      node: [6, 8, 10]
      # a key for OS
      os: [macos-latest, ubuntu-latest]
    # default true, if one fails no one else runs
    fail-fast: true
    # by default github will try to maximize it
    max-parallel: 2
  runs-on: ${{ matrix.os}}
  steps:
    - name: Log Node version
      run: node -v

    - name: Setup Node
      uses: actions/setup-node@v1
      with:
        # this node-version is the input the action needs
        node-version: ${{ matrix.node}}

    - name: Log the Updated version
      run: node -v
```

- If ever we feel like we need to exclude some jobs from running based on some Matrix configuration we can use the `exclude`. The below setuo will not run the jobs when OS is 'ubuntu-lates' and Node version is 8 or when OS is 'macos-latest' and Node version is 10

```yml
strategy:
  matrix:
    # any key name
    node_version: [8, 10]
    # a key for OS
    os: [macos-latest, ubuntu-latest]
    exclude:
      - os: ubuntu-latest
        node: 8
      - os: macos-latest
        node: 10
  # default true, if one fails no one else runs
  fail-fast: true
  # by default github will try to maximize it
  max-parallel: 2
```

#### Using Docker

- Simple step to just use a docker image is as below

```yml
jobs:
  docker-test:
    runs-on: ubuntu-latest
    # container: node:13.5.0-alpine3.10
    container:
      image: node:13.5.0-alpine3.10
    steps:
      - name: Log Container Node version
        run: |
          node -v
          cat /etc/os-release
```

- The `container` key can be an array and take in options like `image`, `volumes`, `env`, `ports` etc all the options that a docker container might use

- To run multile docker containers we can use `services` key instead of `container`

```yml
jobs:
  docker-test:
    runs-on: ubuntu-latest
    services:
      app:
        image: myAppDOckerImage
        ports:
          - 3001:3001
      db:
        image: mongo
        ports:
          - 2701:2701
```

#### Custom Actions

- We can write custom action in different ways and that gives us capability to re-use code and have more control.
- We can create a simple javascript action by creating a new folder under `.github` folder called `actions` and then adding two files in there, the `action.yml` and `index.js`(which is the entry point.)
  - `action.yml` file contains the info about our action like the name, author, input parameters, output from our action and how does the action executes.

```yml
name: Simple Javacript Action
author: Me
description: Simple logging Action
inputs:
  greeter-name:
    description: "Name to output in greeting message"
    required: true
    default: World
outputs:
  date:
    description: "Greeting Date"
runs:
  using: "node16" # since it will be executed by node
  main: "index.js" # main entry point
```

- A simple js action would look like this

```js
const core = require("@actions/core");
// const github = require("@actions/github");

// get input and log it
const greeterName = core.getInput("greeter-name");
console.log(`Hello there ${greeterName}`);

// set output
const greetDate = new Date().toString();
core.setOutput("greet-date", greetDate);
```

- What if the above code was throwing Error on some line, with current logic our action would stop but on github it would appear that the action passed successfully.
- `throw new Error("Some error message");` would only stop the execution, but not make the action fail, action would still appear as passing.
- To make the action `fail` we need to explicitly call `core.setFailed('Message')`.

```js
const core = require("@actions/core");

try {
  // get input and log it
  const greeterName = core.getInput("greeter-name");
  console.log(`Hello there ${greeterName}`);

  // set output
  const greetDate = new Date().toString();
  core.setOutput("greet-date", greetDate);
} catch (error) {
  core.setFailed(error.message);
}
```

#### Adding Debugging to Actions

- We can add some debugging to our custom action, that would show up if the consumer has enabled the debugging.
- Few option for it are
  - `core.debug('Message)` - to add any debugging message
  - `core.warn('warning')` - to add any warning message
  - `core.error('error')` - to add any error message
- We can also make logs collapsible if they are long using the group feature.

```js
core.startGroup("Logging a long Object");
console.log(JSON.stringify({}, null, "\t"));
core.endGroup();
```

#### Adding Environment Variable in Custom Action

- We can add env variables in our custom action that could be used by subsequent steps in the consumer action.

  ```js
  // custom action
  core.exportVariable("CustomEnvVar", "From CUstom");
  ```

  ```yml
  # in consuming action
  run: echo $CustomEnvVar
  ```
