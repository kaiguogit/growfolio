import React, { PropTypes } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

class NumberChangeTransition extends React.Component {
    static propTypes = {
        children: PropTypes.node,
        upOrDown: PropTypes.bool
    }

    transitionUpOrDown() {
        return this.props.upOrDown ? "background-green-fade-out" : "background-red-fade-out";
    }

    render() {
            {/**
              * Because then transition group is within a map. The transition group
              * and children are rendered at same time. That's why we use 'Appear'.
              * Read React document.
              * https://facebook.github.io/react/docs/animation.html#animate-initial-mounting
              */}
        return(
            <ReactCSSTransitionGroup
                transitionName={this.transitionUpOrDown()}
                transitionEnter={false}
                transitionLeave={false}
                transitionAppear={true}
                transitionAppearTimeout={1000}
            >
                {this.props.children}
            </ReactCSSTransitionGroup>
        );
    }
}

export default NumberChangeTransition;