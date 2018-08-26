import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { registerUser } from "../../actions/authActions";
import TextFieldGroup from "../common/TextFieldGroup";


class Register extends Component {
    //if use constructor
    //use this.handleChange = this.handleChange.bind(this)
    state = {
        name: '',
        email: '',
        password: '',
        password2: '',
        errors: {}
    };

    componentDidMount() {
        if (this.props.auth.isAuthenticated) {
            this.props.history.push('/dashboard');
        }
    }

    componentWillReceiveProps = (nextProps) => {
        if(nextProps.errors) {
            this.setState({errors: nextProps.errors})
        }
    };

    handleChange = (ev) => {
        this.setState({[ev.target.name]: ev.target.value})
    };

    handleSubmit = (ev) => {
        ev.preventDefault();
        let {errors, ...newUser} = this.state;

        this.props.registerUser(newUser, this.props.history);
    };

    render() {
        const {errors} = this.state;

        // const {user} = this.props.auth;

        return (
            <div className="register">
                <div className="container">
                    <div className="row">
                        <div className="col-md-8 m-auto">
                            <h1 className="display-4 text-center">Sign Up</h1>
                            <p className="lead text-center">Create your DevConnector account</p>
                            <form noValidate onSubmit={this.handleSubmit}>
                                <TextFieldGroup
                                    placeholder="Name"
                                    name="name"
                                    value={this.state.name}
                                    handleChange={this.handleChange}
                                    error={errors.name}
                                />
                                <TextFieldGroup
                                    placeholder="Email Address"
                                    name="email"
                                    type="email"
                                    value={this.state.email}
                                    handleChange={this.handleChange}
                                    error={errors.email}
                                    info="This site uses Gravatar so if you want a profile
                                        image, use a Gravatar email"
                                />
                                <TextFieldGroup
                                    placeholder="Password"
                                    name="password"
                                    type="password"
                                    value={this.state.password}
                                    handleChange={this.handleChange}
                                    error={errors.password}
                                />
                                <TextFieldGroup
                                    placeholder="Password Confirmation"
                                    name="password2"
                                    type="password"
                                    value={this.state.password2}
                                    handleChange={this.handleChange}
                                    error={errors.password2}
                                />
                                <input type="submit" className="btn btn-info btn-block mt-4"/>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    };
};

Register.propTypes = {
    registerUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(mapStateToProps, {registerUser})(withRouter(Register));
