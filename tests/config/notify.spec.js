import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('dotenv', () => ({
  default: { config: vi.fn(() => ({ parsed: { TEST: 'value' } })) },
}))
vi.mock('../../config/emailTemplates.js', () => ({
  emailTemplates: { welcome: 'Welcome Template' },
}))
vi.mock('../../config/serviceUrls.js', () => ({
  URLS: { api: 'http://default-api' },
}))

describe('notify config', () => {
  beforeEach(() => {
    process.env.CONFIGS = JSON.stringify({ foo: 'bar' })
    process.env.URLS = JSON.stringify({ api: 'http://env-api', extra: 'yes' })
  })

  it('should load and merge configs and urls', async () => {
    const { notify } = await import('../../config/notify.js')
    const result = notify()
    expect(result.configs).toEqual({
      foo: 'bar',
      notify_api_key: 'fake-api-key-please-set-me-loi',
      request_business_service_mailbox: 'fake-address-please-set-me-loi@fcdo.gov.uk',
    })
    expect(result.templates).toEqual({ welcome: 'Welcome Template' })
    expect(result.urls).toEqual({ api: 'http://env-api', extra: 'yes' })
    expect(result.env).toBeDefined()
  })

  describe('merging URLs', () => {
    beforeEach(() => {
      process.env.CONFIGS = JSON.stringify({ foo: 'bar' })
      process.env.URLS = JSON.stringify({ extra: 'yes' })
    })

    it('should merge URLs from config and env, with env taking precedence', async () => {
      const { notify } = await import('../../config/notify.js')
      const result = notify()
      expect(result.urls).toEqual({ api: 'http://default-api', extra: 'yes' })
    })
  })
})
