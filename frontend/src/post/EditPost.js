import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { isAuthenticated } from '../auth';
import { singlePost, update } from './apiPost';
import photo from '../images/user.png';

export default class EditPost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      title: '',
      description: '',
      redirectToProfile: false,
      fileSize: 0,
      loading: false,
      error: '',
    };
  }

  init = (postId) => {
    singlePost(postId).then((data) => {
      if (data.error) {
        this.setState({ redirectToProfile: true });
      } else {
        this.setState({
          id: data.postedBy._id,
          title: data.title,
          description: data.description,
          error: '',
        });
      }
    });
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

  handleClick = (e) => {
    e.preventDefault();
    this.setState({ loading: true });

    if (this.isValid()) {
      const postId = this.props.match.params.postId;
      const token = isAuthenticated().token;

      update(postId, token, this.postData).then((data) => {
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

  editPostForm = (title, description) => (
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
        Update Post
      </button>
    </form>
  );

  componentDidMount() {
    this.postData = new FormData();
    const postId = this.props.match.params.postId;
    this.init(postId);
  }

  render() {
    const {
      id,
      description,
      title,
      redirectToProfile,
      loading,
      error,
    } = this.state;

    if (redirectToProfile) {
      return <Redirect to={`/user/${isAuthenticated().user._id}`} />;
    }

    const photoUrl = id
      ? `http://localhost:4000/post/photo/${id}?${new Date().getTime()}`
      : photo;

    return (
      <div className='container'>
        <h2 className='mt-5 mb-5'>{title}</h2>

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
          alt={title}
          style={{ height: '200px', width: 'auto' }}
          className='img-thumbnail'
          onError={(i) => (i.target.src = `${photo}`)}
        />
        {this.editPostForm(title, description)}
      </div>
    );
  }
}
