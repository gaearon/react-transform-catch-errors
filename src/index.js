export default function catchErrors({ filename, components, imports }) {
  const [React, ErrorReporter, reporterOptions] = imports;

  if (!React || !React.Component) {
    throw new Error('imports[0] for react-transform-catch-errors does not look like React.');
  }
  if (typeof ErrorReporter !== 'function') {
    throw new Error('imports[1] for react-transform-catch-errors does not look like a React component.');
  }

  return function wrapToCatchErrors(ReactClass, ReactClassId) {
    const proto = ReactClass.prototype;
    let nextRender = null;
    let lastErrorString = null;

    function tryMethod(key) {
      const method = proto[key];
      const isReactClassApproved = method && method.isReactClassApproved;

      function getResult() {
        const SAFE_RESULTS = {
          getInitialState: {},
          shouldComponentUpdate: true
        };
        let result;
        let errorString;

        try {
          result = method.apply(this, arguments);
        } catch (error) {
          errorString = error && error.toString();

          // Prevent infinite loop
          if (errorString && errorString !== lastErrorString) {
            lastErrorString = errorString;

            if (console.reportErrorsAsExceptions) {
              // Stop react-native from triggering its own error handler
              console.reportErrorsAsExceptions = false;
              console.error(error);
              // Reactivate it so other errors are still handled
              console.reportErrorsAsExceptions = true;
            } else {
              console.error(error);
            }

            nextRender = React.createElement(ErrorReporter, {
              error,
              filename,
              ...reporterOptions
            });

            if (typeof global !== 'undefined' && global.document) {
              // Can't reasonably do this if rendering on the server?
              // TODO: Does this work with react-native?
              setTimeout(() => {
                this.forceUpdate();
                lastErrorString = null;
              });
            } else if (key === 'render') {
              // Go ahead and render the error
              result = nextRender;
              nextRender = null;
            }
          }
          
          // Prevent further breakage as it might be confusing
          if (SAFE_RESULTS[key]) {
            result = SAFE_RESULTS[key];
          }
        }

        return result;
      }

      // Can't monkey-patch if not a function
      if (typeof method !== 'function') {
        return;
      }

      if (key === 'render') {
        // If we've caught an error at some point within our component,
        // the `render` method will display it using the `ErrorReporter`
        proto[key] = function () {
          let result = nextRender;  // Render `ErrorReporter` if truthy
          nextRender = null;        // and then forget it

          if (!result) {  // No error pending so attempt render
            result = getResult.apply(this, arguments) || null;
          }

          return result;
        };
      } else if (key === 'constructor') {
        // Even the constructor could have an error, so when monkey-patching it
        // to catch errors, we inadvertently replace static properties and so
        // now we need to copy them to the monkey-patch since React and other
        // libraries sometimes check `inst.constructor[property]`
        proto[key] = getResult;
        Object.keys(ReactClass).forEach((key) => {
          getResult[key] = ReactClass[key];
        });
      } else {
        proto[key] = getResult;
      }

      // Prevent React from displaying misleading warning due to monkey-patch
      if (isReactClassApproved) {
        proto[key].isReactClassApproved = isReactClassApproved;
      }
    }

    Object.getOwnPropertyNames(proto).forEach(tryMethod);

    return ReactClass;
  };
}
