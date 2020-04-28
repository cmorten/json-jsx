import checkProps from "./";
import { checkPropTypes } from "prop-types";
import getComponentName from "./getComponentName";

jest.mock("prop-types", () => ({
  checkPropTypes: jest.fn(),
}));
jest.mock("./getComponentName", () => jest.fn());

const mockComponentName = Symbol("test-component-name");
const mockPropTypes = Symbol("test-prop-types");
const mockPropsAndChildren = Symbol("test-props-and-children");

describe("checkProps", () => {
  let mockComponent;

  beforeEach(() => {
    getComponentName.mockReturnValue(mockComponentName);
    mockComponent = jest.fn();
  });

  describe("when the component does not have PropTypes", () => {
    beforeEach(() => {
      checkProps(mockComponent, mockPropsAndChildren);
    });

    it("should not call getComponentName", () => {
      expect(getComponentName).not.toHaveBeenCalled();
    });

    it("should not call checkPropTypes", () => {
      expect(checkPropTypes).not.toHaveBeenCalled();
    });
  });

  describe("when the component does have PropTypes", () => {
    beforeEach(() => {
      mockComponent.PropTypes = mockPropTypes;

      checkProps(mockComponent, mockPropsAndChildren);
    });

    it("should call getComponentName with the component", () => {
      expect(getComponentName).toHaveBeenCalledWith(mockComponent);
    });

    it("should call checkPropTypes with the component's PropTypes, the passed propsAndChildren, the `prop` signifier and the component name", () => {
      expect(checkPropTypes).toHaveBeenCalledWith(
        mockComponent.PropTypes,
        mockPropsAndChildren,
        "prop",
        mockComponentName
      );
    });
  });
});
