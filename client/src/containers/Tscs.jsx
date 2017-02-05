import React, { PropTypes } from 'react';
import * as actions from '../actions/tscs';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import TscsTable from '../components/Tscs/TscsTable.jsx';
import TscsForm from '../components/Tscs/TscsForm.jsx';


class Tscs extends React.Component {
    static propTypes = {
      items: PropTypes.array.isRequired,
      isFetching: PropTypes.bool.isRequired,
      formOpened: PropTypes.bool.isRequired,
      actions: PropTypes.object.isRequired
    }

    handleRefreshClick = e => {
        if (e) {
            e.preventDefault();
        }
        this.props.actions.fetchTscs();
    }

    handleFormSubmit = tsc => {
        this.props.actions.createTscs(tsc);
        this.props.actions.closeTscsForm();
    }

    render() {
        const { isFetching, items } = this.props;
        const isEmpty = items.length === 0;
        const sortedItems = items.slice(0);

        // Sort tscs by symbol then by date.
        sortedItems.sort(function(a, b) {
            const symbolA = a.symbol.toUpperCase();
            const symbolB = b.symbol.toUpperCase();
            const result = (symbolA < symbolB) ? -1 : (symbolA > symbolB) ? 1 : 0;
            if (result !== 0) {
                return result;
            }
            return new Date(a.date) - new Date(b.date);
        });

        return (
            <div>
                <div className="btn btn-primary" onClick={this.props.formOpened ? this.props.actions.closeTscsForm : this.props.actions.openTscsForm}>
                    Add Transaction
                </div>
                {/* Formm stay opened during fetching */}
                {(this.props.isFetching || this.props.formOpened) &&
                    <TscsForm onSubmit={this.handleFormSubmit} isFetching={this.props.isFetching}/>
                }
                {isEmpty
                  ? (isFetching ? <h2>Loading...</h2> : <h2>Empty.</h2>)
                  : <div style={{ opacity: isFetching ? 0.5 : 1 }}>
                      <TscsTable tscs={sortedItems} removeTscs={this.props.actions.removeTscs}/>
                    </div>
                }
            </div>
        );
    }
}

const mapStateToProps = state => {
    return state.tscs;
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Tscs);
