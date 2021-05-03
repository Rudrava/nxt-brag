import React from "react";

const userProfile = ({ user }) => {
  return (
    <div className="box-center">
      <img src={user.photoURL} alt="" className="card-img-center" />
      <p>
        <i>@{user.username}</i>
      </p>
      <h1>{user.displayName}</h1>
    </div>
  );
};

export default userProfile;
