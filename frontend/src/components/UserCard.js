import React from 'react';

const UserCard = ({ user }) => {
    return (
        <div className="user-card">
            <h4>{user.name}</h4>
            <p>ID: {user.id}</p>
            <p>Address: {user.address}</p>
        </div>
    );
};

export default UserCard;
