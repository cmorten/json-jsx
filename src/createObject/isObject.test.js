import isObject from "./isObject";

function ObjectContrustorFunction() {
  this["test-object-constructor-key"] = "test-object-constructor-value";
}

describe("isObject", () => {
  it.each`
    input                                                         | expected
    ${undefined}                                                  | ${false}
    ${null}                                                       | ${false}
    ${"test-string"}                                              | ${false}
    ${123456}                                                     | ${false}
    ${Symbol("test-symbol")}                                      | ${false}
    ${() => {}}                                                   | ${false}
    ${["test-array"]}                                             | ${false}
    ${{ "test-object-literal-key": "test-object-literal-value" }} | ${true}
    ${new ObjectContrustorFunction()}                             | ${true}
  `("should return '$expected' when passed '$input'", ({ input, expected }) => {
    expect(isObject(input)).toEqual(expected);
  });
});
