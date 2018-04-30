import React, { Component } from 'react';
import PropsTypes from 'prop-types';
import logo from './logo.svg';
import './BinderContext.css';

import BinderContextEngine from './engine';

class BinderContext extends Component {

  static propTypes = {
    height: PropsTypes.number,
    width: PropsTypes.number,
    selector: PropsTypes.string
  }

  static defaultProps = {
    focusedClassName: 'focused'
  }

  binderRef = React.createRef();
  engine = undefined;

  componentDidMount() {
    const {
      focusedClassName,
      height,
      width,
      selector
    } = this.props;

    this.engine = BinderContextEngine(this.binderRef, height, width, selector, focusedClassName);
  }

  componentWillUnmount() {
    if(this.engine) {
      this.engine.remove();
    }
  }

  render() {
    const {
      height,
      width,
    } = this.props;


    return (
      <div
        className="Binder"
        ref={this.binderRef}
        style={{ width, height }}
      >
        <div className="Binder-Wrapper" >
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default BinderContext;
