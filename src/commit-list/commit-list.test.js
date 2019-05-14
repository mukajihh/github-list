import React from 'react';
import ReactDOM from 'react-dom';
import CommitList from './commit-list';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<CommitList />, div);
  ReactDOM.unmountComponentAtNode(div);
});
