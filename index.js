const Svgo = require('svgo')
const cheerio = require('cheerio')
const camelCase = require('camel-case')
const transform = require('css-to-react-native')

/**
 * Config
 */

const CONFIG = {
  plugins: [
    { removeScriptElement: true },
    { removeStyleElement: true },
    { convertShapeToPath: false },
    { removeHiddenElems: false },
    { convertPathData: false },
    { mergePaths: false },
    { cleanupIDs: false },
    { removeTitle: true },
    { removeDesc: true },
  ]
}


/**
 * Constants
 */

const JSX_ATTRIBUTES = {
  class: 'className',
  viewbox: 'viewBox',
}

const REGEX = {
  QUOTE: /\"/g,
  WHITE_SPACE: /\s/g,
  JSX: /"({{)|(}})"/g,
}

const INLINE_STYLE = 'style'
const EMPTY_STRING = ''

/**
 * Parse CSS
 * @returns {Array}
 */

const parseCss = cssString => {

  const trimmedCss = cssString.replace(REGEX.WHITE_SPACE, EMPTY_STRING)
  const parsedCss = trimmedCss.split(';').map(proprieties => proprieties.split(':'))

  return parsedCss.filter(proprieties => proprieties.length > 1)

}

/**
 * Reactify CSS
 * @returns {Object}
 */

const transformCss = cssString => {

  const parsedCss = parseCss(cssString)
  const transformedCss = transform.default(parsedCss)
  const proprieties = Object.keys(transformedCss)

  const reactCss = proprieties.reduce((accumulator, proprietyName, index) => {

    const value = transformedCss[proprietyName]
    const separator = (index < proprieties.length-1) ? ',' : EMPTY_STRING

    return accumulator += `${proprietyName}:${JSON.stringify(value)}${separator}`

  }, EMPTY_STRING)

  return `{{${reactCss}}}`

}

/**
 * SVG {String}
 * @returns optimized SVG {String}
 */

const optimize = svgString => {

  const svgo = new Svgo(CONFIG)

  return new Promise((resolve, reject) => svgo.optimize(svgString, response => {

    const { error, data } = response

    if (error) reject(error)

    resolve(data)

  }))

}

/**
 * SVG {String}
 * @returns SVG with camel case attributes {String}
 */

const jsxify = svgString => {

  const parsedHtml = cheerio.load(svgString, { decodeEntities: false })
  const elements = parsedHtml('*')

  elements.each(function() {

    const currentElement = parsedHtml(this)
    const attributes = currentElement.attr()

    for (let attribute in attributes) {

      let attributeValue = attributes[attribute]
      let jsxAttribute = camelCase(attribute)

      if (JSX_ATTRIBUTES[attribute])
        jsxAttribute = JSX_ATTRIBUTES[attribute]

      if (attribute === INLINE_STYLE)
        attributeValue = transformCss(attributeValue)

      currentElement
        .removeAttr(attribute)
        .attr(jsxAttribute, attributeValue)

    }

  })

  const transformedSvg = parsedHtml.html()

  // replace quotes before and after {{}}
  return transformedSvg.replace(REGEX.JSX, '$1$2')

}

/**
 * SVG {String}
 * @returns JSX valid SVG {String}
 */

const svgToJsx = svgString => optimize(svgString)
  .then(jsxify)


module.exports = svgToJsx
