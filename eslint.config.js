import js from "@eslint/js";
import globals from "globals";
import prettierConfig from "eslint-config-prettier";

export default [
    js.configs.recommended,
    {
        files: ["src/**/*.js"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: { ...globals.node },
        },
    },
    {
        files: ["public/**/*.js"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "script",
            globals: { ...globals.browser },
        },
    },
    prettierConfig,
];
