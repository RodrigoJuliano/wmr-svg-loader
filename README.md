# wmr-svg-loader:  WIP
A port of [preact-svg-loader](https://github.com/VuexLtd/preact-svg-loader) to [wmr](https://wmr.dev/). Load svg files as preact components.

## Install
```bash
npm i --save-dev wmr-svg-loader
```
or
```bash
yarn add --dev wmr-svg-loader
```

## Usage

Add the plugin to your `wmr.config.mjs`.
```js
import { defineConfig } from 'wmr';
import svgLoaderPlugin from 'wmr-svg-loader';

export default defineConfig({
  plugins: [svgLoaderPlugin()],
});
```

In your code, use the prefix `svg:` to import the svg as a component.
```jsx
import Logo from 'svg:./logo.svg';

() => <Logo />
```

The prefix is customizable.
```js
plugins: [svgLoaderPlugin({ importPrefix: 'myprefix:' })],
```

You can also use in combination with `lazy` to enable code spliting, generating a js file to each svg.
```jsx
import { lazy, ErrorBoundary } from 'preact-iso';

const Logo = lazy(() => import('svg:./logo.svg'));

() => (
    <ErrorBoundary>
        <Logo />
    <ErrorBoundary/>
);
```