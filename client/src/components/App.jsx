import React, { PropTypes } from 'react';

import NavBar from './NavBar.jsx';
// This is a class-based component because the current
// version of hot reloading won't hot reload a stateless
// component at the top-level.
class App extends React.Component {
  render() {
    return (
      <div className="container-fluid">
        <NavBar/>
        {this.props.children}
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.element
};

export default App;