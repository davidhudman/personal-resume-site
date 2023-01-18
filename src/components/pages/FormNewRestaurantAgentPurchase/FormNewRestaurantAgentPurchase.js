import React, { useState, useEffect } from "react"; // Fragment
import {
  // BrowserRouter as Router,
  // Route,
  // Routes,
  Link,
} from "react-router-dom";
import { ProgressBar } from "react-bootstrap";

import "./formnewrestaurantagentpurchase.css";
import "bootstrap/dist/css/bootstrap.min.css";

const FormNewRestaurantAgentPurchase = () => {
  const [formEnabled, setFormEnabled] = useState(true);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [message, setMessage] = useState("");
  const [formType, setFormType] = useState("waitingListAgentPurchases");
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState(false);

  const [unlockParagraphClickCount, setUnlockParagraphClickCount] = useState(0);
  const [env, setEnv] = useState("production");
  const [progressBarValue, setProgressBarValue] = useState(0);

  // setTimeout to update the progressBarValue by 1 every 100ms
  useEffect(() => {
    const interval = setInterval(() => {
      if (progressBarValue < 100) {
        setProgressBarValue(progressBarValue + 1);
      }
    }, 50);
    return () => clearInterval(interval);
  }, [progressBarValue]);

  const onFormSubmit = (e) => {
    e.preventDefault();
    setFormEnabled(false);
    setProgressBarValue(0);

    // build the payment request
    const req = {
      email,
      firstName,
      lastName,
      message,
      formType: "formNewRestaurantAgentPurchases",
    };

    // send the payment request to the server
    // local endpoint
    const formApi = {
      local: "http://localhost:3001/formWaitingListAgentPurchases",
      local2:
        "https://ps5lyq6sa8.execute-api.us-east-1.amazonaws.com/default/formWaitingListAgentPurchases",
      production:
        "https://ps5lyq6sa8.execute-api.us-east-1.amazonaws.com/default/formWaitingListAgentPurchases",
    };

    fetch(formApi[env], {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // access-control-allow-origin: *

        "Access-Control-Allow-Origin": "*", // this is the important part
      },
      body: JSON.stringify(req),
    })
      .then((res) => res.json())
      .then(
        (data) => {
          console.log("data", data);
          setFormEnabled(false);
          setProgressBarValue(100);

          // if data.error is set, set the error message to formError
          if (data.error) {
            // TODO: handle error cases
            if (data?.error?.details?.[0]?.message) {
              setFormError(data.error.details[0].message);
            } else {
              setFormError("Something went wrong. Please try again.");
            }
          } else {
            setFormSuccess(true);
          }
        } // end of .then()
      ); // end of fetch()
  };

  const getForm = () => {
    if (formEnabled) {
      return (
        <>
          {/* form with text box for QR code link */}
          <div className="form">
            <form>
              {/* email */}
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <br />
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="Enter Email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* first name */}
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <br />
                <input
                  type="text"
                  className="form-control"
                  id="firstName"
                  placeholder="Enter First Name"
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>

              {/* last name */}
              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <br />
                <input
                  type="text"
                  className="form-control"
                  id="lastName"
                  placeholder="Enter Last Name"
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>

              {/* message */}
              <div className="form-group">
                <label htmlFor="message">Restaurant Name</label>
                <br />
                <small id="message-help" className="form-text text-muted">
                  Please only send restaurants that currently support QR code
                  payments
                </small>
                <input
                  type="text"
                  className="form-control"
                  id="message"
                  placeholder="Enter Restaurant Name"
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              {/* submit button */}
              <button
                type="submit"
                className="btn btn-lg btn-block btn-primary"
                style={{ fontSize: "18px" }}
                onClick={(e) => onFormSubmit(e)}
              >
                Submit
              </button>
            </form>
          </div>
        </>
      );
    } else {
      return null;
    }
  };

  return (
    <div className="outer-home-container">
      <div className="home">
        <h1>Restaurant Suggestions</h1>
        <strong>
          Submit this form only if you know of restaurants with QR code payment
        </strong>

        <hr />

        {/* Error Message Display Div */}
        {formError ? (
          <div id="error-message" className="alert alert-danger" role="alert">
            <strong>Error!</strong> {formError}
          </div>
        ) : null}

        {/* Success Message Display Div */}
        {formSuccess ? (
          <div
            id="success-message"
            className="alert alert-success"
            role="alert"
          >
            <strong>Success!</strong> You have submitted a restaurant for us to
            review.
          </div>
        ) : null}

        {/* Loading Message Display Div */}
        {!formEnabled && !formError && progressBarValue != 100 ? (
          <>
            <div id="loading-message" className="alert alert-info" role="alert">
              <strong>
                If you are not shown a success message within 10 seconds, please
                refresh the page and try again.
              </strong>
            </div>
            {/* create a loading spinner with inline css */}
            <ProgressBar now={progressBarValue} animated />
          </>
        ) : null}
      </div>

      {getForm()}

      <br />
      <hr />

      <p>
        Agent purchases (or proxy purchases) are a way to pay for your meal at a
        restaurant that has QR code payments on their bill. You can pay for your
        meal by asking for your bill and scanning it with your phone. Then you
        can send the order number to us, and we will request the equivalent
        amount of crypto from you. Once we receive right amount of crypto from
        you, we will pay the restaurant bill on your behalf.
      </p>
      <br />
      <p>
        If you don't have access to the agent purchases feature and would like
        to join the waiting list, let us know by{" "}
        <a href="/waiting-list-agent-purchase">clicking here</a>. Or if you have
        access to the agent purchases feature, you can visit the page by{" "}
        <a href="/agent-purchase">clicking here</a>.
      </p>
      <br />

      {/* footer */}
      <div className="footer">
        <p>&copy; {new Date().getFullYear()} David Hudman</p>
      </div>
    </div>
  );
};

export default FormNewRestaurantAgentPurchase;
