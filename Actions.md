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
