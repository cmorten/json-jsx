import * as PropTypes from "prop-types";

export = JsonJsx;
export as namespace JsonJsx;

declare namespace JsonJsx {
  /**
   * Returns the values of an array.
   */
  type ValuesOf<T extends any[]> = T[number];

  /**
   * PropTypes Validator.
   */
  type Validator<T> = PropTypes.Validator<T>;

  type WeakValidationMap<T> = {
    [K in keyof T]?: null extends T[K]
      ? Validator<T[K] | null | undefined>
      : undefined extends T[K]
      ? Validator<T[K] | null | undefined>
      : Validator<T[K]>;
  };

  interface Attributes {}

  /**
   * Props extended with the optional children property.
   */
  type PropsWithChildren<P> = P & { children?: Node };

  /**
   * A FunctionComponent accepts props (with optional children)
   * and returns an Element or null.
   *
   * Prop types and display name can also be optionally provided
   * for validation purposes.
   */
  interface FunctionComponent<P = {}> {
    (props: PropsWithChildren<P>): Element | null;
    propTypes?: WeakValidationMap<PropsWithChildren<P>>;
    displayName?: string;
  }

  /**
   * The return value of jsonJsx.createObject, which is either
   * an object or Fragment element.
   */
  type Element<P extends {} = {}, C extends any[] = any[]> =
    | ObjectElement<P, C>
    | FragmentElement<C>;

  /**
   * Objects returned from jsonJsx.createObject are formed of
   * the passed props merged with the values from the children and
   * / or the values from the children assigned to a key.
   */
  type ObjectElement<P extends any = any, C extends any[] = any[]> =
    | P
    | ValuesOf<C>
    | { [key: string]: ValuesOf<C> };

  /**
   * Fragments returned from jsonJsx.createObject are the children.
   */
  type FragmentElement<C extends any[] = any[]> = C;

  /**
   * The return value of a component is a Node. This is either a child
   * node, a fragment node, or another primitive type, usually null.
   */
  type Node = ChildNode | FragmentNode | boolean | null | undefined;

  /**
   * Child nodes are elements.
   */
  type ChildNode = Element | string | number;

  /**
   * A Fragment node can be empty of is an array of Nodes.
   */
  type FragmentNode = {} | NodeArray;

  /**
   * A NodeArray is an array of Nodes, the type for a non-empty Fragment
   * or a children array.
   */
  interface NodeArray extends Array<Node> {}

  /**
   * The Fragment export itself is a Symbol. It is unlikely this will be
   * needed if consumers use JSX syntax as it is an internal implementation
   * of the JSX Fragment Pragma.
   */
  type FragmentType = symbol;
  const Fragment: FragmentType;

  /**
   * The createObject function is used for the JSX Pragma implementation
   * to create JSON from a type, props and children.
   *
   * @param {string} type Name of the component, used as the key in parent JSON.
   * @param {object | null} props Object containing key-value pairs to assign to constructed JSON.
   * @param {Node[]} children Array of children elements. These are merged into the constructed JSON depending on their type. If child is a component then it will be assigned to it's component name in the JSON, otherwise all properties of the child are spread into the constructed JSON.
   *
   * @returns {Element} A JSON element.
   */
  function createObject<P extends {}, C extends Node[] = Node[]>(
    type: string,
    props?: (Attributes & P) | null,
    ...children: C
  ): ObjectElement<P, C>;

  /**
   * The createObject function is used for the JSX Pragma implementation
   * to create JSON from a type, props and children.
   *
   * @param {FunctionComponent} type A function component. This will invoked using the provided props and children and the resulting JSON returned.
   * @param {object | null} props Object containing key-value pairs to assign to constructed JSON.
   * @param {Node[]} children Array of children elements. These are merged into the constructed JSON depending on their type. If child is a component then it will be assigned to it's component name in the JSON, otherwise all properties of the child are spread into the constructed JSON.
   * 
   * @returns {Element} A JSON element.
   */
  function createObject<P extends {}, C extends Node[] = Node[]>(
    type: FunctionComponent<P>,
    props?: (Attributes & P) | null,
    ...children: C
  ): Element<P, C>;

  /**
   * The createObject function is used for the JSX Pragma implementation
   * to create JSON from a type, props and children.
   *
   * @param {FragmentType} type A Fragment.
   * @param {object | null} props An ignored argument. Props are not used in Fragment components.
   * @param {Node[]} children Array of children elements which are returned as the output of this method.
   * 
   * @returns {FragmentElement} A JSON element.
   */
  function createObject<P extends {}, C extends Node[] = Node[]>(
    type: FragmentType,
    props?: (Attributes & P) | null,
    ...children: C
  ): FragmentElement<C>;
}

declare global {
  namespace JSX {
    interface Element extends JsonJsx.Element<any, any> {}

    interface ElementAttributesProperty {
      props: {};
    }

    interface ElementChildrenAttribute {
      children: {};
    }

    interface IntrinsicAttributes extends JsonJsx.Attributes {}

    interface IntrinsicElements {
      [elementName: string]: any;
    }
  }
}
