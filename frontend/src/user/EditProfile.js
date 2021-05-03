import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { isAuthenticated } from '../auth';
import { read, update, updateUser } from './apiUser';
import photo from '../images/user.png';

export default class EditProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      name: '',
      password: '',
      redirectToProfile: false,
      error: '',
      loading: false,
      fileSize: 0,
      about: '',
    };
  }

  init = (userId) => {
    const token = isAuthenticated().token;
    read(userId, token).then((data) => {
      if (data.error) {
        this.setState({ redirectToProfile: true });
      } else {
        this.setState({
          id: data._id,
          name: data.name,
          email: data.email,
          error: '',
          about: data.about,
        });
      }
    });
  };

  componentDidMount() {
    this.userData = new FormData();
    const userId = this.props.match.params.userId;
    this.init(userId);
  }

  isValid = () => {
    const { name, email, password, fileSize } = this.state;

    if (fileSize > 1000000) {
      this.setState({ error: 'File size should be less than 1mb' });
      return false;
    }

    if (name.length === 0) {
      this.setState({ error: 'Name is required', loading: false });
      return false;
    }
    if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      this.setState({ error: 'A valid email is required' });
      return false;
    }

    if (password.length > 1 && password.length <= 5) {
      this.setState({ error: 'Password must be atleast 6 character long' });
      return false;
    }
    return true;
  };

  handleChange = (name) => (event) => {
    this.setState({ error: '' });
    const value = name === 'photo' ? event.target.files[0] : event.target.value;

    const fileSize = name === 'photo' ? event.target.files[0].size : 0;

    this.userData.set(name, value);
    this.setState({
      [name]: value,
      fileSize,
    });
  };

  handleClick = (e) => {
    e.preventDefault();
    this.setState({ loading: true });

    if (this.isValid()) {
      const userId = this.props.match.params.userId;
      const token = isAuthenticated().token;

      update(userId, token, this.userData).then((data) => {
        if (data.error) {
          this.setState({ error: data.error });
        } else {
          updateUser(data, () => {
            this.setState({
              redirectToProfile: true,
            });
          });
        }
      });
    }
  };

  updateForm = (name, email, password, about) => (
    <form>
      <div className='form-group'>
        <label className='text-muted'>Profile Photo</label>
        <input
          onChange={this.handleChange('photo')}
          type='file'
          accept='image/*'
          className='form-control'
        />
      </div>

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

      <div className='form-group'>
        <label className='text-muted'>About</label>
        <textarea
          onChange={this.handleChange('about')}
          type='text'
          className='form-control'
          value={about}
        />
      </div>

      <button onClick={this.handleClick} className='btn btn-raised btn-primary'>
        Update
      </button>
    </form>
  );

  render() {
    const {
      id,
      name,
      email,
      password,
      error,
      loading,
      redirectToProfile,
      about,
    } = this.state;

    if (redirectToProfile) {
      return <Redirect to={`/user/${id}`} />;
    }

    const photoUrl = id
      ? `http://localhost:4000/user/photo/${id}?${new Date().getTime()}`
      : photo;

    return (
      <div className='container'>
        <h2 className='mt-5 mb-5'>Edit Profilee</h2>

        <div
          className='alert alert-danger'
          style={{ display: error ? '' : 'none' }}
        >
          {error}
        </div>

        {loading ? (
          <div className='jumbotron text-center'>
            <h2>Loading</h2>
          </div>
        ) : (
          ''
        )}

        <img
          src={photoUrl}
          alt={name}
          style={{ height: '200px', width: 'auto' }}
          className='img-thumbnail'
          onError={(i) => (i.target.src = `${photo}`)}
        />

        {this.updateForm(name, email, password, about)}
      </div>
    );
  }
}
