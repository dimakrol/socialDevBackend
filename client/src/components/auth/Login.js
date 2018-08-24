import React, {Component} from 'react';

class Login extends Component {
    state = {
        email: '',
        password: '',
        errors: {}
    };

    handleChange = (ev) => {
        this.setState({[ev.target.name]: ev.target.value})
    };

    handleSubmit = (ev) => {
        ev.preventDefault();
        let {errors, ...user} = this.state;
        console.log(user);

    };

    render() {
        return (
            <div className="login">
                <div className="container">
                    <div className="row">
                        <div className="col-md-8 m-auto">
                            <h1 className="display-4 text-center">Log In</h1>
                            <p className="lead text-center">Sign in to your DevConnector account</p>
                            <form onSubmit={this.handleSubmit}>
                                <div className="form-group">
                                    <input type="email" className="form-control form-control-lg"
                                           placeholder="Email Address"
                                           name="email"
                                           value={this.state.email}
                                           onChange={this.handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <input type="password" className="form-control form-control-lg"
                                           placeholder="Password"
                                           name="password"
                                           value={this.state.password}
                                           onChange={this.handleChange}
                                    />
                                </div>
                                <input type="submit" className="btn btn-info btn-block mt-4"/>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};

export default Login;