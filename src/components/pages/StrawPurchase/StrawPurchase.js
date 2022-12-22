import React, { useState } from "react"; // Fragment
import {
  // BrowserRouter as Router,
  // Route,
  // Routes,
  Link,
} from "react-router-dom";

import "./strawpurchase.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect } from "react";

const StrawPurchase = () => {
  const [whichTipPercentageChecked, setWhichTipPercentageChecked] =
    useState("option0");
  const [tipPercentage, setTipPercentage] = useState(0);
  const [isShowTip, setIsShowTip] = useState(true);
  const [tipCustomAmount, setTipCustomAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [formEnabled, setFormEnabled] = useState(false);
  const [showPromptCashPayButton, setShowPromptCashPayButton] = useState(false);
  const [showCustomTip, setShowCustomTip] = useState(true);
  const [showPercentageTip, setShowPercentageTip] = useState(false);
  const [email, setEmail] = useState("");
  const [qrCodeLink, setQrCodeLink] = useState("");
  const [refundAddress, setRefundAddress] = useState("");
  const [password, setPassword] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [customOrderId, setCustomOrderId] = useState(null);
  const [unlockParagraphClickCount, setUnlockParagraphClickCount] = useState(0);

  // useEffect for totalAmount
  useEffect(() => {
    console.log("totalAmount", totalAmount);
    // show prompt.cash QR code
    if (totalAmount > 0) {
      setShowPromptCashPayButton(true);
    }
    if (customOrderId) {
      setCustomOrderId(customOrderId);
    }
  }, [totalAmount, customOrderId]);

  const unlockParagraphClickHandler = (e) => {
    setUnlockParagraphClickCount(unlockParagraphClickCount + 1);
    if (unlockParagraphClickCount >= 3) {
      setFormEnabled(true);
    }
  };

  const onFormSubmit = (e) => {
    e.preventDefault();
    setFormEnabled(false);

    // build the payment request
    const paymentRequest = {
      tipCustomAmount,
      tipPercentage,
      email,
      qrCodeLink,
      refundAddress,
      password,
      orderNumber,
    };

    // send the payment request to the server
    // local endpoint
    const invoiceApi = {
      local: "http://localhost:3001/invoice",
    };

    fetch(invoiceApi.local, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // access-control-allow-origin: *

        // "Access-Control-Allow-Origin": "*", // this is the important part
      },
      body: JSON.stringify(paymentRequest),
    })
      .then((res) => res.json())
      .then(
        (data) => {
          console.log("data", data);
          setFormEnabled(false);
          setTotalAmount(data.body.totalAfterTip);
          setCustomOrderId(data.body.customOrderId);
        } // end of .then()
      ); // end of fetch()
  };

  const getTipForm = () => {
    return (
      <>
        {/* bill amount */}
        {/* <div className="form-group">
          <label htmlFor="bill-amount">Bill Amount Before Tip (optional)</label>
          <br />
          <small id="bill-amount-help" className="form-text text-muted">
            We will charge you based on the QR code you send, not the amount
            entered here. This is just so you can specify a tip.
          </small>
          <input
            type="number"
            className="form-control"
            id="bill-amount"
            placeholder="Enter Bill Amount"
          />
        </div> */}
        {/* tip percentage buttons */}
        {showPercentageTip ? (
          <div className="form-group">
            <label htmlFor="tip-percentage">Tip Percentage</label>
            <br />
            <div className="btn-group btn-group-toggle" data-toggle="buttons">
              <label className="btn btn-secondary active">
                <input
                  type="radio"
                  name="options"
                  id="option0"
                  autoComplete="off"
                  defaultChecked
                  value="0"
                  onClick={tipPercentageClickHandler}
                />{" "}
                0%
              </label>
              <label className="btn btn-secondary">
                <input
                  type="radio"
                  name="options"
                  id="option15"
                  autoComplete="off"
                  value="15"
                  onClick={tipPercentageClickHandler}
                />{" "}
                15%
              </label>
              <label className="btn btn-secondary">
                <input
                  type="radio"
                  name="options"
                  id="option18"
                  autoComplete="off"
                  value="18"
                  onClick={tipPercentageClickHandler}
                />{" "}
                18%
              </label>
              <label className="btn btn-secondary">
                <input
                  type="radio"
                  name="options"
                  id="option20"
                  autoComplete="off"
                  value="20"
                  onClick={tipPercentageClickHandler}
                />{" "}
                20%
              </label>
              <label className="btn btn-secondary">
                <input
                  type="radio"
                  name="options"
                  id="optionother"
                  autoComplete="off"
                  value=""
                  onClick={tipPercentageClickHandler}
                />{" "}
                other
              </label>
            </div>
          </div>
        ) : null}

        {/* tip amount */}
        {showCustomTip ? (
          <div className="form-group">
            <label htmlFor="tip-amount">Tip Amount (in USD dollars)</label>
            <br />

            <input
              type="number"
              className="form-control"
              id="tip-amount"
              placeholder="Enter Tip Amount"
              onChange={(e) => setTipCustomAmount(e.target.value)}
            />
          </div>
        ) : null}
        {/* <small id="custom-tip-help" className="form-text text-muted">
            Enter any amount you want to tip
          </small> */}
        {/* total amount */}
        {/* <div className="form-group">
          <label htmlFor="total-amount">Total Amount (in dollars)</label>
          <h3 id="total-amount">${totalAmount}</h3>
        </div> */}
      </>
    );
  };

  const getAgentPurchaseForm = () => {
    if (formEnabled) {
      return (
        <>
          {/* form with text box for QR code link */}
          <div className="strawpurchase-form">
            <form>
              {/* password */}
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <br />
                <small id="password-help" className="form-text text-muted">
                  While the site is still in beta, you need the password to
                  purchase. If you don't have it, don't try to guess it. Contact
                  us instead and we will put you on a waiting list.
                </small>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="Enter Password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {/* order number */}
              <div className="form-group">
                <label htmlFor="order-number">Order Number</label>
                <br />
                <small id="order-number-help" className="form-text text-muted">
                  Enter the order number on your check (bill).
                </small>
                <input
                  type="text"
                  className="form-control"
                  id="order-number"
                  placeholder="Enter Order Number"
                  onChange={(e) => setOrderNumber(e.target.value)}
                />
              </div>

              {/* email */}
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="Enter Email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="qr-code-link">QR Code Link</label>
                <input
                  type="text"
                  className="form-control"
                  id="qr-code-link"
                  placeholder="Enter QR Code Link"
                  onChange={(e) => setQrCodeLink(e.target.value)}
                />
              </div>
              {/* refund address */}
              <div className="form-group">
                <label htmlFor="refund-address">Refund Address</label>
                <br />
                {/* small italic text */}
                <small
                  id="refund-address-help"
                  className="form-text text-muted"
                >
                  If there is a problem with your payment, we will send your
                  refund to this address.
                </small>
                <input
                  type="text"
                  className="form-control"
                  id="refund-address"
                  placeholder="Enter Refund Address"
                  onChange={(e) => setRefundAddress(e.target.value)}
                />
              </div>

              {getTipForm()}

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

  // tip percentage button click handler
  const tipPercentageClickHandler = (e) => {
    setShowCustomTip(e.target.value === "" ? true : false);

    // disable default checked for previously checked button
    console.log(`changing ${whichTipPercentageChecked} to ${e.target.id}`);

    document.getElementById(whichTipPercentageChecked).checked = false;
    document.getElementById(whichTipPercentageChecked).defaultChecked = false;
    // remove active class from previously checked button's label
    document
      .getElementById(whichTipPercentageChecked)
      .parentNode.classList.remove("active");

    // set new checked button
    setWhichTipPercentageChecked(e.target.id);
    document.getElementById(e.target.id).checked = true;
    document.getElementById(e.target.id).defaultChecked = true;

    // set its label to active
    document.getElementById(e.target.id).parentNode.classList.add("active");

    // set target to defaultChecked
    e.target.defaultChecked = true;

    // set tip percentage
    setTipPercentage(e.target.value);

    // // get the tip percentage
    // const tipPercentage = e.target.value;

    // // get the bill amount
    // const billAmount = document.getElementById("bill-amount").value;

    // // calculate the tip amount
    // const tip_amount = (billAmount * tipPercentage) / 100;

    // // calculate the total amount
    // const total_amount = parseFloat(billAmount) + parseFloat(tip_amount);

    // // display the tip amount
    // document.getElementById("tip-amount").value = tip_amount;

    // // display the total amount
    // document.getElementById("total-amount").value = total_amount;

    // setTotalAmount(total_amount);
  };

  return (
    <div className="outer-home-container">
      <div className="home">
        <h1>Agent Purchases</h1>
        <h4>Send a QR-enabled receipt & crypto, and we pay the restaurant.</h4>

        <br />

        <div>
          <p>
            Be sure to provide us with your email so we can send you payment
            confirmation that we receive from the restaurant. And view the
            confirmation email before leaving just in case payment fails for
            some reason.
          </p>
          <hr />
          <h3>Accepted Restaurants</h3>
          <p>Cracker Barrel coming soon</p>

          <hr />

          <br />
        </div>

        {getAgentPurchaseForm()}
        {showPromptCashPayButton ? (
          <div>
            <p>
              If you would like to pay with Bitcoin, please click the button
              below.
            </p>
            <form
              name="prompt-cash-form"
              action="https://prompt.cash/pay"
              method="get"
            >
              <input type="hidden" name="token" value="608-eiDIZuKh" />
              <input type="hidden" name="tx_id" value={customOrderId} />
              <input type="hidden" name="amount" value={totalAmount} />
              <input type="hidden" name="currency" value="USD" />
              <input type="hidden" name="desc" value="Your Product" />
              <input
                type="hidden"
                name="return"
                value="http://localhost:3000/agentpurchase"
              />
              {/* <input
                type="hidden"
                name="callback"
                value="http://your-store.com/api/v1/update-payment"
              /> */}
              <button type="submit" class="btn btn-primary">
                Pay ${totalAmount} with BitcoinCash (BCH)
              </button>
            </form>
          </div>
        ) : null}

        <br />
        <br />

        <p>
          Agent purchases are a way to pay for your meal at a restaurant that
          has QR code payments on their bill. You can pay for your meal by
          asking for your bill and scanning it with your phone. Then you can
          send the link to us, and we will request the equivalent amount of
          crypto from you. Once we receive right amount of crypto from you, we
          will pay the restaurant bill on your behalf.
        </p>
        <br />
        <p onClick={unlockParagraphClickHandler}>
          The restaurant will not know that you paid with crypto, and you will
          not have to give them your credit card or cash. If they ask, just say
          that you paid through the QR code on the receipt.
        </p>
        <p>
          If you have suggestions for restaurants that we should add to our list
          who accept QR code payments, please let me know by reaching out to me
          on <a href="https://www.linkedin.com/in/davidhudman/">My LinkedIn</a>.
        </p>
        <br />

        {/* footer */}
        <div className="footer">
          <p>&copy; {new Date().getFullYear()} David Hudman</p>
        </div>
      </div>
    </div>
  );
};

export default StrawPurchase;
