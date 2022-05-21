import React, {useState} from "react";
import "./App.css";
import c3po from "./images/c3p0.png";
import spinner from "./images/spinner.gif";
import env from "react-dotenv";

function App() {

  const [prompt, setPrompt] = useState("");  
  let [apiResponse, setApiResponse] = useState([]);
  let [loading, setLoading] = useState(false);
 
  let targetData = document.getElementById("getalldata");
  let targetBtn = document.getElementById("clearBtn");
  
  function handleChange(e) {
      setPrompt(e.target.value);
  };
  
  function getResponse(e) {
    setLoading(true);
    e.preventDefault();
    // if the prompt is empty, don't return anything
    if (prompt.length == 0) {
      setLoading(false);
      alert("Oops! You forgot to write something!")
      return;
    };
    
    const data = {"prompt" : prompt};
    const request = {
      method: "POST",
      headers: {"Content-Type": "application/json", "Authorization": "Bearer " + env.API_KEY},
      body: JSON.stringify(data)
    };
    fetch("https://api.openai.com/v1/engines/text-curie-001/completions", request)
      .then(response => response.json())
      .then(res => {
        setLoading(false);
        let choices = res.choices;
        if (!choices) {
          return;
        }
        for (let i = 0; i < choices.length; ++i) {
          setApiResponse(prevValue => [choices[i].text, ...prevValue]);
        }
      })
      targetData.style.display = "flex";
      targetBtn.style.display = "flex";
  };

  function clearResponse(e) {
    e.preventDefault();
    if (prompt.length > 0) {
      targetData.style.display = "none";
      setPrompt("");
      targetBtn.style.display = "none";
    }
  };
      

  return (
    <div className="main-container">
      <div className="main-title mt-4"> 
        <h1 className="header">
          Fun with GPT-3
          <div id="image">
            <img id="c3p0" alt="c3p0" src={c3po}></img>
          </div>
        </h1>
      </div>
      <div className="paragraph">
        <p id="gpt3">GPT-3 is a powerful AI model created by OpenAI that can process plain text prompts and produce outputs.</p>
      </div>
      <form className="form">
        <div className="form-group">
          <label htmlFor="comment" className="sub-title mt-5" form="sub-title">What's on your mind?</label>
          <p className="paragraph font-size">Enter your question in any language and your answer will appear below!</p>
          <textarea className="form-control" rows="5" id="comment" value={prompt} onChange={handleChange} placeholder="Your text here..."/>
        </div>
        <button type="button" className="btn btn-primary send mt-3" onClick={getResponse}>Send</button>
        { loading && 
          <img id="spinner" alt="spinner" src={spinner} />
        }
        <button type="button" className="btn btn-primary mt-3" id="clearBtn" onClick={clearResponse}>Clear</button>
        <div className="response-container mt-3">
          <div id="getalldata">
            <table>
              <tbody>
                  {apiResponse.map((item, index) =>     
                    <tr key={index} className="response-div m-2">
                      <td>{item}</td>
                    </tr>
                  )}
              </tbody>
            </table> 
          </div>
        </div>      
      </form>

      {/* FOOTER */}
      <div className="main-cont-footer">
        <div className="footer text-center text-lg-start">
          <section className="section">
            <div className="container text-center text-md-start mt-5">
              <div className="row">
                <div className="col-md-12 text-center">
                  <hr/>
                  <p className="ft-text-rights"><small>© 2022 Boglárka Sebestyén: Fun with GPT-3. All rights reserved.</small></p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
         
      

    </div>
  );
}

export default App;
