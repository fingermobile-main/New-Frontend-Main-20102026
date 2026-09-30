import React from 'react';

const LushPressiesPage = () => {
  return (
    <div>
      <div>Loading...</div>{" "}
      {/* This is to match the initial loading state in the test output */}
      <div>
        <span>Discover Matches</span>
        <input placeholder="Search matches..." />
      </div>
      <nav>
        <span>member Icon</span>
        <span>Heart Icon</span>
        <span>Gift Icon</span>
        <span>Chat Icon</span>
        <span>Chart Icon</span>
        <span>Cog Icon</span>
      </nav>
    </div>
  );
};

export default LushPressiesPage;
