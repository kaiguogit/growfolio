import React, {PropTypes} from 'react';
import { Link } from 'react-router';

const LoginForm = ({
  onSubmit,
  onChange,
  errors,
  user,
}) => (
    <form onSubmit={onSubmit}>
        <input type="email" value={user.email} name="email" onChange={onChange}/>
        <input type="password"value={user.password} name="password" onChange={onChange}/>
        <input type="submit" value="submit"/>
        <span>Don't Have an account? <Link to="/signup">Create ONE</Link>.</span>
    </form>
);

LoginForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
};

export default LoginForm;
