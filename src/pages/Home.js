import "./Home.css";
import config from "../config";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import CardButton from "../components/CardButton.js";

function Home() {
  console.log(config.DOMAIN);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const navigate = useNavigate();

  const infoRef = useRef(null);

  const goToLearnMore = () => {
    window.scrollTo({
      top: infoRef.current.offsetTop - 100,
      behavior: "smooth", 
    });
  };

  return (
    <>
      <div className="homepage-hero-img">
        <div className="hero-box">
          <h1>Welcome</h1>
          <p>
            The Arizona Farm to School Network is a state-wide hub of
            connections, research, and resources that are gathered and shared to
            support all communities working to implement and sustain farm to
            school programming.
          </p>
          <CardButton
            onClick={goToLearnMore}
            color="#B55B2C"
            text="Learn More"
          ></CardButton>
        </div>
      </div>
      <div className="home-page-top">        
        <div className="home-row teal-card">
          <div className="text-col">
            <h1>Find Resources</h1>
            <p>
              Browse our library of resources for information on topics like tips 
              on getting started, food education, school gardens, food service, local 
              purchasing, sustainability, and more.
            </p>
            <CardButton
              onClick={(e) => {
                navigate("/resources");
              }}
              color="#568571"
              text="Learn More"
            ></CardButton>
          </div>
          <div className="teal-row-img row-img" />
        </div>
        <div className="home-row brown-card">
          <div className="brown-row-img row-img" />
          <div className="text-col">
            <h1>See the Network Map</h1>
            <p>
              Discover organizations and members involved in the farm to school 
              network in your region and connect with them using this interactive map.
            </p>
            <CardButton
              onClick={(e) => {
                navigate("/map");
              }}
              color="#A1762B"
              text="Explore"
            ></CardButton>
          </div>
        </div>
        <div className="home-row purple-card">
          <div className="text-col">
            <h1>Read Our Newsletter</h1>
            <p>
              Stay up to date with what's happening in the AZ Farm to
              School Network. Learn about events in your area and how to get
              involved in your community.
            </p>
            <CardButton
              onClick={(e) => {
                navigate("/newsletter");
              }}
              color="#7A3C5F"
              text="Read"
            ></CardButton>
          </div>
          <div className="purple-row-img row-img" />
        </div>
      </div>
      <div className="homepage-mid">
        <div className="horizontal-line" ref={infoRef} />
        <div className="f2s-description">
          <h1 className="green-header">
            What is the Arizona Farm to School Network
          </h1>
          <p>
            Farm to School is a national movement that promotes the use of 
            locally- and regionally-grown foods in schools. The Arizona Farm to School 
            Network aspires to inspire systemic promotion and implementation of farm to school 
            and farm to early childhood education priorities around the state of Arizona. As a 
            network, we work to strengthen the connection between community, state, and nationwide 
            efforts in pursuit of increased access to local food, school gardens, and food education to 
            improve childrens health, strengthen relationships with local producers, and cultivate thriving 
            communities.
            <br />
            <br />
            &emsp;&emsp;Farm to School activities and initiatives can
            include nutrition education in classrooms, farmer visits, signage
            promoting local foods, serving local foods in the cafeteria, school
            gardens, and so much more!
          </p>
          <div className="three-pillars-row">
            <div className="pillars-diagram-img" />
            <div className="pillars-description">
              <p>The three core elements of Farm to School include:</p>
              <ul>
                <li>
                  <b>Procurement - </b>Purchasing and promoting local foods that
                  are served in the school meals.
                </li>
                <li>
                  <b>Food Education - </b>Educational activities for students to
                  learn about agriculture, food, health, and nutrition
                </li>
                <li>
                  <b>School Gardens - </b>Students receive hands-on learning
                  through gardening
                </li>
              </ul>
            </div>
          </div>
          <div className="benefits-section">
            <div className="benefits-section-text">
              <h2 className="purple-header">THE BENEFITS</h2>
              <a
                href="https://www.fns.usda.gov/f2s/research-shows-farm-school-works"
                target="_blank"
                rel="noreferrer"
              >
                <p>Research shows that Farm to School Works!</p>
              </a>
              <ul>
                <li>Stimulates local and regional economies.</li>
                <li>
                  Increases student's health, nutrition, and academic
                  performance.
                </li>
                <li>Helps healthy habits take root early.</li>
                <li>
                  Read more about the{" "}
                  <a
                    href="https://www.farmtoschool.org/resources-main/benefits-of-farm-to-school"
                    target="_blank"
                    rel="noreferrer"
                  >
                    benefits of Farm to School!
                  </a>
                </li>
              </ul>
              <div className="gap" />
              <h2 className="purple-header">GET INVOLVED</h2>
              <ul>
                <li>
                  <a
                    href="https://www.farmtoschool.org/our-work/farm-to-school-month"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Participate in Farm to School Month.
                  </a>
                </li>
                <li>Check out our{" "}
                  <a
                    href={`${config.DOMAIN}/calendar`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Event Calendar
                  </a>
                </li>
                <li>
                  <a href="/sign-up">Create an account</a> to become a member
                  (it's free)!
                </li>
                <li>
                  Subscribe to our{" "}
                  <a
                    href="https://gmail.us11.list-manage.com/subscribe?u=8ab36a253b7d3786969d0a77d&id=a16a0fde59"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Newsletter
                  </a>
                </li>
              </ul>
            </div>
            <div className="quote-img" />
          </div>
          <div className="statistics-section">
            <div className="gap" />
            <h2 className="purple-header">STATISTICS</h2>
            <p className="statistics-text">
              National Farm to School Network research{" "}
              <a
                href="https://www.farmtoschool.org/resources-main/benefits-of-farm-to-school"
                target="_blank"
                rel="noreferrer"
              >
                findings
              </a>{" "}
              discovered that participation in Farm to School{" "}
              <a
                href="https://assets.website-files.com/5c469df2395cd53c3d913b2d/611027419232d281ad2f51ff_BenefitsFactSheet.pdf"
                target="_blank"
                rel="noreferrer"
              >
                resulted
              </a>{" "}
              in:
            </p>
            <ul>
              <li>
                <b>Students - </b>Increased consumption of fruit and vegetables,
                as well as an increase in physical activity, academic
                achievement and food system awareness.
              </li>
              <li>
                <b>Schools - </b>On average, there was a 9% increase in school
                meal participation, overall improvement of food service staff
                morale and improved cafeteria options.
              </li>
              <li>
                <b>Farmers - </b>On average, there was a 5% increase in income
                for producers selling to Farm to School, as well as increased
                diversification and new growth opportunities.
              </li>
              <li>
                <b>Community - </b>For every $1 spent there was a $2.16 of
                economic activity generated. Families have increased food
                security and positive diet changes.
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="homepage-bottom">
        <div className="home-row green-card">
          <div className="text-col-cop">
            <h1>Farm to School Network Communities of Practice</h1>
            <p>The Arizona Farm to School Network organizes two Communities of Practices (CoPs): 
            School Gardens & Food Education in K-12 & Early Childhood Education CoP and 
            Local Food Purchasing in K-12 & Early Childhood Education CoP. Network members 
            can choose their level of engagement in these groups to find the support they need 
            for their unique initiatives.
            </p>
          </div>
          <div className="green-row-img row-img" />
        </div>
      </div>
      
      <br />
      <br />
      <br />
    </>
  );
}

/* old homepage bottom

<div className="homepage-bottom">
        <div className="wg-col left-col">
          <div className="wg-card">
            <img src={wheelbarrow_img} alt="Wheelbarrow icon" />
            <h2 className="purple-header">SCHOOL GARDEN</h2>
            <div className="wg-text">
              <p>
                <b>Chairs:</b> Barbara Halden and Jessie Giambia
              </p>
              <p>
                <b>Purpose of Workgroup:</b>
              </p>
              <ul>
                <li>
                  Create a network and support system for all people involved in
                  implementing educational gardening across Arizona
                </li>
                <li>
                  Plan and align standards with the garden cycles during the
                  school year
                </li>
                <li>Build community around the gardens</li>
                <li>
                  Communicate the magnificence of school gardening to the wider
                  educational system
                </li>
              </ul>
            </div>
          </div>
          <div className="wg-card">
            <img src={book_img} alt="Book icon" />
            <h2 className="purple-header">FARM TO EARLY CHILDHOOD</h2>
            <div className="wg-text">
              <p>
                <b>Chairs:</b> Tricia Kinnell, Dionne Washington, Leslie Owen
              </p>
              <p>
                <b>Purpose of Workgroup:</b>
              </p>
              <ul>
                <li>Connect Farm to ECE stakeholders from across Arizona</li>
                <li>Support implementation of Farm to ECE</li>
                <li>
                  Build Farm to ECE resources specific to Arizona's diverse
                  growing regions and cultures
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="wg-col right-col">
          <div className="wg-card">
            <img src={truck_img} alt="Truck icon" />
            <h2 className="purple-header">LOCAL PRODUCTION & PROCUREMENT</h2>
            <div className="wg-text">
              <p>
                <b>Chairs:</b> Patty Emmert and Rachel Gomez Acosta
              </p>
              <p>
                <b>Purpose of Workgroup:</b>
              </p>
              <ul>
                <li>
                  Facilitate partnerships between producers, School Food
                  Authorities (SFA's), and other stakeholders (SNAP-Ed,
                  Cooperative Extension Offices, Community Health, Policy
                  Advocates, etc.) to increase the use of local food to nourish
                  our children through school meals and other nutrition programs
                </li>
                <li>Provide outreach, education, and technical assistance</li>
              </ul>
            </div>
          </div>
          <div className="wg-card">
            <img src={student_img} alt="Student icon" />
            <h2 className="purple-header">FOOD EDUCATION</h2>
            <div className="wg-text">
              <p>
                <b>Chairs:</b> Paige Mollen and Shelby Thompson
              </p>
              <p>
                <b>Purpose of Workgroup:</b>
              </p>
              <ul>
                <li>
                  Increase food education experiences in schools across Arizona
                  by providing education and networking opportunities to
                  collectively problem solve
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

*/

export default Home;
