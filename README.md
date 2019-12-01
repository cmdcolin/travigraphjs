# cra_starter_pack

Xref https://github.com/facebook/create-react-app/issues/1217

I wanted a simple sort of setup where I can run eslint from the command line also (e.g. `yarn lint`), and have prettier also (where prettier is autofixed by linter too)

I ended up with something like this

```
create-react-app myapp
cd myapp
yarn add -D eslint-config-prettier eslint-plugin-prettier prettier
```


Then I had the .eslintrc and .prettierrc manually setup

.eslintrc
```
{
  "plugins": [
    "prettier",
    "react"
  ],
  "extends": [
    "prettier",
    "eslint:recommended",
    "plugin:react/recommended"
  ],
  "rules": {
    "prettier/prettier": "error"
  },
  "settings": {
    "react": {
      "version": "detect"
    }
  },
  "parserOptions": {
    "ecmaVersion": 7,
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true,
      "modules": true
    }
  }
}
```


.prettierrc
```
{
  "trailingComma": "es5",
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2
}
```


This worked nicely also with vim and ALE where it just has eslint configured as a fixer


```
let g:ale_fixers = {'typescript':['eslint'],'javascript': ['eslint']}
let g:ale_fix_on_save = 1
let g:ale_lint_on_text_changed = 'never'
```

The typescript above would probably work well with typescript-eslint was additionally configured


