import React from 'react';
import PropTypes from 'prop-types';
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
              * Each children needs a key attribute to trigger the transition properly.
              * They will have class name background-(green/red)-fade-out.(enter/active)
              * added.
              * This component must already be mounted when children changes.
              * unless we use transitionAppear attribute so that "appear" class will be add
              * at the same time when this component is mounted with children.
              * But I removed transitionAppear attribute to avoid transition when entering page.
              * read more at
              * https://facebook.github.io/react/docs/animation.html#animate-initial-mounting
              */}
        return(
            <ReactCSSTransitionGroup
                transitionName={this.transitionUpOrDown()}
                transitionEnter={true}
                transitionEnterTimeout={1000}
                transitionLeave={false}
            >
                {this.props.children}
            </ReactCSSTransitionGroup>
        );
    }
}

export default NumberChangeTransition;