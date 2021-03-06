const Schema = {
  card_type: {
    isIn: {
      errorMessage: 'errors.card_type.valid',
      options: [['Visa', 'MasterCard']],
    },
  },
  card_number: {
    isLength: {
      options: {min:16, max: 19},
      errorMessage: 'errors.card_number.valid',
    },
  },
  ccv: {
    isLength: {
      errorMessage: 'errors.ccv.length',
      options: { min: 3, max: 3 },
    },
  },
  expiry: {
    isLength: {
      errorMessage: 'errors.expiry.length',
      options: { min: 7, max: 7 },
    },
  },
}

module.exports = {
  Schema,
}
