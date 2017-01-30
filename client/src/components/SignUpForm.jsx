import React, {PropTypes} from 'react';

const SignUpForm = ({
  onSubmit,
  onChange,
  errors,
  user,
}) => (
    <form onSubmit={onSubmit}>
        <input type="text" value={user.name} name="name" onChange={onChange}/>
        <input type="email" value={user.email} name="email" onChange={onChange}/>
        <input type="password"value={user.password} name="password" onChange={onChange}/>
        <input type="submit" value="submit"/>
    </form>
);

SignUpForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
};

export default SignUpForm;
