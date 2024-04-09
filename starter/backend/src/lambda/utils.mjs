import { parseUserId } from '../auth/utils.mjs'

export function getUserId(event) {
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  return parseUserId(jwtToken)
}

export function response(statusCode, item) {
  return {
    statusCode: statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true

    },
    body: JSON.stringify(item)
  }
}