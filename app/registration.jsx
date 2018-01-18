import ReactOnRails from 'react-on-rails';
import React from 'react';
import ReactDOM from 'react-dom';

import CommandCenter from './main';

// This is how react_on_rails can see the HelloWorld in the browser.
ReactOnRails.register({
  CommandCenter,
});
