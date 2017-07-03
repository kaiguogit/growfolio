import React from 'react';
import PropTypes from 'prop-types';

import Header from './Header.jsx';
// This is a class-based component because the current
// version of hot reloading won't hot reload a stateless
// component at the top-level.
class App extends React.Component {
  render() {
    return (
      <div>
        <Header/>
        <div className="layout-main-content">
            {this.props.children}
        </div>
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.element
};

export default App;