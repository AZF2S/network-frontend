import "./ContactCard.css";
import config from "../config.js";
import { useState, useEffect } from "react";
import PrimaryButton from "./PrimaryButton";
import educatorPic from "./../assets/profile/default/profile-01.jpg";
import gardenerPic from "./../assets/profile/default/profile-14.jpg";
import defaultPic from "./../assets/profile/default/profile-06.jpg";
import studentPic from "./../assets/profile/default/profile-10.jpg";
import farmerPic from "./../assets/profile/default/profile-05.jpg";
import volunteerPic from "./../assets/profile/default/profile-04.jpg";
import adminPic from "./../assets/profile/default/profile-03.jpg";
import parentPic from "./../assets/profile/default/profile-09.jpg";
import organizerPic from "./../assets/profile/default/profile-07.jpg";

function ContactCard({ user, groupColors }) {
  const [picture, setPicture] = useState("");
  const [defaultPicture, setDefaultPicture] = useState("");
  const [displayName, setDisplayName] = useState(""); // Defaults to username if user doesn't give permission
  const [location, setLocation] = useState(""); // Full string for location div
  const [groupElements, setGroupElements] = useState(""); // Dynamic HTML for groups
  const [backgroundGradient, setBackgroundGradient] = useState("#ddd");
  const [color, set_color] = useState("#ddd");
  const [orgElements, setOrgElements] = useState([]);
  const [groupDefaultPictures, setGroupDefaultPictures] = useState({
    Farmer: farmerPic,
    Gardener: gardenerPic,
    Educator: educatorPic,
    Committee: defaultPic,
    Workgroup: defaultPic,
    Student: studentPic,
    Volunteer: volunteerPic,
    Administrator: adminPic,
    Parent: parentPic,
    Organizer: organizerPic,
  });

  useEffect(() => {
    // Set Full Name
    if (user.settings.showfullname === "1" && user.fullname !== "") {
      setDisplayName(user.fullname);
    } else {
      setDisplayName("@" + user.username);
    }

    // Set location string
    if (user.showlocation) {
      if (user.city && user.county) {
        const setLocationString = "📍 " + user.city + "  ||  " + user.county;
        setLocation(setLocationString);
      } else if (user.city) {
        const setLocationString = "📍 " + user.city;
        setLocation(setLocationString);
      } else if (user.county) {
        const setLocationString = "📍 " + user.county;
        setLocation(setLocationString);
      }
    }

    // Create group elements
    let groupList = [];

    if (user?.groups?.length > 0) {
      groupList = user.groups;
      if (groupList[0] === "") {
        groupList = [];
      }
    }

    if (groupList?.length > 0) {
      let tempGroupElements = groupList.map((group) => (
        <p
          key={group}
          className="card-role"
          style={{ backgroundColor: groupColors[group] || "4f7942" }}
        >
          {group}
        </p>
      ));

      setGroupElements(tempGroupElements);

      const colorList = groupList.map(
        (group) => groupColors[group] || "4f7942"
      );

      if (colorList?.length > 1) {
        const tempBackgroundGradient = `linear-gradient(to right, ${colorList.join(
          ", "
        )})`;
        setBackgroundGradient(tempBackgroundGradient);
      } else if (colorList?.length === 1) {
        setBackgroundGradient(groupColors[groupList[0]]);
      } else {
        setBackgroundGradient("#ddd");
      }
    }

    // Set profile picture
    if (user.picture) {
      setPicture(user.picture);
    } else {
      const groupDefaultPicturesArray = Object.values(groupDefaultPictures);

      // get random picture based on groups
      if (groupList?.length > 1) { // Fix for users who are only in the Network Members group
        const filteredPictures = Object.entries(groupDefaultPictures)
          .filter(([group]) => groupList.includes(group))
          .map(([_, picture]) => picture);

        const randomIndex = Math.floor(
          Math.random() * filteredPictures?.length
        );
        setDefaultPicture(filteredPictures[randomIndex]);

        // Set color based on the selected picture
        const selectedGroup = Object.keys(groupDefaultPictures).find(
          (group) =>
            groupDefaultPictures[group] === filteredPictures[randomIndex]
        );
        const selectedColor = groupColors[selectedGroup];
        set_color(groupColors[groupList[0]]);
      } else {
        setDefaultPicture(groupDefaultPictures["Student"]);
      }
    }

    if (groupList?.length > 0) {
      set_color(groupColors[groupList[0]]);
    } else {
      set_color("#ddd");
    }

    // Create organization stuff
    if (user?.organizations?.length > 0) {
      const tempOrgElements = user.organizations.map((org, index) =>
        org.role ? (
          <p key={index} className="card-title">
            <span className="bold">{org.role}</span> at{" "}
            <span className="italic">{org.name}</span>
          </p>
        ) : (
          <p key={index} className="card-title">
            <span className="italic">{org.name}</span>
          </p>
        )
      );

      setOrgElements(tempOrgElements);
    }
  }, []);

  return (
    <>
      <div className="single-card" style={{ border: "2.5px solid" + color }}>
        <div
          className="single-card-top"
          style={{ background: backgroundGradient }}
        />

        <div className="card-profile-pic">
          {picture !== "" ? (
            <img
              src={`${config.NODEBB_URL}${picture}`}
              style={{ border: "2px solid" + color }}
            />
          ) : (
            <img src={defaultPicture} style={{ border: "2px solid" + color }} />
          )}
        </div>

        <div className="card-details-div">
          <h4 id="FULL NAME" className="card-name">
            {displayName}
          </h4>

          <p id="LOCATION" className="card-location">
            {location}
          </p>

          <div
            id="GROUPS"
            className="flex flex-wrap"
            style={{ justifyContent: "center" }}
          >
            {groupElements}
          </div>

          <br />

          <div id="ORGANIZATION">{orgElements}</div>

          {
            <div id="Email Button Logic">
              {user.email !== "" && user.settings.showemail === "1" && (
                <a className="email-link" href={"mailto:" + user.email}>
                  <PrimaryButton
                    backgroundColor={color}
                    text="Email"
                  ></PrimaryButton>
                  <br />
                  <br />
                </a>
              )}
            </div>
          }
        </div>
      </div>
    </>
  );
}

export default ContactCard;
