import createObject from "./";
import parseProps from "./parseProps";
import parseChildren from "./parseChildren";
import checkProps from "./checkProps";
import { JSX_FRAGEMENT_TYPE } from "../symbols";
import createFragment from "./createFragment";
import createElement from "./createElement";

jest.mock("./parseProps", () => jest.fn((arg) => arg));
jest.mock("./parseChildren", () => jest.fn((arg) => arg));
jest.mock("./checkProps", () => jest.fn());
jest.mock("./createFragment", () => jest.fn());
jest.mock("./createElement", () => jest.fn());

const mockProps = { "test-props-key": Symbol("test-props-value") };
const mockChildren = [Symbol("test-child"), Symbol("test-child")];

describe("createObject", () => {
  let mockType;
  let result;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when the passed component is undefined", () => {
    beforeEach(() => {
      result = createObject(undefined);
    });

    it("should return null", () => {
      expect(result).toBeNull();
    });
  });

  describe("when the passed component is null", () => {
    beforeEach(() => {
      result = createObject(null);
    });

    it("should return null", () => {
      expect(result).toBeNull();
    });
  });

  describe("when the passed component is defined and non-null", () => {
    const commonAssertions = () => {
      it("should call parseProps with the passed props object", () => {
        expect(parseProps).toHaveBeenCalledWith(mockProps);
      });

      it("should call parseChildren with an array of all the passed children", () => {
        expect(parseChildren).toHaveBeenCalledWith(mockChildren);
      });

      it("should call checkProps with the component and an object containing the props entries and the children as a entry", () => {
        expect(checkProps).toHaveBeenCalledWith(mockType, {
          ...mockProps,
          children: mockChildren,
        });
      });
    };

    describe("when the component is a function", () => {
      const mockFunctionalComponentOutput = Symbol(
        "test-functional-component-output"
      );

      beforeEach(() => {
        mockType = jest.fn().mockReturnValue(mockFunctionalComponentOutput);
        result = createObject(mockType, mockProps, ...mockChildren);
      });

      commonAssertions();

      it("should invoke the functional component with an object containing the props entries and the children as a entry", () => {
        expect(mockType).toHaveBeenCalledWith({
          ...mockProps,
          children: mockChildren,
        });
      });

      it("should return the result of the functional component invokation", () => {
        expect(result).toEqual(mockFunctionalComponentOutput);
      });
    });

    describe("when the component is not a function", () => {
      describe("when the component is a Fragment", () => {
        const mockCreateFragmentOutput = Symbol("test-create-fragment-output");

        beforeEach(() => {
          mockType = JSX_FRAGEMENT_TYPE;
          createFragment.mockReturnValue(mockCreateFragmentOutput);
          result = createObject(mockType, mockProps, ...mockChildren);
        });

        commonAssertions();

        it("should call createFragment with the children", () => {
          expect(createFragment).toHaveBeenCalledWith(mockChildren);
        });

        it("should return the result of createFragment", () => {
          expect(result).toEqual(mockCreateFragmentOutput);
        });
      });

      describe("when the component is not a Fragment", () => {
        const mockCreateElementOutput = Symbol("test-create-element-output");

        beforeEach(() => {
          mockType = "test-component";
          createElement.mockReturnValue(mockCreateElementOutput);
          result = createObject(mockType, mockProps, ...mockChildren);
        });

        commonAssertions();

        it("should call createElement with the component, props and children", () => {
          expect(createElement).toHaveBeenCalledWith(
            mockType,
            mockProps,
            mockChildren
          );
        });

        it("should return the result of createElement", () => {
          expect(result).toEqual(mockCreateElementOutput);
        });
      });
    });
  });
});
