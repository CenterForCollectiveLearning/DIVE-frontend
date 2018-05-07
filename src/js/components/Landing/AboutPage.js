import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import DocumentTitle from 'react-document-title';

import landingStyles from './Landing.sass';
import contentStyles from './Content.sass';
const styles = { ...landingStyles, ...contentStyles };

import { Position, Toaster, Button, Intent, NonIdealState } from '@blueprintjs/core';

import Footer from './Footer';

export class AboutPage extends Component {
  render() {
    return (
      <DocumentTitle title={ 'DIVE | About' }>
        <div className={ styles.contentPage + ' ' + styles.sections }>
          <NonIdealState
            className={ styles.centeredFill + ' ' + styles.notFoundPageContent }
            title='Under Construction'
            description={ <p>This page is still under construction</p> }
            action={ <span className={ styles.link } onClick={ this.goHome }>Click here to return to DIVE.</span> }
            visual='build'
          />
          {/* <div className={ styles.section + ' ' + styles.contentSection }>
            <div className={ styles.sectionHeader }>Origin</div>
              <div className={ styles.sectionContent }>
                <p>Forage selfies gochujang, biodiesel mlkshk tacos 8-bit viral readymade. Pabst messenger bag letterpress mumblecore beard food truck. Waistcoat readymade polaroid, keytar pitchfork asymmetrical knausgaard ethical green juice. Whatever neutra authentic readymade retro quinoa. Biodiesel affogato authentic meditation. Polaroid swag austin, poutine jean shorts actually pinterest meditation. Tattooed 90s lumbersexual, irony umami listicle +1.</p>
                <p>Ugh selvage ennui meggings irony bushwick, chambray cray everyday carry kinfolk. Bushwick intelligentsia pitchfork freegan bicycle rights lo-fi, tote bag meh dreamcatcher migas blog poutine portland. Cray deep v try-hard 8-bit, retro PBR&B church-key chartreuse. Neutra single-origin coffee direct trade mumblecore street art. Kogi kale chips beard, organic paleo chambray meh cronut. Ramps normcore VHS, man bun hoodie sustainable kickstarter tofu. Jean shorts gentrify meggings normcore.</p>
              </div>
          </div>
          <div className={ styles.section + ' ' + styles.contentSection }>
            <div className={ styles.sectionHeader }>Vision</div>
              <div className={ styles.sectionContent }>
                <p>Forage selfies gochujang, biodiesel mlkshk tacos 8-bit viral readymade. Pabst messenger bag letterpress mumblecore beard food truck. Waistcoat readymade polaroid, keytar pitchfork asymmetrical knausgaard ethical green juice. Whatever neutra authentic readymade retro quinoa. Biodiesel affogato authentic meditation. Polaroid swag austin, poutine jean shorts actually pinterest meditation. Tattooed 90s lumbersexual, irony umami listicle +1.</p>
              </div>
          </div>
          <div className={ styles.section + ' ' + styles.contentSection }>
            <div className={ styles.sectionHeader }>Current</div>
              <div className={ styles.sectionContent }>
                <p>Ugh selvage ennui meggings irony bushwick, chambray cray everyday carry kinfolk. Bushwick intelligentsia pitchfork freegan bicycle rights lo-fi, tote bag meh dreamcatcher migas blog poutine portland. Cray deep v try-hard 8-bit, retro PBR&B church-key chartreuse. Neutra single-origin coffee direct trade mumblecore street art. Kogi kale chips beard, organic paleo chambray meh cronut. Ramps normcore VHS, man bun hoodie sustainable kickstarter tofu. Jean shorts gentrify meggings normcore.</p>
              </div>
          </div>
          <div className={ styles.section + ' ' + styles.contentSection }>
            <div className={ styles.sectionHeader }>Built With</div>
              <div className={ styles.sectionContent }>
                <p>The DIVE front-end uses React for UI construction, Redux for state management, Google Charts for visualizations, and Blueprint for visual components.</p>
                <p>Our back-end is built on <a href="http://flask.pocoo.org/" target="_blank">Flask</a>, Celery, PostgreSQL.</p>
              </div>
          </div>
          <div className={ styles.section + ' ' + styles.contentSection }>
            <div className={ styles.sectionHeader }>Future</div>
              <div className={ styles.sectionContent }>
                <p>Ugh selvage ennui meggings irony bushwick, chambray cray everyday carry kinfolk. Bushwick intelligentsia pitchfork freegan bicycle rights lo-fi, tote bag meh dreamcatcher migas blog poutine portland. Cray deep v try-hard 8-bit, retro PBR&B church-key chartreuse. Neutra single-origin coffee direct trade mumblecore street art. Kogi kale chips beard, organic paleo chambray meh cronut. Ramps normcore VHS, man bun hoodie sustainable kickstarter tofu. Jean shorts gentrify meggings normcore.</p>
              </div>
          </div> */}
          <Footer />
        </div>
      </DocumentTitle>
    );
  }
}


function mapStateToProps(state) {
  return { };
}

export default connect(mapStateToProps, { })(AboutPage);
