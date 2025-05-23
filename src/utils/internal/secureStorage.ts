import { jwtDecode } from 'jwt-decode';
import SecureLS from 'secure-ls';
import moment from 'moment';

// import appConfig from 'src/config/app'
import type * as types from 'src/constants/types';

// const secureLS = require('secure-ls')
const ls = new SecureLS({
  encodingType: 'aes',
  // encryptionSecret: appConfig.oauth.client_secret.substr(0, 32),
  isCompression: false,
})

// console.log('SecureLS', { SecureLS, secureLS })

const KEY_TOKEN = 'idvalid-session'

// --------- BASE ---------
function getStorage(key: string) {
  return ls.get(key)
}

function saveStorage(key: string, data: any) {
  ls.set(key, data)
}

function deleteStorage(key: string) {
  ls.remove(key)
}

// --------- HELPER ---------
function getUserToken(): types.TOKEN | null {
  let credential = null

  try {
    credential = getStorage(KEY_TOKEN)
  } catch(e) {}

  return credential || null

  return credential || {
    username: null,
    access_token: null,
    refresh_token: null,
    profile: {},
  }
}

function setUserToken(data: any) {
  saveStorage(KEY_TOKEN, data)
}

function assignUserToken(data: any) {
  setUserToken({ ...getUserToken(), ...data })
}

function deleteUserToken() {
  deleteStorage(KEY_TOKEN)
}

function getUserTokenObject(tokenType: 'access_token'): types.ACCESS_TOKEN;
function getUserTokenObject(tokenType: 'refresh_token'): types.REFRESH_TOKEN;
function getUserTokenObject(tokenType: 'access_token' | 'refresh_token'): types.ACCESS_TOKEN | types.REFRESH_TOKEN {
  const userToken = getUserToken()
  console.log('getUserTokenObject userToken', userToken)
  const strAccessToken = userToken?.[tokenType] || ''

  try {
    return jwtDecode(strAccessToken)
  } catch(error) {
    return null
  }
}

function getIsAuthorizedTwoFactor(): boolean {
  const MARGIN_EXPIRED = 3000

  const userTokenObject = getUserTokenObject('access_token')
  console.log('getIsAuthorizedTwoFactor userTokenObject', userTokenObject)

  let isAuthorizedTwoFactor = false

  // if (userTokenObject?.mfe)
  //   console.log('getIsAuthorizedTwoFactor', moment(userTokenObject.mfe * 1000).diff(moment()), moment.duration(moment(userTokenObject.mfe * 1000).diff(moment()))._data)
  
  if (userTokenObject?.mfe)
    isAuthorizedTwoFactor = moment(userTokenObject.mfe * 1000).diff(moment()) > MARGIN_EXPIRED

  return isAuthorizedTwoFactor
}

export default {
  // get: getStorage,
  // save: saveStorage,
  // delete: deleteStorage,
  getUserToken,
  setUserToken,
  assignUserToken,
  deleteUserToken,
  // --------- TOKEN HELPER BY CASE ---------
  getUserTokenObject,
  getIsAuthorizedTwoFactor,
}

// // eslint-disable-next-line import/no-anonymous-default-export
// export default {
//   get(key) {
//     try {
//       return ls.get(key)
//     } catch(e) {}

//     return null
//   },

//   save(key, data) {
//     ls.set(key, data)
//   },

//   remove(key) {
//     ls.remove(key)
//   },

//   getUserToken() {
//     let credential = null

//     try {
//       credential = ls.get(TOKEN_KEY)
//     } catch(e) {}

//     return credential || {
//       username: null,
//       access_token: null,
//       refresh_token: null,
//       profile: {},
//     }
//   },

//   setUserToken(data) {
//     this.save(TOKEN_KEY, data)
//   },

//   removeUserToken() {
//     this.remove(TOKEN_KEY)
//   },

//   updateUserToken(data) {
//     this.setUserToken({ ...this.getUserToken(), ...data })
//   },

//   setCompanies(companies, withSetSelectedCompany = true) {
//     const userToken = this.getUserToken()
//     userToken.companies = companies

//     if (withSetSelectedCompany) {
//       if (Array.isArray(companies)) {
//         let selectedIndex = -1
//         if (userToken.selectedCompany) {
//           selectedIndex = companies.findIndex(company => company.alias === userToken.selectedCompany)
//         }

//         if (selectedIndex === -1) {
//           selectedIndex = companies.findIndex(company => company.user_registered && company.user_active)
//         }
//         if (selectedIndex === -1) {
//           selectedIndex = companies.findIndex(company => company.user_active)
//         }
//         if (selectedIndex === -1) {
//           selectedIndex = companies.findIndex(company => company.user_registered)
//         }

//         if (selectedIndex !== -1) {
//           userToken.selectedCompany = companies[selectedIndex].alias
//         }
//       }
//     }

//     this.setUserToken(userToken)
//   },

//   getObjCompanies() {
//     const userToken = this.getUserToken()
//     let objCompanies = null
//     if (Array.isArray(userToken.companies)) {
//       // objCompanies = userToken.companies.reduce((accumulator, current) => ({ ...accumulator, [current.alias]: current }), {})
//     }

//     return objCompanies
//   },

//   setAccount(account) {
//     const userToken = this.getUserToken()
//     userToken.account = account
//     this.setUserToken(userToken)
//   },

//   setCurrentUser(user) {
//     const userToken = this.getUserToken()
//     if (userToken.selectedCompany && Array.isArray(userToken.companies)) {
//       const indexCurrentCompany = userToken.companies.findIndex(company => company.alias === userToken.selectedCompany)
//       if (indexCurrentCompany !== -1) {
//         userToken.companies[indexCurrentCompany].user = user
//         this.setUserToken(userToken)
//       }
//     }
//   },

//   getCurrentUser() {
//     const userToken = this.getUserToken()
//     let currentUser = null
//     if (userToken.selectedCompany && Array.isArray(userToken.companies)) {
//       const currentCompany = userToken.companies.find(company => company.alias === userToken.selectedCompany)
//       if (currentCompany) {
//         currentUser = currentCompany.user
//         Object.defineProperties(currentUser, {
//           company: {
//             get() {
//               return currentCompany
//             }
//           }
//         })
//       }
//     }

//     return currentUser
//   },

//   getFullName() {
//     let fullName = null

//     const user = this.getCurrentUser()
//     if (user) {
//       fullName = user.first_name || ''
//       if (user.last_name) {
//         fullName += ' ' + user.last_name
//       }

//       if (!fullName) {
//         const account = this.getUserToken().account
//         if (account) {
//           fullName = account.first_name || ''
//           if (account.last_name) {
//             fullName += ' ' + account.last_name
//           }

//           if (!fullName) fullName = account.email
//         }
//       }
//     }

//     return fullName
//   },
// }