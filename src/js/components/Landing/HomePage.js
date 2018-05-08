import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './Landing.sass';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import DocumentTitle from 'react-document-title';
import { createProject, fetchPreloadedProjects, fetchUserProjects, wipeProjectState } from '../../actions/ProjectActions';

import { Button, Intent } from '@blueprintjs/core';

import ProjectCreateModal from '../Base/ProjectCreateModal';
import RaisedButton from '../Base/RaisedButton';
import ProjectButton from '../Base/ProjectButton';
import Footer from './Footer';

export class HomePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      projectCreateModalOpen: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    const nextProjectId = nextProps.project.id;
    const nextUserId = nextProps.userId;

    if (this.props.project.id != nextProjectId) {
      this.props.wipeProjectState();
      this.props.push(`/projects/${ nextProjectId }/datasets/upload`);
    }
  }

  closeProjectSettingsModal = () => {
    this.setState({ projectCreateModalOpen: false });
  }

  _onUploadClick = () => {
    const { user, userId, push, createProject } = this.props;
    if (user.isAuthenticated || (user.anonymous && user.id)) {
      this.setState({ projectCreateModalOpen: true });
    } else {
      push('/auth/register')
    }
  }

  render() {
    const { projects, user } = this.props;
    const { userProjects, preloadedProjects } = projects;
    return (
      <DocumentTitle title='DIVE | Projects'>
        <div>
          <div className={ styles.ctaBox }>
            <div className={ styles.primaryCopy }>
              {/* <span>Turn Data into Stories</span> */}
              <span>Easy and powerful data exploration</span>
            </div>
            <div className={ styles.secondaryCopy + ' pt-running-text' }>
              DIVE lets you turn data into stories within minutes, without writing a single line of code
            </div>
            {/* <div className={ styles.video }>
              <iframe src="https://player.vimeo.com/video/179173590" color="#007BD7" width="600" height="340" frameBorder="0" allowFullScreen />
            </div> */}
            <div className={ styles.ctaContainer }>
              <Button
                text="Upload Data"
                intent={ Intent.PRIMARY }
                className="pt-large"
                iconName="cloud-upload"
                onClick={ this._onUploadClick }
              />
              { !user.id &&
                <Button
                  text="Create Account"
                  intent={ Intent.PRIMARY }
                  className="pt-large"
                  iconName="user"
                  style={{'marginLeft': '10px'}}
                  onClick={ this._onUploadClick }
                />
              }
            </div>
          </div>
          <div className={ styles.sections + ' ' + styles.fillContainer }>
            { (!projects.fetching && preloadedProjects.length > 0) &&
              <div className={ styles.section + ' ' + styles.projectsContainer + ' ' + styles.contentSection }>
                <div className={ styles.innerSection + ' ' + styles.projectTypeContainer }>
                  <div className={ styles.sectionHeader }>Featured Projects</div>
                  <div className={ styles.projectListContainer }>
                    { projects.isFetching &&
                      <div className={ styles.watermark }>Fetching projects...</div>
                    }
                    { preloadedProjects.slice(0, 5).map((project) =>
                      <ProjectButton project={ project } key={ `project-button-id-${ project.id }` }/>
                    )}
                  </div>
                </div>
              </div>
            }
            <div className={ styles.section + ' ' + styles.contentSection }>
              <div className={ styles.sectionHeader }>1. Intelligent Data Ingestion</div>
              <div className={ styles.sectionContent }>
                <img className={ styles.gif } src="/assets/images/ingest.gif"/>
                <div className={ styles.textBox }>
                  <p className="pt-running-text">DIVE intelligently samples your data to <b>infer the types of your fields and the structure of your datasets</b> to best inform your visualizations and statistical analyses. DIVE works with human-interpretable data types, not machine types, to best match your domain knowledge.</p>
                </div>
              </div>
            </div>

            <div className={ styles.section + ' ' + styles.contentSection }>
              <div className={ styles.sectionHeader }>2. Semi-automated Visualization Recommendation</div>
              <div className={ styles.sectionContent }>
                <img className={ styles.gif } src="/assets/images/visualization.gif"/>
                <div className={ styles.textBox }>
                  <p className="pt-running-text">Instead of learning syntax or specifying visual mappings, simply <b>select the fields you're interested in and DIVE will recommend relevant visualizations.</b> No more building visualizations from scratch. You can <b>sort visualizations</b> based on effectiveness, expressiveness, and statistical properties like correlation, entropy, and gini.</p>
                </div>
              </div>
            </div>
            <div className={ styles.section + ' ' + styles.contentSection }>
              <div className={ styles.sectionHeader }>3. Point-and-click Statistical Analysis</div>
              <div className={ styles.sectionContent }>
                <img className={ styles.gif } src="/assets/images/analysis.gif"/>
                <div className={ styles.textBox }>
                  <p className="pt-running-text">DIVE <b>lowers the barrier to running statistical analyses so you can focus on interpreting results, not technical minutiae</b>. Run ANOVA to compare group means, build regressions to explore relationships between fields, and more, all without writing a single line of code. </p>
                </div>
              </div>
            </div>
            <div className={ styles.section + ' ' + styles.contentSection }>
              <div className={ styles.sectionHeader }>4. WYSIWYG Visual Narratives</div>
              <div className={ styles.sectionContent }>
                <img className={ styles.gif } src="/assets/images/compose.gif"/>
                <div className={ styles.textBox }>
                  <p className="pt-running-text">With the visualizations and analyses you've saved, <b>construct visual stories with a what-you-see-is-what-you-get editor</b>. Share stories with <b>interactive content linked to dynamic data.</b> If this doesn't suit you, yes, we are working on powerpoint export ☺. </p>
                </div>
              </div>
            </div>
            <div className={ styles.section + ' ' + styles.contentSection + ' ' + styles.aboutContainer }>
              <div className={ styles.sectionHeader }>Team</div>
              <div className={ styles.sectionContent }>
                <div className={ styles.textBox }>
                  <p className="pt-running-text">DIVE is built by <a target="_blank" href="https://twitter.com/KevinZengHu">Kevin Hu</a> and <a target="_blank" href="https://twitter.com/cesifoti">César Hidalgo</a> in the <a target="_blank" href="http://macro.media.mit.edu">Collective Learning Group</a> at the <a target="_blank" href="http://media.mit.edu">MIT Media Lab</a>. To give feedback, compliments, or complaints, please e-mail us at <a href="mailto:dive@media.mit.edu" target="_top">dive@media.mit.edu</a>.</p>
                </div>
              </div>
            </div>
          </div>
          <ProjectCreateModal
            user={ user }
            closeAction={ this.closeProjectSettingsModal }
            isOpen={ this.state.projectCreateModalOpen }
          />
          <Footer />
        </div>
      </DocumentTitle>
    );
  }
}
function mapStateToProps(state) {
  const { project, projects, user } = state;
  return { project, projects, user };
}
export default connect(mapStateToProps, { fetchPreloadedProjects, fetchUserProjects, createProject, wipeProjectState, push })(HomePage);
