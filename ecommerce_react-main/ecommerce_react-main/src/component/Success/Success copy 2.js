import React, { useEffect } from "react";
//import { useHistory } from "react-router-dom";

const Success = () => {
  //const history = useHistory();
  useEffect(() => {
    console.log("Success useEffect call");
    window.location.reload();
  }, []);

  return (
    <div>
      <button style={{ border: "2px solid red" }}>Click me</button>
    </div>
  );
};

export default Success;
