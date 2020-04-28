import { JSX_COMPONENT_NAME_KEY } from "../symbols";

const createElement = (component, props, children) => {
  Object.defineProperty(props, JSX_COMPONENT_NAME_KEY, {
    configurable: true,
    enumerable: false,
    writable: true,
    value: component,
  });

  children.forEach((childObject) => {
    const { [JSX_COMPONENT_NAME_KEY]: objectName } = childObject || {};

    if (objectName) {
      props[objectName] = childObject;
    } else {
      Object.assign(props, childObject);
    }
  });

  return props;
};

export default createElement;
