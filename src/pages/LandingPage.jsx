import LandingMovie from "../components/LandingMovie";
import LandingReview from "../components/LandingReview";
import { Link } from "react-router-dom";

import "../css/LandingPage.css";

export default function HomePage() {
  return (
    <div className="home">
      <div className="container container-max-width">
        <div className="landing-header">
          <div className="landing-header-words">Cinnefiles.</div>
          <div className="landing-header-words2">
            Watch. Track. Rate. Repeat.
          </div>
        </div>

        <div className="main-create-account">
          <Link to="/signUp" className="button">
            Create A Free Account
          </Link>
        </div>

        <div className="reasons-why">
          <div className="top-row-reasons-why">
            <div className="reason-why-1">
              Keep track of movies you have seen or want to see!
            </div>
            <div className="reason-why-2">
              Interact and discuss with other movie lovers!
            </div>
          </div>
          <div className="bottom-reasons-why">
            <div className="reason-why-3">
              Review movies and see what your peers think, too!
            </div>
            <div className="reason-why-4">
              Subscribe to our box, and we will deliver an exclusive cinema
              experience to your doorstep!
            </div>
          </div>
        </div>

        <LandingMovie />
        <LandingReview />
      </div>
    </div>
  );
}
