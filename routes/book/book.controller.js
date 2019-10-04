/*

@todo

- pull saved info from database i.e. email or sms
 --- pull based on id + XXXXX in link sent from previous step
- write date to hidden input
- send confirmation
*/

const path = require('path')
const { routeUtils, getClientJs, doRedirect, checkErrors } = require('./../../utils')
const { Schema } = require('./schema.js')
const { checkSchema } = require('express-validator')
const { Submission } = require('../../db/model')

const saveToDb = (req, res, next) => {
  var sessionData = routeUtils.getViewData(req).data;
  if(sessionData.userId === "") {
    console.log("WTF")
  }
  const entry = new Submission({
    id: sessionData.userId,
    date: sessionData.date,
    time: sessionData.time,
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

module.exports = app => {
  const name = 'book'
  const route = routeUtils.getRouteByName(name)

  routeUtils.addViewPath(app, path.join(__dirname, './'))

  const getData = (req, name) => {
    const jsPath = getClientJs(req, name)
    const jsFiles = jsPath ? [jsPath] : false
    const data = routeUtils.getViewData(req, {
      jsFiles: jsFiles,
      month: 'October',
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
      checkSchema(Schema),
      checkErrors(name),
      saveToDb,
      doRedirect(name),
    ])
}
