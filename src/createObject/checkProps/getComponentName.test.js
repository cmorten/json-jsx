import getComponentName from "./getComponentName";

const mockName = Symbol("test-name");

describe("getComponentName", () => {
  let mockComponent;

  beforeEach(() => {
    mockComponent = () => {};
  });

  describe("when a displayName is defined", () => {
    beforeEach(() => {
      mockComponent.displayName = mockName;
    });

    it("should return the displayName", () => {
      expect(getComponentName(mockComponent)).toEqual(mockName);
    });
  });

  describe("when a displayName is not defined", () => {
    beforeEach(() => {
      mockComponent.displayName = undefined;
    });

    describe("when the component has a name", () => {
      beforeEach(() => {
        /**
         * No-op: mockComponent will already have a name equal
         * to it's assigned variable.
         */
      });

      it("should return the displayName", () => {
        expect(getComponentName(mockComponent)).toEqual(mockComponent.name);
      });
    });

    describe("when the component does not have a name (unlikely to happen, but there are scenarios such as below - guess if someone is being super functional or something)", () => {
      beforeEach(() => {
        mockComponent = (() => () => {})();
      });

      it("should return the component's constructor name", () => {
        expect(getComponentName(mockComponent)).toEqual(
          mockComponent.constructor.name
        );
      });
    });
  });
});
