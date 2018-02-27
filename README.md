# Notes

## Instalação do app

```
$ cd app/
$ npm install
$
$ # react-native-vector-icons issue (Error: While resolving module `react-native-vector-icons/...)
$ # https://github.com/oblador/react-native-vector-icons/issues/626
$ rm ./node_modules/react-native/local-cli/core/__fixtures__/files/package.json
$ 
$ react-native run-android # ou react-native run-ios
```

