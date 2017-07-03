import React from 'react';
import PropTypes from 'prop-types';

import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../actions/auth';
import LoginForm from './LoginForm.jsx';
import NProgress from 'nprogress';

class LoginPage extends React.Component {

    static propTypes = {
        actions: PropTypes.object.isRequired,
        errors: PropTypes.object,
        message: PropTypes.string,
        success: PropTypes.bool,
        isFetching: PropTypes.bool,
        history: PropTypes.object
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
                password: ''
            }
        };

        this.processForm = this.processForm.bind(this);
        this.changeUser = this.changeUser.bind(this);
    }

    componentWillUnmount() {
        NProgress.done();
        this.props.actions.clearLoginError();
    }

    /**
     * Process the form.
     *
     * @param {object} event - the JavaScript event object
     */
    processForm(event) {
      // prevent default action. in this case, action is the form submission event
      event.preventDefault();
      this.props.actions.submitLogin(this.state.user, () => {
            // Redirect to previous intended page if applicable
            const history = this.props.history;
            const location = history.location;
            if (location.state && location.state.from) {
                history.replace(location.state.from);
            } else {
                history.replace('/');
            }
      });
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
            <LoginForm
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
    const {errors, message, success, isFetching} = state.auth.login;
    return {errors, message, success, isFetching};
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LoginPage));
