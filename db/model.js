const dynamoose = require('dynamoose')

const Submission = dynamoose.model('Submissions', {
  id: Number,
  fullname: String,
})

module.exports = {
  Submission,
}
