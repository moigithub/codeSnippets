import React from 'react'
import { Field, reduxForm } from 'redux-form'
import { connect } from 'react-redux'

const renderField = ({
  input,
  label,
  type,
  meta: { touched, error, warning },
  children,
  ...rest
}) => (
  <div>
    <label>{label}</label>
    <div>
      <input {...input} placeholder={label} type={type} />
      {touched &&
        ((error && <span>{error}</span>) ||
          (warning && <span>{warning}</span>))}
    </div>
  </div>
)


let ContactForm = props => {
  const { handleSubmit, load, pristine, reset, submitting } = props
  return (
    <form onSubmit={ handleSubmit }>
      <div>
        <label htmlFor="firstName">First Name</label>
        <Field name="firstName" component="input" type="text" />
      </div>
      
      <div>
        <label>Favorite Color</label>
        <div>
          <Field name="favoriteColor" component="select">
            <option />
            <option value="ff0000">Red</option>
            <option value="00ff00">Green</option>
            <option value="0000ff">Blue</option>
          </Field>
        </div>
      </div>

      <div>
        <label htmlFor="lastName">Last Name</label>
        <Field name="lastName" component="input" type="text" />
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <Field name="email" component="input" type="email" />
      </div>

      <Field
        name="username"
        type="text"
        component={renderField}
        label="Username"
      />

      <div>
        <label>Favorite Color</label>
        <div>
          <Field name="favoriteColor" component="select">
            <option value="">Select a color...</option>
            {colors.map(colorOption => (
              <option value={colorOption} key={colorOption}>
                {colorOption}
              </option>
            ))}
          </Field>
        </div>
      </div>
      <div>
        <label>Bio</label>
        <div>
          <Field name="bio" component="textarea" />
        </div>
      </div>

      <div>
        <button type="submit" disabled={pristine || submitting}>Submit</button>
        <button type="button" disabled={pristine || submitting} onClick={reset}>
          Undo Changes
        </button>
      </div>
      
    </form>
  )
}


const validate = values => {
  const errors = {}
  if (!values.username) {
    errors.username = 'Required'
  } else if (values.username.length > 15) {
    errors.username = 'Must be 15 characters or less'
  }
  if (!values.email) {
    errors.email = 'Required'
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Invalid email address'
  }
  if (!values.age) {
    errors.age = 'Required'
  } else if (isNaN(Number(values.age))) {
    errors.age = 'Must be a number'
  } else if (Number(values.age) < 18) {
    errors.age = 'Sorry, you must be at least 18 years old'
  }
  return errors
}

const warn = values => {
  const warnings = {}
  if (values.age < 19) {
    warnings.age = 'Hmm, you seem a bit young...'
  }
  return warnings
}

ContactForm = reduxForm({
  form: 'contact', // a unique identifier for this form
  validate, // <--- validation function given to redux-form
  warn // <--- warning function given to redux-form
})(ContactForm)


ContactForm = connect(
  state => ({
    initialValues: state.account.data // pull initial values from account reducer
  }),
  { load: loadAccount } // bind account loading action creator
)(ContactForm)


export default ContactForm;



/*


handleSubmit = (values) => {
    // print the form values to the console
    console.log(values)
  }



<ContactForm handleSubmit = {this.handleSubmit} />

*/