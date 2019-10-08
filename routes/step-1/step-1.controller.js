const { routeUtils } = require('./../../utils')
const { Schema } = require('./schema.js')
const { Submission } = require('../../db/model')

const saveToDb = (req, res, next) => {
  req.session.formdata.userId = Math.random().toString().split(".")[1].slice(0, 10);
  var sessionData = routeUtils.getViewData(req).data;
  
  const entry = new Submission({
    id: sessionData.userId,
    fullname: sessionData.fullname,
    email: sessionData.email,
    phone_number: sessionData.phone_number,
    address: sessionData.address,
    grant_type: sessionData.grant_type,
    notify_type: sessionData.notify_type,
  })
  entry.save()
  return next()
}

module.exports = (app, route) => {
  route.draw(app)
    .get(async (req, res) => {
      res.render(
        route.name,
        routeUtils.getViewData(req),
      )
    })
    .post(
      route.applySchema(Schema),
      saveToDb,
      route.doRedirect()
    )
}
