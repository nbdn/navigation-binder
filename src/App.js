import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import BinderContext from './BinderContext';

class App extends Component {

  state = {
    items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
  }

  render() {
    const {
      items
    } = this.state;

    return (
      <BinderContext
        height={300}
        width={630}
        selector={'.Item'}
      >
        <div style={{ width: '900px' }}>
          {
            items.map((item) => {
              return (
                <div className="Item" id={`item_${item}`} key={`item_${item}`}>
                  item {item}
                </div>
              )
            })
          }
        </div>
      </BinderContext>
    );
  }
}

export default App;
