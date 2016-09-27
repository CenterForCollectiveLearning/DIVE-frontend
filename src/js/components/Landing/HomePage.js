import React, { Component, PropTypes } from 'react';
import styles from './Landing.sass';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import DocumentTitle from 'react-document-title';
import { createProject, fetchPreloadedProjects, fetchUserProjects, wipeProjectState } from '../../actions/ProjectActions';

import RaisedButton from '../Base/RaisedButton';
import ProjectButton from '../Base/ProjectButton';
import Footer from './Footer';

import MediaLabLogo from '../../../assets/MIT_ML_Logo_K_RGB.svg?name=MediaLabLogo';
import MacroConnectionsLogo from '../../../assets/MacroConnections_Logo_K_RGB.svg?name=MacroConnectionsLogo';


export class HomePage extends Component {
  componentWillMount() {
    const { projects, userId } = this.props;
    this.props.fetchPreloadedProjects(userId);
    this.props.fetchUserProjects(userId);
  }

  componentWillReceiveProps(nextProps) {
    const nextProjectId = nextProps.project.properties.id;
    const nextUserId = nextProps.userId;

    if (this.props.project.properties.id != nextProjectId) {
      this.props.wipeProjectState();
      this.props.push(`/projects/${ nextProjectId }/datasets/upload`);
    }

    if (this.props.userId != nextUserId) {
      nextProps.fetchPreloadedProjects(nextUserId);
      if (nextUserId) {
        nextProps.fetchUserProjects(nextUserId);
      }
    }
  }

  _onUploadClick() {
    const { user, userId, push, createProject } = this.props;
    if (user.isAuthenticated) {
      const projectTitle = 'Project Title';
      const projectDescription = 'Project Description'
      createProject(userId, projectTitle, projectDescription);
    } else {
      push('/register')
    }
  }

  render() {
    const { projects, userId } = this.props;
    const { userProjects, preloadedProjects } = projects;
    return (
      <DocumentTitle title='DIVE | Projects'>
        <div className={ styles.centeredFill }>
          <div className={ styles.ctaBox }>
            <div className={ styles.primaryCopy }>
              <span>Turn Data into Stories</span>
            </div>
            <div className={ styles.secondaryCopy }>
              Easy, fast, and powerful data visualization and analysis.
            </div>
            <div className={ styles.ctaContainer }>
              <RaisedButton
                label="Get Started"
                primary={ true }
                onClick={ this._onUploadClick.bind(this) }
                className={ styles.uploadButton + ' ' + styles.primary } />
            </div>
            <div className={ styles.video }>
              <iframe src="https://player.vimeo.com/video/179173590" color="#007BD7" width="640" height="360" frameBorder="0" allowFullScreen />
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
              <div className={ styles.sectionHeader }>Automatic Visualization</div>
              <div className={ styles.sectionContent }>
                <div className={ styles.textBox }>
                  <p>DIVE automatically recommends visualizations based on the fields you are interested in. No more building visualizations from scratch. You can sort visualizations based on effectiveness, expressiveness, and statistical properties like correlation, entropy, and gini.</p>
                </div>
              </div>
            </div>

            <div className={ styles.section + ' ' + styles.contentSection }>
              <div className={ styles.sectionHeader }>Point-and-click Statistical Analysis</div>
              <div className={ styles.sectionContent }>
                <div className={ styles.textBox }>
                  <p>DIVE lowers the barrier to understanding data so you can focus on interpreting results, not technical minutiae. Run ANOVA to compare group means, build regressions to explore relationships between fields, and more, all without writing a single line of code. </p>
                </div>
              </div>
            </div>

            <div className={ styles.section + ' ' + styles.contentSection }>
              <div className={ styles.sectionHeader }>Easy Visual Narratives</div>
              <div className={ styles.sectionContent }>
                <div className={ styles.textBox }>
                  <p></p>
                </div>
              </div>
            </div>

            <div className={ styles.section + ' ' + styles.contentSection + ' ' + styles.aboutContainer }>
              <div className={ styles.sectionHeader }>About</div>
              <div className={ styles.sectionContent }>
                <div className={ styles.textBox }>
                  <p>DIVE is built by <a target="_blank" href="https://twitter.com/KevinZengHu">Kevin Hu</a> and <a target="_blank" href="https://twitter.com/cesifoti">César Hidalgo</a> in the <a target="_blank" href="http://macro.media.mit.edu">Macro Connections Group</a> at the <a target="_blank" href="http://media.mit.edu">MIT Media Lab</a></p>
                </div>
                <div className={ styles.mugshotBox }>
                  <div className={ styles.mugshots }>
                    <div className={ styles.mugshotContainer }>
                      <a href="http://twitter.com/kevinzenghu" target="_blank">
                        <img className={ styles.mugshot } src="/assets/images/kevin.mugshot.jpg"/>
                      </a>
                      <div className={ styles.mugCaption }>
                        <span className={ styles.mugCaptionName }>Kevin Hu</span>
                        <span className={ styles.mugCaptionRole }>PhD Candidate</span>
                      </div>
                    </div>
                    <div className={ styles.mugshotContainer }>
                      <a href="" target="_blank">
                        <img className={ styles.mugshot } src="/assets/images/suzanne.mugshot.jpg"/>
                      </a>
                      <div className={ styles.mugCaption }>
                        <span className={ styles.mugCaptionName }>Suzanne Wang</span>
                        <span className={ styles.mugCaptionRole }>Undergraduate Intern</span>
                      </div>
                    </div>
                    <div className={ styles.mugshotContainer }>
                      <a href="http://twitter.com/cesifoti" target="_blank">
                        <img className={ styles.mugshot } src="/assets/images/cesar.mugshot.jpg"/>
                      </a>
                      <div className={ styles.mugCaption }>
                        <span className={ styles.mugCaptionName }>César Hidalgo</span>
                        <span className={ styles.mugCaptionRole }>Principal Investigator</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </DocumentTitle>
    );
  }
}


function mapStateToProps(state) {
  const { project, projects, user } = state;
  return { project, projects, user, userId: user.id };
}

export default connect(mapStateToProps, { fetchPreloadedProjects, fetchUserProjects, createProject, wipeProjectState, push })(HomePage);
