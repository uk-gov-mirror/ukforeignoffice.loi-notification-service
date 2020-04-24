/**
 * Created by skaifem on 25/11/2015.
 */


module.exports = function(router, sendGrid,notify, configSendGrid,configNotify,templator) {

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

            var notifyClient = new NotifyClient("conor_test_api_key-6c19e868-f026-4ff4-86ed-8effb112c0cc-23decf65-ecc6-45bb-9fb9-696320d48544")


            notifyClient
                .sendEmail("fc22c984-b50b-4c43-898e-039dd808b039", req.body.to, {
                    personalisation: {
                        'application_reference': req.body.application_reference,
                        'email_address': req.body.to,
                        'user_ref': req.body.user_ref,
                        'token': req.body.token,
                        'url': "http://localhost:8080/api/user"
                    },
                    reference: "email confirmation notify test"
                })
                .then(response => console.log(response))
                .catch(err => console.error(err))


            console.log('Sending confirmation email for notify');
        });

    // =====================================
    // SUBMISSION CONFIRMATION
    // =====================================

    router

        .post('/confirm-submission', function (req, res) {

            console.log('confirm submission output', req.body);

            var NotifyClient = require('notifications-node-client').NotifyClient

            var notifyClient = new NotifyClient("conor_test_api_key-6c19e868-f026-4ff4-86ed-8effb112c0cc-23decf65-ecc6-45bb-9fb9-696320d48544")

            if (req.body.user_ref !== "undefined" && req.body.user_ref !== null && req.body.user_ref !== "") {
                if (req.body.service_type == 1) {//standard service

                    notifyClient
                        .sendEmail("1f0557da-4c66-4f05-95ff-1ea55daede9f", req.body.to, {
                            personalisation: {
                                'application_reference': req.body.application_reference,
                                'email_address': req.body.to,
                                'user_ref':req.body.user_ref
                            },
                            reference: "app submission notify test"
                        })
                        .then(response => console.log(response))
                        .catch(err => console.error(err))


                    console.log('Sending submission confirmation email Notify for standard');
                } else {
                    (req.body.service_type == 2)
                    {//premium and drop-off service

                        notifyClient
                            .sendEmail("2fa30eab-e847-4fc0-ae2b-1725923adb9a", "c.mcgandy@kainos.com", {
                                personalisation: {
                                    'application_reference': req.body.application_reference,
                                    'user_ref':req.body.user_ref

                                },
                                reference: "app submission notify test"
                            })
                            .then(response => console.log(response))
                            .catch(err => console.error(err))


                        console.log('Sending submission confirmation email Notify for premium');
                    }
                }
            }else{
                if (req.body.service_type == 1) {//standard service

                    notifyClient
                        .sendEmail("03acf3ba-0c95-438a-9ead-f6daadb8bb93", req.body.to, {
                            personalisation: {
                                'application_reference': req.body.application_reference,
                                'email_address': req.body.to
                            },
                            reference: "app submission notify test"
                        })
                        .then(response => console.log(response))
                        .catch(err => console.error(err))


                    console.log('Sending submission confirmation email Notify for standard');
                } else {
                    (req.body.service_type == 2)
                    {//premium and drop-off service

                        notifyClient
                            .sendEmail("6bc36b7a-dbd9-4363-b188-b3eed8c4fc79", "c.mcgandy@kainos.com", {
                                personalisation: {
                                    'application_reference': req.body.application_reference
                                },
                                reference: "app submission notify test"
                            })
                            .then(response => console.log(response))
                            .catch(err => console.error(err))


                        console.log('Sending submission confirmation email Notify for premium');
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

            var notifyClient = new NotifyClient("conor_test_api_key-6c19e868-f026-4ff4-86ed-8effb112c0cc-23decf65-ecc6-45bb-9fb9-696320d48544")


            notifyClient
                .sendEmail("1b1eabfa-cf93-4faf-92df-2d11963cc043", req.body.to, {
                    personalisation: {
                        'application_reference': req.body.application_reference,
                        'email_address': req.body.to,
                        'user_ref': req.body.user_ref,
                        'token': req.body.token,
                        'url': "http://localhost:8080/api/user"
                    },
                    reference: "reset email notify test"
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

            var notifyClient = new NotifyClient("conor_test_api_key-6c19e868-f026-4ff4-86ed-8effb112c0cc-23decf65-ecc6-45bb-9fb9-696320d48544")


            notifyClient
                .sendEmail("52fd0907-3e80-41f9-be02-3239c1371a64", req.body.to, {
                    personalisation: {
                        'application_reference': req.body.application_reference,
                        'email_address': req.body.to,
                        'user_ref': req.body.user_ref,
                        'token': req.body.token,
                        'url': "http://localhost:8080/api/user"
                    },
                    reference: "update password  notify test"
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

            //construct email from post request JSON
            var payload = new sendGrid.Email({
                to: req.body.to,
                from: configSendGrid.fromAddresses.test,
                subject: 'Your account has been locked',
                html: templator.accountLockedTemplate(req.body.name, req.body.to, configSendGrid.urls.userServiceURL)
            });
            console.info('Sending account locked email');
            return res.json(sendEmail(req, res, payload));


        });

    // =====================================
    // ACCOUNT EXPIRY WARNING
    // =====================================
    router

        .post('/expiry_warning', function (req, res) {

            //construct email from post request JSON
            var payload = new sendGrid.Email({
                to: req.body.to,
                from: configSendGrid.fromAddresses.test,
                subject: 'Your online account is about to expire: ' + req.body.to,
                html: templator.accountExpiringTemplate(configSendGrid.urls.userServiceURL, req.body.accountExpiryDateText, req.body.dayAndMonthText, req.body.to)
            });

            return res.json(sendEmail(req, res, payload));


        });
    // =====================================
    // ACCOUNT EXPIRY CONFIRMATION
    // =====================================
    router

        .post('/expiry_confirmation', function (req, res) {

            //construct email from post request JSON
            var payload = new sendGrid.Email({
                to: req.body.to,
                from: configSendGrid.fromAddresses.test,
                subject: 'Your online account has been deleted: ' + req.body.to,
                html: templator.accountExpiredTemplate(configSendGrid.urls.userServiceURL, req.body.to)
            });

            return res.json(sendEmail(req, res, payload));


        });

    // =====================================
    // FAILED DOCUMENTS
    // =====================================
    router

        .post('/failed-documents', function (req, res) {

            //construct email from post request JSON
            var payload = new sendGrid.Email({
                to: req.body.to,
                from: configSendGrid.fromAddresses.test,
                subject: 'How to get documents certified',
                html: templator.failedDocumentTemplate(req.body.failed_certs)
            });
            console.info('Sending failed eligibility email');
            return res.json(sendEmail(req, res, payload));
        });

};


// function sendEmail(req, res, payload) { //send the email via SendGrid
//     //use SendGrid template (GOV.UK)
//     payload.setFilters({
//         'templates': {
//             'settings': {
//                 'enable': 1,
//                 'template_id': configSendGrid.templates.emailTemplateId
//             }
//         }
//     });
//     payload.setFromName('Legalisation Office');
//     sendGrid.send(payload, function (err, json) {
//         if (err) {
//             console.error(err);
//             return false;
//         }
//         console.info('Email sent');
//         return json;
//     });
//
// }





