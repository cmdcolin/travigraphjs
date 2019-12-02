import React from 'react'
import { useForm, useField } from 'react-final-form-hooks'

export default ({ onSubmit, initialValues }) => {
  const { form, handleSubmit, pristine, submitting } = useForm({
    onSubmit, // the function to call with your form values upon valid submit
    initialValues,
  })
  const repo = useField('repo', form)
  const token = useField('token', form)
  const com = useField('com', form)
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Repo name</label>
        <input {...repo.input} />
      </div>
      <div>
        <label>Authorization token (only needed for private)</label>
        <input {...token.input} />
      </div>
      <div>
        <label>On travis-ci.com instead of travis-ci.org?</label>
        <input
          type="checkbox"
          id={com.input.name}
          checked={com.input.value}
          {...com.input}
        />
      </div>

      <button type="submit" disabled={pristine || submitting}>
        Submit
      </button>
    </form>
  )
}
