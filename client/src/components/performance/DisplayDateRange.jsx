import React from 'react';
import PropTypes from 'prop-types';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../../actions/portfolio';
import DatePicker from 'react-datepicker';

class DisplayDateRange extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <div className="d-inline-block mr-2">
                    <div>
                        Start Date
                    </div>
                    <div>
                        <DatePicker
                            selected={this.props.startDate.toDate()}
                            onChange={this.props.actions.setStartDate}
                            showYearDropdown
                            yearDropdownItemNumber={3}
                            showMonthDropdown
                            scrollableYearDropdown
                            className="form-control"
                        />
                    </div>
                </div>
                <div className="d-inline-block mr-2">
                    <div>
                        End Date
                    </div>
                    <div>
                        <DatePicker
                            selected={this.props.endDate.toDate()}
                            onChange={this.props.actions.setEndDate}
                            showYearDropdown
                            yearDropdownItemNumber={3}
                            showMonthDropdown
                            scrollableYearDropdown
                            className="form-control"
                        />
                    </div>
                </div>
            </div>
        );
    }
}

DisplayDateRange.propTypes = {
    startDate: PropTypes.object,
    endDate: PropTypes.object,
    actions: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    startDate: state.portfolio.startDate,
    endDate: state.portfolio.endDate
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(DisplayDateRange);