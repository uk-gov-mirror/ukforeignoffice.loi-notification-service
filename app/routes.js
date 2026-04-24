import { logger } from '../config/logs.js'

export const routes = (router, notify, notifySettings) => {
  const notifyClient = new notify(notifySettings.configs.notify_api_key)

  // =====================================
  // HEALTHCHECK
  // =====================================
  router
    //process login form
    .get('/healthcheck', (_req, res) => {
      res.json({ message: 'Notification Service is running' })
    })

  // =====================================
  // CONFIRM EMAIL
  // =====================================
  router.post('/confirm-email', (req, res) => {
    const { application_reference, to, token } = req.body

    notifyClient
      .sendEmail(notifySettings.templates.emailTemplateConfirm, to, {
        personalisation: {
          application_reference,
          email_address: to,
          token,
          url: notifySettings.urls.userServiceURL,
        },
        reference: 'email confirmation',
      })
      .then((_response) => {
        logger.debug('Sending confirmation email')
        return res.json('Confirmation email sent')
      })
      .catch((err) => logger.error(err))
  })

  // =====================================
  // SUBMISSION CONFIRMATION
  // =====================================

  router.post('/confirm-submission', (req, res) => {
    const { application_reference, to, application_guid, user_ref, service_type, send_information } = req.body

    // ALL APPLICATIONS WITH A REFERENCE NUMBER
    if (user_ref !== 'undefined' && user_ref !== null && user_ref !== '') {
      switch (service_type) {
        // STANDARD SERVICE
        case 1:
          // ROYAL MAIL
          if (
            user_ref !== 'undefined' &&
            send_information !== null &&
            send_information[0][0].includes('Royal Mail tracked delivery')
          ) {
            notifyClient
              .sendEmail(notifySettings.templates.emailTemplateSubmissionStandardCustRefRoyalMail, to, {
                personalisation: {
                  application_reference,
                  email_address: to,
                  customerRef: user_ref,
                  coverSheetLink: `${notifySettings.urls.applicationServiceURL}/open-paper-app/${application_reference}/${application_guid}`,
                },
                reference: 'submission - standard - customer reference - royal mail',
              })
              .then((_response) => {
                logger.info('sending submission email (standard - customer reference - royal mail)')
                return res.json('submission email (standard - customer reference - royal mail) sent')
              })
              .catch((err) => logger.error(err))
          }

          // COURIER
          else if (
            user_ref !== 'undefined' &&
            send_information !== null &&
            send_information[0][0].includes('Courier recorded delivery')
          ) {
            notifyClient
              .sendEmail(notifySettings.templates.emailTemplateSubmissionStandardCustRefCourier, to, {
                personalisation: {
                  application_reference,
                  email_address: to,
                  customerRef: user_ref,
                  coverSheetLink: `${notifySettings.urls.applicationServiceURL}/open-paper-app/${application_reference}/${application_guid}`,
                },
                reference: 'submission - standard - customer reference - courier',
              })
              .then((_response) => {
                logger.info('sending submission email (standard - customer reference - courier)')
                return res.json('submission email (standard - customer reference - courier) sent')
              })
              .catch((err) => logger.error(err))
          } else {
            logger.info('NO EMAIL SENT - Could not determine if application was postal or courier.')
          }
          break
        // PREMIUM SERVICE
        case 2:
          notifyClient
            .sendEmail(notifySettings.templates.emailTemplateSubmissionPremiumCustRef, to, {
              personalisation: {
                application_reference,
                customerRef: user_ref,
                coverSheetLink: `${notifySettings.urls.applicationServiceURL}/open-paper-app/${application_reference}/${application_guid}`,
              },
              reference: 'submission - premium - customer reference',
            })
            .then((_response) => {
              logger.info('sending submission email (premium - customer reference)')
              return res.json('submission email (premium - customer reference) sent')
            })
            .catch((err) => logger.error(err))
          break
        // DROP-OFF SERVICE
        case 3:
          notifyClient
            .sendEmail(notifySettings.templates.emailTemplateSubmissionDropOffCustRef, to, {
              personalisation: {
                application_reference,
                customerRef: user_ref,
                coverSheetLink: `${notifySettings.urls.applicationServiceURL}/open-paper-app/${application_reference}/${application_guid}`,
              },
              reference: 'submission - drop-off - customer reference',
            })
            .then((_response) => {
              logger.info('sending submission email (drop-off - customer reference)')
              return res.json('submission email (drop-off - customer reference) sent')
            })
            .catch((err) => logger.error(err))
          break
      }
    } else {
      // ALL APPLICATIONS WITHOUT A REFERENCE NUMBER
      switch (service_type) {
        // STANDARD SERVICE
        case 1:
          // ROYAL MAIL
          if (
            user_ref !== 'undefined' &&
            send_information !== null &&
            send_information[0][0].includes('Royal Mail tracked delivery')
          ) {
            notifyClient
              .sendEmail(notifySettings.templates.emailTemplateSubmissionStandardRoyalMail, to, {
                personalisation: {
                  application_reference,
                  email_address: to,
                  customerRef: user_ref,
                  coverSheetLink: `${notifySettings.urls.applicationServiceURL}/open-paper-app/${application_reference}/${application_guid}`,
                },
                reference: 'submission - standard - royal mail',
              })
              .then((_response) => {
                logger.info('sending submission email (standard - royal mail)')
                return res.json('submission email (standard - royal mail) sent')
              })
              .catch((err) => logger.error(err))
          }

          // COURIER
          else if (
            user_ref !== 'undefined' &&
            send_information !== null &&
            send_information[0][0].includes('Courier recorded delivery')
          ) {
            notifyClient
              .sendEmail(notifySettings.templates.emailTemplateSubmissionStandardCourier, to, {
                personalisation: {
                  application_reference,
                  email_address: to,
                  customerRef: user_ref,
                  coverSheetLink: `${notifySettings.urls.applicationServiceURL}/open-paper-app/${application_reference}/${application_guid}`,
                },
                reference: 'submission - standard - courier',
              })
              .then((_response) => {
                logger.info('sending submission email (standard - courier)')
                return res.json('submission email (standard - courier) sent')
              })
              .catch((err) => logger.error(err))
          } else {
            logger.info('NO EMAIL SENT - Could not determine if application was postal or courier.')
          }
          break
        // PREMIUM SERVICE
        case 2:
          notifyClient
            .sendEmail(notifySettings.templates.emailTemplateSubmissionPremium, to, {
              personalisation: {
                application_reference,
                coverSheetLink: `${notifySettings.urls.applicationServiceURL}/open-paper-app/${application_reference}/${application_guid}`,
              },
              reference: 'submission - premium',
            })
            .then((_response) => {
              logger.info('sending submission email (premium)')
              return res.json('submission email (premium) sent')
            })
            .catch((err) => logger.error(err))
          break
        // DROP-OFF SERVICE
        case 3:
          notifyClient
            .sendEmail(notifySettings.templates.emailTemplateSubmissionDropOff, to, {
              personalisation: {
                application_reference,
                coverSheetLink: `${notifySettings.urls.applicationServiceURL}/open-paper-app/${application_reference}/${application_guid}`,
              },
              reference: 'submission - drop-off',
            })
            .then((_response) => {
              logger.info('sending submission email (drop-off)')
              return res.json('submission email (drop-off) sent')
            })
            .catch((err) => logger.error(err))
          break
      }
    }

    if (service_type === 4) {
      // E-APP SERVICE
      const { emailTemplateSubmissionEApp } = notifySettings.templates

      notifyClient
        .sendEmail(emailTemplateSubmissionEApp, to, {
          personalisation: {
            application_reference,
            first_name: send_information.first_name,
            last_name: send_information.last_name,
            app_url: `${notifySettings.urls.applicationServiceURL}/open-eapp/${application_reference}`,
          },
          reference: `submission - e-app - ${application_reference}`,
        })
        .then(() => {
          logger.info(`sending submission email (e-app - ${application_reference})`)
          return res.json(`submission email (e-app - ${application_reference}) sent`)
        })
        .catch((err) => logger.error(err))
    }
  })

  // =====================================
  // RESET PASSWORD
  // =====================================
  router.post('/reset-password', (req, res) => {
    const { application_reference, to, token } = req.body
    notifyClient
      .sendEmail(notifySettings.templates.emailTemplateResetPassword, to, {
        personalisation: {
          application_reference,
          email_address: to,
          token,
          url: notifySettings.urls.userServiceURL,
        },
        reference: 'reset email password',
      })
      .then((_response) => {
        logger.info('Sending reset password email')
        return res.json('Password reset email sent')
      })
      .catch((err) => logger.error(err))
  })

  // =====================================
  // REQUEST BUSINESS ACCESS
  // =====================================
  router.post('/request-business-access', (req, res) => {
    const { userEmail, companyName, companiesHouseNumber, businessArea, justification, token } = req.body
    notifyClient
      .sendEmail(
        notifySettings.templates.emailTemplateRequestBusinessAccess,
        notifySettings.configs.request_business_service_mailbox,
        {
          personalisation: {
            userEmail,
            companyName,
            companiesHouseNumber,
            businessArea,
            justification,
            token,
            url: notifySettings.urls.userServiceURL,
          },
          reference: 'apply for business access',
        },
      )
      .then((_response) => {
        logger.info('Sending email to request business access')
        return res.json('Business access request email has been sent')
      })
      .catch((err) => logger.error(err))
  })

  // =====================================
  // BUSINESS SERVICE DECISION
  // =====================================
  router.post('/business-service-decision', (req, res) => {
    const { to, decision } = req.body
    notifyClient
      .sendEmail(notifySettings.templates.emailTemplateBusinessAccessDecision, to, {
        personalisation: {
          approve: decision === 'approve' ? 'yes' : 'no',
          reject: decision === 'reject' ? 'yes' : 'no',
        },
        reference: 'business service access decision',
      })
      .then((_response) => {
        logger.info('Sending business service access decision email')
        return res.json('Business service access decision email has been sent')
      })
      .catch((err) => logger.error(err))
  })

  // =====================================
  // PASSWORD UPDATED
  // =====================================
  router.post('/password-updated', (req, res) => {
    const { to, application_reference, token } = req.body
    notifyClient
      .sendEmail(notifySettings.templates.emailTemplatePasswordUpdated, to, {
        personalisation: {
          application_reference,
          email_address: to,
          token,
          url: notifySettings.urls.userServiceURL,
        },
        reference: 'update password',
      })
      .then((_response) => {
        logger.info('Sending updated password email')
        return res.json('Password updated email sent')
      })
      .catch((err) => logger.error(err))
  })

  // =====================================
  // ACCOUNT LOCKED
  // =====================================
  router.post('/account_locked', (req, res) => {
    const { to, application_reference } = req.body
    notifyClient
      .sendEmail(notifySettings.templates.emailTemplateAccountLocked, to, {
        personalisation: {
          application_reference,
          email_address: to,
          url: notifySettings.urls.userServiceURL,
        },
        reference: 'account locked',
      })
      .then((_response) => {
        logger.info('Sending account locked email')
        return res.json('Account locked email sent')
      })
      .catch((err) => logger.error(err))
  })

  // =====================================
  // ONE TIME PASSCODE EMAIL
  // =====================================
  router.post('/one_time_passcode_email', (req, res) => {
    const { to, oneTimePasscode } = req.body
    notifyClient
      .sendEmail(notifySettings.templates.emailTemplateOneTimePasscode, to, {
        personalisation: {
          one_time_passcode: oneTimePasscode,
        },
        reference: 'one time passcode',
      })
      .then((_response) => {
        logger.info('Sending one time passcode email')
        return res.json('One time passcode email sent')
      })
      .catch((err) => logger.error(err))
  })

  // =====================================
  // ONE TIME PASSCODE SMS
  // =====================================
  router.post('/one_time_passcode_sms', (req, res) => {
    const { to, oneTimePasscode } = req.body
    notifyClient
      .sendSms(notifySettings.templates.textMessageOneTimePasscode, to, {
        personalisation: {
          one_time_passcode: oneTimePasscode,
        },
        reference: 'one time passcode',
      })
      .then((_response) => {
        logger.info('Sending one time passcode sms')
        return res.json('One time passcode sms sent')
      })
      .catch((err) => logger.error(err))
  })

  // =====================================
  // ACCOUNT EXPIRY WARNING
  // =====================================
  router.post('/expiry_warning', (req, res) => {
    const { to, dayAndMonthText, accountExpiryDateText } = req.body
    notifyClient
      .sendEmail(notifySettings.templates.emailTemplateExpiryWarning, to, {
        personalisation: {
          email_address: to,
          url: notifySettings.urls.userServiceURL,
          dayAndMonthText,
          accountExpiryDateText,
        },
        reference: 'expiry warning test',
      })
      .then((_response) => {
        logger.info('Sending account expiry warning email')
        return res.json('Account expiry warning email sent')
      })
      .catch((err) => logger.error(err))
  })

  // =====================================
  // ACCOUNT EXPIRY CONFIRMATION
  // =====================================
  router.post('/expiry_confirmation', (req, res) => {
    const { to } = req.body
    notifyClient
      .sendEmail(notifySettings.templates.emailTemplateExpiryConfirmation, to, {
        personalisation: {
          email_address: to,
          url: notifySettings.urls.userServiceURL,
        },
        reference: 'expiry confirmation test',
      })
      .then((_response) => {
        logger.info('Sending account expiry confirmation email')
        return res.json('Account expired confirmation email sent')
      })
      .catch((err) => logger.error(err))
  })

  // =====================================
  // FAILED DOCUMENTS
  // =====================================

  router.post('/failed-documents', function failed_certs_string(req, res) {
    const failed_certs = JSON.parse(req.body.failed_certs)

    const docLabel = failed_certs.length > 1 ? 'documents' : 'document'

    const failedCertList = []
    for (let i = 0; i < failed_certs.length; i++) {
      failedCertList.push(failed_certs[i].doc_title)
    }

    const { to } = req.body

    notifyClient
      .sendEmail(notifySettings.templates.emailTemplateFailedDoc, to, {
        personalisation: {
          email_address: to,
          docLabel,
          failedCertList,
        },
        reference: 'failed eligibility email notify test',
      })
      .then((_response) => {
        logger.info('Sending failed eligibility email')
        return res.json('Failed document eligibility email sent')
      })
      .catch((err) => logger.error(err))
  })

  // =====================================
  // Additional Payments Receipt
  // =====================================

  router.post('/additional-payment-receipt', function failed_certs_string(req, res) {
    const { to, dateOfPayment, pspReference, serviceSlug, paymentAmount, paymentMethod } = req.body
    notifyClient
      .sendEmail(notifySettings.templates.emailTemplateAdditionalPaymentReceipt, to, {
        personalisation: {
          dateOfPayment,
          pspReference,
          serviceSlug,
          paymentAmount,
          paymentMethod,
        },
        reference: 'additional payment receipt',
      })
      .then((_response) => {
        logger.info('Sending additional payment receipt email')
        return res.json('Additional payment receipt email sent')
      })
      .catch((err) => logger.error(err))
  })
}
