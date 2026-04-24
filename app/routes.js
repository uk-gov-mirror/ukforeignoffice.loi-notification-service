module.exports = function (router, notify, notifySettings) {
  var notifyClient = new notify(notifySettings.configs.notify_api_key)

  // =====================================
  // HEALTHCHECK
  // =====================================
  router
    //process login form
    .get('/healthcheck', function (req, res) {
      res.json({ message: 'Notification Service is running' })
    })

  // =====================================
  // CONFIRM EMAIL
  // =====================================
  router.post('/confirm-email', function (req, res) {
    notifyClient
      .sendEmail(notifySettings.templates.emailTemplateConfirm, req.body.to, {
        personalisation: {
          application_reference: req.body.application_reference,
          email_address: req.body.to,
          token: req.body.token,
          url: notifySettings.urls.userServiceURL,
        },
        reference: 'email confirmation',
      })
      .then((response) => {
        console.debug('Sending confirmation email')
        return res.json('Confirmation email sent')
      })
      .catch((err) => console.error(err))
  })

  // =====================================
  // SUBMISSION CONFIRMATION
  // =====================================

  router.post('/confirm-submission', function (req, res) {
    // ALL APPLICATIONS WITH A REFERENCE NUMBER
    if (req.body.user_ref !== 'undefined' && req.body.user_ref !== null && req.body.user_ref !== '') {
      switch (req.body.service_type) {
        // STANDARD SERVICE
        case 1:
          // ROYAL MAIL
          if (
            req.body.user_ref !== 'undefined' &&
            req.body.send_information !== null &&
            req.body.send_information[0][0].includes('Royal Mail tracked delivery')
          ) {
            notifyClient
              .sendEmail(notifySettings.templates.emailTemplateSubmissionStandardCustRefRoyalMail, req.body.to, {
                personalisation: {
                  application_reference: req.body.application_reference,
                  email_address: req.body.to,
                  customerRef: req.body.user_ref,
                  coverSheetLink: `${notifySettings.urls.applicationServiceURL}/open-paper-app/${req.body.application_reference}/${req.body.application_guid}`,
                },
                reference: 'submission - standard - customer reference - royal mail',
              })
              .then((response) => {
                console.info('sending submission email (standard - customer reference - royal mail)')
                return res.json('submission email (standard - customer reference - royal mail) sent')
              })
              .catch((err) => console.error(err))
          }

          // COURIER
          else if (
            req.body.user_ref !== 'undefined' &&
            req.body.send_information !== null &&
            req.body.send_information[0][0].includes('Courier recorded delivery')
          ) {
            notifyClient
              .sendEmail(notifySettings.templates.emailTemplateSubmissionStandardCustRefCourier, req.body.to, {
                personalisation: {
                  application_reference: req.body.application_reference,
                  email_address: req.body.to,
                  customerRef: req.body.user_ref,
                  coverSheetLink: `${notifySettings.urls.applicationServiceURL}/open-paper-app/${req.body.application_reference}/${req.body.application_guid}`,
                },
                reference: 'submission - standard - customer reference - courier',
              })
              .then((response) => {
                console.info('sending submission email (standard - customer reference - courier)')
                return res.json('submission email (standard - customer reference - courier) sent')
              })
              .catch((err) => console.error(err))
          } else {
            console.info('NO EMAIL SENT - Could not determine if application was postal or courier.')
          }
          break
        // PREMIUM SERVICE
        case 2:
          notifyClient
            .sendEmail(notifySettings.templates.emailTemplateSubmissionPremiumCustRef, req.body.to, {
              personalisation: {
                application_reference: req.body.application_reference,
                customerRef: req.body.user_ref,
                coverSheetLink: `${notifySettings.urls.applicationServiceURL}/open-paper-app/${req.body.application_reference}/${req.body.application_guid}`,
              },
              reference: 'submission - premium - customer reference',
            })
            .then((response) => {
              console.info('sending submission email (premium - customer reference)')
              return res.json('submission email (premium - customer reference) sent')
            })
            .catch((err) => console.error(err))
          break
        // DROP-OFF SERVICE
        case 3:
          notifyClient
            .sendEmail(notifySettings.templates.emailTemplateSubmissionDropOffCustRef, req.body.to, {
              personalisation: {
                application_reference: req.body.application_reference,
                customerRef: req.body.user_ref,
                coverSheetLink: `${notifySettings.urls.applicationServiceURL}/open-paper-app/${req.body.application_reference}/${req.body.application_guid}`,
              },
              reference: 'submission - drop-off - customer reference',
            })
            .then((response) => {
              console.info('sending submission email (drop-off - customer reference)')
              return res.json('submission email (drop-off - customer reference) sent')
            })
            .catch((err) => console.error(err))
          break
      }
    } else {
      // ALL APPLICATIONS WITHOUT A REFERENCE NUMBER
      switch (req.body.service_type) {
        // STANDARD SERVICE
        case 1:
          // ROYAL MAIL
          if (
            req.body.user_ref !== 'undefined' &&
            req.body.send_information !== null &&
            req.body.send_information[0][0].includes('Royal Mail tracked delivery')
          ) {
            notifyClient
              .sendEmail(notifySettings.templates.emailTemplateSubmissionStandardRoyalMail, req.body.to, {
                personalisation: {
                  application_reference: req.body.application_reference,
                  email_address: req.body.to,
                  customerRef: req.body.user_ref,
                  coverSheetLink: `${notifySettings.urls.applicationServiceURL}/open-paper-app/${req.body.application_reference}/${req.body.application_guid}`,
                },
                reference: 'submission - standard - royal mail',
              })
              .then((response) => {
                console.info('sending submission email (standard - royal mail)')
                return res.json('submission email (standard - royal mail) sent')
              })
              .catch((err) => console.error(err))
          }

          // COURIER
          else if (
            req.body.user_ref !== 'undefined' &&
            req.body.send_information !== null &&
            req.body.send_information[0][0].includes('Courier recorded delivery')
          ) {
            notifyClient
              .sendEmail(notifySettings.templates.emailTemplateSubmissionStandardCourier, req.body.to, {
                personalisation: {
                  application_reference: req.body.application_reference,
                  email_address: req.body.to,
                  customerRef: req.body.user_ref,
                  coverSheetLink: `${notifySettings.urls.applicationServiceURL}/open-paper-app/${req.body.application_reference}/${req.body.application_guid}`,
                },
                reference: 'submission - standard - courier',
              })
              .then((response) => {
                console.info('sending submission email (standard - courier)')
                return res.json('submission email (standard - courier) sent')
              })
              .catch((err) => console.error(err))
          } else {
            console.info('NO EMAIL SENT - Could not determine if application was postal or courier.')
          }
          break
        // PREMIUM SERVICE
        case 2:
          notifyClient
            .sendEmail(notifySettings.templates.emailTemplateSubmissionPremium, req.body.to, {
              personalisation: {
                application_reference: req.body.application_reference,
                coverSheetLink: `${notifySettings.urls.applicationServiceURL}/open-paper-app/${req.body.application_reference}/${req.body.application_guid}`,
              },
              reference: 'submission - premium',
            })
            .then((response) => {
              console.info('sending submission email (premium)')
              return res.json('submission email (premium) sent')
            })
            .catch((err) => console.error(err))
          break
        // DROP-OFF SERVICE
        case 3:
          notifyClient
            .sendEmail(notifySettings.templates.emailTemplateSubmissionDropOff, req.body.to, {
              personalisation: {
                application_reference: req.body.application_reference,
                coverSheetLink: `${notifySettings.urls.applicationServiceURL}/open-paper-app/${req.body.application_reference}/${req.body.application_guid}`,
              },
              reference: 'submission - drop-off',
            })
            .then((response) => {
              console.info('sending submission email (drop-off)')
              return res.json('submission email (drop-off) sent')
            })
            .catch((err) => console.error(err))
          break
      }
    }

    if (req.body.service_type === 4) {
      // E-APP SERVICE
      const { application_reference, send_information, to } = req.body
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
          console.info(`sending submission email (e-app - ${application_reference})`)
          return res.json(`submission email (e-app - ${application_reference}) sent`)
        })
        .catch((err) => console.error(err))
    }
  })

  // =====================================
  // RESET PASSWORD
  // =====================================
  router.post('/reset-password', function (req, res) {
    notifyClient
      .sendEmail(notifySettings.templates.emailTemplateResetPassword, req.body.to, {
        personalisation: {
          application_reference: req.body.application_reference,
          email_address: req.body.to,
          token: req.body.token,
          url: notifySettings.urls.userServiceURL,
        },
        reference: 'reset email password',
      })
      .then((response) => {
        console.info('Sending reset password email')
        return res.json('Password reset email sent')
      })
      .catch((err) => console.error(err))
  })

  // =====================================
  // REQUEST BUSINESS ACCESS
  // =====================================
  router.post('/request-business-access', function (req, res) {
    notifyClient
      .sendEmail(
        notifySettings.templates.emailTemplateRequestBusinessAccess,
        notifySettings.configs.request_business_service_mailbox,
        {
          personalisation: {
            userEmail: req.body.userEmail,
            companyName: req.body.companyName,
            companiesHouseNumber: req.body.companiesHouseNumber,
            businessArea: req.body.businessArea,
            justification: req.body.justification,
            token: req.body.token,
            url: notifySettings.urls.userServiceURL,
          },
          reference: 'apply for business access',
        },
      )
      .then((response) => {
        console.info('Sending email to request business access')
        return res.json('Business access request email has been sent')
      })
      .catch((err) => console.error(err))
  })

  // =====================================
  // BUSINESS SERVICE DECISION
  // =====================================
  router.post('/business-service-decision', function (req, res) {
    notifyClient
      .sendEmail(notifySettings.templates.emailTemplateBusinessAccessDecision, req.body.to, {
        personalisation: {
          approve: req.body.decision === 'approve' ? 'yes' : 'no',
          reject: req.body.decision === 'reject' ? 'yes' : 'no',
        },
        reference: 'business service access decision',
      })
      .then((response) => {
        console.info('Sending business service access decision email')
        return res.json('Business service access decision email has been sent')
      })
      .catch((err) => console.error(err))
  })

  // =====================================
  // PASSWORD UPDATED
  // =====================================
  router.post('/password-updated', function (req, res) {
    notifyClient
      .sendEmail(notifySettings.templates.emailTemplatePasswordUpdated, req.body.to, {
        personalisation: {
          application_reference: req.body.application_reference,
          email_address: req.body.to,
          token: req.body.token,
          url: notifySettings.urls.userServiceURL,
        },
        reference: 'update password',
      })
      .then((response) => {
        console.info('Sending updated password email')
        return res.json('Password updated email sent')
      })
      .catch((err) => console.error(err))
  })

  // =====================================
  // ACCOUNT LOCKED
  // =====================================
  router.post('/account_locked', function (req, res) {
    notifyClient
      .sendEmail(notifySettings.templates.emailTemplateAccountLocked, req.body.to, {
        personalisation: {
          application_reference: req.body.application_reference,
          email_address: req.body.to,
          url: notifySettings.urls.userServiceURL,
        },
        reference: 'account locked',
      })
      .then((response) => {
        console.log('Sending account locked email')
        return res.json('Account locked email sent')
      })
      .catch((err) => console.error(err))
  })

  // =====================================
  // ONE TIME PASSCODE EMAIL
  // =====================================
  router.post('/one_time_passcode_email', function (req, res) {
    notifyClient
      .sendEmail(notifySettings.templates.emailTemplateOneTimePasscode, req.body.to, {
        personalisation: {
          one_time_passcode: req.body.oneTimePasscode,
        },
        reference: 'one time passcode',
      })
      .then((response) => {
        console.log('Sending one time passcode email')
        return res.json('One time passcode email sent')
      })
      .catch((err) => console.error(err))
  })

  // =====================================
  // ONE TIME PASSCODE SMS
  // =====================================
  router.post('/one_time_passcode_sms', function (req, res) {
    notifyClient
      .sendSms(notifySettings.templates.textMessageOneTimePasscode, req.body.to, {
        personalisation: {
          one_time_passcode: req.body.oneTimePasscode,
        },
        reference: 'one time passcode',
      })
      .then((response) => {
        console.log('Sending one time passcode sms')
        return res.json('One time passcode sms sent')
      })
      .catch((err) => console.error(err))
  })

  // =====================================
  // ACCOUNT EXPIRY WARNING
  // =====================================
  router.post('/expiry_warning', function (req, res) {
    notifyClient
      .sendEmail(notifySettings.templates.emailTemplateExpiryWarning, req.body.to, {
        personalisation: {
          email_address: req.body.to,
          url: notifySettings.urls.userServiceURL,
          dayAndMonthText: req.body.dayAndMonthText,
          accountExpiryDateText: req.body.accountExpiryDateText,
        },
        reference: 'expiry warning test',
      })
      .then((response) => {
        console.log('Sending account expiry warning email')
        return res.json('Account expiry warning email sent')
      })
      .catch((err) => console.error(err))
  })

  // =====================================
  // ACCOUNT EXPIRY CONFIRMATION
  // =====================================
  router.post('/expiry_confirmation', function (req, res) {
    notifyClient
      .sendEmail(notifySettings.templates.emailTemplateExpiryConfirmation, req.body.to, {
        personalisation: {
          email_address: req.body.to,
          url: notifySettings.urls.userServiceURL,
        },
        reference: 'expiry confirmation test',
      })
      .then((response) => {
        console.log('Sending account expiry confirmation email')
        return res.json('Account expired confirmation email sent')
      })
      .catch((err) => console.error(err))
  })

  // =====================================
  // FAILED DOCUMENTS
  // =====================================

  router.post('/failed-documents', function failed_certs_string(req, res) {
    var failed_certs = JSON.parse(req.body.failed_certs)

    var docLabel = failed_certs.length > 1 ? 'documents' : 'document'

    var failedCertList = []
    for (var i = 0; i < failed_certs.length; i++) {
      failedCertList.push(failed_certs[i].doc_title)
    }

    notifyClient
      .sendEmail(notifySettings.templates.emailTemplateFailedDoc, req.body.to, {
        personalisation: {
          email_address: req.body.to,
          docLabel: docLabel,
          failedCertList: failedCertList,
        },
        reference: 'failed eligibility email notify test',
      })
      .then((response) => {
        console.log('Sending failed eligibility email')
        return res.json('Failed document eligibility email sent')
      })
      .catch((err) => console.error(err))
  })

  // =====================================
  // Additional Payments Receipt
  // =====================================

  router.post('/additional-payment-receipt', function failed_certs_string(req, res) {
    notifyClient
      .sendEmail(notifySettings.templates.emailTemplateAdditionalPaymentReceipt, req.body.to, {
        personalisation: {
          dateOfPayment: req.body.dateOfPayment,
          pspReference: req.body.pspReference,
          serviceSlug: req.body.serviceSlug,
          paymentAmount: req.body.paymentAmount,
          paymentMethod: req.body.paymentMethod,
        },
        reference: 'additional payment receipt',
      })
      .then((response) => {
        console.log('Sending additional payment receipt email')
        return res.json('Additional payment receipt email sent')
      })
      .catch((err) => console.error(err))
  })
}
