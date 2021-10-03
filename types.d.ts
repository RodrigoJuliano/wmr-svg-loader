declare module 'svg:*' {
	import { JSXInternal } from "preact/src/jsx";
	const el: (props : JSXInternal.IntrinsicElements['svg']) => JSX.Element;
	export default el;
}
