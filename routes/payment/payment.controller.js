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

const sendApplyConfirmation = async (req, res, next) => {
  const session = getSessionData(req);
  const date = new Date(1000*(+session.date));
  const dateString = date.toLocaleString("en-GB", {"year": "numeric", "month": "long", "day": "numeric"})
  var rescheduleUrl = req.protocol + '://' + req.get('host') + "/book-appointment?id=" + session.userId
  const options = { 
    personalisation: {
      name: session.fullname,
      address: session.address,
      grant: session.grant_type,
      date: dateString,
      time: session.time,
      link: rescheduleUrl,
  }}

  if (session.notify_type === "Sms") {
    sendSMSNotification({
      phone: session.phone,
      templateId: process.env.TEMPLATE_ID_SMS_APPLY_CONFIRM,
      options,
    });
  } else {
    sendNotification({
      email: session.email,
      templateId: process.env.TEMPLATE_ID_EMAIL_APPLY_CONFIRM,
      options,
    });
  }
  return next()
}

module.exports = (app, route) => {

  // app
  //   .get(route.path, async (req, res) => {
  //     const { Schema: step1 } = require('../step-1/schema.js')
  //     const result = await validateRouteData(req, step1)
  //     if (!result.status) {
  //       setFlashMessageContent(req, result.errors)
  //       return res.redirect(getRouteByName('step-1').path)
  //     }
  //     res.render(name, { ...routeUtils.getViewData(req, {}), nextRoute: getNextRoute(name).path })
  //   })
  //   .post(route.path, [
  //     checkSchema(Schema),
  //     checkErrors(name),
  //     sendPaymentReceipt,
  //     sendApplyConfirmation,
  //     doRedirect(name),
  //   ])

    route.draw(app)
      .get((req, res) => {
        res.render(route.name, routeUtils.getViewData(req))
      })
      .post(
        route.applySchema(Schema),
        route.doRedirect()
      )

}
