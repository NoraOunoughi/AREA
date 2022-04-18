import "./weather.css";
import { getDoc, doc } from "firebase/firestore";
import db from "../../components/firebase/firebase";
import React, { useState, useEffect } from "react";
import { createArea, getAllParams } from "../../functions";

export default function Weather() {
  const [userId] = useState(window.localStorage.getItem("uid"));
  const [allActionsPage, setActions] = useState([]);
  const [allReactionsPage, setReactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAction, setIsAction] = React.useState(true);
  const [isReaction, setIsReaction] = React.useState(true);
  const [isForm, setIsForm] = React.useState(true);
  const [actionParam, setActionParam] = useState("");
  const [reactionParam, setReactionParam] = useState("");
  const [reactionParam2, setReactionParam2] = useState("");
  const [reactionParam3, setReactionParam3] = useState("");
  const [action, setAction] = React.useState("");
  const [reaction, setReaction] = React.useState("");
  const [title, setTitle] = React.useState("");

  useEffect(() => {
    console.log(allActionsPage);
    console.log(allReactionsPage);

    const getActionReaction = async () => {
      setIsLoading(true);

      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists) {
        const data = docSnap.data();
        console.log("Document data:", data);
        const allParams = await getAllParams(data, "weather");
        console.log(setActions(allParams[0]));
        setActions(allParams[0]);
        setReactions(allParams[1]);
        console.log(allParams);
        setIsLoading(false);
      }
    };
  
    getActionReaction();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const hidenAction = () => {
    if (!isAction) {
      setIsAction(true);
    } else if (isAction) {
      setIsAction(false);
    }
  };

  const hidenReaction = () => {
    if (!isReaction) {
      setIsReaction(true);
    } else if (isReaction) {
      setIsReaction(false);
      setIsAction(true);
    }
  };

  const handleSubmitArea = (event) => {
    event.preventDefault();
    setIsForm(true);
    setIsAction(true);
    if (title !== "" && action !== "" && reaction !== "") {
      sendToDB(title, action, actionParam, reaction, reactionParam);
    } else {
      alert("Area not created, Title, action or reaction is null");
    }
  };

  const getAction = (myindex, myaction) => {
    setAction(myaction);
  };

  const getReaction = (myindex, myreaction) => {
    setIsForm(false);
    setIsReaction(true);
    setReaction(myreaction);
  };

  const sendToDB = async () => {
    await createArea(userId, title, action, reaction, actionParam, reactionParam, reactionParam2, reactionParam3);
    clearArea();
    alert("Area created");
  };

  const renderTitle = () => {
    if (title !== "") {
      return (
        <div
          className="weatherArea-newAreaContent"
          style={{ color: "#50C878" }}
        >
          Title: {title}
        </div>
      );
    } else {
      return (
        <div
          className="weatherArea-newAreaContent"
          style={{ color: "#FF4433" }}
        >
          Title: ?
        </div>
      );
    }
  };

  const renderAction = () => {
    if (action !== "") {
      return (
        <div
          className="weatherArea-newAreaContent"
          style={{ color: "#50C878" }}
        >
          Action: [{action.service}] {action.description}
        </div>
      );
    } else {
      return (
        <div
          className="weatherArea-newAreaContent"
          style={{ color: "#FF4433" }}
        >
          Action: ?
        </div>
      );
    }
  };

  const renderActionParameter = () => {
    if (actionParam !== "" && action !== "" && action.args.length !== 0) {
      return (
        <div className="githubArea-newAreaContent" style={{ color: "#50C878" }}>
          City: {actionParam}
        </div>
      );
    } else if (actionParam === "" && action !== "" && action.args.length !== 0) {
      return (
        <div className="githubArea-newAreaContent" style={{ color: "#FF4433" }}>
          City: ?
        </div>
      );
    } else {
      return (
        <div></div>
      )
    }
  };

  const renderReaction = () => {
    if (reaction !== "") {
      return (
        <div
          className="weatherArea-newAreaContent"
          style={{ color: "#50C878" }}
        >
          {" "}
          Reaction: [{reaction.service}] {reaction.description}
        </div>
      );
    } else {
      return (
        <div
          className="weatherArea-newAreaContent"
          style={{ color: "#FF4433" }}
        >
          Reaction: ?
        </div>
      );
    }
  };

  const renderReactionParameter = () => {
    if (reaction !== "" && reaction.args.length === 3) {
      if (
        reactionParam !== "" &&
        reactionParam2 !== "" &&
        reactionParam3 !== ""
      ) {
        return (
          <span className="weatherArea-span">
            <div
              className="weatherArea-newAreaContent"
              style={{ color: "#50C878" }}
            >
              {reaction.args[0].argName}: {reactionParam}
            </div>
            <div
              className="weatherArea-newAreaContent"
              style={{ color: "#50C878" }}
            >
              {reaction.args[1].argName}: {reactionParam2}
            </div>
            <div
              className="weatherArea-newAreaContent"
              style={{ color: "#50C878" }}
            >
              {reaction.args[2].argName}: {reactionParam3}
            </div>
          </span>
        );
      } else {
        return (
          <span className="weatherArea-span">
            <div
              className="weatherArea-newAreaContent"
              style={{ color: "#FF4433" }}
            >
              {reaction.args[0].argName}: ?
            </div>
            <div
              className="weatherArea-newAreaContent"
              style={{ color: "#FF4433" }}
            >
              {reaction.args[1].argName}: ?
            </div>
            <div
              className="weatherArea-newAreaContent"
              style={{ color: "#FF4433" }}
            >
              {reaction.args[2].argName}: ?
            </div>
          </span>
        );
      }
    } else if (reaction !== "" && reaction.args.length === 1) {
      if (reactionParam !== "") {
        return (
          <div
            className="weatherArea-newAreaContent"
            style={{ color: "#50C878" }}
          >
            {reaction.args[0].argName}: {reactionParam}
          </div>
        );
      } else {
        return (
          <div
            className="weatherArea-newAreaContent"
            style={{ color: "#FF4433" }}
          >
            {reaction.args[0].argName}: ?
          </div>
        );
      }
    }
  };

  const clearArea = async () => {
    setIsForm(true);
    setTitle("");
    setAction("");
    setActionParam("");
    setReaction("");
    setReactionParam("");
    setReactionParam2("");
    setReactionParam3("");
  };

  const renderForm = () => {
    if (reaction.args != null && reaction.args.length === 3) {
      return (
        <form onSubmit={handleSubmitArea}>
          <input
            hidden={isForm}
            type="text"
            name="name"
            className="weatherArea-searchButton"
            placeholder={reaction.args[0].argName}
            value={reactionParam}
            onChange={(e) => setReactionParam(e.target.value)}
          />
          <input
            hidden={isForm}
            type="text"
            name="name"
            className="weatherArea-searchButton"
            placeholder={reaction.args[1].argName}
            value={reactionParam2}
            onChange={(e) => setReactionParam2(e.target.value)}
          />
          <input
            hidden={isForm}
            type="text"
            name="name"
            className="weatherArea-searchButton"
            placeholder={reaction.args[2].argName}
            value={reactionParam3}
            onChange={(e) => setReactionParam3(e.target.value)}
          />
          <input
            hidden={isForm}
            type="submit"
            className="weatherArea-sendButton"
            value="Send"
          ></input>
        </form>
      );
    } else if (reaction.args != null && reaction.args.length === 2) {
      return (
        <form onSubmit={handleSubmitArea}>
          <input
            hidden={isForm}
            type="text"
            name="name"
            className="weatherArea-searchButton"
            placeholder={reaction.args[0].argName}
            value={reactionParam}
            onChange={(e) => setReactionParam(e.target.value)}
          />
          <input
            hidden={isForm}
            type="text"
            name="name"
            className="weatherArea-searchButton"
            placeholder={reaction.args[1].argName}
            value={reactionParam}
            onChange={(e) => setReactionParam(e.target.value)}
          />
          <input
            hidden={isForm}
            type="submit"
            className="weatherArea-sendButton"
            value="Send"
          ></input>
        </form>
      );
    } else if (reaction.args != null && reaction.args.length === 1) {
      return (
        <form onSubmit={handleSubmitArea}>
          <input
            hidden={isForm}
            type="text"
            name="name"
            className="weatherArea-searchButton"
            placeholder={reaction.args[0].argName}
            value={reactionParam}
            onChange={(e) => setReactionParam(e.target.value)}
          />
          <input
            hidden={isForm}
            type="submit"
            className="weatherArea-sendButton"
            value="Send"
          ></input>
        </form>
      );
    } else if (reaction.args != null && reaction.args.length === 0) {
      return (
        <form onSubmit={handleSubmitArea}>
          <input
            hidden={isForm}
            type="submit"
            className="weatherArea-sendButton"
            value="Send"
          ></input>
        </form>
      );
    }
  };

  return (
    <div className="weatherArea">
      <div className="weatherArea-container">
        <div className="weatherArea-AreaTest">
          <div className="weatherArea-Area">
            <div className="weatherArea-Title">
              Weather Creator
            </div>
            <div>
              <input
                type="text"
                name="name"
                className="weatherArea-titleButton"
                placeholder="Title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="weatherArea-containerButton">
              <div className="weatherArea-dropdown">
                <div className="weatherArea-btn" onClick={hidenAction}>
                  Actions
                </div>
                <div className="weatherArea-hidenAction" hidden={isAction}>
                  {isLoading ? (
                    <div>Loading...</div>
                  ) : (
                    allActionsPage.map((action, index) => (
                      <div className="weatherArea-btnPattern">
                        <div
                          key={action.service + action.name}
                          className="weatherArea-btnContent"
                          onClick={() => getAction(index, action)}
                        >
                          [{action.service}] - {action.name}:{" "}
                          {action.description}
                        </div>
                      </div>
                    ))
                  )}
                </div>
                {action !== "" && action.args.length === 1 ? <input
                  hidden={isForm}
                  type="text"
                  name="name"
                  className="githubArea-searchButton"
                  placeholder={action.args[0].argName}
                  value={actionParam}
                  onChange={(e) => setActionParam(e.target.value)}
                /> : <div></div>}
              </div>
              <div className="weatherArea-dropdown">
                <div className="weatherArea-btn" onClick={hidenReaction}>
                  <div>Reactions</div>
                </div>
                <div className="weatherArea-btnPattern" hidden={isReaction}>
                  {isLoading ? (
                    <div>Loading...</div>
                  ) : (
                    allReactionsPage.map((reaction, index) => (
                      <div
                        key={reaction.service + reaction.name}
                        className="weatherArea-btnContent"
                        onClick={() => getReaction(index, reaction)}
                      >
                        [{reaction.service}] - {reaction.name}:{" "}
                        {reaction.description}
                      </div>
                    ))
                  )}
                </div>
                {renderForm()}
              </div>
            </div>

            <div className="weatherArea-newArea">
              <div className="weatherArea-newAreaContainer">
                {renderTitle()}
                {renderAction()}
                {renderActionParameter()}
                {renderReaction()}
                {renderReactionParameter()}
                <div className="weatherArea-newAreaDelete" onClick={clearArea}>
                  clear
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
