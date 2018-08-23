import React, { Component } from 'react';

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

    handleChange = (ev) => {
        this.setState({[ev.target.name]: ev.target.value})
    };

    handleSubmit = (ev) => {
        ev.preventDefault();
        let {errors, ...newUser} = this.state;
        console.log(newUser);

    };

    render() {
        return (
            <div className="register">
                <div className="container">
                    <div className="row">
                        <div className="col-md-8 m-auto">
                            <h1 className="display-4 text-center">Sign Up</h1>
                            <p className="lead text-center">Create your DevConnector account</p>
                            <form onSubmit={this.handleSubmit}>
                                <div className="form-group">
                                    <input type="text" className="form-control form-control-lg" placeholder="Name"
                                           name="name"
                                           value={this.state.name}
                                           onChange={this.handleChange}/>
                                </div>
                                <div className="form-group">
                                    <input type="email" className="form-control form-control-lg" placeholder="Email Address"
                                           name="email"
                                           value={this.state.email}
                                           onChange={this.handleChange}/>
                                    <small className="form-text text-muted">This site uses Gravatar so if you want a profile
                                        image, use a Gravatar email
                                    </small>
                                </div>
                                <div className="form-group">
                                    <input type="password" className="form-control form-control-lg" placeholder="Password"
                                           name="password"
                                           value={this.state.password}
                                           onChange={this.handleChange}/>
                                </div>
                                <div className="form-group">
                                    <input type="password" className="form-control form-control-lg"
                                           placeholder="Confirm Password"
                                           name="password2"
                                           value={this.state.password2}
                                           onChange={this.handleChange}/>
                                </div>
                                <input type="submit" className="btn btn-info btn-block mt-4"/>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    };
};

export default Register;
