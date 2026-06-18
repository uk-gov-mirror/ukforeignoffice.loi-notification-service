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
        logger.info('Sent confirmation email', { application_reference, email_address: to })
        return res.json('Confirmation email sent')
      })
      .catch((err) => {
        logger.error('Error sending confirmation email', { application_reference, email_address: to, error: err })
        return res.status(500).json('Error sending confirmation email')
      })
  })

  // =====================================
  // SUBMISSION CONFIRMATION
  // =====================================

  router.post('/confirm-submission', (req, res) => {
    const { application_reference, to, application_guid, user_ref, service_type, send_information } = req.body

    // E-APP SERVICE — handled separately, early return
    if (service_type === 4) {
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
          logger.info(`Sent submission email (e-app - ${application_reference})`, {
            application_reference,
            email_address: to,
          })
          return res.json(`submission email (e-app - ${application_reference}) sent`)
        })
        .catch((err) => {
          logger.error('Error sending submission email (e-app)', {
            application_reference,
            email_address: to,
            error: err,
          })
          return res.status(500).json('Error sending submission email (e-app)')
        })
      return
    }

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
                logger.info('Sent submission email (standard - customer reference - royal mail)', {
                  application_reference,
                  email_address: to,
                  customerRef: user_ref,
                })
                return res.json('submission email (standard - customer reference - royal mail) sent')
              })
              .catch((err) => {
                logger.error('Error sending submission email (standard - customer reference - royal mail)', {
                  application_reference,
                  email_address: to,
                  customerRef: user_ref,
                  error: err,
                })
                return res
                  .status(500)
                  .json('Error sending submission email (standard - customer reference - royal mail)')
              })
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
                logger.info('sending submission email (standard - customer reference - courier)', {
                  application_reference,
                  email_address: to,
                  customerRef: user_ref,
                })
                return res.json('submission email (standard - customer reference - courier) sent')
              })
              .catch((err) => {
                logger.error('Error sending submission email (standard - customer reference - courier)', {
                  application_reference,
                  email_address: to,
                  customerRef: user_ref,
                  error: err,
                })
                return res.status(500).json('Error sending submission email (standard - customer reference - courier)')
              })
          } else {
            logger.error('NO EMAIL SENT - Could not determine if application was postal or courier.', {
              application_reference,
              email_address: to,
              customerRef: user_ref,
            })
            return res.status(400).json('Could not determine delivery method (postal or courier)')
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
              logger.info('Sent submission email (premium - customer reference)', {
                application_reference,
                email_address: to,
                customerRef: user_ref,
              })
              return res.json('submission email (premium - customer reference) sent')
            })
            .catch((err) => {
              logger.error('Error sending submission email (premium - customer reference)', {
                application_reference,
                email_address: to,
                customerRef: user_ref,
                error: err,
              })
              return res.status(500).json('Error sending submission email (premium - customer reference)')
            })
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
              logger.info('Sent submission email (drop-off - customer reference)', {
                application_reference,
                email_address: to,
                customerRef: user_ref,
              })
              return res.json('submission email (drop-off - customer reference) sent')
            })
            .catch((err) => {
              logger.error('Error sending submission email (drop-off - customer reference)', {
                application_reference,
                email_address: to,
                customerRef: user_ref,
                error: err,
              })
              return res.status(500).json('Error sending submission email (drop-off - customer reference)')
            })
          break
        default:
          logger.error('NO EMAIL SENT - Unrecognised service_type with customer reference', {
            application_reference,
            service_type,
          })
          return res.status(400).json(`Unrecognised service_type: ${service_type}`)
      }
    } else {
      // ALL APPLICATIONS WITHOUT A REFERENCE NUMBER
      switch (service_type) {
        // STANDARD SERVICE
        case 1:
          // ROYAL MAIL
          if (send_information?.[0][0].includes('Royal Mail tracked delivery')) {
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
                logger.info('Sent submission email (standard - royal mail)', {
                  application_reference,
                  email_address: to,
                  customerRef: user_ref,
                })
                return res.json('submission email (standard - royal mail) sent')
              })
              .catch((err) => {
                logger.error('Error sending submission email (standard - royal mail)', {
                  application_reference,
                  email_address: to,
                  customerRef: user_ref,
                  error: err,
                })
                return res.status(500).json('Error sending submission email (standard - royal mail)')
              })
          }

          // COURIER
          else if (send_information?.[0][0].includes('Courier recorded delivery')) {
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
                logger.info('sending submission email (standard - courier)', {
                  application_reference,
                  email_address: to,
                  customerRef: user_ref,
                })
                return res.json('submission email (standard - courier) sent')
              })
              .catch((err) => {
                logger.error('Error sending submission email (standard - courier)', {
                  application_reference,
                  email_address: to,
                  error: err,
                })
                return res.status(500).json('Error sending submission email (standard - courier)')
              })
          } else {
            logger.error('NO EMAIL SENT - Could not determine if application was postal or courier.', {
              application_reference,
              email_address: to,
            })
            return res.status(400).json('Could not determine delivery method (postal or courier)')
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
              logger.info('Sent submission email (premium)', { application_reference, email_address: to })
              return res.json('submission email (premium) sent')
            })
            .catch((err) => {
              logger.error('Error sending submission email (premium)', {
                application_reference,
                email_address: to,
                error: err,
              })
              return res.status(500).json('Error sending submission email (premium)')
            })
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
              logger.info('Sent submission email (drop-off)', { application_reference, email_address: to })
              return res.json('submission email (drop-off) sent')
            })
            .catch((err) => {
              logger.error('Error sending submission email (drop-off)', {
                application_reference,
                email_address: to,
                error: err,
              })
              return res.status(500).json('Error sending submission email (drop-off)')
            })
          break
        default:
          logger.error('NO EMAIL SENT - Unrecognised service_type without customer reference', {
            application_reference,
            service_type,
          })
          return res.status(400).json(`Unrecognised service_type: ${service_type}`)
      }
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
        logger.info('Sent reset password email', { application_reference, email_address: to })
        return res.json('Password reset email sent')
      })
      .catch((err) =>
        logger.error('Error sending reset password email', { application_reference, email_address: to, error: err }),
      )
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
        logger.info('Sent email to request business access', {
          userEmail,
          companyName,
          companiesHouseNumber,
          businessArea,
          justification,
        })
        return res.json('Business access request email has been sent')
      })
      .catch((err) =>
        logger.error('Error sending email to request business access', {
          userEmail,
          companyName,
          companiesHouseNumber,
          businessArea,
          justification,
          error: err,
        }),
      )
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
        logger.info('Sent business service access decision email', { email_address: to })
        return res.json('Business service access decision email has been sent')
      })
      .catch((err) =>
        logger.error('Error sending business service access decision email', { email_address: to, error: err }),
      )
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
        logger.info('Sent updated password email', { application_reference, email_address: to })
        return res.json('Password updated email sent')
      })
      .catch((err) =>
        logger.error('Error sending updated password email', { application_reference, email_address: to, error: err }),
      )
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
        logger.info('Sent account locked email', { application_reference, email_address: to })
        return res.json('Account locked email sent')
      })
      .catch((err) =>
        logger.error('Error sending account locked email', { application_reference, email_address: to, error: err }),
      )
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
        logger.info('Sent one time passcode email', { email_address: to })
        return res.json('One time passcode email sent')
      })
      .catch((err) => logger.error('Error sending one time passcode email', { email_address: to, error: err }))
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
        logger.info('Sent one time passcode sms', { email_address: to })
        return res.json('One time passcode sms sent')
      })
      .catch((err) => logger.error('Error sending one time passcode sms', { email_address: to, error: err }))
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
        logger.info('Sent account expiry warning email', { email_address: to })
        return res.json('Account expiry warning email sent')
      })
      .catch((err) => logger.error('Error sending account expiry warning email', { email_address: to, error: err }))
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
        logger.info('Sent account expiry confirmation email', { email_address: to })
        return res.json('Account expired confirmation email sent')
      })
      .catch((err) =>
        logger.error('Error sending account expiry confirmation email', { email_address: to, error: err }),
      )
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
        logger.info('Sent failed eligibility email', { email_address: to })
        return res.json('Failed document eligibility email sent')
      })
      .catch((err) => logger.error('Error sending failed eligibility email', { email_address: to, error: err }))
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
        logger.info('Sent additional payment receipt email', { email_address: to })
        return res.json('Additional payment receipt email sent')
      })
      .catch((err) => logger.error('Error sending additional payment receipt email', { email_address: to, error: err }))
  })
}
