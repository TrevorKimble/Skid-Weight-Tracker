let SuperiorNodeServerUrl
let Environment

const hostname = window?.location?.hostname

if (hostname.includes('dataserv')) {
  SuperiorNodeServerUrl = '--redacted--'
} else if (hostname.includes('--redacted--.net')) {
  SuperiorNodeServerUrl = '--redacted--'
} else if (hostname.includes('devserv')) {
  SuperiorNodeServerUrl = '--redacted--'
} else if (hostname.includes('testserv')) {
  SuperiorNodeServerUrl = '--redacted--'
} else {
  SuperiorNodeServerUrl = 'http://localhost:3000'
}

export const API_ROOT = SuperiorNodeServerUrl