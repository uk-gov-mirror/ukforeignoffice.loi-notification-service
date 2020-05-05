/**
 * Created by skaifem on 25/11/2015.
 */


module.exports = function(router,notify,configNotify) {
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

            var NotifyClient = require('notifications-node-client').NotifyClient

            var notifyClient = new NotifyClient(configNotify.configs.api_key_preprod)


            notifyClient
                .sendEmail(configNotify.templates.emailTemplateConfirm, req.body.to, {
                    personalisation: {
                        'application_reference': req.body.application_reference,
                        'email_address': req.body.to,
                        'token': req.body.token,
                        'url': configNotify.urls.userServiceURL
                    },
                    reference: "email confirmation"
                })
                .then(response => console.log(response))
                .catch(err => console.error(err))


            console.log('Sending confirmation email');
        });

    // =====================================
    // SUBMISSION CONFIRMATION
    // =====================================

    router

        .post('/confirm-submission', function (req, res) {

            console.log('confirm submission output', req.body);

            var NotifyClient = require('notifications-node-client').NotifyClient

            var notifyClient = new NotifyClient(configNotify.configs.api_key_preprod)

            if (req.body.user_ref !== "undefined" && req.body.user_ref !== null && req.body.user_ref !== "") {
                if (req.body.service_type == 1) {//standard service

                    notifyClient
                        .sendEmail(configNotify.templates.emailTemplateSubmissionStandardNoUserRef, req.body.to, {
                            personalisation: {
                                'application_reference': req.body.application_reference,
                                'email_address': req.body.to,
                                'user_ref':req.body.user_ref
                            },
                            reference: "application submission standard without user ref"
                        })
                        .then(response => console.log(response))
                        .catch(err => console.error(err))


                    console.log('Sending submission confirmation email');
                } else {
                    (req.body.service_type == 2)
                    {//premium and drop-off service

                        notifyClient
                            .sendEmail(configNotify.templates.emailTemplateSubmissionPremiumNoUserRef, "c.mcgandy@kainos.com", {
                                personalisation: {
                                    'application_reference': req.body.application_reference,
                                    'user_ref':req.body.user_ref

                                },
                                reference: "application submission premium without user ref"
                            })
                            .then(response => console.log(response))
                            .catch(err => console.error(err))


                        console.log('Sending submission confirmation');
                    }
                }
            }else{
                if (req.body.service_type == 1) {//standard service

                    notifyClient
                        .sendEmail(configNotify.templates.emailTemplateSubmissionStandardUserRef, req.body.to, {
                            personalisation: {
                                'application_reference': req.body.application_reference,
                                'email_address': req.body.to
                            },
                            reference: "application submission standard with user ref"
                        })
                        .then(response => console.log(response))
                        .catch(err => console.error(err))


                    console.log('Sending submission confirmation');
                } else {
                    (req.body.service_type == 2)
                    {//premium and drop-off service

                        notifyClient
                            .sendEmail(configNotify.templates.emailTemplateSubmissionPremiumUserRef, "c.mcgandy@kainos.com", {
                                personalisation: {
                                    'application_reference': req.body.application_reference
                                },
                                reference: "application submission premium with user ref"
                            })
                            .then(response => console.log(response))
                            .catch(err => console.error(err))


                        console.log('Sending submission confirmation email');
                    }
                }
            }

        });

    // =====================================
    // RESET PASSWORD
    // =====================================
    router

        .post('/reset-password', function (req, res) {

            var NotifyClient = require('notifications-node-client').NotifyClient

            var notifyClient = new NotifyClient(configNotify.configs.api_key_preprod)


            notifyClient
                .sendEmail(configNotify.templates.emailTemplateResetPassword, req.body.to, {
                    personalisation: {
                        'application_reference': req.body.application_reference,
                        'email_address': req.body.to,
                        'token': req.body.token,
                        'url': configNotify.urls.userServiceURL
                    },
                    reference: "reset email password"
                })
                .then(response => console.log(response))
                .catch(err => console.error(err))


            console.log('Sending reset password email');
        });

    // =====================================
    // PASSWORD UPDATED
    // =====================================

    router

        .post('/password-updated', function (req, res) {

            var NotifyClient = require('notifications-node-client').NotifyClient

            var notifyClient = new NotifyClient(configNotify.configs.api_key_preprod)


            notifyClient
                .sendEmail(configNotify.templates.emailTemplatePasswordUpdated, req.body.to, {
                    personalisation: {
                        'application_reference': req.body.application_reference,
                        'email_address': req.body.to,
                        'token': req.body.token,
                        'url': configNotify.urls.userServiceURL
                    },
                    reference: "update password"
                })
                .then(response => console.log(response))
                .catch(err => console.error(err))


            console.log('Sending updated password email');
        });

    // =====================================
    // ACCOUNT LOCKED
    // =====================================

    router

        .post('/account_locked', function (req, res) {

            var NotifyClient = require('notifications-node-client').NotifyClient

            var notifyClient = new NotifyClient(configNotify.configs.api_key_preprod)


            notifyClient
                .sendEmail(configNotify.templates.emailTemplateAccountLocked, req.body.to, {
                    personalisation: {
                        'application_reference': req.body.application_reference,
                        'email_address': req.body.to,
                        'token': req.body.token
                    },
                    reference: "account locked"
                })
                .then(response => console.log(response))
                .catch(err => console.error(err))


            console.log('Sending account locked email');
        });


    // =====================================
    // ACCOUNT EXPIRY WARNING
    // =====================================

    router

        .post('/expiry_warning', function (req, res) {

            var NotifyClient = require('notifications-node-client').NotifyClient

            var notifyClient = new NotifyClient(configNotify.configs.api_key_preprod)

            notifyClient
                .sendEmail(configNotify.templates.emailTemplateExpiryWarning, req.body.to, {
                    personalisation: {
                        'application_reference': req.body.application_reference,
                        'email_address': req.body.to,
                        'token': req.body.token,
                        'url': configNotify.urls.userServiceURL,
                        'dayAndMonthText':req.body.dayAndMonthText,
                        'accountExpiryDateText':req.body.accountExpiryDateText
                    },
                    reference: "expiry warning test"
                })
                .then(response => console.log(response))
                .catch(err => console.error(err))


            console.log('Sending account expiry warning email');
        });

    // =====================================
    // ACCOUNT EXPIRY CONFIRMATION
    // =====================================

    router

        .post('/expiry_confirmation', function (req, res) {

            var NotifyClient = require('notifications-node-client').NotifyClient

            var notifyClient = new NotifyClient(configNotify.configs.api_key_preprod)

            notifyClient
                .sendEmail(configNotify.templates.emailTemplateExpiryConfirmation, req.body.to, {
                    personalisation: {
                        'application_reference': req.body.application_reference,
                        'email_address': req.body.to,
                        'url': configNotify.urls.userServiceURL
                    },
                    reference: "expiry confirmation test"
                })
                .then(response => console.log(response))
                .catch(err => console.error(err))


            console.log('Sending account expiry confirmation email');
        });

    // =====================================
    // FAILED DOCUMENTS
    // =====================================

    router

        .post('/failed-documents',function failed_certs_string(req){

             var failed_certs = JSON.parse(req.body.failed_certs);

            var docLabel = (failed_certs.length > 1) ? 'documents' : 'document';


            var failedCertList = '';
            for (var i = 0; i < failed_certs.length; i++) {
            failedCertList += failed_certs[i].doc_title;
            }

            var NotifyClient = require('notifications-node-client').NotifyClient

            var notifyClient = new NotifyClient(configNotify.configs.api_key_preprod)

            notifyClient
                .sendEmail(configNotify.templates.emailTemplateFailedDoc, req.body.to, {
                    personalisation: {
                        'application_reference': req.body.application_reference,
                        'email_address': req.body.to,
                        'failed_certs': req.body.failed_certs,
                        'docLabel': docLabel,
                        'failedCertList': failedCertList
                    },
                    reference: "failed eligibility email notify test"
                })
                .then(response => console.log(response))
                .catch(err => console.error(err))


            console.log('Sending failed eligibility email');
    });

 };





