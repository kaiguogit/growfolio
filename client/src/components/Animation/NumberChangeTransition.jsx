import React from 'react';
import PropTypes from 'prop-types';
import CSSTransition from 'react-transition-group/CSSTransition';
import TransitionGroup from 'react-transition-group/TransitionGroup';

const transitionUpOrDown = (upOrDown) => {
    return upOrDown ? "background-green-fade-out" : "background-red-fade-out";
};

const MyTransition = ({children, upOrDown, ...props}) => (
    <CSSTransition {...props}
        classNames={transitionUpOrDown(upOrDown)}
        timeout={1000}
        exit={false}>
        {children}
    </CSSTransition>
);

MyTransition.propTypes = {
    upOrDown: PropTypes.bool,
    children: PropTypes.node
};


class NumberChangeTransition extends React.Component {

    constructor(props) {
        super(props);
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
            <TransitionGroup>
                <MyTransition upOrDown={this.props.data > 0}
                    key={this.props.data}>
                    {this.props.children}
                </MyTransition>
            </TransitionGroup>
        );
    }
}

NumberChangeTransition.propTypes = {
    // Data is used as key, changing data will trigger animation.
    data: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    children: PropTypes.node
};

export default NumberChangeTransition;