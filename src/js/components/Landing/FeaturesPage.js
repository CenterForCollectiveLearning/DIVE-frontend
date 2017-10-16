import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './Landing.sass';
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
              <div className={ styles.videoContainer }>
                <iframe src="https://player.vimeo.com/video/144666629" width="640" height="360" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
              </div>
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
              <img src="/assets/images/ExploringVisualizations.2x.png"/>
            </div>
            <div className={ styles.featureCopy }>
              <div className={ styles.featureCopyHeader }>Discover the most interesting visualizations of your data.</div>
              <div className={ styles.featureCopyBody }>
                <div>
                  DIVE makes visualizing your data ridiculously easy. We automatically show recommended visualizations first, based on effectiveness, expressiveness, and statistical properties like correlation, entropy, and gini.
                </div>
                <div>
                  Trying to answer a specific question? Just select which columns in your data you'd like to visualize, and pick a visualization style — we'll take care of the rest.
                </div>
              </div>
            </div>
          </div>
          <div className={ styles.centeredFill + ' ' + styles.featureBlock + ' ' + styles.rightBlock }>
            <div className={ styles.featureImage + ' ' + styles.imageCausalRelationships }>
              <img src="/assets/images/CausalRelationships.2x.png"/>
            </div>
            <div className={ styles.featureCopy }>
              <div className={ styles.featureCopyHeader }>Determine the underlying relationships between variables.</div>
              <div className={ styles.featureCopyBody }>
                <div>
                  Figure out how variables in your data influence each other, without losing your cool to Excel or R.
                </div>
                <div>
                  Run statistical analyses on your data in seconds, like multivariate regressions, t-tests, and time series analysis.
                </div>
              </div>
            </div>
          </div>
          <div className={ styles.centeredFill + ' ' + styles.featureBlock + ' ' + styles.leftBlock }>
            <div className={ styles.featureImage + ' ' + styles.imageEmbeddedVisualization }>
              <img src="/assets/images/EmbeddedVisualization.2x.png"/>
            </div>
            <div className={ styles.featureCopy }>
              <div className={ styles.featureCopyHeader }>Easily embed live interactive visualizations, anywhere.</div>
              <div className={ styles.featureCopyBody }>
                <div>
                  All DIVE visualizations are embeddable, so you can get live interactive visualizations on your websites as easily as any image or video.
                </div>
                <div>
                  You can also tie together multiple visualizations and add annotations to create a linear story. Share these immediately, or embed them in your article or website.
                </div>
              </div>
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
