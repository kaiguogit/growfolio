import React, {PropTypes} from 'react';
import { Link } from 'react-router';
import { Input, FormGroup } from '../shared/index.jsx';

const SignUpForm = ({
  onSubmit,
  onChange,
  errors,
  message,
  success,
  user,
}) => {
    const typeMap = {
        name: 'text',
        email: 'email',
        password: 'password'
    };

    const renderField = (fieldName) => {
        return (
            <FormGroup className={`${errors[fieldName] ? "has-danger" : ""}`}>
                <label className="form-control-label text-capitalize" htmlFor={fieldName}>{fieldName}</label>
                <Input id={fieldName} type={typeMap[fieldName]} value={user[fieldName]} name={fieldName} onChange={onChange}/>
                <div className="form-control-feedback">{errors[fieldName]}</div>
            </FormGroup>
        );
    };

    return (
        <div className="row justify-content-center">
            <div className="card mx-auto" style={{width: 500}}>
                <h3 className="card-header">Sign Up</h3>
                {message &&
                <div className={`alert alert-dismissible fade show ${(success ? "alert-success" : "alert-danger")}`} role="alert">
                    {message}
                </div>
                }
                <form onSubmit={onSubmit}>
                    {renderField('name')}
                    {renderField('email')}
                    {renderField('password')}
                    <input className="btn btn-primary" type="submit" value="Create New Account"/>
                </form>
                <span>Already have an account? <Link to="/login">Log in</Link>.</span>
            </div>
        </div>
    );
};

SignUpForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  message: PropTypes.string.isRequired,
  success: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired
};

export default SignUpForm;
