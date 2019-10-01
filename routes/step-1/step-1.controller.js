const path = require('path')
const { routeUtils, getClientJs } = require('./../../utils')
const { Schema } = require('./schema.js')

module.exports = app => {
  const name = 'step-1'
  const route = routeUtils.getRouteByName(name)

  routeUtils.addViewPath(app, path.join(__dirname, './'))

  app
    .get(route.path, (req, res) => {
      const jsPath = getClientJs(req, name)
      const jsFiles = jsPath ? [jsPath, 'js/file-input.js'] : false
      res.render(name, routeUtils.getViewData(req, { jsFiles: jsFiles }))
    })
    .post(
      route.path,
      routeUtils.getDefaultMiddleware({ schema: Schema, name: name }),
    )
}
