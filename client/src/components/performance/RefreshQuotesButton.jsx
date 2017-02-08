import React, {PropTypes} from 'react';
import { connect } from 'react-redux';

class RefreshQuotesButton extends React.Component {
    static propTypes = {
        refreshFn: PropTypes.func.isRequired,
        isFetching: PropTypes.bool.isRequired
    }
    render() {
        const { isFetching, refreshFn } = this.props;
        return(
            <div className="d-inline-block">
                <button type="button" className={`btn ${isFetching ? "btn-outline-danger" : "btn-outline-primary"}`} onClick={refreshFn}
                disabled={isFetching}>
                    <i className="fa fa-refresh" aria-hidden="true"/>
                    {' '}
                    {isFetching ? 'Refreshing' : 'Refresh Quotes'}
                </button>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        isFetching: state.tscs.isFetching || state.quotes.isFetching
    };
};

export default connect(mapStateToProps)(RefreshQuotesButton);