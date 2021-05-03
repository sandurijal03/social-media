import React, { Component } from 'react';
import { list } from './apiPost';
import defaultPhoto from '../images/new.jpeg';
import { Link } from 'react-router-dom';

export default class Posts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
    };
  }

  componentDidMount() {
    list().then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ posts: data });
      }
    });
  }

  renderPosts = (posts) => {
    return (
      <div className='row'>
        {posts.map((post, i) => {
          const posterId = post.postedBy ? `/user/${post.postedBy._id}` : '';
          const posterName = post.postedBy ? post.postedBy.name : ' unknown';
          return (
            <div className='card col-md-4' key={i}>
              <div className='card-body'>
                <img
                  src={`http://localhost:4000/post/photo/${post._id}`}
                  alt={post.title}
                  onError={(i) => (i.target.src = `${defaultPhoto}`)}
                  className='img-thumbnail mb-3'
                  style={{ height: '200px', width: '100%' }}
                />
                <h5 className='card-title'>{post.title}</h5>
                <p className='card-text'>
                  {post.description.substring(0, 100)}
                </p>
                <br />
                <p className='font-italic mark'>
                  Posted By : <Link to={`${posterId}`}>{posterName} </Link>
                  on {new Date(post.created).toDateString()}
                </p>
                <Link
                  to={`/post/${post._id}`}
                  className='btn btn-primary btn-raised btn-smooth '
                >
                  Read More
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  render() {
    const { posts } = this.state;
    return (
      <div className='container'>
        <h2 className='mt-5 mb-5'>
          {!posts.length ? 'Loading....' : 'Recent Posts'}
        </h2>
        {this.renderPosts(posts)}
      </div>
    );
  }
}
