import React from 'react';
import DropdownMenu from 'react-dd-menu';
import PropTypes from 'prop-types';

class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        isMenuOpen: false
    };
    this.toggle = this.toggle.bind(this);
    this.close = this.close.bind(this);
  }

  toggle() {
    this.setState({ isMenuOpen: !this.state.isMenuOpen });
  }

  close() {
    this.setState({ isMenuOpen: false });
  }


  render() {
    const Toggle = this.props.toggle;
    const menuOptions = {
      isOpen: this.state.isMenuOpen,
      close: this.close,
      toggle: <Toggle onClick={this.toggle}/>,
      align: 'right',
      className: this.props.className
    };
    const children = Array.isArray(this.props.children) ? this.props.children
        : [this.props.children];

    return (
      <DropdownMenu {...menuOptions}>
        {children.map((child, i) =>
            <li key={i}>{child}</li>
        )}
      </DropdownMenu>
    );
  }
}

Menu.propTypes = {
    toggle: PropTypes.func,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ]),
    className: PropTypes.string
};

export default Menu;