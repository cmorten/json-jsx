import { JSX_FRAGEMENT_TYPE } from "../symbols";
import parseProps from "./parseProps";
import parseChildren from "./parseChildren";
import checkProps from "./checkProps";
import createFragment from "./createFragment";
import createElement from "./createElement";

const createObject = (component, props, ...children) => {
  if (typeof component === "undefined" || component === null) {
    return null;
  }

  props = parseProps(props);
  children = parseChildren(children);

  checkProps(component, {
    ...props,
    children,
  });

  if (typeof component === "function") {
    return component({
      ...props,
      children,
    });
  }

  return component === JSX_FRAGEMENT_TYPE
    ? createFragment(children)
    : createElement(component, props, children);
};

export default createObject;
