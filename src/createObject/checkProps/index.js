import { checkPropTypes } from "prop-types";
import getComponentName from "./getComponentName";

const checkProps = (component, propsAndChildren) => {
  if (component.PropTypes) {
    const componentName = getComponentName(component);

    checkPropTypes(
      component.PropTypes,
      propsAndChildren,
      "prop",
      componentName
    );
  }
};

export default checkProps;
