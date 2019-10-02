const path = require('path')
const { routeUtils } = require('./../../utils')
const { Schema } = require('./schema.js')
const { Submission } = require('../../db/model')

const saveToDb = (req, res, next) => {
  const randomId = Math.random().toString().split(".")[1].slice(0, 10);
  const entry = new Submission({
    id: randomId,
    fullname: req.body.fullname,
    email: req.body.email,
    phone_number: req.body.email,
    address: req.body.address,
    grant_type: req.body.grant_type,
    notify_type: req.body.notify_type,
  })
  entry.save()
  return next()
}

module.exports = app => {
  const name = 'step-1'
  const route = routeUtils.getRouteByName(name)

  routeUtils.addViewPath(app, path.join(__dirname, './'))

  app
    .get(route.path, (req, res) => {
      res.render(name, routeUtils.getViewData(req))
    })
    .post(
      route.path,
      [
        saveToDb,
        routeUtils.getDefaultMiddleware({ schema: Schema, name: name }),
      ],
    )
}
