import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/auth';
import LoginForm from '../components/LoginForm.jsx';

class LoginPage extends Component {

    static propTypes = {
        actions: PropTypes.object.isRequired
    }
    /**
    * Class constructor.
    */
    constructor(props, context) {
        super(props, context);

        const storedMessage = localStorage.getItem('successMessage');
        let successMessage = '';

        if (storedMessage) {
            successMessage = storedMessage;
            localStorage.removeItem('successMessage');
        }

        // set the initial component state
        this.state = {
            errors: {},
            successMessage,
            user: {
                email: '',
                password: ''
            }
        };

        this.processForm = this.processForm.bind(this);
        this.changeUser = this.changeUser.bind(this);
    }

    /**
     * Process the form.
     *
     * @param {object} event - the JavaScript event object
     */
    processForm(event) {
      // prevent default action. in this case, action is the form submission event
      event.preventDefault();
      this.props.actions.submitLogin(this.state.user, this.props);
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
        return (
            <LoginForm
              onSubmit={this.processForm}
              onChange={this.changeUser}
              errors={this.state.errors}
              user={this.state.user}
            />
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
};

export default connect(null, mapDispatchToProps)(LoginPage);
