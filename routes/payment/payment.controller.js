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

const sendConfirmations = async (req, res, next) => {
  // need to get session
  const session = getSessionData(req);
  const date = new Date(1000*(+session.date));
  const dateString = date.toLocaleString("en-GB", {"year": "numeric", "month": "long", "day": "numeric"})

  const optionsPayment = { 
    personalisation: {
      "cardholder name": session.fullname,
  }}
  console.log(optionsPayment)
  const optionsApply = { 
    personalisation: {
      name: session.fullname,
      address: session.address,
      grant: session.grant_type,
      date: dateString,
      time: session.time,
      link: "https://apply-for-grant-app.herokuapp.com/book-appointment",
  }}
  if (session.notify_type === "Sms") {
    sendSMSNotification({
      phone: session.phone,
      templateId: process.env.TEMPLATE_ID_SMS_PAYMENT_CONFIRM,
      optionsPayment,
    });
    // sendSMSNotification({
    //   phone: session.phone,
    //   templateId: process.env.TEMPLATE_ID_SMS_APPLY_CONFIRM,
    //   optionsApply,
    // });
  } else {
    sendNotification({
      email: session.email,
      templateId: process.env.TEMPLATE_ID_EMAIL_PAYMENT_CONFIRM,
      optionsPayment,
    });
    // sendNotification({
    //   email: session.email,
    //   templateId: process.env.TEMPLATE_ID_EMAIL_APPLY_CONFIRM,
    //   optionsApply,
    // });
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
      sendConfirmations,
      doRedirect(name),
    ])
}
