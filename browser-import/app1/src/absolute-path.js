import React from 'https://cdn.jsdelivr.net/npm/@esm-bundle/react/esm/react.production.min.js';
import ReactDOM  from 'https://cdn.jsdelivr.net/npm/@esm-bundle/react-dom/esm/react-dom.resolved.production.min.js';

class Hello extends React.Component {
    render() {
      return React.createElement('div', null, `Hello ${this.props.toWhat}`);
    }
  }
  
ReactDOM.render(
    React.createElement(Hello, {toWhat: 'World'}, null),
    document.getElementById('root')
);


