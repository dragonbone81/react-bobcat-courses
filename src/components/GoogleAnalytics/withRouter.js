import React, {Component} from 'react';
import * as ReactGA from 'react-ga';

ReactGA.initialize('UA-116671933-2');

const withTracker = (WrappedComponent, options = {}) => {
    const trackPage = page => {
        ReactGA.set({
            page,
            ...options,
        });
        ReactGA.pageview(page);
    };

    return class extends Component {
        componentDidMount() {
            const page = this.props.location.pathname;
            trackPage(page);
        }

        componentWillReceiveProps(nextProps) {
            const currentPage = this.props.location.pathname;
            const nextPage = nextProps.location.pathname;

            if (currentPage !== nextPage) {
                trackPage(nextPage);
            }
        }

        render() {
            return <WrappedComponent {...this.props} />;
        }
    };
};

export default withTracker;