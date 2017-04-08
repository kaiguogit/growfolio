import React, {PropTypes} from 'react';

// Bootstrap 4 custom input
// https://v4-alpha.getbootstrap.com/components/forms/#checkboxes
export const CheckBox = ({title, onChange, checked}) => {

    const _onChange = (event) => {
        onChange(event.target.checked);
    };

    return (
        <label className="custom-control custom-checkbox">
          <input type="checkbox" className="custom-control-input"
            onChange={_onChange} checked={checked}/>
          <span className="custom-control-indicator"/>
          <span className="custom-control-description">{title}</span>
        </label>
    );
};

CheckBox.propTypes = {
    title: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    checked: PropTypes.bool
};