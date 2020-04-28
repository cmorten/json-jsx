const MockChildComponent = ({ testProp }) => (
  <>
    <test-child-in-fragment-1 testProp={testProp} />
    <test-child-in-fragment-2 testProp={testProp} />
  </>
);

const MockComponent = ({ testProp }) => (
  <test-top-level-component-should-be-ignored
    topLevelProp={"test-top-level-prop"}
  >
    <test-top-level-child-with-prop testProp={"test-top-level-child-prop"} />
    <test-top-level-child-with-child>
      <MockChildComponent testProp={testProp} />
    </test-top-level-child-with-child>
    <test-top-level-child-with-list-child>
      {{ list: <MockChildComponent testProp={testProp} /> }}
    </test-top-level-child-with-list-child>
  </test-top-level-component-should-be-ignored>
);

const mockProp = Symbol("test-prop");

describe("E2E: json-jsx", () => {
  it("should convert json-jsx to JSON", () => {
    expect(<MockComponent testProp={mockProp} />).toEqual({
      topLevelProp: "test-top-level-prop",
      "test-top-level-child-with-prop": {
        testProp: "test-top-level-child-prop",
      },
      "test-top-level-child-with-child": {
        "test-child-in-fragment-1": {
          testProp: mockProp,
        },
        "test-child-in-fragment-2": {
          testProp: mockProp,
        },
      },
      "test-top-level-child-with-list-child": {
        list: [
          {
            testProp: mockProp,
          },
          {
            testProp: mockProp,
          },
        ],
      },
    });
  });
});
