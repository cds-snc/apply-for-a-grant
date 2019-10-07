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

const updateDb = async (req, res, next) => {
  var sessionData = routeUtils.getViewData(req).data;
  if("id" in req.query && req.query.id !== "") {
    // appointment has been rescheduled
    sessionData.userId = req.query.id
    try {
      const result = await Submission.get(sessionData.userId)
      const overwrite = ["fullname", "email", "phone_number", "address", "grant_type", "notify_type"]
      overwrite.forEach(k => {
        // eslint-disable-next-line security/detect-object-injection
        sessionData[k] = result[k]
      })
    } catch (err) {
      console.log(err.message)
    }
    saveToDb(sessionData)
    next()
  } else {
    // appointment is being scheduled for the 1st time 
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
    return
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
