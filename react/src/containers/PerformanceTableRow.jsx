import React, {PropTypes} from 'react';
import { connect } from 'react-redux';

import { makeGetHoldingPerformance } from '../selectors';

import PerformanceTableRow from '../components/PerformanceTableRow.jsx';

class PerformanceTableRowContainer extends React.Component {
    static propTypes = {
        symbol: PropTypes.string.isRequired,
        holding: PropTypes.object.isRequired
    }

    render() {
        return (
            <PerformanceTableRow holding={this.props.holding}/>
        );
    }
}

 const makeMapStateToProps = () => {
     const getHoldingPerformance = makeGetHoldingPerformance();
     const mapStateToProps = (state, props) => {
          return {
              holding: getHoldingPerformance(state, props)
          };
     };
     return mapStateToProps;
 };

export default connect(makeMapStateToProps)(PerformanceTableRowContainer);