import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const PersonalPage = () => {
  const { userName } = useParams();

  const [userData, setUserData] = useState(null);

  useEffect(() => {
    axios(`http://localhost:8888/userData/${userName}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "GET",
    }).then(({ data }) => setUserData(data));
  }, []);

  return (
    <div>
      {userData ? (
        <div>
          <img src={userData.profilePicture} alt="User" />
          <h3>{userData.displayName}</h3>

          <div>
            <h3>NUMBER</h3>
            <p>Completed Games</p>
          </div>
          <div>
            <h3>NUMBER</h3>
            <p>Best Game</p>
          </div>
          <div>
            <h3>NUMBER</h3>
            <p>Average Game</p>
          </div>
        </div>
      ) : (
        <h3>LOADING...</h3>
      )}
    </div>
  );
};

export default PersonalPage;
