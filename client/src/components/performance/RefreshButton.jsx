import React, {PropTypes} from 'react';
import { connect } from 'react-redux';

class RefreshButton extends React.Component {
    static propTypes = {
        refreshFn: PropTypes.func.isRequired,
        isFetching: PropTypes.bool.isRequired
    }
    render() {
        const { isFetching, refreshFn } = this.props;
        return(
            <button type="button" className={`btn d-inline-block mr-2 ${isFetching ? "btn-outline-danger" : "btn-outline-primary"}`}
                onClick={refreshFn}
                disabled={isFetching}>
                <i className={`fa fa-refresh${isFetching ? ' fa-spin' : ''}`} aria-hidden="true"/>
                <span className="ml-2">
                    Refresh
                </span>
            </button>
        );
    }
}

const mapStateToProps = state => {
    return {
        isFetching: state.tscs.isFetching || state.quotes.isFetching
    };
};

export default connect(mapStateToProps)(RefreshButton);
