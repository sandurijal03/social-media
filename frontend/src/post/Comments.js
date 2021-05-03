import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../auth';
import { comment, uncomment } from './apiPost';
import defaultProfile from '../images/user.png';

export default class Comments extends Component {
  state = {
    text: '',
    error: '',
  };

  handleChange = (e) => {
    this.setState({ error: '' });
    this.setState({ text: e.target.value });
  };

  isValid = () => {
    const { text } = this.state;
    if (!text.length > 0 || text.length > 150) {
      this.setState({
        error:
          'Commeents should not be empty and leess than 150 characters long',
      });
      return false;
    }
    return true;
  };

  deleteComment = () => {
    const userId = isAuthenticated().user._id;
    const token = isAuthenticated().token;
    const postId = this.props.postId;

    uncomment(userId, token, postId, comment).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.props.updateComments(data.comments);
      }
    });
  };

  deleteConfirm = (comment) => {
    let answer = window.confirm(
      'Are you sure you want to deltee your comment?',
    );
    if (answer) {
      this.deletePost(comment);
    }
  };

  addComment = (e) => {
    e.preventDefault();

    if (!isAuthenticated()) {
      this.setState({ error: 'You must be logged in to leave the comment' });
      return false;
    }

    if (this.isValid()) {
      const userId = isAuthenticated().user._id;
      const token = isAuthenticated().token;
      const postId = this.props.postId;
      // const comment = ;

      comment(userId, token, postId, { text: this.state.text }).then((data) => {
        if (data.error) {
          console.log(data.error);
        } else {
          this.setState({
            text: '',
          });
          // dispatch fresh list of comments to parent singlePost
          this.props.updatComments(data.comments);
        }
      });
    }
  };

  render() {
    const { comments } = this.props;
    const { error } = this.state;
    return (
      <div>
        <h2 className='mt-5 mb-5'>Leave a comments</h2>

        <form onSubmit={this.addComment}>
          <div className='form-group'>
            <input
              type='text'
              onChange={this.handleChange}
              className='form-control'
              value={this.state.text}
              placeholder='please leave a comment'
            />

            <button className='btn btn-raised btn-success mt-2'>Post</button>
          </div>
        </form>

        <div
          className='alert alert-danger'
          style={{ display: error ? '' : 'none' }}
        >
          {error}
        </div>

        <div className='col-md-8 col-md-offset  -2'>
          <h3 className='text-primary'>{comments.length} Comments</h3>
          <hr />
          {comments.map((comment, i) => {
            return (
              <div key={i}>
                <div>
                  <Link to={`/user/${comment.postedBy._id}`}>
                    <img
                      className='float-left mr-2'
                      height='30px'
                      width='30px'
                      style={{ borderRadius: '50%', boder: '1px solid black' }}
                      onError={(i) => (i.target.src = `${defaultProfile}`)}
                      src={`http://localhost:4000/user/photo/${comment.postedBy._id}`}
                      alt={comment.postedBy.name}
                    />
                  </Link>
                  <div>
                    <p className='lead'>{comment.text}</p>
                    <br />
                    <p className='font-italic mark'>
                      Posted By :{' '}
                      <Link to={`${comment._id}`}>{comment.postedBy.name}</Link>
                      on {new Date(comment.created).toDateString()}
                      <span>
                        {isAuthenticated().user &&
                          isAuthenticated().user._id ===
                            comment.postedBy._id && (
                            <>
                              <span
                                className='text-danger float-right mr-1'
                                onClick={() => this.deleteConfirm()}
                              >
                                Remove
                              </span>
                            </>
                          )}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
          <hr />
        </div>
      </div>
    );
  }
}
