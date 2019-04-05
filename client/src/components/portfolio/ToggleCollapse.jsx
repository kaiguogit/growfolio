import React from 'react';
import PropTypes from 'prop-types';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../../actions/tscs';
import { getHoldingsWithValidTscs } from '../../selectors';

class ToggleCollapse extends React.Component {

    toggle() {
        this.props.actions.setAllCollapse(!this.isAllCollapse());
    }
    isAllCollapse() {
        return this.props.holdings.every(h => {
            return Object.entries(this.props.collapse).every(([symbol, value]) => {
                if (h.symbol === symbol) {
                    return value;
                }
                return true;
            });
        });
    }
    render() {
        return (
            <button className="mod-small" onClick={this.toggle.bind(this)}>
                <i className={"fa fa-lg " + (this.isAllCollapse() ? "fa-plus-square" : "fa-minus-square")} aria-hidden="true"/>
                <span className="ml-2">
                    {this.isAllCollapse() ? 'Expand All' : 'Collapse All'}
                </span>
            </button>
        );
    }
}

ToggleCollapse.propTypes = {
    collapse: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    holdings: PropTypes.array.isRequired
};

const mapStateToProps = (state) => ({
    collapse: state.tscs.collapse,
    holdings: getHoldingsWithValidTscs(state)
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ToggleCollapse);