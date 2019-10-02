const path = require('path')
const { routeUtils } = require('./../../utils')
const { doRedirect } = require('./../../utils/route.helpers')
const { checkErrors } = require('./../../utils/validate.helpers')
const { checkSchema } = require('express-validator')
const { Schema } = require('./schema.js')
const { Submission } = require('../../db/model')

const saveToDb = (req, res, next) => {
  const randomId = Math.random().toString().split(".")[1].slice(0, 10);
  const entry = new Submission({
    id: randomId,
    fullname: req.body.fullname,
    email: req.body.email,
    phone_number: req.body.phone_number,
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
        checkSchema(Schema),
        checkErrors(name),
        saveToDb,
        doRedirect(name),
      ],
    )
}
