# react-transform-catch-errors

A [React Transform](https://github.com/gaearon/babel-plugin-react-transform) that catches errors inside `render()` function and renders a React component with an error message instead.

It’s up to you to choose the React component to render an error message. For example, you may use [redbox-react](https://github.com/KeywordBrain/redbox-react) that imitates React Native “red screen of death”.

## Installation

First, install the [Babel plugin](https://raw.githubusercontent.com/gaearon/babel-plugin-react-transform):

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
  "stage": 0,
  "env": {
    "development": {
      // this plugin will be included only in development mode, e.g.
      // if NODE_ENV (or BABEL_ENV) environment variable is not set
      // or is equal to "development"
      "plugins": [
        "react-transform"
      ],
      "extra": {
        // must be defined and be an array
        "react-transform": [{
          "target": "react-transform-catch-errors",
          // now go the imports!

          // the first import is your React distribution
          // (if you use React Native, pass "react-native" instead)

          // the second import is the React component to render error
          // (it can be a local path too, like "./src/ErrorReporter")

          // the third import is OPTIONAL!
          // when specified, its export is used as options to the reporter.
          // see specific reporter's docs for the options it needs.
          "imports": ["react", "redbox-react", /* optional: */ "./src/reporterOptions"]
        }]
        // note: you can put more transforms into array
        // this is just one of them!
      }
    }
  }
}
```

This transform has no effect when `process.env.NODE_ENV` is set to `'production'`. You can further restrict the environments it runs in by setting them in `.babelrc` as above.

## License

MIT
