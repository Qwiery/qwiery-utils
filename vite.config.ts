import {defineConfig} from "vite";
import dts from "vite-plugin-dts";
import * as path from "path";
import {nodePolyfills} from 'vite-plugin-node-polyfills'

export default defineConfig({
    plugins: [
        nodePolyfills(),
        dts({
            rollupTypes: true,
            entryRoot: "src",
            tsconfigPath: path.join(__dirname, "tsconfig.json"),
        }),
    ],
    resolve: {
        alias: [
            {
                find: "~",
                replacement: path.resolve(__dirname, "./src"),
            },
        ],
    },
    build: {
        rollupOptions: {
            external: ["fs"]
        },
        lib: {
            entry: path.resolve(__dirname, "src/index.ts"),
            fileName: "index",
            formats: ["es", "cjs"],
        },
    },
});
