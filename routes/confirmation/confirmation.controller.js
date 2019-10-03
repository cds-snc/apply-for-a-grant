const path = require('path')
const {
  validateRouteData,
  getRouteByName,
  addViewPath,
  getViewData,
  setFlashMessageContent,
} = require('../../utils/index')

module.exports = app => {
  const name = 'confirmation'
  const route = getRouteByName(name)

  addViewPath(app, path.join(__dirname, './'))

  app.get(route.path, async (req, res) => {
    // ⚠️ experimental
    // validate data from previous step
    // see if we should be allowed to reach this step
    const viewData = getViewData(req);
    const date = new Date(1000*viewData.data.date);
    const dateString = date.toLocaleString("en-GB", {"year": "numeric", "month": "long", "day": "numeric"})
    const { Schema } = require('../step-1/schema.js')
    const result = await validateRouteData(req, Schema)
    if (!result.status) {
      setFlashMessageContent(req, result.errors)
      return res.redirect(getRouteByName('step-1').path)
    }

    res.render(name, getViewData(req, {dateString: dateString}))
  })
}
