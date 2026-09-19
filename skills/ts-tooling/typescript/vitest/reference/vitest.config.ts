import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        reporters: ["dot"],
        silent: true,
        include: ["src/**/*.{spec,test}.ts"],
    },
});
