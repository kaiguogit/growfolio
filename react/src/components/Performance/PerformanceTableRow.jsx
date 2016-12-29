import React, { PropTypes } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { PERFORMANCE_COLUMNS } from './columns.jsx';

class PerformanceTableRow extends React.Component {
    static propTypes = {
        holding: PropTypes.object.isRequired
    }

    renderCell(column) {
        let value = this.props.holding[column.selector];
        if (column.formatFunction) {
            return column.formatFunction(this.props.holding, column);
        }
        return column.filter ? column.filter(value) : value;
    }

    transitionUpOrDown(value) {
        return value > 0 ? "background-green-fade-out" : "background-red-fade-out";
    }

    render() {
        return (
            <tr>
                {PERFORMANCE_COLUMNS.map(column => {
                        {/**
                          * We generate a unique key, e.g 'change-0.55' to make sure React create
                          * a new component on update to trigger 'Appear' animation
                          */}
                    return (
                        <td key={`${column.selector}-${this.props.holding[column.selector]}`}>
                            {/**
                              * Because then transition group is within a map. The transition group
                              * and children are rendered at same time. That's why we use 'Appear'.
                              * Read React document.
                              * https://facebook.github.io/react/docs/animation.html#animate-initial-mounting
                              */}
                            <ReactCSSTransitionGroup
                                transitionName={this.transitionUpOrDown(this.props.holding[column.selector])}
                                transitionEnter={false}
                                transitionLeave={false}
                                transitionAppear={true}
                                transitionAppearTimeout={1000}
                            >
                                <div>
                                    {this.renderCell(column)}
                                </div>
                            </ReactCSSTransitionGroup>
                        </td>
                    );
                })}
            </tr>
        );
    }
}

export default PerformanceTableRow;