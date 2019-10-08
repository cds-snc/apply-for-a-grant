const {
  validateRouteData,
  routeUtils,
  setFlashMessageContent,
} = require('../../utils/index')

module.exports = (app, route) => {
  route.draw(app)
    .get(async (req, res) => {
      // ⚠️ experimental
      // validate data from previous step
      // see if we should be allowed to reach this step
      const { Schema } = require('../step-1/schema.js')
      const result = await validateRouteData(req, Schema)
      if (!result.status) {
        setFlashMessageContent(req, result.errors)
        route.doRedirect((req, res, next) => {return "step-1"})
      }
      var viewData = routeUtils.getViewData(req);
      const date = new Date(1000*(+viewData.data.date));
      viewData.dateString = date.toLocaleString("en-GB", {"year": "numeric", "month": "long", "day": "numeric"})
      res.render(route.name, viewData)
  })
}
