export const suppressReactRendererConsoleError = () => {
  const invalidError = console.error;
  console.error = (...x) => {
    // debugger;
    if (
      x[0].includes(
        'is using incorrect casing. Use PascalCase for React components, or lowercase for HTML elements.'
      ) ||
      x[0].includes(
        'is unrecognized in this browser. If you meant to render a React component, start its name with an uppercase letter.'
      )
    ) {
      return;
    }
    invalidError(...x);
  };
};
