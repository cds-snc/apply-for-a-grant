const dynamoose = require('dynamoose')

const Submission = dynamoose.model('Submissions', {
  id: String,
  fullname: String,
  email: String,
  phone_number: String,
  address: String,
  grant_type: String,
  notify_type: String,
  date: String,
  time: String,
})

module.exports = {
  Submission,
}
