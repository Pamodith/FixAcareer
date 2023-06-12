import mailgen from 'mailgen'
import 'dotenv/config'
import nodemailer from 'nodemailer'
import { moduleLogger } from '@sliit-foss/module-logger'

const logger = moduleLogger('Admin-Email-Service')

const mailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_TOKEN,
  },
})

const sendWelcomeEmail = async (userObj) => {
  const MailGenerator = new mailgen({
    theme: 'cerberus',
    product: {
      name: 'FixACareer',
      link: 'http://localhost:5173/',
      logo: 'https://drive.google.com/file/d/1L5LeUn4dhoYdNIJLoY5uHnPFONAXcvwF/view',
    },
  })

  const email = {
    body: {
      name: `${userObj.firstName} ${userObj.lastName}`,
      intro: `Welcome to FixACareer. The FixACareer System is a web-based application that is designed to help students to find their career path. We are glad to have you on board.`,
      action: {
        button: {
          color: '#22BC66',
          text: 'Find your career',
          link: 'http://localhost:5173/',
        },
      },
      outro: 'If you have any queries or concerns, please feel free to contact our support team.',
    },
  }

  // convert mailgen body into HTML
  const mail = MailGenerator.generate(email)

  // nodemailer sending credentials
  const details = {
    from: process.env.EMAIL_USER,
    to: `${userObj.email}`,
    subject: `Welcome to FixACareer`,
    html: mail,
  }

  // send mail through nodemailer
  await mailTransporter
    .sendMail(details)
    .then(() => {
      logger.info(`Email sent to ${userObj.email}`)
    })
    .catch((error) => {
      logger.error(`An error occurred when sending email - err: ${error.message}`)
    })
}

const sendPasswordResetEmail = async (userObj, newPassword) => {
  const MailGenerator = new mailgen({
    theme: 'cerberus',
    product: {
      name: 'FixACareer',
      link: '#',
      logo: 'https://drive.google.com/file/d/1L5LeUn4dhoYdNIJLoY5uHnPFONAXcvwF/view',
    },
  })

  const email = {
    body: {
      name: `${userObj.firstName} ${userObj.lastName}`,
      intro: `You have requested to reset your password. We have generated a temporary password for you to access your account.`,
      action: {
        instructions: `Your temporary password is:<br><h1>${newPassword}</h1>`,
        button: {
          color: '#22BC66',
          text: 'Go to Login',
          link: '#',
        },
      },
      outro: 'To ensure security, we advise you to change your password when you first log in. If you have any queries or concerns, please feel free to contact our support team.',
    },
  }

  // convert mailgen body into HTML
  const mail = MailGenerator.generate(email)

  // nodemailer sending credentials
  const details = {
    from: process.env.EMAIL_USER,
    to: `${userObj.email}`,
    subject: `Password Reset`,
    html: mail,
  }

  // send mail through nodemailer
  await mailTransporter
    .sendMail(details)
    .then(() => {
      logger.info(`Email sent to ${userObj.email}`)
    })
    .catch((error) => {
      logger.error(`An error occurred when sending email - err: ${error.message}`)
    })
}

const UserEmailService = {
  sendWelcomeEmail,
  sendPasswordResetEmail,
}

export default UserEmailService
