import React, { Component, PropTypes } from 'react';
import styles from './landing.sass';
import { connect } from 'react-redux';

export class FeaturesPage extends Component {
  render() {
    return (
      <div className={ styles.centeredFill }>
        <div className={ styles.centeredFill }>
          <div className={ styles.ctaBox }>
            <div className={ styles.primaryCopy }>
              <span>Stop Processing Data and Start <strong>Understanding It</strong></span>
            </div>
            <div className={ styles.ctaContainer }>
              <div className={ styles.videoContainer }></div>
            </div>
            <div className={ styles.secondaryCopy }>
              Merge and query datasets, conduct statistical analyses, and explore
              automatically generated visualizations within seconds.
            </div>
          </div>
        </div>
        <div className={ styles.centeredFill + ' ' + styles.segment2 }>
        </div>
        <div className={ styles.centeredFill + ' ' + styles.segment3 }>
        </div>
        <div className={ styles.centeredFill + ' ' + styles.segment4 }>
        </div>
      </div>
    );
  }
}


function mapStateToProps(state) {
  return { };
}

export default connect(mapStateToProps, { })(FeaturesPage);
