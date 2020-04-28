const isObject = (objectLike) =>
  Object.prototype.toString.call(objectLike) === "[object Object]";

export default isObject;
