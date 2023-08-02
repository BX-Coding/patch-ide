declare module 'dom-element-renderer' {
    import { CSSProperties } from 'react';
    import { Element } from 'dom';

    export interface DOMElementRendererProps {
        domElement: Element;
        style?: CSSProperties;
        [key: string]: any;
    }

    export default class DOMElementRenderer extends React.Component<DOMElementRendererProps> {}
}