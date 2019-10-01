/* istanbul ignore file */

const isValidDate = require('../../utils/').isValidDate

const Schema = {
  email: {
    isLength: {
      errorMessage: 'errors.email.length',
      options: { min: 3, max: 200 },
    },
  },
  send_notifications: {
    isIn: {
      errorMessage: 'errors.send_notifications.valid',
      options: [['Yes', 'No']],
    },
  },
  notify_type: {
    custom: {
      options: (value, { req }) => {
        const sendNotifications = req.body.send_notifications
        if (sendNotifications && sendNotifications === 'Yes') {
          if (typeof value === 'undefined') {
            return false
          }
        } else {
          req.body.notify_type = undefined
        }

        return true
      },
      errorMessage: 'errors.notify_type',
    },
  },
}

module.exports = {
  Schema,
}
