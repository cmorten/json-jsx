import { JSX_FRAGEMENT_TYPE } from "../symbols";
import parseProps from "./parseProps";
import parseChildren from "./parseChildren";
import checkProps from "./checkProps";
import createFragment from "./createFragment";
import createElement from "./createElement";

const createObject = (type, props, ...children) => {
  if (typeof type === "undefined" || type === null) {
    return null;
  }

  props = parseProps(props);
  children = parseChildren(children);

  checkProps(type, {
    ...props,
    children,
  });

  if (typeof type === "function") {
    return type({
      ...props,
      children,
    });
  }

  return type === JSX_FRAGEMENT_TYPE
    ? createFragment(children)
    : createElement(type, props, children);
};

export default createObject;
