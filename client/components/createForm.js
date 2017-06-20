import React from 'react'
import { Field, FieldArray, reduxForm } from 'redux-form'
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
      {type==="textarea" && <textarea {...input} placeholder={label} type={type} />}
      {type!=="textarea" && <input {...input} placeholder={label} type={type} />}
      {touched &&
        ((error && <span>{error}</span>) ||
          (warning && <span>{warning}</span>))}
    </div>
  </div>
)

const renderLinks = ({ fields, meta: { error } }) => (
  <ul>
    <li>
      <button type="button" onClick={() => fields.push()}>Add Link</button>
    </li>
    {fields.map((link, index) => (
      <li key={index}>
        <button
          type="button"
          title="Remove link"
          onClick={() => fields.remove(index)}
        >Remove</button>
        <Field
          name={link}
          type="text"
          component={renderField}
          label={`Link #${index + 1}`}
        />
      </li>
    ))}
    {error && <li className="error">{error}</li>}
  </ul>
);


/*
  language : String,
  description: String,
  title: String,
  code: String,
  tags : [String],
  links: [String],
  postedBy 
*/
let ContactForm = props => {
  const { handleSubmit, load, pristine, reset, submitting } = props
  return (
    <form onSubmit={ handleSubmit }>
      <Field
        name="title"
        type="text"
        component={renderField}
        label="Title"
      />

      <div>
        <label htmlFor="description">Description</label>
        <Field name="description" component="input" type="text" />
      </div>
      
      <div>
        <label>Language</label>
        <div>
          <Field name="language" component="select">
            <option value="">All</option>
            <option value="Javascript">Javascript</option>
            <option value="Ruby">Ruby</option>
          </Field>
        </div>
      </div>

      <Field name="code" type="textarea" component={renderField} label="Code"/>

      <FieldArray name="links" component={renderLinks} />

{/*
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
*/}      
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
  
  if (!values.title) {
    errors.title = 'Required'
  } else if (values.title.length < 3) {
    errors.title = 'Must be at least 3 characters or more'
  }
  if (!values.code) {
    errors.code = 'Required'
  } else if (values.code.length < 3) {
    errors.code = 'Enter a valid code.'
  }
  if (!values.language) {
    errors.language = 'Required'
  }
  
  return errors
}

const warn = values => {
  const warnings = {}
  /*
  if (values.age < 19) {
    warnings.age = 'Hmm, you seem a bit young...'
  }
  */
  return warnings
}

ContactForm = reduxForm({
  form: 'contact', // a unique identifier for this form
  validate, // <--- validation function given to redux-form
  warn // <--- warning function given to redux-form
})(ContactForm)


ContactForm = connect(
  /*
  state => ({
    initialValues: state.account.data // pull initial values from account reducer
  }),
  { load: loadAccount } // bind account loading action creator
  */
)(ContactForm)


export default ContactForm;



/*


handleSubmit = (values) => {
    // print the form values to the console
    console.log(values)
  }



<ContactForm handleSubmit = {this.handleSubmit} />

*/