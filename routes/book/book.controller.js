const path = require('path')
const { routeUtils, getClientJs } = require('./../../utils')
const { Schema } = require('./schema.js')

module.exports = app => {
  const name = 'book'
  const route = routeUtils.getRouteByName(name)

  routeUtils.addViewPath(app, path.join(__dirname, './'))

  app
    .get(route.path, (req, res) => {
      const jsPath = getClientJs(req, name)
      const jsFiles = jsPath ? [jsPath] : false
      const data = routeUtils.getViewData(req, {
        jsFiles: jsFiles,
        month: 'September',
        year: '2019',
      })

      console.log(data)
      res.render(name, data)
    })
    .post(route.path, [
      ...routeUtils.getDefaultMiddleware({ schema: Schema, name: name }),
    ])
}
