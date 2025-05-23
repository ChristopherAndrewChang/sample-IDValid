import { get } from 'lodash';

function getField(errResponseData, fields = []) {
  
}

function getStrErrorMessage(errResponseData): string {
  return JSON.stringify(errResponseData)
}

function setFieldsError(errResponseData, fields = []) {
  errResponseData = {
    "new_password": ["Must be different from the old password."]
  }
  // fields = [
  //   { dataIndex: 'old_password' },
  //   { dataIndex: 'new_password' },
  // ]
  fields = ['old_password', 'new_password']

  for (const field of fields) {
    errResponseData[field]
  }
}

export default {
  error: getStrErrorMessage,
}