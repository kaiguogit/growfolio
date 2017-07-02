import React, { PropTypes } from 'react';

// Create a collapsible row to show/hide its children
class TableCategory extends React.Component {
    static propTypes = {
        title: PropTypes.string.isRequired,
        columnsCount: PropTypes.number.isRequired,
        children: PropTypes.oneOfType([
            PropTypes.arrayOf(PropTypes.node),
            PropTypes.node
        ])
    };

    constructor(props) {
        super(props);
        this.state = {collapse: true};
    }

    toggleCollapse = () => {
        this.setState({collapse: !this.state.collapse});
    }

    render() {
        return (
            // Use multiple tbody in table, so that we can return multiple <tr> in one element.
            // https://stackoverflow.com/a/37112662
            // Alternative use react-package to create <frag> tags, which will be removed in render.
            <tbody>
                <tr className="table-category">
                    <td colSpan={this.props.columnsCount} onClick={this.toggleCollapse} className="toggle-label">
                        <i className={"fa " + (this.state.collapse ? "fa-plus-square" : "fa-minus-square")} aria-hidden="true"/>
                        <span>{this.props.title}</span>
                    </td>
                </tr>
                {this.state.collapse || this.props.children}
            </tbody>
        );
    }
}

export default TableCategory;
