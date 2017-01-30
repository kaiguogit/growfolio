import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SignUpForm from '../components/SignUpForm.jsx';
import * as actions from '../actions/auth';

class SignUpPage extends Component {

    static propTypes = {
        actions: PropTypes.object.isRequired
    }

    /**
     * Class constructor.
     */
    constructor(props) {
      super(props);

      // set the initial component state
      this.state = {
        errors: {},
        user: {
          email: '',
          name: '',
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
        return (
            <SignUpForm
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

export default connect(null, mapDispatchToProps)(SignUpPage);
