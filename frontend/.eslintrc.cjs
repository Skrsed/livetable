/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution")

module.exports = {
  root: true,
  "extends": [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "@vue/eslint-config-typescript",
  ],
  rules: {
    "vue/script-indent": ["error", 4, { "baseIndent": 0 }],
    "max-len": ["error", 80, 2, {
      ignoreComments: false,
      ignoreRegExpLiterals: true,
      ignoreStrings: false,
      ignoreTemplateLiterals: false,
    }],
    "vue/html-indent": ["error", 4, {
      "attribute": 1,
      "baseIndent": 0,
      "closeBracket": 0,
      "alignAttributesVertically": false,
      "ignores": []
    }],
    "vue/max-attributes-per-line": ["error", {
      "singleline": {
        "max": 1
      },      
      "multiline": {
        "max": 1
      }
    }],
    "vue/multi-word-component-names": ["error", {
      "ignores": ["default"]
    }]
  },
  parserOptions: {
    ecmaVersion: "latest"
  }
}
