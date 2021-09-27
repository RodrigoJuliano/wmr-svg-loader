import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';

/** @type {import('rollup').RollupOptions} */
const config = {
    input: 'src/index.js',
    output: {
        dir: 'dist',
        format: 'cjs',
        exports: 'auto',
    },
    plugins: [
        nodeResolve(),
        commonjs({
            transformMixedEsModules: true,
        }),
        terser(),
    ],
};

export default config;
