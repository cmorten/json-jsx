import parseProps from "./parseProps";
import isObject from "./isObject";

jest.mock("./isObject", () => jest.fn());

const mockProps = {
  "test-undefined-prop-key": undefined,
  "test-null-prop-key": null,
  "test-string-prop-key": "test-string-prop-value",
  "test-number-prop-key": 123456,
  "test-symbol-prop-key": Symbol("test-symbol-prop-value"),
  "test-object-prop-key": {},
  "test-array-prop-key": [],
};

describe("parseProps", () => {
  let result;

  const commonAssertions = () => {
    it("should call isObject with the passed props", () => {
      expect(isObject).toHaveBeenCalledWith(mockProps);
    });
  };

  describe("when the props are not an object", () => {
    beforeEach(() => {
      isObject.mockReturnValue(false);
      result = parseProps(mockProps);
    });

    commonAssertions();

    it("should return an empty object", () => {
      expect(result).toEqual({});
    });
  });

  describe("when the props are an object", () => {
    beforeEach(() => {
      isObject.mockReturnValue(true);
      result = parseProps(mockProps);
    });

    commonAssertions();

    it("should return the props object with all undefined entries removed", () => {
      const { ["test-undefined-prop-key"]: _, ...expectedProps } = mockProps;

      expect(result).toEqual(expectedProps);
    });
  });
});
