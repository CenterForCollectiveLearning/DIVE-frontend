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
              <span>Instantly discover stories in your data</span>
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
        <div className={ styles.centeredFill + ' ' + styles.featuresContainer }>
          <div className={ styles.centeredFill + ' ' + styles.featureBlock + ' ' + styles.centerBlock }>
            <div className={ styles.featureImage + ' ' + styles.imageExploreVisualizations }>
              <img src="/assets/images/Exploring Visualizations.2x.png"/>
            </div>
            <div className={ styles.featureCopy }>
              <div className={ styles.featureCopyHeader }>Discover the most interesting visualizations of your data.</div>
              <div className={ styles.featureCopyBody }>Blabbity blah blah.</div>
            </div>
          </div>
          <div className={ styles.centeredFill + ' ' + styles.featureBlock + ' ' + styles.rightBlock }>
            <div className={ styles.featureImage + ' ' + styles.imageCausalRelationships }>
              <img src="/assets/images/Causal Relationships.2x.png"/>
            </div>
            <div className={ styles.featureCopy }>
              <div className={ styles.featureCopyHeader }>Determine the underlying relationships between variables.</div>
              <div className={ styles.featureCopyBody }>Blabbity blah blah.</div>
            </div>
          </div>
          <div className={ styles.centeredFill + ' ' + styles.featureBlock + ' ' + styles.leftBlock }>
            <div className={ styles.featureImage + ' ' + styles.imageEmbeddedVisualization }>
              <img src="/assets/images/Embedded Visualization.2x.png"/>
            </div>
            <div className={ styles.featureCopy }>
              <div className={ styles.featureCopyHeader }>Easily embed live interactive visualizations, anywhere.</div>
              <div className={ styles.featureCopyBody }>Blabbity blah blah.</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


function mapStateToProps(state) {
  return { };
}

export default connect(mapStateToProps, { })(FeaturesPage);
