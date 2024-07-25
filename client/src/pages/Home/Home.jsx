import React, { useContext, useEffect } from "react";
import axios from "axios";
import { UserContext } from "../../context/UserContext";
import { Link, useNavigate } from "react-router-dom";
import Question from "./Question";
import "./Home.css";

function Home({ logout }) {
  const [userData, setUserData] = useContext(UserContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (!userData.user) navigate("/login");
    const fetch = async () => {
      const response = await axios.get("http://localhost:3000/api/questions");
      setUserData({
        ...userData,
        questions: response.data.questions,
      });
    };
    fetch();
  }, [userData.user, navigate]);
  // console.log(userData);

  const handClick = (item) => {
    setUserData({
      ...userData,
      singleQuestion: {
        post_id: item.post_id,
        question_id: item.question_id,
      },
    });
    console.log(userData);
    navigate("/answer");
  };

  return (
    <div className="home">
      <div className="home__container">
        <div className="home__header">
          <div className="home__btn">
            
              <Link to="/questions"><button>Ask question</button></Link>
            
          </div>
          <div className="header__wellcome">
            <h2>Wellcome : {userData.user?.display_name}</h2>
          </div>
        </div>
        <div className="home__body">
          <h1>Questions</h1>
          <hr/>

          <Question />
          
        </div>
      </div>
    </div>
  );
}

export default Home;

{
  /* <div >
      <h1>wellcome {userData.user?.display_name}</h1>
      <button onClick={logout}>Logout</button>
    </div> */
}
