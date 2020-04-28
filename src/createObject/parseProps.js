import isObject from "./isObject";

const parseProps = (props) =>
  isObject(props)
    ? Object.fromEntries(
        Object.entries(props).filter(
          ([key, value]) => typeof value !== "undefined" && key !== "children"
        )
      )
    : {};

export default parseProps;
