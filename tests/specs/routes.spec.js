const { expect } = require('chai')
const express = require('express')
const request = require('supertest')
const httpOkStatus = 200
const registerRoutes = require('../../app/routes')

class FakeNotifyClient {
  constructor() {
    FakeNotifyClient.lastInstance = this
    this.sendEmailCalls = []
    this.sendSmsCalls = []
  }

  sendEmail(templateId, to, options) {
    this.sendEmailCalls.push({ templateId, to, options })
    return Promise.resolve({ ok: true })
  }

  sendSms(templateId, to, options) {
    this.sendSmsCalls.push({ templateId, to, options })
    return Promise.resolve({ ok: true })
  }
}

function createTestApp() {
  const app = express()
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  const router = express.Router()
  const notifySettings = {
    configs: {
      notify_api_key: 'test-api-key',
      request_business_service_mailbox: 'biz@example.test',
    },
    templates: {
      emailTemplateConfirm: 'tmpl-confirm',
      emailTemplateSubmissionStandardCustRefRoyalMail: 'tmpl-sub-standard-custref-rm',
      emailTemplateSubmissionPremium: 'tmpl-sub-premium',
      emailTemplateSubmissionEApp: 'tmpl-sub-eapp',
      emailTemplateBusinessAccessDecision: 'tmpl-business-decision',
      textMessageOneTimePasscode: 'tmpl-otp-sms',
      emailTemplateFailedDoc: 'tmpl-failed-doc',
      emailTemplateAdditionalPaymentReceipt: 'tmpl-additional-receipt',
      emailTemplateRequestBusinessAccess: 'tmpl-request-business-access',
    },
    urls: {
      userServiceURL: 'https://user.test',
      applicationServiceURL: 'https://app.test',
    },
  }

  registerRoutes(router, FakeNotifyClient, notifySettings)
  app.use('/api/notification', router)
  return app
}

describe('Routes unit tests', () => {
  let app

  beforeEach(() => {
    app = createTestApp()
  })

  it('POST /confirm-email sends confirmation email with expected payload', async () => {
    const body = {
      application_reference: 'APP-123',
      to: 'user@example.test',
      token: 'abc-token',
    }

    const response = await request(app).post('/api/notification/confirm-email').send(body).expect(httpOkStatus)

    expect(response.body).to.equal('Confirmation email sent')
    const call = FakeNotifyClient.lastInstance.sendEmailCalls[0]
    expect(call.templateId).to.equal('tmpl-confirm')
    expect(call.to).to.equal('user@example.test')
    expect(call.options.personalisation).to.deep.equal({
      application_reference: 'APP-123',
      email_address: 'user@example.test',
      token: 'abc-token',
      url: 'https://user.test',
    })
    expect(call.options.reference).to.equal('email confirmation')
  })

  it('POST /confirm-submission for standard service + customer ref + royal mail', async () => {
    const body = {
      application_reference: 'APP-456',
      application_guid: 'guid-123',
      to: 'user@example.test',
      user_ref: 'CUST-1',
      service_type: 1,
      send_information: [['Royal Mail tracked delivery']],
    }

    const response = await request(app).post('/api/notification/confirm-submission').send(body).expect(httpOkStatus)

    expect(response.body).to.equal('submission email (standard - customer reference - royal mail) sent')
    const call = FakeNotifyClient.lastInstance.sendEmailCalls[0]
    expect(call.templateId).to.equal('tmpl-sub-standard-custref-rm')
    expect(call.options.personalisation.customerRef).to.equal('CUST-1')
    expect(call.options.personalisation.coverSheetLink).to.equal('https://app.test/open-paper-app/APP-456/guid-123')
  })

  it('POST /confirm-submission for premium service without customer ref', async () => {
    const body = {
      application_reference: 'APP-789',
      application_guid: 'guid-789',
      to: 'user@example.test',
      user_ref: '',
      service_type: 2,
    }

    const response = await request(app).post('/api/notification/confirm-submission').send(body).expect(httpOkStatus)

    expect(response.body).to.equal('submission email (premium) sent')
    const call = FakeNotifyClient.lastInstance.sendEmailCalls[0]
    expect(call.templateId).to.equal('tmpl-sub-premium')
    expect(call.options.personalisation.application_reference).to.equal('APP-789')
  })

  it('POST /confirm-submission for e-app service sends e-app template', async () => {
    const body = {
      application_reference: 'EAPP-111',
      to: 'eapp@example.test',
      service_type: 4,
      send_information: {
        first_name: 'Ada',
        last_name: 'Lovelace',
      },
    }

    const response = await request(app).post('/api/notification/confirm-submission').send(body).expect(httpOkStatus)

    expect(response.body).to.equal('submission email (e-app - EAPP-111) sent')
    const call = FakeNotifyClient.lastInstance.sendEmailCalls[0]
    expect(call.templateId).to.equal('tmpl-sub-eapp')
    expect(call.options.personalisation).to.deep.equal({
      application_reference: 'EAPP-111',
      first_name: 'Ada',
      last_name: 'Lovelace',
      app_url: 'https://app.test/open-eapp/EAPP-111',
    })
    expect(call.options.reference).to.equal('submission - e-app - EAPP-111')
  })

  it('POST /business-service-decision maps approve and reject flags', async () => {
    const approveResponse = await request(app)
      .post('/api/notification/business-service-decision')
      .send({ to: 'user@example.test', decision: 'approve' })
      .expect(httpOkStatus)

    expect(approveResponse.body).to.equal('Business service access decision email has been sent')
    let call = FakeNotifyClient.lastInstance.sendEmailCalls[0]
    expect(call.templateId).to.equal('tmpl-business-decision')
    expect(call.options.personalisation).to.deep.equal({ approve: 'yes', reject: 'no' })

    const rejectResponse = await request(app)
      .post('/api/notification/business-service-decision')
      .send({ to: 'user@example.test', decision: 'reject' })
      .expect(httpOkStatus)

    expect(rejectResponse.body).to.equal('Business service access decision email has been sent')
    call = FakeNotifyClient.lastInstance.sendEmailCalls[1]
    expect(call.options.personalisation).to.deep.equal({ approve: 'no', reject: 'yes' })
  })

  it('POST /one_time_passcode_sms uses sendSms with passcode payload', async () => {
    const response = await request(app)
      .post('/api/notification/one_time_passcode_sms')
      .send({
        to: '+447000000001',
        oneTimePasscode: '123456',
      })
      .expect(httpOkStatus)

    expect(response.body).to.equal('One time passcode sms sent')
    expect(FakeNotifyClient.lastInstance.sendEmailCalls).to.have.lengthOf(0)
    expect(FakeNotifyClient.lastInstance.sendSmsCalls).to.have.lengthOf(1)
    const call = FakeNotifyClient.lastInstance.sendSmsCalls[0]
    expect(call.templateId).to.equal('tmpl-otp-sms')
    expect(call.options.personalisation).to.deep.equal({ one_time_passcode: '123456' })
  })

  it('POST /failed-documents uses plural label and mapped document titles', async () => {
    const response = await request(app)
      .post('/api/notification/failed-documents')
      .send({
        to: 'user@example.test',
        failed_certs: JSON.stringify([{ doc_title: 'Passport' }, { doc_title: 'Birth certificate' }]),
      })
      .expect(httpOkStatus)

    expect(response.body).to.equal('Failed document eligibility email sent')
    const call = FakeNotifyClient.lastInstance.sendEmailCalls[0]
    expect(call.templateId).to.equal('tmpl-failed-doc')
    expect(call.options.personalisation.docLabel).to.equal('documents')
    expect(call.options.personalisation.failedCertList).to.deep.equal(['Passport', 'Birth certificate'])
  })

  it('POST /failed-documents uses singular label for one document', async () => {
    await request(app)
      .post('/api/notification/failed-documents')
      .send({
        to: 'user@example.test',
        failed_certs: JSON.stringify([{ doc_title: 'Passport' }]),
      })
      .expect(httpOkStatus)

    const call = FakeNotifyClient.lastInstance.sendEmailCalls[0]
    expect(call.options.personalisation.docLabel).to.equal('document')
    expect(call.options.personalisation.failedCertList).to.deep.equal(['Passport'])
  })

  it('POST /additional-payment-receipt sends expected payment personalisation', async () => {
    const response = await request(app)
      .post('/api/notification/additional-payment-receipt')
      .send({
        to: 'user@example.test',
        dateOfPayment: '2026-02-20',
        pspReference: 'PSP-123',
        serviceSlug: 'premium',
        paymentAmount: '123.45',
        paymentMethod: 'card',
      })
      .expect(httpOkStatus)

    expect(response.body).to.equal('Additional payment receipt email sent')
    const call = FakeNotifyClient.lastInstance.sendEmailCalls[0]
    expect(call.templateId).to.equal('tmpl-additional-receipt')
    expect(call.options.personalisation).to.deep.equal({
      dateOfPayment: '2026-02-20',
      pspReference: 'PSP-123',
      serviceSlug: 'premium',
      paymentAmount: '123.45',
      paymentMethod: 'card',
    })
  })

  it('POST /request-business-access uses configured mailbox as recipient', async () => {
    const response = await request(app)
      .post('/api/notification/request-business-access')
      .send({
        userEmail: 'requester@example.test',
        companyName: 'Test Co',
        companiesHouseNumber: '12345678',
        businessArea: 'Imports',
        justification: 'Need team access',
        token: 'approval-token',
      })
      .expect(httpOkStatus)

    expect(response.body).to.equal('Business access request email has been sent')
    const call = FakeNotifyClient.lastInstance.sendEmailCalls[0]
    expect(call.templateId).to.equal('tmpl-request-business-access')
    expect(call.to).to.equal('biz@example.test')
    expect(call.options.personalisation).to.include({
      userEmail: 'requester@example.test',
      companyName: 'Test Co',
      companiesHouseNumber: '12345678',
      businessArea: 'Imports',
      justification: 'Need team access',
      token: 'approval-token',
      url: 'https://user.test',
    })
  })
})
