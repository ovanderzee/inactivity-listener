// rollup.config.js
import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser'
import commonjs from '@rollup/plugin-commonjs'
import dts from 'rollup-plugin-dts';

const name = 'inactivityListener'

export default [
    {
        input: `src/index.ts`,
        output: [
        {
            file: `dist/${name}.js`,
            format: 'umd',
            name: name,
            sourcemap: true,
        },
        {
            file: `module/${name}.js`,
            format: 'esm',
            name: name,
            sourcemap: true,
        },
        ],
        plugins: [
            typescript(),
            commonjs({
                // to read umd dependencies
                include: 'node_modules/**',
            }),
            terser(),
        ],
    }, {
        input: "src/index.ts",
        output: {
            file: "types/index.d.ts",
            format: "es",
        },
        plugins: [dts()],
    }
]
