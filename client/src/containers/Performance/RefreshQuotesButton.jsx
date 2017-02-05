import React, {PropTypes} from 'react';
import { connect } from 'react-redux';

const style = {
    display: 'inline-block'
};

class RefreshQuotesButton extends React.Component {
    static propTypes = {
        refreshFn: PropTypes.func.isRequired,
        isFetching: PropTypes.bool.isRequired
    }
    render() {
        const { isFetching, refreshFn } = this.props;
        return(
            <div style={style}>
                <div className="btn btn-primary" onClick={refreshFn}
                disabled={isFetching}>
                    <span className="glyphicon glyphicon-refresh"/>
                    {' '}
                    {isFetching ? 'Refreshing' : 'Refresh Quotes'}
                </div>
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