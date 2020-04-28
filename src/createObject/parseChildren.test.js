import parseChildren from "./parseChildren";

const mockArrayWithSimpleElements = [
  undefined,
  null,
  "test-string-child",
  123456,
  Symbol("test-symbol-child"),
];

const mockArrayWithNestedArrays = [
  mockArrayWithSimpleElements,
  mockArrayWithSimpleElements,
];

describe("parseChildren", () => {
  describe.each`
    children                       | childrenDescription | expected                                                            | expectedDescription
    ${undefined}                   | ${"undefined"}      | ${[]}                                                               | ${"an empty array"}
    ${null}                        | ${"null"}           | ${[]}                                                               | ${"an empty array"}
    ${mockArrayWithSimpleElements} | ${"a simple array"} | ${mockArrayWithSimpleElements}                                      | ${"the passed array"}
    ${mockArrayWithNestedArrays}   | ${"a 2D array"}     | ${[...mockArrayWithSimpleElements, ...mockArrayWithSimpleElements]} | ${"a flattened version of the passed array"}
  `(
    "when the passed children is $childrenDescription",
    ({ children, expected, expectedDescription }) => {
      it(`should return ${expectedDescription}`, () => {
        expect(parseChildren(children)).toEqual(expected);
      });
    }
  );
});
