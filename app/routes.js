/**
 * Created by skaifem on 25/11/2015.
 */


module.exports = function(router, notify, notifySettings) {

    var notifyClient = new notify(notifySettings.configs.notify_api_key)

    // =====================================
    // HEALTHCHECK
    // =====================================
    router
    //process login form
        .get('/healthcheck', function (req, res) {
            res.json({message: 'Notification Service is running'});
        });

    // =====================================
    // CONFIRM EMAIL
    // =====================================
    router
        .post('/confirm-email', function (req, res) {
            notifyClient
                .sendEmail(notifySettings.templates.emailTemplateConfirm, req.body.to, {
                    personalisation: {
                        'application_reference': req.body.application_reference,
                        'email_address': req.body.to,
                        'token': req.body.token,
                        'url': notifySettings.urls.userServiceURL
                    },
                    reference: "email confirmation"
                })
                .then(response => {
                    console.debug('Sending confirmation email')
                    return res.json('Confirmation email sent');
                }
                    )
                .catch(err => console.error(err))
        });

    // =====================================
    // SUBMISSION CONFIRMATION
    // =====================================

    router
        .post('/confirm-submission', function (req, res) {
            if (req.body.user_ref !== "undefined" && req.body.user_ref !== null && req.body.user_ref !== "") {
                // Application Emails when we have a reference

                if (req.body.service_type == 1) { // standard service with reference
                    notifyClient
                        .sendEmail(notifySettings.templates.emailTemplateSubmissionStandardUserRef, req.body.to, {
                            personalisation: {
                                'application_reference': req.body.application_reference,
                                'email_address': req.body.to,
                                'customerRef': req.body.user_ref
                            },
                            reference: "application submission standard without user ref"
                        })
                        .then(response => {
                            console.info('Sending standard submission confirmation email with user reference')
                            return res.json('Standard submission confirmation (with reference) sent');
                        })
                        .catch(err => console.error(err))
                } else if (req.body.service_type == 2) { // premium and drop-off service with reference
                    notifyClient
                        .sendEmail(notifySettings.templates.emailTemplateSubmissionPremiumUserRef, req.body.to, {
                            personalisation: {
                                'application_reference': req.body.application_reference,
                                'customerRef': req.body.user_ref
                            },
                            reference: "application submission premium without user ref"
                        })
                        .then(response => {
                            console.info('Sending premium submission confirmation email with user reference')
                            return res.json('Premium submission confirmation (with reference) sent')
                        })
                        .catch(err => console.error(err))
                }

                // Application Email with no reference
            } else {
                if (req.body.service_type == 1) { // standard service with no reference
                    notifyClient
                        .sendEmail(notifySettings.templates.emailTemplateSubmissionStandardNoUserRef, req.body.to, {
                            personalisation: {
                                'application_reference': req.body.application_reference,
                                'email_address': req.body.to
                            },
                            reference: "application submission standard with user ref"
                        })
                        .then(response => {
                            console.info('Sending standard submission confirmation email')
                            return res.json('Standard submission confirmation (without reference) sent');
                            })
                        .catch(err => console.error(err))
                } else if (req.body.service_type == 2) { // premium and drop-off service with no reference
                    notifyClient
                        .sendEmail(notifySettings.templates.emailTemplateSubmissionPremiumNoUserRef, req.body.to, {
                            personalisation: {
                                'application_reference': req.body.application_reference
                            },
                            reference: "application submission premium with user ref"
                        })
                        .then(response => {
                            console.log('Sending premium submission confirmation email')
                            return res.json('Premium submission confirmation (without reference) sent');
                            }
                        )
                        .catch(err => console.error(err))
                }
            }
        });

    // =====================================
    // RESET PASSWORD
    // =====================================
    router
        .post('/reset-password', function (req, res) {
            notifyClient
                .sendEmail(notifySettings.templates.emailTemplateResetPassword, req.body.to, {
                    personalisation: {
                        'application_reference': req.body.application_reference,
                        'email_address': req.body.to,
                        'token': req.body.token,
                        'url': notifySettings.urls.userServiceURL
                    },
                    reference: "reset email password"
                })
                .then(response => {
                    console.info('Sending reset password email')
                    return res.json('Password reset email sent');
                })
                .catch(err => console.error(err))
        });

    // =====================================
    // PASSWORD UPDATED
    // =====================================
    router
        .post('/password-updated', function (req, res) {
            notifyClient
                .sendEmail(notifySettings.templates.emailTemplatePasswordUpdated, req.body.to, {
                    personalisation: {
                        'application_reference': req.body.application_reference,
                        'email_address': req.body.to,
                        'token': req.body.token,
                        'url': notifySettings.urls.userServiceURL
                    },
                    reference: "update password"
                })
                .then(response => {
                    console.info('Sending updated password email')
                    return res.json('Password updated email sent');
                })
                .catch(err => console.error(err))
        });

    // =====================================
    // ACCOUNT LOCKED
    // =====================================
    router
        .post('/account_locked', function (req, res) {
            notifyClient
                .sendEmail(notifySettings.templates.emailTemplateAccountLocked, req.body.to, {
                    personalisation: {
                        'application_reference': req.body.application_reference,
                        'email_address': req.body.to,
                        'url': notifySettings.urls.userServiceURL
                    },
                    reference: "account locked"
                })
                .then(response => {
                    console.log('Sending account locked email')
                    return res.json('Account locked email sent');
                })
                .catch(err => console.error(err))
        });


    // =====================================
    // ACCOUNT EXPIRY WARNING
    // =====================================
    router
        .post('/expiry_warning', function (req, res) {
            notifyClient
                .sendEmail(notifySettings.templates.emailTemplateExpiryWarning, req.body.to, {
                    personalisation: {
                        'email_address': req.body.to,
                        'url': notifySettings.urls.userServiceURL,
                        'dayAndMonthText':req.body.dayAndMonthText,
                        'accountExpiryDateText':req.body.accountExpiryDateText
                    },
                    reference: "expiry warning test"
                })
                .then(response => {
                    console.log('Sending account expiry warning email')
                    return res.json('Account expiry warning email sent');
                })
                .catch(err => console.error(err))
        });

    // =====================================
    // ACCOUNT EXPIRY CONFIRMATION
    // =====================================
    router
        .post('/expiry_confirmation', function (req, res) {
            notifyClient
                .sendEmail(notifySettings.templates.emailTemplateExpiryConfirmation, req.body.to, {
                    personalisation: {
                        'email_address': req.body.to,
                        'url': notifySettings.urls.userServiceURL
                    },
                    reference: "expiry confirmation test"
                })
                .then(response => {
                    console.log('Sending account expiry confirmation email')
                    return res.json('Account expired confirmation email sent');
                })
                .catch(err => console.error(err))
        });

    // =====================================
    // FAILED DOCUMENTS
    // =====================================

    router

        .post('/failed-documents',function failed_certs_string(req, res){
            var failed_certs = JSON.parse(req.body.failed_certs);

            var docLabel = (failed_certs.length > 1) ? 'documents' : 'document';

            var failedCertList = [];
            for (var i = 0; i < failed_certs.length; i++) {
                failedCertList.push(failed_certs[i].doc_title);
            }

            notifyClient
                .sendEmail(notifySettings.templates.emailTemplateFailedDoc, req.body.to, {
                    personalisation: {
                        'email_address': req.body.to,
                        'docLabel': docLabel,
                        'failedCertList': failedCertList
                    },
                    reference: "failed eligibility email notify test"
                })
                .then(response => {
                    console.log('Sending failed eligibility email')
                    return res.json('Failed document eligibility email sent');
                })
                .catch(err => console.error(err))
    });

    // =====================================
    // Additional Payments Receipt
    // =====================================

    router
        .post('/additional-payment-receipt',function failed_certs_string(req, res){
            notifyClient
                .sendEmail(notifySettings.templates.emailTemplateAdditionalPaymentReceipt, req.body.to, {
                    personalisation: {
                        'dateOfPayment': req.body.dateOfPayment,
                        'pspReference': req.body.pspReference,
                        'serviceSlug': req.body.serviceSlug,
                        'paymentAmount': req.body.paymentAmount,
                        'paymentMethod': req.body.paymentMethod
                    },
                    reference: "additional payment receipt"
                })
                .then(response => {
                    console.log('Sending additional payment receipt email')
                    return res.json('Additional payment receipt email sent');
                })
                .catch(err => console.error(err))
        })
 };





