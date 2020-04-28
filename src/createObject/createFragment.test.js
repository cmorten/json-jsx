import createFragment from "./createFragment";

const mockChildren = Symbol("test-children");

describe("createFragment", () => {
  let result;

  beforeEach(() => {
    result = createFragment(mockChildren);
  });

  it("should return the passed children unchanged", () => {
    expect(result).toBe(mockChildren);
  });
});
