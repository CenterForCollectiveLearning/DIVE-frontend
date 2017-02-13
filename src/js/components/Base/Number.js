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

    let formattedContent;

    if (isNaN(value)) {
      formattedContent = <span>NaN</span>;
    };
    if (!isFinite(value)) {
      formattedContent = <span>Infinity</span>;
    };

    if (typeof value === 'string' || value instanceof String) {
      formattedContent = <span>{ value }</span>;
    };

    if (scientific) {
      formattedContent = <span>{ `${ mantissa }${ multiplicationSign }10` }<sup>{ exponent }</sup></span>;
    } else {
      // 30492.30942 -> 30492.3094
      // 304923 => 304923
      // 0.00032411 => 0.000324

      const parsedNumber = +parseFloat(value).toFixed(precision);
      formattedContent = <span>{ parsedNumber }</span>;
    };

    console.log(value, formattedContent);

    return (
      <div
        className={
          styles.number
          + (this.props.className ? ' ' + this.props.className : '')
        }
      >
        { prefix }{ formattedContent }{ suffix }
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
  exponentCutoff: 3,
  precision: 3,
  multiplicationSign: '×'
}
