import React from 'react'
import { useForm, useField } from 'react-final-form-hooks'
import PropTypes from 'prop-types'

function RepoForm({
  onSubmit,
  initialValues,
}: {
  onSubmit: any
  initialValues: any
}) {
  const { form, handleSubmit, pristine, submitting } = useForm({
    onSubmit, // the function to call with your form values upon valid submit
    initialValues,
  })
  const repo = useField('repo', form)
  const token = useField('token', form)
  const com = useField('com', form)
  const queue = useField('queue', form)
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
      <div>
        <label>View queue time instead of build duration?</label>
        <input
          type="checkbox"
          id={queue.input.name}
          checked={queue.input.value}
          {...queue.input}
        />
      </div>

      <button type="submit" disabled={pristine || submitting}>
        Submit
      </button>
    </form>
  )
}
RepoForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.shape({}).isRequired,
}

export default RepoForm
