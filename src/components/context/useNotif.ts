import { App, NotificationArgsProps } from 'antd';
import { get } from 'lodash';

import { lib } from 'src/utils';

// import type * as React from 'react';

// type MyNotifProps = NotificationArgsProps & {
//   message?: React.ReactNode; // not working
// }

export default function useNotif() {
  const { notification } = App.useApp()

  const setFieldsError = (rawError: any, form?) => {
    console.log('setFieldsError form', form)
    if (form) {
      const fieldsValue = form.getFieldsValue()
      const formFields = []
      console.log('setFieldsError fieldsValue', fieldsValue)

      for (const field in fieldsValue) {
        if (get(rawError?.response?.data, [field])) {
          formFields.push({ name: field, errors: rawError.response.data[field] })
        }
      }

      console.log('setFieldsError formFields', formFields)
      form.setFields(formFields)
    }
  }

  return {
    notification,
    notifError: (rawError, notifOpts?: Partial<NotificationArgsProps>, form?: any) => {
      console.log('notifError', { rawError, form })
      let message = 'Error'
      let description = 'An error has occured, please try again later'

      if (rawError?.response?.status) {
        message = `Error ${rawError.response.status}`
        description = lib.getStrErrorMessage(rawError.response.data)

        setFieldsError(rawError, form)
      }

      notification.error({
        message,
        description,
        ...notifOpts,
      })
    },
  }
}