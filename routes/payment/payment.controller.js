const { 
  validateRouteData,
  getSessionData,
  routeUtils,
  sendNotification,
  sendSMSNotification,
  setFlashMessageContent,
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

module.exports = (app, route) => {
  console.log(route.table.get("book").path.en)
  const sendApplyConfirmation = async (req, res, next) => {
    const session = getSessionData(req);
    const date = new Date(1000*(+session.date));
    const dateString = date.toLocaleString("en-GB", {"year": "numeric", "month": "long", "day": "numeric"})
    var rescheduleUrl = req.protocol + '://' + req.get('host') + route.table.get("book").path.en + "?id=" + session.userId
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

    route.draw(app)
      .get(async (req, res) => {
      // ⚠️ experimental
      // validate data from previous step
      // see if we should be allowed to reach this step
      const { Schema } = require('../step-1/schema.js')
      const result = await validateRouteData(req, Schema)
      if (!result.status) {
        setFlashMessageContent(req, result.errors)
  //     return res.redirect(getRouteByName('step-1').path)
      }
        res.render(route.name, routeUtils.getViewData(req))
      })
      .post(
        route.applySchema(Schema),
        sendPaymentReceipt,
        sendApplyConfirmation,
        route.doRedirect()
      )

}
