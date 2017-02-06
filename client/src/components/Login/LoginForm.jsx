import React, {PropTypes} from 'react';
import { Link } from 'react-router';

const LoginForm = ({
  onSubmit,
  onChange,
  errors,
  message,
  success,
  user,
}) => {
    const typeMap = {
        email: 'email',
        password: 'password'
    };

    const renderField = (fieldName) => {
        return (
            <div className={`form-group ${errors[fieldName] ? "has-danger" : ""}`}>
                <label className="form-control-label text-capitalize" htmlFor={fieldName}>{fieldName}</label>
                <input className="form-control" id={fieldName} type={typeMap[fieldName]} value={user[fieldName]} name={fieldName} onChange={onChange}/>
                <div className="form-control-feedback">{errors[fieldName]}</div>
            </div>
        );
    };

    return (
        <div className="row justify-content-center">
            <div className="card mx-auto" style={{width: 500}}>
                <h3 className="card-header">Login</h3>
                {message &&
                <div className={`alert alert-dismissible fade show ${(success ? "alert-success" : "alert-danger")}`} role="alert">
                    {message}
                </div>
                }
                <form onSubmit={onSubmit}>
                    {renderField('email')}
                    {renderField('password')}
                    <input className="btn btn-primary" type="submit" value="Log in"/>
                </form>
                <span>Don't have an account? <Link to="/signup">Create One</Link>.</span>
            </div>
        </div>
    );
};
LoginForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  message: PropTypes.string.isRequired,
  success: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired
};

export default LoginForm;
