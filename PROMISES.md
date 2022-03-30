---
title: Promises Simplified.
excerpt: Trying to simplify JavaScript Promises.
Tools: ["JavaScript"]
---

# Promises Simplified

## What is a Promise

- In simple language a Promise, is assurance that a particular thing will happen in the future.
- In Js domain a Promise is an `Object` who's value is not known at the time of creation and it assures a completion of a async task in the future. The outcome could be either a success or a failure.
- The Promise can be in either of the 3 states at any given time:
  - Pending - default or initial state, indicates the async operation has not bee completed yet.
  - Fulfilled - indicates the async operation has successfully been completed.
  - Rejected - indicates the async operation has failed.

## Let's review Callbacks before moving on

- Simply put callbacks are functions that run in the future based on an event or a trigger.
- A simple example of callback is the function we pass to the `addEventListener`.

```js
  // here event is the placeholder name for the argument, that gets passed
  const handleClickCallBack = (event) => {....};
  btnElement.addEventListener('click', handleClickCallBack);
```

- In general the callback function takes in any number of arguments pre-defined by the calling(main) function. In the above example the calling function(`addEventListener`) automatically passes the event object as an argument to our `handleClickCallBack` function.
- Let's simplify things bit more and see how the callback functions are invoked and get the argument.
- Below we have a simplified version of `addEventListener`.

```js
/* this function takes in two arguments.
 * eventType - a stirng
 * callBackFn - a callback function that would be invoked later
 */
const customAddEventListener = (eventType, callBackFn) => {
  // we gonna do a simple version here
  const eventObejct = {};
  if (eventType === "clcik") {
    eventObejct["type"] = "clcik";
    eventObejct["element"] = "button";
  } else {
    eventObejct["type"] = "otherEvent";
    eventObejct["element"] = "someElement";
  }

  // invoking the callback function
  callBackFn(eventObejct);
};

// declaring our callback
const handleClickCallBack = (event) => {
  console.log(event.type); // click
};

// invoking our addEventListener
customAddEventListener("click", handleClickCallBack);
```

- In the example above you can see how our callback function `handleClickCallBack` takes 1 predefined argument and how we are passing it from the `addEventListener` function.
- So in most cases when we are passing a callback function to pre-defined events(functions) in JavaScript, like `addEventListener` or `setTimeout` the number of arguments the callback takes is already defined by the calling function(addEventListener or setTimeout).
- But if you define a custom function like we did above `customAddEventListener` we can decide how many arguments we would like to pass to the callBack function we take in as an argument.

## How to create a Promise

- JavaScript gives us a function(constructor function) to create a Promise object.
- This built-in function takes a callback, which excepts two arguments
  - `first` argument is a function to `resolve` the promise we created.
  - `second` argument is a function to `reject` the promise we created.

```js
// Built-in function to create a Promise

new Promise((resolve, reject) => {}); // inline anonymous callback function

const callBackFn = (resolve, reject) => {};
new Promise(callBackFn); // named callback function
```

- Note that we need to use the `new` keyword to invoke the Promise, as it's not a normal JS function, its a special kind of function called `constructor function`.
-

## What to do after creating a Promise

- So we know how to create a promise, but what next.
- Now we can assign the Promise Object to a variable and register the callbacks we want to run on `successful completion` or on `rejection` of the Promise we created.
- The promise object we get back after creating the Promise in above example, has two methods, which allow us to register a success or failure callback.
- The two methods on Promise object are
  - `then` - use to register a success callback.
  - `catch` - use to register a error callback.

```js
const promiseObject = new Promise((resolve, reject) => {
  if (1 == 1) {
    resolve("It is true"); // we are resolving the Promise by invoking resolve function
  } else {
    reject("It is false"); // we are rejecting the promise by invoking the reject function
  }
});

// now let's register our callbacks
promiseObject
  .then((response) => {
    console.log(response); // will output It is true
  })
  .cathc((error) => {
    console.log(error); // will output It is false
  });
```

- In the above snippet we invoke the Promise constructor and store the return value, which is a Promise object in a constant called `promiseObject`.
- Then we use the `then` method on the Promise Object to pass a callback that we want to run on success and the `catch` method on the Promise object to pass a callback we want to run on error.
- The argument to our success callback function `response`, is the value we resolve the promise with, when we called `resolve()`.
- Similarly for the error callback the value of argument `error` is whatever value we rejected the promise with, when we called `reject()`.

### Example

```js
/*
 * Imagine that we have a DB that stores user, posts and comments.
 * Each user can have posts and each posts can have comments.
 * Below we are trying to get all posts for a user and then all comments for the posts
 */

const users = [
  {
    userId: 1,
    userName: "Js",
  },
  {
    userId: 2,
    userName: "Css",
  },
];

const posts = {
  1: {
    userId: 1,
    postId: 1,
    post: "This is a post on Event Handlers",
  },
  2: {
    userId: 2,
    postId: 2,
    post: "This is a post on Scss",
  },
};

const comments = {
  1: [
    {
      postId: 1,
      commentId: 1,
      comment: "Very Helpful",
    },
  ],
  2: [
    {
      postId: 2,
      commentId: 2,
      comment: "Intresting Read",
    },
  ],
};

// Async
const getUser = (name) => {
  return new Promise((res, rej) => {
    setTimeout(() => {
      const userSelected = users.find((arrVal) => {
        return arrVal.userName === name;
      });

      if (userSelected) {
        res({ user: userSelected });
      } else {
        rej({ user: null, error: "User Not found" });
      }
    }, 400);
  });
};

const getPostsForUser = (userId) => {
  return new Promise((res, rej) => {
    setTimeout(() => {
      const postsSelected = posts[userId];
      if (postsSelected) {
        res({ posts: postsSelected });
      } else {
        rej({ posts: null, error: "No Posts found" });
      }
    }, 300);
  });
};

const getCommentsForPost = (postId) => {
  // Fake API Call
  return new Promise((response, reject) => {
    setTimeout(() => {
      const commentsSelected = comments[postId];
      if (commentsSelected) {
        response({ comments: commentsSelected });
      } else {
        // not a great rejection case
        reject({ comments: null, error: "Posts has no comments" });
      }
    }, 100);
  });
};

// callback hell
getUser("Css")
  .then((response) => {
    const user = response.user;
    // we need to get all post for the user
    getPostsForUser(user.userId)
      .then((response) => {
        const posts = response.posts;
        // now we need to get comments for the post
        getCommentsForPost(posts.postId)
          .then((success) => {
            console.log(success);
          })
          .catch((error) => {
            console.lo("Failed to get Comments");
          });
      })
      .catch((err) => {
        console.log("Error from Posts");
      });
  })
  .catch((error) => {
    console.log("Error from user");
  });
```

## Promise Chaining

- In the above example we can see how we ended up nesting Promises, when we had to make sequential calls. This is called Callback hell.
- In order to simplify things and make it more readable, we can take advantage of Promise chaining.
- Promise Chaining simply means that we can chain async tasks in specific order.
- In simple words, we can return a Promise from inside of a `then` callback function and resolve it by putting a new `.then` after the first `.then` call.
- Let's see how we resolve it with Promise Chaining

```js
// chaining
getUser("Js")
  .then((success) => {
    const user = success.user;
    // we return a Promise here, instead of resolivng
    return getPostsForUser(user.userId);
  })
  // we chain a new then to resolve the above returned Promise 'getPostsForUser'
  .then((success) => {
    console.log(success);
    // we again return a Promise
    return getCommentsForPost(success.posts.postId);
  })
  // we chain a new then to resolve the above returned Promise 'getCommentsForPost'
  .then((success) => {
    console.log(success);
  })
  // this catch will catch any error thorn in any of the above Promise
  .catch((err) => {
    console.log(err);
  });
```
