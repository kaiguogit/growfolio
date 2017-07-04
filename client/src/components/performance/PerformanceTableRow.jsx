import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import { makeGetHoldingPerformance } from '../../selectors';
import { renderCell } from '../../utils';

import { PERFORMANCE_COLUMNS } from './columns.jsx';
import NumberChangeTransition from '../Animation/NumberChangeTransition.jsx';

class PerformanceTableRow extends React.Component {
    render() {
        const {holding} = this.props;
        return (
            <tr>
                {PERFORMANCE_COLUMNS.map(column => {
                        {/**
                          * We generate a unique key, e.g 'change-0.55' to make sure React create
                          * a new component on update to trigger 'Appear' animation
                          */}
                    return (
                        <td className={column.className}
                            key={column.selector}>
                            <NumberChangeTransition
                                upOrDown={column.ref_selector ? holding[column.ref_selector] > 0 : holding[column.selector] > 0}>
                                {renderCell(holding, column)}
                            </NumberChangeTransition>
                        </td>
                    );
                })}
            </tr>
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

PerformanceTableRow.propTypes = {
    symbol: PropTypes.string.isRequired,
    holding: PropTypes.object.isRequired
};

export default connect(makeMapStateToProps)(PerformanceTableRow);