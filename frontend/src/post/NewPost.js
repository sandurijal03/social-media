import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { isAuthenticated } from '../auth';
import { create } from './apiPost';

export default class NewPost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      description: '',
      photo: '',
      error: '',
      user: {},
      fileSize: 0,
      redirectToProfile: false,
      loading: false,
    };
  }

  componentDidMount() {
    this.postData = new FormData();
    this.setState({ user: isAuthenticated().user });
  }

  isValid = () => {
    const { title, description, fileSize } = this.state;

    if (fileSize > 1000000) {
      this.setState({
        error: 'File size should be less than 1mb',
        loading: false,
      });
      return false;
    }

    if (title.length === 0 || description.length === 0) {
      this.setState({ error: 'All fields aautore required', loading: false });
      return false;
    }

    return true;
  };

  handleChange = (name) => (event) => {
    this.setState({ error: '' });
    const value = name === 'photo' ? event.target.files[0] : event.target.value;

    const fileSize = name === 'photo' ? event.target.files[0].size : 0;

    this.postData.set(name, value);
    this.setState({
      [name]: value,
      fileSize,
    });
  };

  handleClick = (e) => {
    e.preventDefault();
    this.setState({ loading: true });

    if (this.isValid()) {
      const userId = isAuthenticated().user._id;
      const token = isAuthenticated().token;

      create(userId, token, this.postData).then((data) => {
        if (data.error) {
          this.setState({ error: data.error });
        } else {
          this.setState({
            loading: false,
            title: '',
            description: '',
            photo: '',
            redirectToProfile: true,
          });
        }
      });
    }
  };

  newPostForm = (title, description) => (
    <form>
      <div className='form-group'>
        <label className='text-muted'>Post Photo</label>
        <input
          onChange={this.handleChange('photo')}
          type='file'
          accept='image/*'
          className='form-control'
        />
      </div>

      <div className='form-group'>
        <label className='text-muted'>Title</label>
        <input
          onChange={this.handleChange('title')}
          type='text'
          className='form-control'
          value={title}
        />
      </div>

      <div className='form-group'>
        <label className='text-muted'>Description</label>
        <textarea
          onChange={this.handleChange('description')}
          type='text'
          className='form-control'
          value={description}
        />
      </div>

      <button onClick={this.handleClick} className='btn btn-raised btn-primary'>
        Create Post
      </button>
    </form>
  );

  render() {
    const {
      title,
      description,
      error,
      loading,
      redirectToProfile,
      user,
    } = this.state;

    if (redirectToProfile) {
      return <Redirect to={`/user/${user._id}`} />;
    }

    return (
      <div className='container'>
        <h2 className='mt-5 mb-5'>Create a new post</h2>
        {loading ? (
          <div className='jumbotron text-center'>
            <h2>Loading</h2>
          </div>
        ) : (
          ''
        )}

        <div
          className='alert alert-danger'
          style={{ display: error ? '' : 'none' }}
        >
          {error}
        </div>

        {this.newPostForm(title, description)}
      </div>
    );
  }
}
