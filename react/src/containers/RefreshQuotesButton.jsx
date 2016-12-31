import React, {PropTypes} from 'react';
import { connect } from 'react-redux';

import { Button, Glyphicon } from 'react-bootstrap';

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
                <Button onClick={refreshFn}
                disabled={isFetching}>
                    <Glyphicon glyph="refresh" />
                    {' '}
                    {isFetching ? 'Refreshing' : 'Refresh Quotes'}
                </Button>
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