const SVGO = require('svgo')
const { camelCase } = require('voca')

const ATTRIBUTES_REGEX = /[\w-:]+(?=\s*=\s*".*?")/g

const DEFAULT_CONFIG = {
  removeEmptyContainers: true,
  convertStyleToAttrs: true,
  removeUselessDefs: true,
  removeScriptElement: true,
  removeMetadata: true,
  removeEmptyAttrs: true,
  cleanupEnableBackground: true,
  removeStyleElement: true,
  cleanupAttrs: true,
  convertColors: true,
  cleanupIDs: true,
}

/**
 * Create config {Object}
 * @returns {Object}
 */

const createConfig = config => {

  const plugins = []

  Object.keys(config).map(prop => plugins.push({ [prop]: config[prop] }))

  return { plugins }

}

/**
 * SVG {String}
 * @returns optimized SVG {String}
 */

const optimize = (SVGString, config) => {

  const svgo = new SVGO(config)

  return new Promise(
    (resolve, reject) => svgo.optimize(SVGString, ({ data }) => resolve(data))
  )

}

/**
 * SVG {String}
 * @returns SVG with camel case attributes {String}
 */

const JSXify = SVGString => {

  let transformedSVG = SVGString
  const attributes = SVGString.match(ATTRIBUTES_REGEX)

  attributes.forEach(attribute => {

    const regex = new RegExp(attribute, 'g')
    const jsxAttribute = camelCase(attribute)

    transformedSVG = transformedSVG.replace(regex, jsxAttribute)

  })

  return transformedSVG

}

/**
 * SVG {String}
 * @returns JSX valid SVG {String}
 */

const transform = (SVGString, config) => {

  const optimizerConfig = Object.assign({}, DEFAULT_CONFIG, config)

  return optimize(SVGString, createConfig(optimizerConfig))
    .then(JSXify)

}

const SVGString = `<svg id="Layer_1" xlink:href="#test21" shape-rendering="crispEdges" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 396.218 396.218" style="enable-background:new 0 0 396.218 396.218;" xml:space="preserve">
  <path style="fill:#193651;" d="M242.941,37.075l-9.891,7.434l12.347,16.097c-27.216-6.206-55.661-4.978-81.584,4.331l4.331,11.766 c24.76-8.663,51.911-9.891,77.253-3.103l-17.907,13.576l7.434,9.891l34.004-25.341L242.941,37.075z"/>
</svg>`

transform(SVGString, { cleanupIDs: true }).then(data => console.log(data))