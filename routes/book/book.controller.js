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
const url = require('url');


const saveToDb = sessionData => {
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
}

const updateDb = (req, res, next) => {
  var sessionData = routeUtils.getViewData(req).data;
  if("id" in req.query && req.query.id !== "") {
    // appointment has been rescheduled
    sessionData.userId = req.query.id

    Submission.get(sessionData.userId, (err, data) => {
      if(err) {
        console.log("error: " + err)
      }
      ["fullname", "email", "phone_number", "address", "grant_type", "notify_type"].forEach(k => {
        // eslint-disable-next-line security/detect-object-injection
        sessionData[k] = data[k]
      })
      console.log(sessionData)
      saveToDb(sessionData)
      next()
    })
  } else {
    saveToDb(sessionData)
    next()
  }
}

const customRedirect = name => (req, res, next) => {
  if("id" in req.query && req.query.id !== "") {
    // appointment has been rescheduled
    res.redirect(
      url.format({
        pathname: "/confirmation",
        query: req.query,
      })
    )
  }
  // appointment is being scheduled for the 1st time 
  doRedirect(name)(req, res, next)
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
      updateDb,
      customRedirect(name),
    ])
}
