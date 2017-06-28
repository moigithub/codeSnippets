import React from 'react'
import { Field, FieldArray, reduxForm } from 'redux-form'

const renderField = ({
  input,
  label,
  type,
  clase,
  meta: { touched, error, warning },
  children,
  ...rest
}) => (
  <div className={clase}>
    <label className="col-sm-2 control-label">{label}</label>
    <div className="col-sm-10">
      {type==="textarea" && <textarea {...input} {...rest} placeholder={label} type={type} className="form-control"/>}
      {type!=="textarea" && <input {...input} {...rest} placeholder={label} type={type}  className="form-control"/>}
      {touched &&
        ((error && <p className="help-block pull-right">{error}</p>) ||
          (warning && <p className="help-block pull-right">{warning}</p>))}
    </div>      
  </div>
)

const renderLinks = ({ fields, meta: { error } }) => (
  <ul>
    <li>
      <button type="button" className="btn btn-primary" onClick={() => fields.push()}>Add Link</button>
    </li>
    {fields.map((link, index) => (
      <li key={index} className="row ">
        <Field
          name={link}
          clase="form-group col-sm-10"
          type="text"
          component={renderField}
          label={`Link #${index + 1}`}
        />
        <span className="col-sm-2">
          <button
            type="button"
            title="Remove link"
            className="btn btn-danger"
            onClick={() => fields.remove(index)}
          >Remove</button>
        </span>
      </li>
    ))}
    {error && <li className="error help-block pull-right">{error}</li>}
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
  const { handleSubmit, title, pristine, reset, submitting } = props
//  console.log("createForm.js props",props);
  return (
    <div className="container">
      <h1>{title}</h1>
      <form onSubmit={ handleSubmit } className="form-horizontal">
        <Field
          name="title"
          clase="form-group"
          type="text"
          component={renderField}
          label="Title"
          className="form-control"
        />

        
        <Field name="description" 
          component={renderField}
          clase="form-group"
          type="text" 
          label="Description" 
          className="form-control"/>
        
        
        <div className="form-group">
          <label className="col-sm-2 control-label">Language</label>
          <div className="col-sm-10">
            <Field name="language" component="select" className="form-control">
              <option value="">All</option>
              <option value="Javascript">Javascript</option>
              <option value="Ruby">Ruby</option>
            </Field>
          </div>
        </div>

        <Field name="code" 
          type="textarea" 
          clase="form-group"
          rows={6}
          component={renderField} 
          label="Code"/>

        <Field
          name="tags"
          clase="form-group"
          type="text"
          placeholder="Enter tags separated with comma..."
          component={renderField}
          label="Tags"
        />

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
          <button type="submit" className="btn btn-primary" disabled={pristine || submitting}>Submit</button>
          <button type="button" className="btn btn-warning" disabled={pristine || submitting} onClick={reset}>
            Clear Form
          </button>
        </div>
        
      </form>
    </div>
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
  enableReinitialize: true,
  validate, // <--- validation function given to redux-form
  warn // <--- warning function given to redux-form
})(ContactForm)


export default ContactForm;