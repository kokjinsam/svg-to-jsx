# SVG to JSX 🌓
> Tiny module for transforming SVG to valid JSX

[![npm version](https://badge.fury.io/js/%40balajmarius%2Fsvg-to-jsx.svg)](https://badge.fury.io/js/%40balajmarius%2Fsvg-to-jsx)

### Install ⚙

```
yarn add @balajmarius/svg-to-jsx --dev
```

### Use 🛠

```
const fs = require('fs')
const path = require('path')
const transform = require('@balajmarius/svg-to-jsx')

const filepath = path.resolve(__dirname, 'test.svg')

fs.readFile(filepath, 'utf8', (error, data) => {

  if (error) throw new Error('😞 Something went wrong')

  // transform but keep ids
  return transform(data)
    .then(transformedSVG => console.log(transformedSVG))
    .catch(error => console.log(error))

})
```

### What it does ✅

- Convert attributes to valid JSX attributes
- Convert CSS to Javascript
- Convert CSS (fill, display, ..) to attributes
- Remove useless attributes

### TODO 📝

- [ ] Single/double quotes option
