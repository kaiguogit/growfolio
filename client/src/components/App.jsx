import React, { PropTypes } from 'react';
import Header from './Header.jsx';
// This is a class-based component because the current
// version of hot reloading won't hot reload a stateless
// component at the top-level.
class App extends React.Component {
  render() {
    return (
      <div className="">
        <Header/>
        <div id="content" className="container-fluid">
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