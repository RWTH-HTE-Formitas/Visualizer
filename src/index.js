import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Visualizer from './components/Visualizer/Visualizer';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<Visualizer />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
