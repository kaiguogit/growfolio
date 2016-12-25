import React, { PropTypes } from 'react';
import * as actions from '../actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import TscsTable from '../components/TscsTable.jsx';
import TscsForm from '../components/TscsForm.jsx';

class TrscsPage extends React.Component {
    static propTypes = {
      tscs: PropTypes.array.isRequired,
      isFetching: PropTypes.bool.isRequired,
      lastUpdated: PropTypes.number,
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

    render() {
        const { isFetching, tscs, lastUpdated } = this.props;
        const isEmpty = tscs.length === 0;
        return (
            <div>
                <TscsForm onSubmit={this.props.actions.createTscs}/>
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
                      <TscsTable tscs={tscs} removeTscs={this.props.actions.removeTscs}/>
                    </div>
                }
            </div>
        );

    }
}

const mapStateToProps = state => {
    const { tscs: tscsState } = state;
    const { isFetching, items: tscs, lastUpdated } = tscsState;
    return {
        isFetching,
        tscs,
        lastUpdated
    };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TrscsPage);