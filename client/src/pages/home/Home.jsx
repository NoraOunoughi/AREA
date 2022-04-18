import "./home.css";
import React, { useState, useEffect } from "react";
import { getDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";
import db from "../../components/firebase/firebase";
import Ravenclaw_Background from "../../assets/potter/house/ravenclaw_house.jpg";
import Gryffindor_Background from "../../assets/potter/house/gryffindor_house.jpg";
import Hufflepuff_Background from "../../assets/potter/house/hufflepuff_house.jpg";
import Slytherin_Background from "../../assets/potter/house/slytherin_house.JPG";
import Neutral_Background from "../../assets/potter/house/neutral_house.png";

export default function Home() {
  const uid = localStorage.getItem("uid");
  const house = doc(db, "users", uid);
  const [backgroundImage, setbackgroundImage] = useState(Neutral_Background);
  const [allAction, setAction] = useState([]);
  const [allActionList, setActionList] = useState([]);

  useEffect(() => {
    Fetchdata();
    setBackground();
    getArea();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  //     const intervalId = setInterval(() => {
  //       getArea();
  //     }, 5000);
  //     return () => clearInterval(intervalId); //This is important
  // });

  // const actionsData = (AreaObj) => {
  //   DocumentSnapshot documentSnapshot =
  //     await FirebaseFirestore.instance.collection('users').doc(uid).get();
  //   if (documentSnapshot.exists) {
  //     docData = documentSnapshot.data() as Map<String, dynamic>;
  //   }
  // }

  const Fetchdata = async () => {
    const docSnap = await getDoc(house);
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data.house !== undefined) {
        window.localStorage.setItem("house", data.house);
      } else {
        window.localStorage.setItem("house", "Neutral_Background");
      }
    } else {
      console.log("No such document!");
    }
  };

  const setBackground = async () => {
    if (localStorage.getItem("house") === "gryffindor")
      setbackgroundImage(Gryffindor_Background);
    if (localStorage.getItem("house") === "hufflepuff")
      setbackgroundImage(Hufflepuff_Background);
    if (localStorage.getItem("house") === "ravenclaw")
      setbackgroundImage(Ravenclaw_Background);
    if (localStorage.getItem("house") === "slytherin")
      setbackgroundImage(Slytherin_Background);
    if (localStorage.getItem("house") === "Neutral_Background")
      setbackgroundImage(Neutral_Background);
  };

  const getallAreaId = async () => {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    let areaID = [];
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data.hasOwnProperty("ownedAreaId")) {
        areaID = data.ownedAreaId;
        console.log(areaID);
        return areaID;
      }
    } else {
      console.log("No such document!");
    }
  };

  const getArea = async () => {
    let resultAllAreaId = await getallAreaId();
    let tab = [];

    if (resultAllAreaId) {
      for (let i = 0; i < resultAllAreaId.length; i++) {
        const data = {};
        const docRef = doc(db, "areas", resultAllAreaId[i]);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          data.areaName = docSnap.data().action;
          data.reactionName = docSnap.data().reaction;
          data.reactionParam = docSnap.data().reactionParams;
          data.name = docSnap.data().name;
          data.index = i;
          tab[i] = data;
        }
      }
    } else {
      tab = [];
    }
    console.log(tab);
    setAction(resultAllAreaId);
    setActionList(tab);
  };

  const getClickID = async (index) => {
    // console.log(allAction[index]);
    deleteAreaID(allAction[index], index);
    await getArea();
  };

  const deleteAreaID = async (removeID, index) => {
    allAction.splice(index, 1);
    console.log(allAction);
    const docRef = doc(db, "users", uid);
    updateDoc(docRef, {
      ownedAreaId: allAction,
    });
    deleteDoc(doc(db, "areas", removeID));
  };

  return (
    <div className="home">
      <div
        className="home-container"
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      >
        <div className="home-panel">
          <div className="home-title">All my Area</div>
          <div className="home-area">
            <div className="home-areaList">
              {allActionList.map(
                ({ name, areaName, reactionName, reactionParam, index }) => (
                  <p key={index}>
                    {name} - Action: {areaName} - Reaction: {reactionName}{" "}
                    {reactionParam}.
                    <span
                      className="home-areaDelete"
                      onClick={() => getClickID(index)}
                    >
                      Delete
                    </span>
                  </p>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
