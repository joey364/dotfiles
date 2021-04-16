# React Proptypes Intellisense README

[![Build Status](https://travis-ci.org/of-human-bondage/react-proptypes-intellisense.svg?branch=master)](https://travis-ci.org/of-human-bondage/react-proptypes-intellisense) [![Build status](https://ci.appveyor.com/api/projects/status/gxr50is52835550r?svg=true)](https://ci.appveyor.com/project/tempora-mutantur/react-proptypes-intellisense) [![codecov](https://codecov.io/gh/of-human-bondage/react-proptypes-intellisense/branch/master/graph/badge.svg)](https://codecov.io/gh/of-human-bondage/react-proptypes-intellisense)

## Features

The extension finds React PropTypes and adds them to the suggestion list.

![react-proptypes-intellisense](https://github.com/of-human-bondage/react-proptypes-intellisense/raw/master/images/ReactProptypesIntelliSense.gif)

It works for all implementations of the "PropTypes" feature, i.e. static propTypes, proptypes from a prototype, etc.

## Problems

If the extension doesn't work try to configure jsconfig.json.

Your imports have to be resolved to work with this extension:

```json
{
    "compilerOptions": {
        "jsx": "react",
        "baseUrl": "./src/js"
    }
}
```

"baseUrl" - base directory to resolve imports
