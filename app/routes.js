/**
 * Created by skaifem on 25/11/2015.
 */


module.exports = function(router, sendGrid, configSendGrid,templator) {

    // =====================================
    // HEALTHCHECK
    // =====================================
    router
        //process login form
        .get('/healthcheck', function(req, res) {
            res.json({ message: 'is-notification-service running'});
        });

    // =====================================
    // CONFIRM EMAIL
    // =====================================
    router

        .post('/confirm-email', function(req, res) {

            //construct email from post request JSON
            var payload = new sendGrid.Email({
                to      : req.body.to,
                from    : configSendGrid.fromAddresses.test,
                subject : 'Confirm your email to activate your account',
                html    : templator.emailConfirmationTemplate(req.body.token, configSendGrid.urls.userServiceURL)
            });
            console.info('Sending confirmation email');
            return res.json(sendEmail(req,res, payload));
        });

    // =====================================
    // SUBMISSION CONFIRMATION
    // =====================================
    router

        .post('/confirm-submission', function(req, res) {

            //construct email from post request JSON
            var payload = new sendGrid.Email({
                to      : req.body.to,
                from    : configSendGrid.fromAddresses.test,
                subject : 'Legalisation application confirmation ' + req.body.application_reference,
                html    : templator.submissionConfirmationTemplate(req.body.application_reference, req.body.send_information, configSendGrid.urls.applicationServiceURL)
            });
            console.info('Sending submission confirmation email');
            return res.json(sendEmail(req,res, payload));
        });

    // =====================================
    // RESET PASSWORD
    // =====================================
    router

        .post('/reset-password', function(req, res) {

            //construct email from post request JSON
            var payload = new sendGrid.Email({
                to      : req.body.to,
                from    : configSendGrid.fromAddresses.test,
                subject : 'Reset password instructions',
                html    : templator.resetPasswordTemplate(req.body.token ,configSendGrid.urls.userServiceURL)
            });
            console.info('Sending reset password email');
            return res.json(sendEmail(req,res, payload));


        });
    // =====================================
    // PASSWORD UPDATED
    // =====================================
    router

        .post('/password-updated', function(req, res) {

            //construct email from post request JSON
            var payload = new sendGrid.Email({
                to      : req.body.to,
                from    : configSendGrid.fromAddresses.test,
                subject : 'Your password has been updated',
                html    : templator.passwordUpdatedTemplate()
            });
            console.info('Sending updated password email');
            return res.json(sendEmail(req,res, payload));


        });

    // =====================================
    // ACCOUNT LOCKED
    // =====================================
    router

        .post('/account_locked', function(req, res) {

            //construct email from post request JSON
            var payload = new sendGrid.Email({
                to      : req.body.to,
                from    : configSendGrid.fromAddresses.test,
                subject : 'Your account has been locked',
                html    : templator.accountLockedTemplate(req.body.name,req.body.to,configSendGrid.urls.userServiceURL)
            });
            console.info('Sending account locked email');
            return res.json(sendEmail(req,res, payload));


        });

    // =====================================
    // FAILED DOCUMENTS
    // =====================================
    router

        .post('/failed-documents', function(req, res) {

            //construct email from post request JSON
            var payload = new sendGrid.Email({
                to      : req.body.to,
                from    : configSendGrid.fromAddresses.test,
                subject : 'How to get documents certified',
                html    : templator.failedDocumentTemplate(req.body.failed_certs)
            });
            console.info('Sending failed eligibility email');
            return res.json(sendEmail(req,res, payload));
        });


    function sendEmail(req, res, payload) { //send the email via SendGrid
        //use SendGrid template (GOV.UK)
        payload.setFilters({
            'templates': {
                'settings': {
                    'enable': 1,
                    'template_id': configSendGrid.templates.emailTemplateId
                }
            }
        });
        payload.setFromName('Legalisation Office');
        sendGrid.send(payload, function (err, json) {
            if (err) {
                console.error(err);
                return false;
            }
            console.info('Email sent');
            console.log(json);
            return json;
        });

    }
};





