import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../actions/tscs';

// Create a collapsible row to show/hide its children
class TableCategory extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    toggleCollapse() {
        this.props.actions.setOneCollapse(this.props.symbol, !this.props.collapse);
    }

    render() {
        const {titleFn} = this.props;
        return (
            // Use multiple tbody in table, so that we can return multiple <tr> in one element.
            // https://stackoverflow.com/a/37112662
            // Alternative use react-package to create <frag> tags, which will be removed in render.
            // NOTE: React 16 now support Fragment, so don't need frag anymore.
            <React.Fragment>
                <tbody>
                    <tr className="table-category">
                        <td colSpan={this.props.columnsCount} onClick={this.toggleCollapse.bind(this)} className="toggle-label">
                            <span className="table-category-title">
                                <i className={"fa " + (this.props.collapse ? "fa-plus-square" : "fa-minus-square")} aria-hidden="true"/>
                                <span>{typeof titleFn === 'function' ? titleFn() : titleFn}</span>
                            </span>
                        </td>
                    </tr>
                </tbody>
                {this.props.children}
            </React.Fragment>
        );
    }
}

TableCategory.propTypes = {
    titleFn: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.string
    ]),
    columnsCount: PropTypes.number.isRequired,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ]),
    collapse: PropTypes.bool,
    symbol: PropTypes.string.isRequired,
    actions: PropTypes.object.isRequired
};


const mapStateToProps = (state, props) => {
    return {
        collapse: state.tscs.collapse[props.symbol]
    };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(TableCategory);
