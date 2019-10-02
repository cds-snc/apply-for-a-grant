const Schema = {
  date: {
    isLength: {
      errorMessage: 'errors.date.length',
      options: { min: 3, max: 200 },
    },
  },
  time: {
    isLength: {
      errorMessage: 'errors.date.length',
      options: { min: 3, max: 200 },
    },
  },
}

module.exports = {
  Schema,
}
