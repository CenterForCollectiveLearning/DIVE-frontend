import React, { Component, PropTypes } from 'react';
import styles from './landing.sass';
import { connect } from 'react-redux';

export class AboutPage extends Component {
  render() {
    return (
      <div className={ styles.centeredFill }>
        <div className={ styles.aboutContainer }>
          <div className={ styles.textBox }>
            <span><a href="/"><strong>DIVE</strong></a> automates data processing, lowering the barrier to understanding data so you can focus on interpreting results, not technical minutiae.</span>
          </div>
          <div className={ styles.separater }></div>
          <div className={ styles.textBox }>
            <span><a href="/"><strong>DIVE</strong></a> was created by <a target="_blank" href="https://twitter.com/KevinZengHu">Kevin Hu</a>, <a target="_blank" href="https://twitter.com/gurubavan">Guru Mahendran</a>, and <a target="_blank" href="https://twitter.com/cesifoti">César Hidalgo</a> in the <a target="_blank" href="http://macro.media.mit.edu">Macro Connections Group</a> at the <a target="_blank" href="http://media.mit.edu">MIT Media Lab</a>.</span>
          </div>
        </div>
        <div className={ styles.spacer }></div>
      </div>
    );
  }
}


function mapStateToProps(state) {
  return { };
}

export default connect(mapStateToProps, { })(AboutPage);
