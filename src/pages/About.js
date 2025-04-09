import { Container } from "@mui/material";
import "./About.css";
import { useState, useEffect } from "react";
import '.././config';
import { aboutApi } from '../api';

function About() 
{
  useEffect(() => 
  {
    window.scrollTo(0, 0);
  }, []);

  const [bios, setBios] = useState();

  // Fetch bios from Google Sheets
  useEffect(() => 
  {
    const getBios = async () => 
    {
      try {
        const { data } = await aboutApi.getBios();
        setBios(data.slice(1));
      } catch (error) {
        console.error('Error fetching bios:', error);
      }
    };

    getBios();
  }, []);

  // Construct HTML from bios data
  const WorkgroupBios = () => 
  {
    if (!bios) return <div>Loading...</div>;

    let people = [];

    for (let i = 0; i < bios.length; i++) 
    {
      if (bios[i].category === "Workgroup Chairs") 
      {
        let imgSource;
        try 
        {
          imgSource = require("./img/who-we-are/bio-img/" + bios[i].imageName);
        } 
        catch (err) 
        {
          console.log("file does not exist");
          imgSource = require("./img/who-we-are/bio-img/default.png");
        }

        people.push(
          <div className="bio" key={bios[i].name}>
            <img className="bio-img" src={imgSource} alt={bios[i].name}></img>
            <p className="bio-name">{bios[i].name}</p>
            <p className="bio-position">{bios[i].position}</p>
            <p className="bio-description">{bios[i].description}</p>
          </div>
        );
      }
    }

    return <div className="bio-group">{people}</div>;
  };

  // Construct HTML from bios data
  const SteeringCommitteeBios = () => 
  {
    if (!bios) return <div>Loading...</div>;

    let people = [];
    for (let i = 0; i < bios.length; i++) {
      if (bios[i].category === "Steering Committee") 
      {
        let imgSource;

        try 
        {
          imgSource = require("./img/who-we-are/bio-img/" + bios[i].imageName);
        } 
        catch (err) 
        {
          console.log("file does not exist");
          imgSource = require("./img/who-we-are/bio-img/default.png");
        }

        people.push(
          <div className="bio" key={bios[i].name}>
            <img className="bio-img" src={imgSource} alt={bios[i].name}></img>
            <p className="bio-name">{bios[i].name}</p>
            <p className="bio-position">{bios[i].position}</p>
            <p className="bio-description">{bios[i].description}</p>
          </div>
        );
      }
    }

    return <div className="bio-group">{people}</div>;
  };

  return (
    <>
      <div
        id="hero-img-who-we-are"
        role="img"
        aria-label="Farm to School Network members listen to speaker"
      >
        <h1>Who We Are</h1>
      </div>
      <Container>
        <div>
          <h3 className="lightgreen">Farm to School Network Support Team</h3>
          <p>
          Our chairs support the management and coordination of the Arizona Farm 
          to School Network. They are committed to ensuring that the support offered 
          is responsive to the voice of our members.
          </p>

          <WorkgroupBios />
          <SteeringCommitteeBios />
        </div>
      </Container>
    </>
  );
}

export default About;