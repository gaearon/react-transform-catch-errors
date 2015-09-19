export default function catchErrors({ filename, components, imports }) {
  const [React, ErrorReporter, reporterOptions] = imports;

  if (!React || !React.Component) {
    throw new Error('imports[0] for react-transform-catch-errors does not look like React.');
  }
  if (typeof ErrorReporter !== 'function') {
    throw new Error('imports[1] for react-transform-catch-errors does not look like a React component.');
  }

  return function wrapToCatchErrors(ReactClass, componentId) {
    const originalRender = ReactClass.prototype.render;

    ReactClass.prototype.render = function tryRender() {
      try {
        return originalRender.apply(this, arguments);
      } catch (err) {
        if (console.reportErrorsAsExceptions) {
          // Stop react-native from triggering its own error handler
          console.reportErrorsAsExceptions = false;
          console.error(err);
          // Reactivate it so other errors are still handled
          console.reportErrorsAsExceptions = true;
        } else {
          console.error(err);
        }

        return React.createElement(ErrorReporter, {
          error: err,
          filename,
          ...reporterOptions
        });
      }
    };

    return ReactClass;
  };
}
