import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import TextFieldGroup from '../common/TextFieldGroup';
import TextAreaFieldGroup from '../common/TextAreaFieldGroup';
import InputGroup from '../common/InputGroup';
import SelectListGroup from '../common/SelectListGroup';
import { createProfile } from '../../actions/profileActions';

class CreateProfile extends Component {
    state = {
        displaySocialInputs: false,
        handle: '',
        company: '',
        website: '',
        location: '',
        status: '',
        skills: '',
        githubusername: '',
        bio: '',
        twitter: '',
        facebook: '',
        linkedin: '',
        youtube: '',
        instagram: '',
        errors: {}
    };

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.errors) {
            this.setState({errors: nextProps.errors})
        }
    };

    handleSubmit = (e) => {
        e.preventDefault();
        let {errors, displaySocialInputs,  ...newProfile} = this.state;
        this.props.createProfile(newProfile, this.props.history);
    };

    handleChange = (e) => {
        this.setState({[e.target.name]: e.target.value})
    };

    render() {
        const { errors, displaySocialInputs } = this.state;
        let socialInputs;

        if (displaySocialInputs) {
            socialInputs = (
                <div>
                    <InputGroup
                        placeholder="Twitter Profile URL"
                        name="twitter"
                        icon="fab fa-twitter"
                        value={this.state.twitter}
                        handleChange={this.handleChange}
                        error={errors.twitter}
                    />
                    <InputGroup
                        placeholder="Facebook Profile URL"
                        name="facebook"
                        icon="fab fa-facebook"
                        value={this.state.facebook}
                        handleChange={this.handleChange}
                        error={errors.facebook}
                    />
                    <InputGroup
                        placeholder="Linkedin Profile URL"
                        name="linkedin"
                        icon="fab fa-linkedin"
                        value={this.state.linkedin}
                        handleChange={this.handleChange}
                        error={errors.linkedin}
                    />
                    <InputGroup
                        placeholder="YouTube Profile URL"
                        name="youtube"
                        icon="fab fa-youtube"
                        value={this.state.youtube}
                        handleChange={this.handleChange}
                        error={errors.youtube}
                    />
                    <InputGroup
                        placeholder="Instagram Profile URL"
                        name="instagram"
                        icon="fab fa-instagram"
                        value={this.state.instagram}
                        handleChange={this.handleChange}
                        error={errors.instagram}
                    />
                </div>
            )
        }
        // Select option for status
        const options = [
            { label: '* Select Professional Status', value: 0},
            { label: 'Developer', value: 'Developer' },
            { label: 'Junior Developer', value: 'Junior Developer' },
            { label: 'Manager', value: 'Manager' },
        ];
        return (
            <div className="create-profile">
                <div className="container">
                    <div className="row">
                        <div className="col-md-8 m-auto">
                            <h1 className="display-4 text-center">Create Your Profile</h1>
                            <p className="lead text-center">
                                Let's get some information to make you profile stand out
                            </p>
                            <small className="d-block pb-3">* = required fields</small>
                            <form onSubmit={this.handleSubmit}>
                                <TextFieldGroup
                                    placeholder="* Profile Handle"
                                    name="handle"
                                    value={this.state.handle}
                                    handleChange={this.handleChange}
                                    error={errors.handle}
                                    info="A unique handle for your profile URL. Your full name, company name,
                                    nickname"
                                />
                                <SelectListGroup
                                    placeholder="Status"
                                    name="status"
                                    value={this.state.status}
                                    handleChange={this.handleChange}
                                    options={options}
                                    error={errors.status}
                                    info="Give us an idea of where you are at in your career"
                                />
                                <TextFieldGroup
                                    placeholder="Company"
                                    name="company"
                                    value={this.state.company}
                                    handleChange={this.handleChange}
                                    error={errors.company}
                                    info="Could be your own company or one you work for"
                                />
                                <TextFieldGroup
                                    placeholder="Website"
                                    name="website"
                                    value={this.state.website}
                                    handleChange={this.handleChange}
                                    error={errors.website}
                                    info="Could be your own website or a company one"
                                />
                                <TextFieldGroup
                                    placeholder="Location"
                                    name="location"
                                    value={this.state.location}
                                    handleChange={this.handleChange}
                                    error={errors.location}
                                    info="City or city & state suggested"
                                />
                                <TextFieldGroup
                                    placeholder="* Skills"
                                    name="skills"
                                    value={this.state.skills}
                                    handleChange={this.handleChange}
                                    error={errors.skills}
                                    info="Please use comma separated values"
                                />
                                <TextFieldGroup
                                    placeholder="Github Username"
                                    name="githubusername"
                                    value={this.state.githubusername}
                                    handleChange={this.handleChange}
                                    error={errors.githubusername}
                                    info="Github commits and links"
                                />
                                <TextAreaFieldGroup
                                    placeholder="Short Bio"
                                    name="bio"
                                    value={this.state.bio}
                                    handleChange={this.handleChange}
                                    error={errors.bio}
                                    info="Github commits and links"
                                />
                                <div className="mb-3">
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            this.setState(prevState => ({
                                                displaySocialInputs: !prevState.displaySocialInputs
                                            }))
                                    }} className="btn btn-light">
                                        Add Social Network Links
                                    </button>
                                    <span className="text-muted">Optional</span>
                                </div>
                                {socialInputs}
                                <input type="submit" value="Submit" className="btn btn-info btn-block mt-4"/>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

CreateProfile.propTypes = {
    profile: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    profile: state.profile,
    errors: state.errors
});

export default connect(mapStateToProps, {createProfile})(withRouter(CreateProfile));
