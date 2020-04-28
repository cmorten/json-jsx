const getComponentName = (component) =>
  component.displayName || component.name || component.constructor.name;

export default getComponentName;
