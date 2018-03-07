# is-notification-service

This repository complements the loi-application-service by adding 'notification' capabilities. It integrates with SendGrid to send emails and constructs a number of templates.

**Please note:**
The UAT, PRE-PROD and PROD environments all have their own corresponding email templates in SendGrid. Because the UAT and PRE-PROD environments are restricted to a small number of users and aren't publicly accessible, the email assets from these environments reference those in Production so they render correctly for testing purposes.