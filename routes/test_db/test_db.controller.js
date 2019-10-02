const path = require('path')
const { routeUtils } = require('./../../utils')
const { Submission } = require('../../db/model')

module.exports = app => {
  const name = 'test_db'
  const route = routeUtils.getRouteByName(name)

  routeUtils.addViewPath(app, path.join(__dirname, './'))

  const entry = new Submission({
    id: 1,
    fullname: 'Mr. Test 3',
  })

  entry.save()

  app.get(route.path, (req, res) => {
    res.render(name)
  })
}
