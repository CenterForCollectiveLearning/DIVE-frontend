import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { updateProject, deleteProject } from '../../actions/ProjectActions.js';
import { submitFeedback, closeFeedbackModal } from '../../actions/FeedbackActions.js';
import styles from '../App/App.sass';

import DropDownMenu from './DropDownMenu';
import BlockingModal from './BlockingModal';
import RaisedButton from './RaisedButton';
import Input from './Input';
import TextArea from './TextArea';

class FeedbackModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      feedbackType: 'feature',
      description: ''
    };
  }

  submit = () => {
    const { project, user, closeAction, submitFeedback, location } = this.props;
    const { pathname, search } = location;
    const { feedbackType, description } = this.state;

    const fullPath = pathname + search;

    submitFeedback(
      project.properties.id,
      user.id,
      user.email,
      user.username,
      feedbackType,
      description,
      fullPath
    );
  }

  selectFeedbackType = (feedbackType) => {
    this.setState({ feedbackType: feedbackType });
  }

  enteredFeedbackDescription = (event) => {
    this.setState({ description: event.target.value });
  }
    // Or contact us directly: <a href="mailto:dive@media.mit.edu?Subject=DIVE%20Feedback" target="_top">dive@media.mit.edu</a>
  render() {
    const { closeAction, feedback } = this.props;
    const { feedbackType, description } = this.state;

    var footer = feedback.received ? null :
      <div className={ styles.footerContent }>
        <div className={ styles.rightActions }>
          <RaisedButton primary normalHeight minWidth={ 100 } onClick={ this.submit }>Submit</RaisedButton>
        </div>
      </div>;

    return (
      <BlockingModal
        scrollable={ false }
        closeAction={ this.props.closeAction }
        heading={ feedback.received ? "Thank you for your feedback!" : "Help Us Make DIVE Better" }
        footer={ footer }>
          { feedback.received &&
            <div className={ styles.fillContainer }>
              <div className={ styles.receivedFeedbackContainer }>
                <i className="fa fa-check-circle"></i>
              </div>
            </div>
          }
          { !feedback.received &&
            <div className={ styles.fillContainer }>
              <div className={ styles.controlSection }>
                <div className={ styles.label }>Category</div>
                <DropDownMenu
                  value={ feedbackType }
                  options={[
                    { id: 'bug', name: 'Bug'},
                    { id: 'feature', name: 'Feature Request'},
                    { id: 'idea', name: 'Idea'},
                    { id: 'complaint', name: 'Complaint'},
                    { id: 'compliment', name: 'Compliment'},
                  ]}
                  valueMember="id"
                  displayTextMember="name"
                  onChange={ this.selectFeedbackType }/>
            </div>
            <div className={ styles.controlSection }>
              <div className={ styles.label }>Description</div>
              <TextArea
                type="textarea"
                placeholder={ description }
                value={ description }
                onChange={ this.enteredFeedbackDescription }/>
            </div>
          </div>
        }
      </BlockingModal>
    );
  }
}

FeedbackModal.propTypes = {
  closeAction: PropTypes.func,
  user: PropTypes.object,
  project: PropTypes.object,
  feedback: PropTypes.object,
  location: PropTypes.object
};

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps, { updateProject, deleteProject, submitFeedback })(FeedbackModal);
