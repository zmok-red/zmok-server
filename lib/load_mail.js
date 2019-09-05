const debug = require('debug')('zmok:load_mail')

module.exports = function (ctx) {
  return new Promise(async (resolve, reject) => {
    try {
      debug('start')

      // const mailgun = require('mailgun-js')({apiKey: ctx.config.variables.MAILGUN_API_KEY, domain: ctx.config.variables.MAILGUN_DOMAIN})
      // const data = {
      //   from: `ivan@${ctx.config.variables.MAILGUN_DOMAIN}`,
      //   to: 'ivanmoto254@gmail.com',
      //   subject: 'hello from oleg',
      //   text: 'Testing some Mailgun awesomeness!'
      // }

      // mailgun.messages().send(data, (error, body) => {
      //   debug('body', body)
      //   resolve()
      // })

      debug('done')
      resolve()
    } catch (error) {
      debug('error', error)
      reject(error)
    }
  })
}
