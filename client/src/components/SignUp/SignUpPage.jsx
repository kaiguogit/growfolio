import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SignUpForm from './SignUpForm.jsx';
import * as actions from '../../actions/auth';
import NProgress from 'nprogress';

class SignUpPage extends Component {

    static propTypes = {
        actions: PropTypes.object.isRequired,
        errors: PropTypes.object,
        message: PropTypes.string,
        success: PropTypes.bool,
        isFetching: PropTypes.bool
    }

    /**
     * Class constructor.
     */
    constructor(props) {
      super(props);

      // set the initial component state
      this.state = {
        user: {
          email: '',
          name: '',
          password: ''
        }
      };

      this.processForm = this.processForm.bind(this);
      this.changeUser = this.changeUser.bind(this);
    }

    componentWillUnmount() {
        NProgress.done();
        this.props.actions.clearSignUpError();
    }
    /**
     * Process the form.
     *
     * @param {object} event - the JavaScript event object
     */
    processForm(event) {
      // prevent default action. in this case, action is the form submission event
      event.preventDefault();
      this.props.actions.submitSignUp(this.state.user);
    }

    /**
     * Change the user object.
     *
     * @param {object} event - the JavaScript event object
     */
    changeUser(event) {
      const field = event.target.name;
      const user = this.state.user;
      user[field] = event.target.value;

      this.setState({
        user
      });
    }

    render() {
        this.props.isFetching ? NProgress.start() : NProgress.done();
        return (
            <SignUpForm
              onSubmit={this.processForm}
              onChange={this.changeUser}
              errors={this.props.errors}
              message={this.props.message}
              success={this.props.success}
              user={this.state.user}
            />
        );
    }
}

const mapStateToProps = state => {
  const {errors, message, success, isFetching} = state.auth.signup;
  return {errors, message, success, isFetching};
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUpPage);
