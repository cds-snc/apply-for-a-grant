const path = require('path')
const { 
  validateRouteData,
  getSessionData,
  getNextRoute,
  routeUtils,
  sendNotification,
  sendSMSNotification,
  setFlashMessageContent,
  getRouteByName,
} = require('./../../utils')
const { doRedirect } = require('./../../utils/route.helpers')
const { checkErrors } = require('./../../utils/validate.helpers')
const { checkSchema } = require('express-validator')
const { Schema } = require('./schema.js')

const sendPaymentReceipt = async (req, res, next) => {
  // need to get session
  const session = getSessionData(req);
  const options = { 
    personalisation: {
      "cardholder name": session.fullname,
      phone: session.phone,
  }}
  if (session.notify_type === "Sms") {
    sendSMSNotification({
      phone: session.phone,
      templateId: process.env.TEMPLATE_ID_SMS_PAYMENT_CONFIRM,
      options,
    });
  } else {
    sendNotification({
      email: session.email,
      templateId: process.env.TEMPLATE_ID_EMAIL_PAYMENT_CONFIRM,
      options,
    });
  }
  return next()
}

module.exports = app => {
  const name = 'payment'
  const route = routeUtils.getRouteByName(name)

  routeUtils.addViewPath(app, path.join(__dirname, './'))

  app
    .get(route.path, async (req, res) => {
      const { Schema: step1 } = require('../step-1/schema.js')
      const result = await validateRouteData(req, step1)
      if (!result.status) {
        setFlashMessageContent(req, result.errors)
        return res.redirect(getRouteByName('step-1').path)
      }
      res.render(name, { ...routeUtils.getViewData(req, {}), nextRoute: getNextRoute(name).path })
    })
    .post(route.path, [
      checkSchema(Schema),
      checkErrors(name),
      sendPaymentReceipt,
      doRedirect(name),
    ])
}
