import React, {PropTypes} from 'react';
import { connect } from 'react-redux';

import { getTotalPerformance } from '../../selectors';

import PerformanceTableRowTotal from '../../components/Performance/PerformanceTableRowTotal.jsx';

class PerformanceTableRowTotalContainer extends React.Component {
    static propTypes = {
        total: PropTypes.object.isRequired
    }

    render() {
        return (
            <PerformanceTableRowTotal total={this.props.total}/>
        );
    }
}

const mapStateToProps = (state) => {
  return {
      total: getTotalPerformance(state)
  };
};

export default connect(mapStateToProps)(PerformanceTableRowTotalContainer);