# How does Browser resolve import statements

We are use to importing dependencies with name specifier and running through the bundler and boom there we have wonderful page.

```js
// bundler knows how to reslove these named specifier to node modules
import React from 'react'; 
import ReactDOM from 'react-dom';

const App = () => {
    return <h2>Wonderful Component</h2>
}

ReactDOM.render(
   <App/>,
    document.getElementById('root')
)

```
So what happens when we write the following code and try to run it on browser by importing this file in a HTML 

```js
// file.js

import React from 'react';
import ReactDOM from 'react-dom';

class Hello extends React.Component {
    render() {
      return React.createElement('div', null, `Hello ${this.props.toWhat}`);
    }
}
  
ReactDOM.render(
    React.createElement(Hello, {toWhat: 'World'}, null),
    document.getElementById('root')
);

````

````html
<body>
    <div id='root'>Test</div>
    <script type="module" src="./file.js"></script>
</body>
````

We will see a nasty error message 

```js

Uncaught TypeError: Failed to resolve module specifier "react". Relative references must start with either "/", "./", or "../".

```

Why is that ? 

This is because the Browser does not know how to resolve the import with named specifier. The code in bundler works because the imports are resolved and bundled by the bundler. Browser by default can import module, with the new ES6 specification but it can only resolve two types of module path

```js
  // first is relative import 
  import MyCoolCode from './myRelativePath';

  // from absolute path
  import React from 'https://cdn.jsdelivr.net/npm/@esm-bundle/react/esm/react.production.min.js';
```

Lets see some examples -

### Without a bundler - Absolute Import Path
- Uncomment the following line in the `index.html` file under `src` directory
```js
   <!-- <script type="module" src="./absolute-path.js"></script> -->

```
- Then run `npx serve src`. 
- This will render the content of `absolute-path.js` file on the browser, notice we are using the `absolute path` for our deps and we don't have a bundler.

### With a bundler - Named export (System JS)

If you want to 
- keep the named exports.
- Externalize the deps, so that they are not bundled in with your code.
- Use a bundler and still see your wonderful code run.

We have a solution and that is `SystemJs`.

SystemJs is just a shim for a lot of JS feature which are not supported by the browser yet. And one of that feature we are leveraging is `importMaps`.

Let's see an example 
- Uncomment everything that is under the head tag that is under this message tag
  ```js
  <!-- SystemSJ Releated Script section starts -->
   ....scripts
  <!-- SystemSJ Releated Script section ends -->

  ```
- Then uncomment the following script too
  ```js
  <!-- <script type="systemjs-module" src="./bundle.js"></script> -->
  ``` 
  - Then run `npx serve src`. 
  - You will see the App loads.

#### Few pre-requisite 
- Mark `react` and `react-dom` as external.
- Bundle the webpack output as `systemJs` by setting the `libraryTarget` under `output` to `system`
  

#### Few points to remember
- The type of the script in the index has changed to ` type="systemjs-module"`.
- The import map script type is also `type="systemjs-importmap"`
- The dependencies url are absolute bundles for `systemjs` and not `esm` or `commonjs`.
- The reason behind using the `systemjs` bundles is
  ```js
   With systemJS we cannot use import keyword,
   since systemJS keeps it own registry/list of module we are using
   and it is separate from what browser keeps track of 
   and if we use import then browser keeps a track of what the import module are
   Since we provide feature what browser does not supprt we cannot use import
   we will use new syntax to import modules, which browser does not understand
   but system js does. We don;t have to do it manually, 
   we just instruct the bundler to ouput in system format and that is it.

  ```

 *** Note - For sake of demo, I have moved the output bundle to the src folder and committed *** 