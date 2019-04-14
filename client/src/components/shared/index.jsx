import React from 'react';
import PropTypes from 'prop-types';

// Bootstrap 4 custom input
// https://v4-alpha.getbootstrap.com/components/forms/#checkboxes
export const CheckBox = ({title, onChange, checked, name}) => {

    const _onChange = (event) => {
        onChange(event);
    };

    return (
        <label className="custom-control custom-checkbox">
          <input type="checkbox" className="custom-control-input"
            name={name}
            onChange={_onChange} checked={checked}/>
          <span className="custom-control-indicator"/>
          <span className="custom-control-description">{title}</span>
        </label>
    );
};

CheckBox.propTypes = {
    title: PropTypes.string.isRequired,
    name: PropTypes.string,
    onChange: PropTypes.func,
    checked: PropTypes.bool
};

// Simple input component with bootstrap form-control class for drier code.
export const Input = (props) => {
    // spread object with exception
    // http://stackoverflow.com/questions/34698905/clone-a-js-object-except-for-one-key
    let {className, ...rest} = props;
    return (
        <input className={addClassName(className, "form-control")} {...rest}/>
    );
};

Input.propTypes = {
    className: PropTypes.string
};

export const Select = (props) => {
    let {className, children, ...rest} = props;
    return (
        <select className={addClassName(className, "form-control")} {...rest}>
            {children}
        </select>
    );
};

Select.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node
};

export const FormGroup = (props) => {
    let {className, children, ...rest} = props;
    return (
        <div className={addClassName(className, "form-group")} {...rest}>
            {children}
        </div>
    );
};

FormGroup.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node
};

function addClassName(className, addition) {
    className = className || '';
    addition = addition || '';
    if (addition && className) {
        return className + ' ' + addition;
    }
    return addition || className;
}