import React, { PropTypes } from 'react';
import * as actions from '../actions/tscs';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Button } from 'react-bootstrap';
import TscsTable from '../components/TscsTable.jsx';
import TscsForm from '../components/TscsForm.jsx';


class Tscs extends React.Component {
    static propTypes = {
      items: PropTypes.array.isRequired,
      isFetching: PropTypes.bool.isRequired,
      lastUpdated: PropTypes.number,
      formOpened: PropTypes.bool.isRequired,
      actions: PropTypes.object.isRequired
    }

    componentDidMount() {
        this.handleRefreshClick();
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
        const { isFetching, items, lastUpdated } = this.props;
        const isEmpty = items.length === 0;
        return (
            <div>
                <Button bsStyle="info" onClick={this.props.formOpened ? this.props.actions.closeTscsForm : this.props.actions.openTscsForm}>
                    Add Transaction
                </Button>
                {/* Formm stay opened during fetching */}
                {(this.props.isFetching || this.props.formOpened) &&
                    <TscsForm onSubmit={this.handleFormSubmit} isFetching={this.props.isFetching}/>
                }
                <p>
                    {lastUpdated &&
                        <span>
                            Last updated at {new Date(lastUpdated).toLocaleTimeString()}.
                            {' '}
                        </span>
                    }
                    {!isFetching &&
                      <a href="#"
                         onClick={this.handleRefreshClick}>
                        Refresh
                      </a>
                    }
                </p>
                {isEmpty
                  ? (isFetching ? <h2>Loading...</h2> : <h2>Empty.</h2>)
                  : <div style={{ opacity: isFetching ? 0.5 : 1 }}>
                      <TscsTable tscs={items} removeTscs={this.props.actions.removeTscs}/>
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

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Tscs);