>## This Project Is Deprecated

>React Hot Loader 3 is [on the horizon](https://github.com/gaearon/react-hot-loader/pull/240), and you can try it today ([boilerplate branch](https://github.com/gaearon/react-hot-boilerplate/pull/61), [upgrade example](https://github.com/gaearon/redux-devtools/commit/64f58b7010a1b2a71ad16716eb37ac1031f93915)). It fixes some [long-standing issues](https://twitter.com/dan_abramov/status/722040946075045888) with both React Hot Loader and React Transform, and is intended as a replacement for both. The docs are not there yet, but they will be added before the final release. For now, [this commit](https://github.com/gaearon/redux-devtools/commit/64f58b7010a1b2a71ad16716eb37ac1031f93915) is a good reference.

# react-transform-catch-errors

[![react-transform channel on discord](https://img.shields.io/badge/discord-react--transform%40reactiflux-61DAFB.svg?style=flat-square)](http://www.reactiflux.com)

A [React Transform](https://github.com/gaearon/babel-plugin-react-transform) that catches errors inside `render()` function and renders a React component with an error message instead.

It’s up to you to choose the React component to render an error message. For example, you may use [redbox-react](https://github.com/KeywordBrain/redbox-react) that imitates React Native “red screen of death”.

## 🚧🚧🚧🚧🚧

This is **highly experimental tech**. If you’re enthusiastic about hot reloading, by all means, give it a try, but don’t bet your project on it. Either of the technologies it relies upon may change drastically or get deprecated any day. You’ve been warned 😉 .

**This technology exists to prototype next-generation React developer experience**. Please don’t use it blindly if you don’t know the underlying technologies well. Otherwise you are likely to get disillusioned with JavaScript tooling.

**No effort went into making this user-friendly yet. The goal is to eventually kill this technology** in favor of less hacky technologies baked into React. These projects are not long term.

## Installation

First, install the [Babel plugin](https://github.com/gaearon/babel-plugin-react-transform):

```
npm install --save-dev babel-plugin-react-transform
```

Then, install the transform:

```
npm install --save-dev react-transform-catch-errors
```

Finally, install the component for rendering errors, for example:

```js
npm install --save-dev redbox-react
```

You may also use a custom component instead.

Now edit your `.babelrc` to include `extra.babel-plugin-react-transform`.  
It must be an array of the transforms you want to use:

```js
{
  "presets": ["es2015", "stage-0"],
  "env": {
    // only enable it when process.env.NODE_ENV is 'development' or undefined
    "development": {
      "plugins": [["react-transform", {
        "transforms": [{
          "transform": "react-transform-catch-errors",
          // now go the imports!
          "imports": [

            // the first import is your React distribution
            // (if you use React Native, pass "react-native" instead)

            "react",

            // the second import is the React component to render error
            // (it can be a local path too, like "./src/ErrorReporter")

            "redbox-react"

            // the third import is OPTIONAL!
            // when specified, its export is used as options to the reporter.
            // see specific reporter's docs for the options it needs.

            // it will be imported from different files so it either has to be a Node module
            // or a file that you configure with Webpack/Browserify/SystemJS to resolve correctly.
            // for example, see https://github.com/gaearon/babel-plugin-react-transform/pull/28#issuecomment-144536185

            // , "my-reporter-options"
          ]
        }]
        // note: you can put more transforms into array
        // this is just one of them!
      }]]
    }
  }
}
```

**It is up to you to ensure that the transform is not enabled when you compile the app in production mode.** The easiest way to do this is to put React Transform configuration inside `env.development` in `.babelrc` and ensure you’re calling `babel` with `NODE_ENV=development`. See [babelrc documentation](https://babeljs.io/docs/usage/babelrc/#env-option) for more details about using `env` option.

## License

MIT
