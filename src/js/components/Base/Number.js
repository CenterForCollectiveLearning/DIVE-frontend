import React, { Component, PropTypes } from 'react';
import styles from './Number.sass';

import { Popover, PopoverInteractionKind, Position, Menu, MenuItem } from '@blueprintjs/core';

/**
  * Component for formatting numbers.
  * ---
  * Show at most characters 10 characters:
  * 1003761.391 (toFixed 3) and 0.000000134 (toPrecision 3)
  * Convert into scientific notation if:
  * > 10^exponentCutoff and < 10^-exponentCutoff
  *
  * TODO: Add mouseover to show full precision
  */
export default class Number extends Component {

  getExponent = (x) => {
    x = Math.abs(x);
    var exp = Math.floor(Math.log(x) / Math.log(10));
    return exp;
  }

  getDecimalPlaces = (number) => {
    // toFixed produces a fixed representation accurate to 20 decimal places
    // without an exponent.
    // The ^-?\d*\. strips off any sign, integer portion, and decimal point
    // leaving only the decimal fraction.
    // The 0+$ strips off any trailing zeroes.
    return ((+number).toFixed(20)).replace(/^-?\d*\.?|0+$/g, '').length;
  }

  render() {
    const {
      value,
      exponentCutoff,
      precision,
      multiplicationSign,
      className,
      prefix,
      suffix,
      fullPrecisionOnMouseOver
    } = this.props;

  const exponent = this.getExponent(value);
    const mantissa = (+parseFloat(value) / Math.pow(10, exponent)).toFixed(precision);
    const scientific = (Math.abs(exponent) >= exponentCutoff);

    let content;
    let reduceInformation = false;
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
        reduceInformation = true;
        break;
      case (!scientific):
        const numDecimals = this.getDecimalPlaces(value);

        let parsedNumber;
        if (numDecimals < precision) {  // Maximize precision
          parsedNumber = value;
        } else {
          parsedNumber = (Math.abs(value) < 1) ?
            +parseFloat(value).toPrecision(precision) :
            +parseFloat(value).toFixed(precision);
          reduceInformation = true;
        }
        content = <span>{ parsedNumber }</span>;
        break;
    }

    let popoverContent = (
      <div className={ styles.fullPrecision }>{ value.toString() }</div>
    );

    let finalContent = (
      <div>{ prefix }{ content }{ suffix }</div>
    );

    return (
      <div
        className={ styles.number + (this.props.className ? ' ' + this.props.className : '') }
      >
        { fullPrecisionOnMouseOver && reduceInformation &&
          <Popover content={ popoverContent }
            interactionKind={ PopoverInteractionKind.HOVER }
            position={ Position.TOP }
            useSmartPositioning={ true }
            transitionDuration={ 100 }
            hoverOpenDelay={ 100 }
            hoverCloseDelay={ 100 }
          >
            { finalContent }
          </Popover>
        }
        { !(fullPrecisionOnMouseOver && reduceInformation) && finalContent }

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
  fullPrecisionOnMouseOver: PropTypes.bool
}

Number.defaultProps = {
  exponentCutoff: 6,
  precision: 3,
  multiplicationSign: '×',
  fullPrecisionOnMouseOver: true
}
