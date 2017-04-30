const SVGO = require('svgo')
const camelCase = require('camel-case')

/**
 * Constants
 */

const ATTRIBUTES_REGEX = /[\w-:]+(?=\s*=\s*".*?")/g

const DEFAULT_CONFIG = {
  removeDoctype: true,
  removeEmptyContainers: true,
  convertStyleToAttrs: true,
  removeUselessDefs: true,
  removeMetadata: true,
  removeEmptyAttrs: true,
  cleanupEnableBackground: true,
  removeUnknownsAndDefaults: true,
  removeScriptElement: true,
  removeStyleElement: true,
  cleanupAttrs: true,
  convertColors: true,
  cleanupIDs: true,
}

const CUSTOM_ATTRIBUTES = {
  class: 'className',
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
    (resolve, reject) => svgo.optimize(SVGString, ({ error, data }) => {

      if (error) reject(error)

      resolve(data)

    })
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
    const jsxAttribute = CUSTOM_ATTRIBUTES[attribute] ? CUSTOM_ATTRIBUTES[attribute] : camelCase(attribute)

    transformedSVG = transformedSVG.replace(regex, jsxAttribute)

  })

  return transformedSVG

}

/**
 * SVG {String}
 * @returns JSX valid SVG {String}
 */

const transform = (SVGString, config={}) => {

  const optimizerConfig = Object.assign({}, DEFAULT_CONFIG, config)

  return optimize(SVGString, createConfig(optimizerConfig))
    .then(JSXify)

}

module.exports = transform
