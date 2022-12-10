import React from "react";
import { Link } from "react-router-dom";

const CounterPage = () => {
  return (
    <div>
      <div
        style={{
          display: "flex",
          direction: "column",
          position: "absolute",
          marginRight: "auto",
          marginLeft: "auto",
          top: 200,
          left: 450,
          textAlign: "center",
        }}
      >
        <Link to="/bicepcurls">
          <h1 style={{ marginRight: "30px" }}>Bicep Curls</h1>
        </Link>
        <Link to="/squats">
          <h1>Squats</h1>
        </Link>
      </div>
    </div>
  );
};

export default CounterPage;
