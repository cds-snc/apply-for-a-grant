/* istanbul ignore file */

const Schema = {
  email: {
    isLength: {
      errorMessage: 'errors.email.length',
      options: { min: 3, max: 200 },
    },
  },
  phone_number: {
    custom: {
      options: (value, { req }) => {
        const phoneNumber = req.body.phone_number
        const notifyType = req.body.notify_type
        if (notifyType === "SMS" && !phoneNumber) {
          return false
        } 
        return true
      },
      errorMessage: 'errors.phone_number_sms',
    },
  },
  notify_type: {
    isIn: {
      errorMessage: 'errors.notify_type.valid',
      options: [['SMS', 'Email']],
    },
  },
}

module.exports = {
  Schema,
}
