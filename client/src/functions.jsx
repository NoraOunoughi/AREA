import { getDoc, doc, setDoc, collection, updateDoc } from "firebase/firestore";
import db from "./components/firebase/firebase";
import { Action, Reaction } from "./components/models/params";
import axios from "axios";

// Function to CREATE a new Area
// And push it to Bdd
export const createArea = async (userId, title, action, reaction, actionParam, reactionParam, reactionParam2, reactionParam3) => {
    let allAreaId = await getAllAreaId(userId);
    console.log(action, reaction, reactionParam);
    const setareas = doc(collection(db, "areas"));
    if (reaction.args.length === 3) {
      setDoc(setareas, {
        action: action.name,
        actionParams: actionParam,
        name: title,
        reaction: reaction.name,
        reactionParams: [reactionParam, reactionParam2, reactionParam3],
        uid: userId,
      });
    } else if (reaction.args.length === 2) {
      setDoc(setareas, {
        action: action.name,
        actionParams: actionParam,
        name: title,
        reaction: reaction.name,
        reactionParams: [reactionParam, reactionParam2],
        uid: userId,
      });
    } else if (reaction.args.length === 1) {
      setDoc(setareas, {
        action: action.name,
        actionParams: actionParam,
        name: title,
        reaction: reaction.name,
        reactionParams: [reactionParam],
        uid: userId,
      });
    } else {
      setDoc(setareas, {
        action: action.name,
        actionParams: actionParam,
        name: title,
        reaction: reaction.name,
        uid: userId,
      });
    }

    const newID = setareas.id.toString();
    allAreaId.push(newID);
    const docRef = doc(db, "users", userId);
    updateDoc(docRef, {
      ownedAreaId: allAreaId,
    });
};

// Function to get All Id of Area owned by a user
const getAllAreaId = async (userId) => {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    let allAreaId = [];
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data.hasOwnProperty("ownedAreaId")) {
        allAreaId = data.ownedAreaId;
        console.log(allAreaId);
        return allAreaId;
      }
    } else {
      console.log("No such document!");
    }
    return [];
};

// Function to Get all Params
// Action Reaction in about.json
// Into models class
// Token and args check
export const getAllParams = async (
    userData,
    page,
  ) => {
    // Get about.json form Server
    var aboutJson = await getAboutJson();
    var allActions = [];
    var allReactions = [];
    console.log(aboutJson);

    // Parcours all server services
    aboutJson.server.services.map(function (services) {
        let tokenName = services.name.toLowerCase() + "Token";
        if (services.name.toLowerCase() === "gmail" || services.name.toLowerCase() === "youtube") tokenName = "googleToken";
      if (services.name === page) {
        if (services.actions) {
          services.actions.map(function (action) {
            let newAction = new Action(
              services.name,
              action.name,
              action.description
            );
            if (action.args !== undefined) {
              newAction.args = action.args;
            }
            // if userDoc FireStore contains accessToken for this service or services is not Oauth
            if ((services.isNotOauth) || (userData[tokenName] !== undefined && userData[tokenName] !== "")) {
              allActions.push(newAction);
            }
            return 0;
          });
        }
      }
      if (services.reactions) {
        services.reactions.map(function (reaction) {
          let newReac = new Reaction(
            services.name,
            reaction.name,
            reaction.description
          );
          if (reaction.args !== undefined) {
            newReac.args = reaction.args;
          }
          console.log(tokenName);
          console.log(userData[tokenName]);
          if ((services.isNotOauth) || (userData[tokenName] !== undefined && userData[tokenName] !== "")) {
            allReactions.push(newReac);
          }
          return 0;
        });
      }
      return 0;
    });

    return [allActions, allReactions];
};

// Function to get the about.json from server
export const getAboutJson = async () => {
    var aboutJson = {};
    try {
        const response = await axios.get("http://localhost:8080/about.json");
        aboutJson = response.data;
    } catch (error) {
        console.log(error);
    }
    return aboutJson;
};