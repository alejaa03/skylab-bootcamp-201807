import React, { Component } from 'react';
import { Link, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';

import { required, email } from '../../utils/formValidations';

import { toast } from 'react-toastify';

import { authUser } from '../../redux/actions/user';

import { renderField } from '../../utils/renderField';

class LoginForm extends Component {

    onSubmit = ({ email, password }) => {
        const { search } = this.props.location;

        const params = new URLSearchParams(search);

        const ref = params.get('ref') ? params.get('ref') : '';
        const id = params.get('id') ? params.get('id') : '';
        this.props.authUser(email, password, this.props.history, ref, id);
    };

    render() {
        const {
            handleSubmit,
            auth: { auth, error }
        } = this.props;
        if (error !== '') toast.error(`Error! ${error}`);

        return (
            <React.Fragment>
                <form className="form" onSubmit={handleSubmit(this.onSubmit)}>
                    <Field
                        label="Email"
                        icon="mail"
                        name="email"
                        type="text"
                        placeholder="Email..."
                        component={renderField}
                        validate={[required, email]}
                        noValidate
                    />

                    <Field
                        label="Password"
                        icon="lock_outline"
                        name="password"
                        type="password"
                        placeholder="Password..."
                        component={renderField}
                        validate={[required]}
                    />

                    <div className="text-center">
                        <button
                            type="submit"
                            className="btn btn-primary btn-round"
                        >
                            Login
                        </button>
                    </div>

                    <span className="float-right">
                        <Link to="/register">Don't have an account?</Link>
                    </span>
                </form>
            </React.Fragment>
        );
    }
}

function mapStateToProps({ auth }) {
    return { auth };
}

export default reduxForm({
    form: 'loginForm'
})(
    withRouter(
        connect(
            mapStateToProps,
            { authUser }
        )(LoginForm)
    )
);