# Explore VSCODE Debug feature

## How to debug any typescript function locally

Let say we have a a module, where we are doing some complex calculation or calling third party function and we want to debug it to see why it's throwing error and we are lazy enough to not leave the VSCODE.

So how do you do it ?
It's simple just follow the steps:

- Let's say the module you want to test is shown below

  ```ts
  // dummy.ts - module function to test

  const someComplexFunction = (index: number) => {
    console.log(index);
  };

  const callMe = () => {
    for (var i = 0; i < 10; i++) {
      someComplexFunction(i);
    }
  };

  export { callMe };
  ```

- Now as a good practice create a new file to test this, lets called it `dummy.test.ts` ( You don't have to but I generally prefer this).

  ```ts
  import { callMe } from "./dummy";

  callMe();
  ```

- Now the interesting part, let's setup a new debug configuration, by clicking the `Run and Debug` panel on the left side, it's where we have the search and explorer icon.
- Click the `create a launch.json file` link.
- It will prompt you to choose the debug options, select `node`.
- This will create a new folder `.vscode1` and put a `launch.json` file under it.
- The file will have some default content
  ```json
  {
    // Use IntelliSense to learn about possible attributes.
    // Hover to view descriptions of existing attributes.
    // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [
      {
        "type": "pwa-node",
        "request": "launch",
        "name": "Launch Program",
        "skipFiles": ["<node_internals>/**"],
        "program": "${file}"
      }
    ]
  }
  ```
- In order to debug our typescript code, we need to update few things
  ```json
  {
    "version": "0.2.0",
    "configurations": [
      {
        "type": "node",
        "request": "launch",
        // You can select a name you like
        "name": "Debug local",
        // This is set to relative, as you can open the debug file we craeted and run the debugger for it
        "args": ["${relativeFile}"],
        "env": {
          // any node environment variable you code might need
        },
        // set the path to your ts-node, in this case my laucher file was at root and the node modules inside the Backend folder
        "runtimeArgs": ["-r", "../Backend/node_modules/ts-node/register"]
      }
    ]
  }
  ```
- Once the launch file is update, you can put a break point in the `dummy.ts` file we created and than navigate to the `dunmmy.test.ts` file to run the debugger from there.

## How to debug any aws lambda function locally

**_ Note to debug the AWS function, you need to configure a user in the command line that has permissions to run those functions _**

- Let's say you have a simple lambda function, that list all the S3 buckets you have

  ```ts
  // simple.ts - filename

  import { S3 } from "aws-sdk";

  // s3Client
  const s3Client = new S3();

  async function handler(event: any, context: any) {
    const buckets = await s3Client.listBuckets().promise();
    return {
      statusCode: 200,
      body: "Here are the bucket" + JSON.stringify(buckets.Buckets),
    };
  }

  export { handler };
  ```

- Again following the same patter, lets create a test file for this

  ```ts
  import { handler } from "./simple.ts";

  handler(event as any, {} as any).then((res) => {
    const data = res;
    return res;
  });
  ```

- Using the same launcher file we created we can run the debugger form this dummy test file, but since aws need few env variables we need to add those
  ```json
  {
    "version": "0.2.0",
    "configurations": [
      {
        "type": "node",
        "request": "launch",
        // You can select a name you like
        "name": "Debug local",
        // This is set to relative, as you can open the debug file we craeted and run the debugger for it
        "args": ["${relativeFile}"],
        "env": {
          "AWS_REGION": "us-east-1"
        },
        // set the path to your ts-node, in this case my laucher file was at root and the node modules inside the Backend folder
        "runtimeArgs": ["-r", "../Backend/node_modules/ts-node/register"]
      }
    ]
  }
  ```
- But if you have a complex function that uses some AWS env variable you can update the launcher file like so
  ```json
  "env": {
       "AWS_REGION": "us-east-1",
       "TABLE_NAME": "Amazing",
       "PRIMARY_KEY": "amazingId"
   },
  ```
