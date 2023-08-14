const sgMail = require('@sendgrid/mail');
// const sendgridAPIKey = ''

sgMail.setApiKey(process.env.SENDGRID_API_KEY)


const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'jainil.citrusbug@gmail.com',
        subject: 'Welcome to Task APP',
        text:`Hello ${name}, welcome to the future.`
    })
}

const sendDeleteAccountEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'jainil.citrusbug@gmail.com',
        subject: 'Account Cancellation',
        text:`Hello ${name}, your account from Task app deleted.`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendDeleteAccountEmail
}