import createElement from "./createElement";
import { JSX_COMPONENT_NAME_KEY } from "../symbols";

const mockComponent = Symbol("test-component");
const mockPlainObject = {
  [Symbol("test-plain-object-key")]: Symbol("test-plain-object-value"),
};
const mockComponentObject = {
  [JSX_COMPONENT_NAME_KEY]: "test-component-name",
  [Symbol("test-component-object-key")]: Symbol("test-component-object-value"),
};

describe("createElement", () => {
  let result;
  let mockProps;

  beforeEach(() => {
    mockProps = {
      "test-props-key": Symbol("test-props-value"),
    };
  });

  const commonAssertions = () => {
    it("should return the passed props object with the passed component value assigned `JSX_COMPONENT_NAME_KEY` property", () => {
      expect(result).toEqual(
        expect.objectContaining({
          ...mockProps,
          [JSX_COMPONENT_NAME_KEY]: mockComponent,
        })
      );
    });

    it("should set the `JSX_COMPONENT_NAME_KEY` property to be non-enumerable", () => {
      // eslint-disable-next-line no-prototype-builtins
      expect(result.propertyIsEnumerable(JSX_COMPONENT_NAME_KEY)).toBeFalsy();
    });
  };

  describe("when no children are passed", () => {
    beforeEach(() => {
      result = createElement(mockComponent, mockProps, []);
    });

    commonAssertions();
  });

  describe("when children are passed", () => {
    describe("and the child is null", () => {
      beforeEach(() => {
        result = createElement(mockComponent, mockProps, [null]);
      });

      commonAssertions();

      it("should return props", () => {
        expect(result).toEqual(expect.objectContaining(mockProps));
      });
    });

    describe("and the child is a component object", () => {
      beforeEach(() => {
        result = createElement(mockComponent, mockProps, [mockComponentObject]);
      });

      commonAssertions();

      it("should assign component children (with `JSX_COMPONENT_NAME_KEY` properties) to the props against a `JSX_COMPONENT_NAME_KEY` key", () => {
        expect(result).toEqual(
          expect.objectContaining({
            ...mockProps,
            [mockComponentObject[JSX_COMPONENT_NAME_KEY]]: mockComponentObject,
          })
        );
      });
    });

    describe("and the child is a plain object", () => {
      beforeEach(() => {
        result = createElement(mockComponent, mockProps, [mockPlainObject]);
      });

      commonAssertions();

      it("should merge plain children objects into the props", () => {
        expect(result).toEqual(
          expect.objectContaining({ ...mockProps, ...mockPlainObject })
        );
      });
    });

    describe("and there are both types of children", () => {
      beforeEach(() => {
        result = createElement(mockComponent, mockProps, [
          mockComponentObject,
          mockPlainObject,
        ]);
      });

      commonAssertions();

      it("should assign component children (with `JSX_COMPONENT_NAME_KEY` properties) to the props against a `JSX_COMPONENT_NAME_KEY` key", () => {
        expect(result).toEqual(
          expect.objectContaining({
            [mockComponentObject[JSX_COMPONENT_NAME_KEY]]: mockComponentObject,
          })
        );
      });

      it("should merge plain children objects into the props", () => {
        expect(result).toEqual(expect.objectContaining({ ...mockPlainObject }));
      });
    });
  });
});
