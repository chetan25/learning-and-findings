## Webpack config typescript

Yes of course, Webpack config can be written in different languages. The list of supported file extensions can be found in the [node-interpret](https://github.com/gulpjs/interpret) package.

But unfortunately, a typescript based webpack config won't run out of the box in node. Since node does not understands `.ts` extension by default.

To run a `webpac.config.ts` file in node we would need to do the following steps:

- First install `ts-node`, so we can run `.ts` extensions.
- Next install types for webpack and node, for better typing
  `js npm install --save-dev ts-node @types/node @types/webpack `
  Now if you try to run the webpack command chances are you might get the below error

  ```js
       import { merge } from "webpack-merge";
       ^^^^^^

       SyntaxError: Cannot use import statement outside a module
  ```

  The reason for this is, you have the `module` property in `tsconfig.json` set to anything else than `CommonJs`, ts-node won't like it as it only understands commonJs.

So there are two ways to fix this:

- Set the `module` property in `tsconfig.json` in as `CommonJs` and you are ready.

- But if you want the module code generation to be latest ES code and don't want to switch it to CommonJs, we can configure the `ts-node` property in tsconfig.

```js
"ts-node": {
    "compilerOptions": {
    "module": "CommonJS"
    }
},
```

## Alias with Webpack and Typescript

Tired of writing import with a deep nested relative paths.

```js
import Greetings from "../../component/greetings";
```

Lets convert these relative imports to Alias. Before we do that let's understand how are these import path used

- Webpack uses the import path to resolve the module at build time.
- Typescript uses it to resolve the module at compile tile, to statically analyze the type.

So we would need to update in two places.

Webpack provides a simple way to use aliases, by configuring the `resolve.modules` property in the `webpack.config`. This will help us resolving modules under the specified directory as if they were from node_modules

```js
"resolve": {
    "modules": [
        "node_modules",
        path.join(__dirname, "src"),
        "components"
    ],
},

so we can change
import Greetings from '../../component/greetings';
to
import Greetings from "components/greeting";
```

Webpack would be happy with the above but not Typescipt. To configure typescript we just need to set the 'paths` property

```js
"baseUrl": "./",
"paths": {
    "src/*": ["src/*"],
    "components/*": ["src/components/*"]
}
```

Would it be nice if in test file also we could use the Aliases, so let's configure Jest to use the aliases.
In jest config we need to configure the `moduleDirectories` and `moduleNameMapper` for Jest to understand the aliases.

```js
moduleDirectories: [
    "node_modules",
    path.join(__dirname, "src"),
    "components",
    path.join(__dirname, "test"),
],
moduleNameMapper: {
    "^src/(.*)": "<rootDir>/src/$1",
    "^utils/(.*)": "<rootDir>/test/utils/$1",
},


so we can change this in test

import { render } from "../utils/render";
import App from "../../src/app";

To

import { render } from "utils/render";
import App from "src/app";
```

**_ Example can be found [here](https://github.com/chetan25/basic-testing-with-jest-rtl) _**

## Webpack bundling

> Example and explanation for webpack bundling can be found [here](https://github.com/chetan25/webapck-bundling-practice/blob/main/README.md)
