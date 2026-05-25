import { test } from 'node:test'
import assert from 'node:assert/strict'
import { validateEnv } from '../env'

test('validateEnv returns shape when all vars present', () => {
  const env = {
    WEBFLOW_API_TOKEN: 'tok_abc',
    WEBFLOW_SITE_ID: 'site_123',
    FIREBASE_ADMIN_PROJECT_ID: 'fs-proj',
    FIREBASE_ADMIN_CLIENT_EMAIL: 'sa@fs-proj.iam',
    FIREBASE_ADMIN_PRIVATE_KEY: 'pem',
    FIREBASE_STORAGE_BUCKET: 'fs-proj.appspot.com',
  }

  const result = validateEnv(env)
  assert.equal(result.webflow.token, 'tok_abc')
  assert.equal(result.webflow.siteId, 'site_123')
  assert.equal(result.firebase.projectId, 'fs-proj')
  assert.equal(result.firebase.storageBucket, 'fs-proj.appspot.com')
})

test('validateEnv throws when WEBFLOW_API_TOKEN missing', () => {
  assert.throws(
    () => validateEnv({ WEBFLOW_SITE_ID: 'x' }),
    /WEBFLOW_API_TOKEN/
  )
})

test('validateEnv throws when FIREBASE_STORAGE_BUCKET missing', () => {
  assert.throws(
    () => validateEnv({
      WEBFLOW_API_TOKEN: 't',
      WEBFLOW_SITE_ID: 's',
      FIREBASE_ADMIN_PROJECT_ID: 'p',
      FIREBASE_ADMIN_CLIENT_EMAIL: 'e',
      FIREBASE_ADMIN_PRIVATE_KEY: 'k',
    }),
    /FIREBASE_STORAGE_BUCKET/
  )
})
