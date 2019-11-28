const { routeUtils, getClientJs, saveSessionData } = require('./../../utils')
const { Schema } = require('./schema.js')
const { Submission } = require('../../db/model')

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
  var sessionData = routeUtils.getViewData(req).data
  if ('id' in req.query && req.query.id !== '') {
    // appointment has been rescheduled
    req.body.userId = req.query.id
    try {
      const result = await Submission.get(req.query.id)
      const overwrite = [
        'fullname',
        'email',
        'phone_number',
        'address',
        'grant_type',
        'notify_type',
      ]
      overwrite.forEach(k => {
        req.body[k] = result[k]
      })

      saveSessionData(req)
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

const redirectTo = (req, res, next) => {
  if ('id' in req.query && req.query.id !== '') {
    return 'confirmation'
  }
  return null
}

module.exports = (app, route) => {
  route
    .draw(app)
    .get((req, res) => {
      const jsPath = getClientJs(req, route.name)
      const jsFiles = jsPath ? [jsPath] : false
      console.log('jsFiles', jsFiles)
      res.render(
        route.name,
        routeUtils.getViewData(req, {
          jsFiles: jsFiles,
          month: 'December',
          year: '2019',
        }),
      )
    })
    .post(route.applySchema(Schema), updateDb, route.doRedirect(redirectTo))
}
