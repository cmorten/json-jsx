# json-jsx

A JSX library for creating JSON.

## Contents

<!-- toc -->

- [About](#about)
- [Usage](#usage)
  - [Getting Started](#getting-started)
  - [APIs](#apis)
    - [createObject](#createobject)
      - [Options](#options)
- [Developing](#developing)
  - [Install](#install)
  - [Build](#build)
  - [Test](#test)
  - [Lint](#lint)
- [Contributing](#contributing)
- [Changelog](#changelog)

<!-- tocstop -->

## About

This repository provides a JSX pragma for writing JSON as component based code in the same way you might write HTML + JS with React.

This allows you to define elegant, re-usable and composable components for your JSON.

## Usage

### Getting Started

Install this package using npm / yarn.

```console
yarn add json-jsx
```

The recommended way to use this package is with JSX in your codebase. This can be achieved by using the [@babel/plugin-transform-react-jsx](https://babeljs.io/docs/en/babel-plugin-transform-react-jsx) and [babel-plugin-jsx-pragmatic](https://www.npmjs.com/package/babel-plugin-jsx-pragmatic) plugins.

Add the babel plugins to your codebase:

```console
yarn add -D @babel/plugin-transform-react-jsx babel-plugin-jsx-pragmatic
```

And update your `.babelrc` to use the JSX babel plugins:

```json
{
  "plugins": [
    [
      "@babel/plugin-transform-react-jsx",
      {
        "pragma": "jsx",
        "pragmaFrag": "jsxFrag"
      }
    ],
    [
      "babel-plugin-jsx-pragmatic",
      {
        "module": "json-jsx",
        "import": "jsx",
        "export": "createObject"
      },
      "jsx"
    ],
    [
      "babel-plugin-jsx-pragmatic",
      {
        "module": "json-jsx",
        "import": "jsxFrag",
        "export": "Fragment"
      },
      "jsxFrag"
    ]
  ]
}
```

You can now use JSX and JSX Fragments `<></>` in your codebase and Babel will parse the JSX using the `json-jsx` pragmas.

See below for an example of various ways you can use this syntax.

```jsx
const EslintExtensions = ({ children }) => ({ extends: children });
const EslintPlugins = ({ plugins }) => ({ plugins });

const CommonRules = () => (
  <>
    {{ "import/no-extraneous-dependencies": "error" }}
    {{ "no-console": "warn" }}
  </>
);

const ReactRules = () => ({
  "react/jsx-no-comment-textnodes": "error",
  "react/jsx-no-duplicate-props": "error",
});

const EslintRules = ({ isReact }) => (
  <rules>
    <CommonRules />
    {isReact && <ReactRules />}
  </rules>
);

const defaultPlugins = ["import", "jest", "prettier"];

const MyEslintrcConfig = ({ isReact = true }) => {
  const plugins = isReact ? [...defaultPlugins, "react"] : defaultPlugins;

  return (
    <eslintrc parser={"babel-eslint"}>
      <env es6={true} jest={true} node={true} />
      <EslintExtensions>
        {"eslint:recommended"}
        {"plugin:import/recommended"}
        {"plugin:jest/recommended"}
        {"prettier"}
      </EslintExtensions>
      <EslintPlugins plugins={plugins} />
      <EslintRules isReact={isReact} />
      <parserOptions>
        <ecmaFeatures jsx={true} />
      </parserOptions>
    </eslintrc>
  );
};

console.log(<MyEslintConfig />);
/**
 * {
 *    parser: "babel-eslint",
 *    env: { es6: true, jest: true, node: true },
 *    extends: [
 *      "eslint:recommended",
 *      "plugin:import/recommended",
 *      "plugin:jest/recommended",
 *      "prettier"
 *    ],
 *    plugins: [ "import", "react", "jest", "prettier" ],
 *    rules: {
 *      "import/no-extraneous-dependencies": "error",
 *      "no-console": "warn",
 *      "react/jsx-no-comment-textnodes": "error",
 *      "react/jsx-no-duplicate-props": "error"
 *    },
 *    parserOptions: { ecmaFeatures: { jsx: true } }
 *  }
 */
```

### APIs

#### createObject

`createObject` is a JSX Pragma for creating JSON objects.

Using vanilla JS:

```js
import { createObject, Fragment } from "json-jsx";

/**
 * Evaluates to:
 *
 * {
 *   "myProp": "myPropValue",
 *   "childComponentName": {}
 * }
 *
 * Note that the `componentName` is not assigned as it is
 * the top level component.
 */
const myObjectWithStringComponent = createObject(
  "componentName",
  { myProp: "myPropValue" },
  [createObject("childComponentName")]
);

/**
 * Evaluates to:
 *
 * {
 *   "myProp": "myPropValue",
 *   "plain": "json children",
 *   "are": "merged",
 *   "including": [{
 *     "array": "values"
 *   }]
 * }
 *
 */
const myObjectWithJsonChildren = createObject(
  "componentName",
  { myProp: "myPropValue" },
  [
    { plain: "json children" },
    { are: "merged", including: [{ array: "values" }] },
  ]
);

const MyFunctionalComponent = ({ children, ...props }) =>
  createObject("fnComponentName", props, children);

/**
 * Evaluates to:
 *
 * {
 *   "myFnProp": "myFnPropValue",
 *   "componentName": {
 *     "myProp": "myPropValue",
 *     "childComponentName": {}
 *   }
 * }
 *
 * Note that `componentName` is used here because it is a
 * child component to the `fnComponentName` component.
 */
const myObjectWithFunctionalComponent = createObject(
  MyFunctionalComponent,
  { myFnProp: "myFnPropValue" },
  [myObjectWithStringComponent]
);

/**
 * Fragments enable array-like constructions.
 */

/**
 * Used by themselves, sub-components are assigned to an
 * array.
 *
 * Evaluates to:
 *
 * [
 *   {
 *     "myProp": "myPropValue"
 *   },
 *   {
 *     "myProp": "myPropValue"
 *   }
 * ]
 */
const myArrayUsingFragments = createObject(
  Fragment,
  {},
  createObject("componentName", { myProp: "myPropValue" }),
  createObject("componentName", { myProp: "myPropValue" })
);

/**
 * Within the scope of an outer object, the Fragment acts
 * transparently, as if it were not there.
 *
 * Evaluates to:
 *
 * {
 *   "componentName1": {
 *     "myProp": "myPropValue"
 *   },
 *   "componentName2": {
 *     "myProp": "myPropValue"
 *   }
 * }
 */
const myObjectUsingFragments = createObject(
  "componentName",
  {},
  createObject(
    Fragment,
    {},
    createObject("componentName1", { myProp: "myPropValue" }),
    createObject("componentName2", { myProp: "myPropValue" })
  )
);
```

Equivalent using JSX:

```jsx
/**
 * Evaluates to:
 *
 * {
 *   "myProp": "myPropValue",
 *   "childComponentName": {}
 * }
 *
 * Note that the `componentName` is not assigned as it is
 * the top level component.
 */
const myObjectWithStringComponent = (
  <componentName myProp={"myPropValue"}>
    <childComponentName />
  </componentName>
);

/**
 * Evaluates to:
 *
 * {
 *   "myProp": "myPropValue",
 *   "plain": "json children",
 *   "are": "merged",
 *   "including": [{
 *     "array": "values"
 *   }]
 * }
 *
 */
const myObjectWithJsonChildren = (
  <componentName myProp={"myPropValue"}>
    {{ plain: "json children" }}
    {{ are: "merged", including: [{ array: "values" }] }}
  </componentName>
);

const MyFunctionalComponent = ({ children, ...props }) => (
  <fnComponentName {...props}>{children}</fnComponentName>
);

/**
 * Evaluates to:
 *
 * {
 *   "myFnProp": "myFnPropValue",
 *   "componentName": {
 *     "myProp": "myPropValue",
 *     "childComponentName": {}
 *   }
 * }
 *
 * Note that `componentName` is used here because it is a
 * child component to the `fnComponentName` component.
 */
const myObjectWithFunctionalComponent = (
  <MyFunctionalComponent myFnProp={"myFnPropValue"}>
    {myObjectWithStringComponent}
  </MyFunctionalComponent>
);

/**
 * Fragments enable array-like constructions.
 */

/**
 * Used by themselves, sub-components are assigned to an
 * array.
 *
 * Evaluates to:
 *
 * [
 *   {
 *     "myProp": "myPropValue"
 *   },
 *   {
 *     "myProp": "myPropValue"
 *   }
 * ]
 */
const myArrayUsingFragments = (
  <>
    <componentName myProp={"myPropValue"} />
    <componentName myProp={"myPropValue"} />
  </>
);

/**
 * Within the scope of an outer object, the Fragment acts
 * transparently as if it were not there.
 *
 * Evaluates to:
 *
 * {
 *   "componentName1": {
 *     "myProp": "myPropValue"
 *   },
 *   "componentName2": {
 *     "myProp": "myPropValue"
 *   }
 * }
 */
const myObjectUsingFragments = (
  <componentName>
    <>
      <componentName1 myProp={"myPropValue"} />
      <componentName2 myProp={"myPropValue"} />
    </>
  </componentName>
);
```

##### Options

| Argument | Description                                                                                                                                                                                                                                                                                                     |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| type     | A string name, functional component or `Fragment`. If a string is provided, the value is set as a key in the parent JSON object (unless this is the top level component, in which case the type is not used). If a functional component is provided, it is evaluated using the provided `props` and `children`. |
| props    | An object containing the properties that should be assigned against the `type` key in the JSON object.                                                                                                                                                                                                          |
| children | An array of objects. If the object is a plain JSON object, it will be merged into the object assigned against the `type` key. If the object is a component then it will be added to `type` object against a key of the component's name.                                                                        |

## Developing

### Install

```console
yarn install --frozen-lockfile
```

### Build

```console
yarn build
```

### Test

```console
yarn test
```

### Lint

```console
yarn lint
```

## Contributing

Please check out the [CONTRIBUTING](./docs/CONTRIBUTING.md) docs.

## Changelog

Please check out the [CHANGELOG](./docs/CHANGELOG.md) docs.

## Roadmap

Please check out the [ROADMAP](./docs/ROADMAP.md) docs.
