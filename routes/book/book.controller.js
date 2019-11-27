/*

@todo

- pull saved info from database i.e. email or sms
 --- pull based on id + XXXXX in link sent from previous step
- write date to hidden input
- send confirmation
*/

const path = require('path')
const { routeUtils, getClientJs } = require('./../../utils')
const { Schema } = require('./schema.js')

module.exports = app => {
  const name = 'book'
  const route = routeUtils.getRouteByName(name)

  routeUtils.addViewPath(app, path.join(__dirname, './'))

  const getData = (req, name) => {
    const jsPath = getClientJs(req, name)
    const jsFiles = jsPath ? [jsPath] : false
    const data = routeUtils.getViewData(req, {
      jsFiles: jsFiles,
      month: 'December',
      year: '2019',
    })

    return data
  }

  app
    .get(route.path, (req, res) => {
      global.getData = getData
      res.render(name, getData(req, name))
    })
    .post(route.path, [
      ...routeUtils.getDefaultMiddleware({ schema: Schema, name: name }),
    ])
}
