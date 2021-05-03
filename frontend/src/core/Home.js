import React from 'react';
import Posts from '../post/Posts';

const Home = () => {
  return (
    <div className='container-fluid'>
      <div className='jumbotron'>
        <h2>Home</h2>
        <p className='lead'>Welcome to React fronteend</p>
      </div>
      <div className='container'>
        <Posts />
      </div>
    </div>
  );
};

export default Home;
