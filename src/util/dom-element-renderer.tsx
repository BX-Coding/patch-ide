// @ts-nocheck  
import omit from 'lodash.omit';
import React from 'react';
import Style from 'to-style';

/*
 * DOMElementRenderer wraps a DOM element, allowing it to be
 * rendered by React. It's up to the containing component
 * to retain a reference to the element prop, or else it
 * will be garbage collected after unmounting.
 *
 * Props passed to the DOMElementRenderer will be set on the
 * DOM element like it's a normal component.
 */
type DOMElementRendererProps = {
    domElement: Element,
    style: React.CSSProperties,
}

class DOMElementRenderer extends React.Component {
    constructor (props: DOMElementRendererProps) {
        super(props);
        this.setContainer = this.setContainer.bind(this);
    }
    componentDidMount () {
        this.container.appendChild(this.props.domElement);
    }
    componentWillUnmount () {
        this.container.removeChild(this.props.domElement);
    }
    setContainer (c) {
        this.container = c;
    }
    render () {
        // Apply props to the DOM element, so its attributes
        // are updated as if it were a normal component.
        // Look at me, I'm the React now!
        Object.assign(
            this.props.domElement,
            omit(this.props, ['domElement', 'children', 'style'])
        );

        // Convert react style prop to dom element styling.
        if (this.props.style) {
            this.props.domElement.style.cssText = Style.string(this.props.style);
        }

        return <div ref={this.setContainer} />;
    }
}

export default DOMElementRenderer;
