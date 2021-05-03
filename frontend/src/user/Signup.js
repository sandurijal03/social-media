import React, { Component } from 'react';
import { signup } from '../auth';
import { Link } from 'react-router-dom';

export default class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      password: '',
      error: '',
      open: false,
    };
  }

  handleChange = (name) => (event) => {
    this.setState({ error: '' });
    this.setState({
      [name]: event.target.value,
    });
  };

  handleClick = (e) => {
    e.preventDefault();
    const { email, name, password } = this.state;
    const user = {
      name,
      email,
      password,
    };

    signup(user).then((data) => {
      if (data.error) {
        return this.setState({ error: data.error });
      } else {
        return this.setState({
          error: '',
          name: '',
          email: '',
          password: '',
          open: true,
        });
      }
    });
  };

  signupForm = (name, email, password) => (
    <form>
      <div className='form-group'>
        <label className='text-muted'>Name</label>
        <input
          onChange={this.handleChange('name')}
          type='text'
          className='form-control'
          value={name}
        />
      </div>
      <div className='form-group'>
        <label className='text-muted'>Email</label>
        <input
          onChange={this.handleChange('email')}
          type='email'
          className='form-control'
          value={email}
        />
      </div>
      <div className='form-group'>
        <label className='text-muted'>Password</label>
        <input
          onChange={this.handleChange('password')}
          type='password'
          className='form-control'
          value={password}
        />
      </div>
      <button onClick={this.handleClick} className='btn btn-raised btn-primary'>
        Submit
      </button>
    </form>
  );

  render() {
    const { email, name, password, error, open } = this.state;
    return (
      <div className='container'>
        <h2 className='mt-5 mb-5'> Signup</h2>

        <div
          className='alert alert-danger'
          style={{ display: error ? '' : 'none' }}
        >
          {error}
        </div>

        <div
          className='alert alert-info'
          style={{ display: open ? '' : 'none' }}
        >
          New Account is successfully created. Please{' '}
          <Link to='/signin'>Sign in</Link>
        </div>
        {this.signupForm(name, email, password)}
      </div>
    );
  }
}
