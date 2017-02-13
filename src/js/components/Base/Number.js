import React, { Component, PropTypes } from 'react';
import styles from './Number.sass';

export default class Number extends Component {
  getExponent = (x) => {
    x = Math.abs(x);
    var exp = Math.floor(Math.log(x) / Math.log(10));
    return exp;
  }

  render() {
    const {
      value,
      exponentCutoff,
      precision,
      multiplicationSign,
      className,
      prefix,
      suffix
    } = this.props;

    const exponent = this.getExponent(value);
    const mantissa = (+parseFloat(value) / Math.pow(10, exponent)).toFixed(precision);
    const scientific = (Math.abs(exponent) > exponentCutoff);

    let content;
    switch (true) {
      case (typeof value === 'string' || value instanceof String):
        content = <span>{ value }</span>;
        break;
      case value == 0:
        content = <span>0</span>;
        break;
      case value == null:
        content = <span />;
        break;
      case isNaN(value):
        content = <span>NaN</span>;
        break;
      case !isFinite(value):
        content = <span>Infinity</span>;
        break;
      case (scientific):
        content = <span>{ `${ mantissa }${ multiplicationSign }10` }<sup>{ exponent }</sup></span>;
        break;
      case (!scientific):
        const parsedNumber = +parseFloat(value).toFixed(precision);
        content = <span>{ parsedNumber }</span>;
        break;
    }

    return (
      <div
        className={
          styles.number
          + (this.props.className ? ' ' + this.props.className : '')
        }
      >
        { prefix }{ content }{ suffix }
      </div>
    );
  }
}

Number.propTypes = {
  value: PropTypes.any,
  exponentCutoff: PropTypes.number,  // number > 10^x and number < 10^-x formatted scientically
  precision: PropTypes.number,
  multiplicationSign: PropTypes.string,
  className: PropTypes.string,
  prefix: PropTypes.string,
  suffix: PropTypes.string,
}

Number.defaultProps = {
  exponentCutoff: 6,
  precision: 3,
  multiplicationSign: '×'
}
