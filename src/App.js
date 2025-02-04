import React, { useState, useEffect } from "react";
import "./App.css";
import Layout from "./components/Layout.js";
import BettingOptions from "./components/BettingOptions.js";

function App() {
  const [chipCount, setChipCount] = useState(1000);
  const [pendingTotalBet, setPendingTotalBet] = useState(0);
  const [currentBetValue, setCurrentBetValue] = useState(0);
  const [totalAmountWon, setTotalAmountWon] = useState(0);
  const [winningNumber, setWinningNumber] = useState(null);
  const [previousTwenty, setPreviousTwenty] = useState([]);
  const [straightUps, setStraightUps] = useState({
    "0": 0, "00": 0,
    "1": 0, "4": 0, "7": 0, "10": 0, "13": 0, "16": 0, "19": 0, "22": 0, "25": 0, "28": 0, "31": 0, "34": 0,
    "2": 0, "5": 0, "8": 0, "11": 0, "14": 0, "17": 0, "20": 0, "23": 0, "26": 0, "29": 0, "32": 0, "35": 0,
    "3": 0, "6": 0, "9": 0, "12": 0, "15": 0, "18": 0, "21": 0, "24": 0, "27": 0, "30": 0, "33": 0, "36": 0
  });
  const [splits, setSplits] = useState({
    "0-00": 0, "0-1": 0, "00-3": 0,
    "1-2": 0, "2-3": 0, "1-4": 0, "2-5": 0, "3-6": 0,
    "4-5": 0, "5-6": 0, "4-7": 0, "5-8": 0, "6-9": 0,
    "7-8": 0, "8-9": 0, "7-10": 0, "8-11": 0, "9-12": 0,
    "10-11": 0, "11-12": 0, "10-13": 0, "11-14": 0, "12-15": 0,
    "13-14": 0, "14-15": 0, "13-16": 0, "14-17": 0, "15-18": 0,
    "16-17": 0, "17-18": 0, "16-19": 0, "17-20": 0, "18-21": 0,
    "19-20": 0, "20-21": 0, "19-22": 0, "20-23": 0, "21-24": 0,
    "22-23": 0, "23-24": 0, "22-25": 0, "23-26": 0, "24-27": 0,
    "25-26": 0, "26-27": 0, "25-28": 0, "26-29": 0, "27-30": 0,
    "28-29": 0, "29-30": 0, "28-31": 0, "29-32": 0, "30-33": 0,
    "31-32": 0, "32-33": 0, "31-34": 0, "32-35": 0, "33-36": 0,
    "34-35": 0, "35-36": 0
  });
  const [streets, setStreets] = useState({
    "00-2-3": 0, "0-00-2": 0, "0-1-2": 0,
    "1-2-3": 0, "4-5-6": 0, "7-8-9": 0,
    "10-11-12": 0, "13-14-15": 0, "16-17-18": 0,
    "19-20-21": 0, "22-23-24": 0, "25-26-27": 0,
    "28-29-30": 0, "31-32-33": 0, "34-35-36": 0
  });
  const [corners, setCorners] = useState({
    "1-2-4-5": 0, "2-3-5-6": 0, "4-5-7-8": 0, "5-6-8-9": 0,
    "7-8-10-11": 0, "8-9-11-12": 0, "10-11-13-14": 0, "11-12-14-15": 0,
    "13-14-16-17": 0, "14-15-17-18": 0, "16-17-19-20": 0, "17-18-20-21": 0,
    "19-20-22-23": 0, "20-21-23-24": 0, "22-23-25-26": 0, "23-24-26-27": 0,
    "25-26-28-29": 0, "26-27-29-30": 0, "28-29-31-32": 0, "29-30-32-33": 0,
    "31-32-34-35": 0, "32-33-35-36": 0
  });
  const [doubleStreets, setDoubleStreets] = useState({
    "1 to 6": 0, "4 to 9": 0, "7 to 12": 0,
    "10 to 15": 0, "13 to 18": 0, "16 to 21": 0,
    "19 to 24": 0, "22 to 27": 0, "25 to 30": 0,
    "28 to 33": 0, "31 to 36": 0
  });
  const [basket, setBasket] = useState(0);
  const [columns, setColumns] = useState({ "1st column": 0, "2nd column": 0, "3rd column": 0 });
  const [dozens, setDozens] = useState({ "1st dozen": 0, "2nd dozen": 0, "3rd dozen": 0 });
  const [redBlack, setRedBlack] = useState({ "red": 0, "black": 0 });
  const [oddEven, setOddEven] = useState({ "odd": 0, "even": 0 });
  const [highLow, setHighLow] = useState({ "high": 0, "low": 0 });
  const [isSpinComplete, setIsSpinComplete] = useState(false);
  const [recentBets, setRecentBets] = useState([]);
  const [previousTotalBet, setPreviousTotalBet] = useState(0);
  const [allPreviousBets, setAllPreviousBets] = useState([]);
  const [isWheelSpinning, setIsWheelSpinning] = useState(false);

  const wheelNumbers = [
    "0", "00",
    "1", "4", "7", "10", "13", "16", "19", "22", "25", "28", "31", "34",
    "2", "5", "8", "11", "14", "17", "20", "23", "26", "29", "32", "35",
    "3", "6", "9", "12", "15", "18", "21", "24", "27", "30", "33", "36"
  ];

  const spinTheWheel = () => {
    if (!isSpinComplete && pendingTotalBet > 0 && !isWheelSpinning) {
      setIsWheelSpinning(true);
      setTimeout(() => {
        let randomIndex = Math.floor(Math.random() * Math.floor(38));
        let randomWinner = wheelNumbers[randomIndex];
        setWinningNumber(randomWinner);

        let currentTwenty = [...previousTwenty];

        if (currentTwenty.length < 20) {
          setPreviousTwenty([randomWinner, ...previousTwenty]);
        } else {
          currentTwenty.unshift(randomWinner);
          currentTwenty.pop();
          setPreviousTwenty(currentTwenty);
        }

        setIsSpinComplete(true);
      }, 3000);
    }
  };

  const resetLayout = () => {
    setCurrentBetValue(0);
    setTotalAmountWon(0);
    setStraightUps({
      "0": 0, "00": 0,
      "1": 0, "4": 0, "7": 0, "10": 0, "13": 0, "16": 0, "19": 0, "22": 0, "25": 0, "28": 0, "31": 0, "34": 0,
      "2": 0, "5": 0, "8": 0, "11": 0, "14": 0, "17": 0, "20": 0, "23": 0, "26": 0, "29": 0, "32": 0, "35": 0,
      "3": 0, "6": 0, "9": 0, "12": 0, "15": 0, "18": 0, "21": 0, "24": 0, "27": 0, "30": 0, "33": 0, "36": 0
    });
    setSplits({
      "0-00": 0, "0-1": 0, "00-3": 0,
      "1-2": 0, "2-3": 0, "1-4": 0, "2-5": 0, "3-6": 0,
      "4-5": 0, "5-6": 0, "4-7": 0, "5-8": 0, "6-9": 0,
      "7-8": 0, "8-9": 0, "7-10": 0, "8-11": 0, "9-12": 0,
      "10-11": 0, "11-12": 0, "10-13": 0, "11-14": 0, "12-15": 0,
      "13-14": 0, "14-15": 0, "13-16": 0, "14-17": 0, "15-18": 0,
      "16-17": 0, "17-18": 0, "16-19": 0, "17-20": 0, "18-21": 0,
      "19-20": 0, "20-21": 0, "19-22": 0, "20-23": 0, "21-24": 0,
      "22-23": 0, "23-24": 0, "22-25": 0, "23-26": 0, "24-27": 0,
      "25-26": 0, "26-27": 0, "25-28": 0, "26-29": 0, "27-30": 0,
      "28-29": 0, "29-30": 0, "28-31": 0, "29-32": 0, "30-33": 0,
      "31-32": 0, "32-33": 0, "31-34": 0, "32-35": 0, "33-36": 0,
      "34-35": 0, "35-36": 0
    });
    setStreets({
      "00-2-3": 0, "0-00-2": 0, "0-1-2": 0,
      "1-2-3": 0, "4-5-6": 0, "7-8-9": 0,
      "10-11-12": 0, "13-14-15": 0, "16-17-18": 0,
      "19-20-21": 0, "22-23-24": 0, "25-26-27": 0,
      "28-29-30": 0, "31-32-33": 0, "34-35-36": 0
    });
    setDoubleStreets({
      "1 to 6": 0, "4 to 9": 0, "7 to 12": 0,
      "10 to 15": 0, "13 to 18": 0, "16 to 21": 0,
      "19 to 24": 0, "22 to 27": 0, "25 to 30": 0,
      "28 to 33": 0, "31 to 36": 0
    });
    setCorners({
      "1-2-4-5": 0, "2-3-5-6": 0, "4-5-7-8": 0, "5-6-8-9": 0,
      "7-8-10-11": 0, "8-9-11-12": 0, "10-11-13-14": 0, "11-12-14-15": 0,
      "13-14-16-17": 0, "14-15-17-18": 0, "16-17-19-20": 0, "17-18-20-21": 0,
      "19-20-22-23": 0, "20-21-23-24": 0, "22-23-25-26": 0, "23-24-26-27": 0,
      "25-26-28-29": 0, "26-27-29-30": 0, "28-29-31-32": 0, "29-30-32-33": 0,
      "31-32-34-35": 0, "32-33-35-36": 0
    });
    setBasket(0);
    setColumns({ "1st column": 0, "2nd column": 0, "3rd column": 0 });
    setDozens({ "1st dozen": 0, "2nd dozen": 0, "3rd dozen": 0 });
    setRedBlack({ "red": 0, "black": 0 });
    setOddEven({ "odd": 0, "even": 0 });
    setHighLow({ "low": 0, "high": 0 });
    if (!isSpinComplete) {
      setChipCount(chipCount + pendingTotalBet);
    }
    setPendingTotalBet(0);
    if (isSpinComplete && totalAmountWon === 0 && chipCount === 0) {
      setIsSpinComplete(false);
      setChipCount(1000);
    }
    setRecentBets([]);
  };

  const whatColorNumber = (winningNum) => {
    switch (winningNum) {
      // Green Numbers
      case "0":
      case "00":
        return "green-previous-number";
      // Red Numbers
      case "1":
      case "3":
      case "5":
      case "7":
      case "9":
      case "12":
      case "14":
      case "16":
      case "18":
      case "19":
      case "21":
      case "23":
      case "25":
      case "27":
      case "30":
      case "32":
      case "34":
      case "36":
        return "red-previous-number";
      // Black Numbers
      case "2":
      case "4":
      case "6":
      case "8":
      case "10":
      case "11":
      case "13":
      case "15":
      case "17":
      case "20":
      case "22":
      case "24":
      case "26":
      case "28":
      case "29":
      case "31":
      case "33":
      case "35":
        return "black-previous-number";
      default:
        console.log("Something went wrong in App.js > WhatColorNumber()");
        break;
    }
  };

  const wheelHistoryLine = previousTwenty.map((winningNum) => {
    return (
      <div className={whatColorNumber(winningNum)}>
        <p className="history-num">{winningNum}</p>
      </div>
    );
  });


  const undoRecentBet = () => {
    let mostRecentBet = recentBets[recentBets.length - 1];
    let betType = mostRecentBet[0];
    let betKey = mostRecentBet[1];
    let betValue = mostRecentBet[2];
    let newSplits = { ...splits };
    let newStraightUps = { ...straightUps };
    let newColumns = { ...columns };
    let newStreets = { ...streets };
    let newDoubleStreets = { ...doubleStreets };
    let newHighLow = { ...highLow };
    let newOddEven = { ...oddEven };
    let newRedBlack = { ...redBlack };
    let newDozens = { ...dozens };
    let newCorners = { ...corners };

    switch (betType) {
      case "straight":
        newStraightUps[betKey] = straightUps[betKey] - betValue;
        setStraightUps(newStraightUps);
        break;
      case "split":
        newSplits[betKey] = splits[betKey] - betValue;
        setSplits(newSplits);
        break;
      case "corner":
        newCorners[betKey] = corners[betKey] - betValue;
        setCorners(newCorners);
        break;
      case "street":
        newStreets[betKey] = streets[betKey] - betValue;
        setStreets(newStreets);
        break;
      case "double-street":
        newDoubleStreets[betKey] = doubleStreets[betKey] - betValue;
        setDoubleStreets(newDoubleStreets);
        break;
      case "column":
        newColumns[betKey] = columns[betKey] - betValue;
        setColumns(newColumns);
        break;
      case "dozen":
        newDozens[betKey] = dozens[betKey] - betValue;
        setDozens(newDozens);
        break;
      case "low":
        newHighLow[betKey] = highLow[betKey] - betValue;
        setHighLow(newHighLow);
        break;
      case "high":
        newHighLow[betKey] = highLow[betKey] - betValue;
        setHighLow(newHighLow);
        break;
      case "odd":
        newOddEven[betKey] = oddEven[betKey] - betValue;
        setOddEven(newOddEven);
        break;
      case "even":
        newOddEven[betKey] = oddEven[betKey] - betValue;
        setOddEven(newOddEven);
        break;
      case "red":
        newRedBlack[betKey] = redBlack[betKey] - betValue;
        setRedBlack(newRedBlack);
        break;
      case "basket":
        setBasket(basket - betValue);
        break;
      default:
        console.log("No recent bet");
    }
    setChipCount(chipCount + betValue);
    setPendingTotalBet(pendingTotalBet - betValue);
    let newRecentBets = recentBets.splice(0, recentBets.length - 1);
    setRecentBets(newRecentBets);
  };

  const sameBet = () => {
    console.log(allPreviousBets);
  }

  const collectWinnings = () => {
    setIsSpinComplete(false);
    if (totalAmountWon > 0) {
      setChipCount(chipCount + totalAmountWon);
    }
    resetLayout();
  };

  const whichMessage = (messageType) => {
    const goodMessages = [
      "Nice one! Won",
      "Nailed it! Won",
      "Chicken dinner! Won",
      "Damn! You are a luckycat! Won"
    ];
    const badMessages = [
      "Not this time. Lost",
      "Boooo, lost",
      "It's only pretend luckily! Lost",
      "It's only pretend luckycat! Lost",
    ];

    if (messageType === "won") {
      return goodMessages[Math.floor(Math.random() * goodMessages.length)];
    } else if (messageType === "lost") {
      return badMessages[Math.floor(Math.random() * badMessages.length)];
    }
  };

  // Fixes the back to back number problem
  useEffect(() => {
    if (previousTwenty[-1] === previousTwenty[-2]) {
      setIsWheelSpinning(false);
    }
  }, [previousTwenty]);

  // PAYOUT SECTION BELOW
  useEffect(() => {
    let allPayouts = 0;
    if (winningNumber) {
      setIsWheelSpinning(false);
      switch (winningNumber) {
        case "0":
          allPayouts =
            straightUps["0"] * 35 +
            straightUps["0"] +
            (splits["0-00"] * 17 + splits["0-00"]) +
            (splits["0-1"] * 17 + splits["0-1"]) +
            (streets["0-00-2"] * 11 + streets["0-00-2"]) +
            (streets["0-1-2"] * 11 + streets["0-1-2"]) +
            (basket * 6 + basket);
          break;
        case "1":
          allPayouts =
            straightUps["1"] * 35 +
            straightUps["1"] +
            (splits["0-1"] * 17 + splits["0-1"]) +
            (splits["1-2"] * 17 + splits["1-2"]) +
            (splits["1-4"] * 17 + splits["1-4"]) +
            (streets["0-1-2"] * 11 + streets["0-1-2"]) +
            (streets["1-2-3"] * 11 + streets["1-2-3"]) +
            (corners["1-2-4-5"] * 8 + corners["1-2-4-5"]) +
            (basket * 6 + basket) +
            (doubleStreets["1 to 6"] * 5 + doubleStreets["1 to 6"]) +
            columns["1st column"] * 3 +
            dozens["1st dozen"] * 3 +
            oddEven["odd"] * 2 +
            highLow["low"] * 2 +
            redBlack["red"] * 2;
          break;
        case "2":
          allPayouts =
            straightUps["2"] * 35 +
            straightUps["2"] +
            (splits["1-2"] * 17 + splits["1-2"]) +
            (splits["2-3"] * 17 + splits["2-3"]) +
            (splits["2-5"] * 17 + splits["2-5"]) +
            (streets["00-2-3"] * 11 + streets["00-2-3"]) +
            (streets["0-00-2"] * 11 + streets["0-00-2"]) +
            (streets["0-1-2"] * 11 + streets["0-1-2"]) +
            (streets["1-2-3"] * 11 + streets["1-2-3"]) +
            (corners["1-2-4-5"] * 8 + corners["1-2-4-5"]) +
            (corners["2-3-5-6"] * 8 + corners["2-3-5-6"]) +
            (basket * 6 + basket) +
            (doubleStreets["1 to 6"] * 5 + doubleStreets["1 to 6"]) +
            columns["2nd column"] * 3 +
            dozens["1st dozen"] * 3 +
            oddEven["even"] * 2 +
            highLow["low"] * 2 +
            redBlack["black"] * 2;
          break;
        case "3":
          allPayouts =
            straightUps["3"] * 35 +
            straightUps["3"] +
            (splits["00-3"] * 17 + splits["00-3"]) +
            (splits["2-3"] * 17 + splits["2-3"]) +
            (splits["3-6"] * 17 + splits["3-6"]) +
            (streets["00-2-3"] * 11 + streets["00-2-3"]) +
            (streets["1-2-3"] * 11 + streets["1-2-3"]) +
            (corners["2-3-5-6"] * 8 + corners["2-3-5-6"]) +
            (basket * 6 + basket) +
            (doubleStreets["1 to 6"] * 5 + doubleStreets["1 to 6"]) +
            columns["3rd column"] * 3 +
            dozens["1st dozen"] * 3 +
            oddEven["odd"] * 2 +
            highLow["low"] * 2 +
            redBlack["red"] * 2;
          break;
        case "4":
          allPayouts =
            straightUps["4"] * 35 +
            straightUps["4"] +
            (splits["1-4"] * 17 + splits["1-4"]) +
            (splits["4-5"] * 17 + splits["4-5"]) +
            (splits["4-7"] * 17 + splits["4-7"]) +
            (streets["4-5-6"] * 11 + streets["4-5-6"]) +
            (corners["1-2-4-5"] * 8 + corners["1-2-4-5"]) +
            (corners["4-5-7-8"] * 8 + corners["4-5-7-8"]) +
            (doubleStreets["1 to 6"] * 5 + doubleStreets["1 to 6"]) +
            (doubleStreets["4 to 9"] * 5 + doubleStreets["4 to 9"]) +
            columns["1st column"] * 3 +
            dozens["1st dozen"] * 3 +
            oddEven["even"] * 2 +
            highLow["low"] * 2 +
            redBlack["black"] * 2;
          break;
        case "5":
          allPayouts =
            straightUps["5"] * 35 +
            straightUps["5"] +
            (splits["2-5"] * 17 + splits["2-5"]) +
            (splits["4-5"] * 17 + splits["4-5"]) +
            (splits["5-6"] * 17 + splits["5-6"]) +
            (splits["5-8"] * 17 + splits["5-8"]) +
            (streets["4-5-6"] * 11 + streets["4-5-6"]) +
            (corners["1-2-4-5"] * 8 + corners["1-2-4-5"]) +
            (corners["2-3-5-6"] * 8 + corners["2-3-5-6"]) +
            (corners["4-5-7-8"] * 8 + corners["4-5-7-8"]) +
            (corners["5-6-8-9"] * 8 + corners["5-6-8-9"]) +
            (doubleStreets["1 to 6"] * 5 + doubleStreets["1 to 6"]) +
            (doubleStreets["4 to 9"] * 5 + doubleStreets["4 to 9"]) +
            columns["2nd column"] * 3 +
            dozens["1st dozen"] * 3 +
            oddEven["odd"] * 2 +
            highLow["low"] * 2 +
            redBlack["red"] * 2;
          break;
        case "6":
          allPayouts =
            straightUps["6"] * 35 +
            straightUps["6"] +
            (splits["3-6"] * 17 + splits["3-6"]) +
            (splits["5-6"] * 17 + splits["5-6"]) +
            (splits["6-9"] * 17 + splits["6-9"]) +
            (streets["4-5-6"] * 11 + streets["4-5-6"]) +
            (corners["2-3-5-6"] * 8 + corners["2-3-5-6"]) +
            (corners["5-6-8-9"] * 8 + corners["5-6-8-9"]) +
            (doubleStreets["1 to 6"] * 5 + doubleStreets["1 to 6"]) +
            (doubleStreets["4 to 9"] * 5 + doubleStreets["4 to 9"]) +
            columns["3rd column"] * 3 +
            dozens["1st dozen"] * 3 +
            oddEven["even"] * 2 +
            highLow["low"] * 2 +
            redBlack["black"] * 2;
          break;
        case "7":
          allPayouts =
            straightUps["7"] * 35 +
            straightUps["7"] +
            (splits["4-7"] * 17 + splits["4-7"]) +
            (splits["7-8"] * 17 + splits["7-8"]) +
            (splits["7-10"] * 17 + splits["7-10"]) +
            (streets["7-8-9"] * 11 + streets["7-8-9"]) +
            (corners["4-5-7-8"] * 8 + corners["4-5-7-8"]) +
            (corners["7-8-10-11"] * 8 + corners["7-8-10-11"]) +
            (doubleStreets["4 to 9"] * 5 + doubleStreets["4 to 9"]) +
            (doubleStreets["7 to 12"] * 5 + doubleStreets["7 to 12"]) +
            columns["1st column"] * 3 +
            dozens["1st dozen"] * 3 +
            oddEven["odd"] * 2 +
            highLow["low"] * 2 +
            redBlack["red"] * 2;
          break;
        case "8":
          allPayouts =
            straightUps["8"] * 35 +
            straightUps["8"] +
            (splits["5-8"] * 17 + splits["5-8"]) +
            (splits["7-8"] * 17 + splits["7-8"]) +
            (splits["8-9"] * 17 + splits["8-9"]) +
            (splits["8-11"] * 17 + splits["8-11"]) +
            (streets["7-8-9"] * 11 + streets["7-8-9"]) +
            (corners["4-5-7-8"] * 8 + corners["4-5-7-8"]) +
            (corners["5-6-8-9"] * 8 + corners["5-6-8-9"]) +
            (corners["7-8-10-11"] * 8 + corners["7-8-10-11"]) +
            (corners["8-9-11-12"] * 8 + corners["8-9-11-12"]) +
            (doubleStreets["4 to 9"] * 5 + doubleStreets["4 to 9"]) +
            (doubleStreets["7 to 12"] * 5 + doubleStreets["7 to 12"]) +
            columns["2nd column"] * 3 +
            dozens["1st dozen"] * 3 +
            oddEven["even"] * 2 +
            highLow["low"] * 2 +
            redBlack["black"] * 2;
          break;
        case "9":
          allPayouts =
            straightUps["9"] * 35 +
            straightUps["9"] +
            (splits["6-9"] * 17 + splits["6-9"]) +
            (splits["8-9"] * 17 + splits["8-9"]) +
            (splits["9-12"] * 17 + splits["9-12"]) +
            (streets["7-8-9"] * 11 + streets["7-8-9"]) +
            (corners["5-6-8-9"] * 8 + corners["5-6-8-9"]) +
            (corners["8-9-11-12"] * 8 + corners["8-9-11-12"]) +
            (doubleStreets["4 to 9"] * 5 + doubleStreets["4 to 9"]) +
            (doubleStreets["7 to 12"] * 5 + doubleStreets["7 to 12"]) +
            columns["3rd column"] * 3 +
            dozens["1st dozen"] * 3 +
            oddEven["odd"] * 2 +
            highLow["low"] * 2 +
            redBlack["red"] * 2;
          break;
        case "10":
          allPayouts =
            straightUps["10"] * 35 +
            straightUps["10"] +
            (splits["7-10"] * 17 + splits["7-10"]) +
            (splits["10-11"] * 17 + splits["10-11"]) +
            (splits["10-13"] * 17 + splits["10-13"]) +
            (streets["10-11-12"] * 11 + streets["10-11-12"]) +
            (corners["7-8-10-11"] * 8 + corners["7-8-10-11"]) +
            (corners["10-11-13-14"] * 8 + corners["10-11-13-14"]) +
            (doubleStreets["7 to 12"] * 5 + doubleStreets["7 to 12"]) +
            (doubleStreets["10 to 15"] * 5 + doubleStreets["10 to 15"]) +
            columns["1st column"] * 3 +
            dozens["1st dozen"] * 3 +
            oddEven["even"] * 2 +
            highLow["low"] * 2 +
            redBlack["black"] * 2;
          break;
        case "11":
          allPayouts =
            straightUps["11"] * 35 +
            straightUps["11"] +
            (splits["8-11"] * 17 + splits["8-11"]) +
            (splits["10-11"] * 17 + splits["10-11"]) +
            (splits["11-12"] * 17 + splits["11-12"]) +
            (splits["11-14"] * 17 + splits["11-14"]) +
            (streets["10-11-12"] * 11 + streets["10-11-12"]) +
            (corners["7-8-10-11"] * 8 + corners["7-8-10-11"]) +
            (corners["8-9-11-12"] * 8 + corners["8-9-11-12"]) +
            (corners["10-11-13-14"] * 8 + corners["10-11-13-14"]) +
            (corners["11-12-14-15"] * 8 + corners["11-12-14-15"]) +
            (doubleStreets["7 to 12"] * 5 + doubleStreets["7 to 12"]) +
            (doubleStreets["10 to 15"] * 5 + doubleStreets["10 to 15"]) +
            columns["2nd column"] * 3 +
            dozens["1st dozen"] * 3 +
            oddEven["odd"] * 2 +
            highLow["low"] * 2 +
            redBlack["black"] * 2;
          break;
        case "12":
          allPayouts =
            straightUps["12"] * 35 +
            straightUps["12"] +
            (splits["9-12"] * 17 + splits["9-12"]) +
            (splits["11-12"] * 17 + splits["11-12"]) +
            (splits["12-15"] * 17 + splits["12-15"]) +
            (streets["10-11-12"] * 11 + streets["10-11-12"]) +
            (corners["8-9-11-12"] * 8 + corners["8-9-11-12"]) +
            (corners["11-12-14-15"] * 8 + corners["11-12-14-15"]) +
            (doubleStreets["7 to 12"] * 5 + doubleStreets["7 to 12"]) +
            (doubleStreets["10 to 15"] * 5 + doubleStreets["10 to 15"]) +
            columns["3rd column"] * 3 +
            dozens["1st dozen"] * 3 +
            oddEven["even"] * 2 +
            highLow["low"] * 2 +
            redBlack["red"] * 2;
          break;
        case "13":
          allPayouts =
            straightUps["13"] * 35 +
            straightUps["13"] +
            (splits["10-13"] * 17 + splits["10-13"]) +
            (splits["13-14"] * 17 + splits["13-14"]) +
            (splits["13-16"] * 17 + splits["13-16"]) +
            (streets["13-14-15"] * 11 + streets["13-14-15"]) +
            (corners["10-11-13-14"] * 8 + corners["10-11-13-14"]) +
            (corners["13-14-16-17"] * 8 + corners["13-14-16-17"]) +
            (doubleStreets["10 to 15"] * 5 + doubleStreets["10 to 15"]) +
            (doubleStreets["13 to 18"] * 5 + doubleStreets["13 to 18"]) +
            columns["1st column"] * 3 +
            dozens["2nd dozen"] * 3 +
            oddEven["odd"] * 2 +
            highLow["low"] * 2 +
            redBlack["black"] * 2;
          break;
        case "14":
          allPayouts =
            straightUps["14"] * 35 +
            straightUps["14"] +
            (splits["11-14"] * 17 + splits["11-14"]) +
            (splits["13-14"] * 17 + splits["13-14"]) +
            (splits["14-15"] * 17 + splits["14-15"]) +
            (splits["14-17"] * 17 + splits["14-17"]) +
            (streets["13-14-15"] * 11 + streets["13-14-15"]) +
            (corners["10-11-13-14"] * 8 + corners["10-11-13-14"]) +
            (corners["11-12-14-15"] * 8 + corners["11-12-14-15"]) +
            (corners["13-14-16-17"] * 8 + corners["13-14-16-17"]) +
            (corners["14-15-17-18"] * 8 + corners["14-15-17-18"]) +
            (doubleStreets["10 to 15"] * 5 + doubleStreets["10 to 15"]) +
            (doubleStreets["13 to 18"] * 5 + doubleStreets["13 to 18"]) +
            columns["2nd column"] * 3 +
            dozens["2nd dozen"] * 3 +
            oddEven["even"] * 2 +
            highLow["low"] * 2 +
            redBlack["red"] * 2;
          break;
        case "15":
          allPayouts =
            straightUps["15"] * 35 +
            straightUps["15"] +
            (splits["12-15"] * 17 + splits["12-15"]) +
            (splits["14-15"] * 17 + splits["14-15"]) +
            (splits["15-18"] * 17 + splits["15-18"]) +
            (streets["13-14-15"] * 11 + streets["13-14-15"]) +
            (corners["11-12-14-15"] * 8 + corners["11-12-14-15"]) +
            (corners["14-15-17-18"] * 8 + corners["14-15-17-18"]) +
            (doubleStreets["10 to 15"] * 5 + doubleStreets["10 to 15"]) +
            (doubleStreets["13 to 18"] * 5 + doubleStreets["13 to 18"]) +
            columns["3rd column"] * 3 +
            dozens["2nd dozen"] * 3 +
            oddEven["odd"] * 2 +
            highLow["low"] * 2 +
            redBlack["black"] * 2;
          break;
        case "16":
          allPayouts =
            straightUps["16"] * 35 +
            straightUps["16"] +
            (splits["13-16"] * 17 + splits["13-16"]) +
            (splits["16-17"] * 17 + splits["16-17"]) +
            (splits["16-19"] * 17 + splits["16-19"]) +
            (streets["16-17-18"] * 11 + streets["16-17-18"]) +
            (corners["13-14-16-17"] * 8 + corners["13-14-16-17"]) +
            (corners["16-17-19-20"] * 8 + corners["16-17-19-20"]) +
            (doubleStreets["13 to 18"] * 5 + doubleStreets["13 to 18"]) +
            (doubleStreets["16 to 21"] * 5 + doubleStreets["16 to 21"]) +
            columns["1st column"] * 3 +
            dozens["2nd dozen"] * 3 +
            oddEven["even"] * 2 +
            highLow["low"] * 2 +
            redBlack["red"] * 2;
          break;
        case "17":
          allPayouts =
            straightUps["17"] * 35 +
            straightUps["17"] +
            (splits["14-17"] * 17 + splits["14-17"]) +
            (splits["16-17"] * 17 + splits["16-17"]) +
            (splits["17-18"] * 17 + splits["17-18"]) +
            (splits["18-21"] * 17 + splits["18-21"]) +
            (streets["16-17-18"] * 11 + streets["16-17-18"]) +
            (corners["13-14-16-17"] * 8 + corners["13-14-16-17"]) +
            (corners["14-15-17-18"] * 8 + corners["14-15-17-18"]) +
            (corners["16-17-19-20"] * 8 + corners["16-17-19-20"]) +
            (corners["17-18-20-21"] * 8 + corners["17-18-20-21"]) +
            (doubleStreets["13 to 18"] * 5 + doubleStreets["13 to 18"]) +
            (doubleStreets["16 to 21"] * 5 + doubleStreets["16 to 21"]) +
            columns["2nd column"] * 3 +
            dozens["2nd dozen"] * 3 +
            oddEven["odd"] * 2 +
            highLow["low"] * 2 +
            redBlack["black"] * 2;
          break;
        case "18":
          allPayouts =
            straightUps["18"] * 35 +
            straightUps["18"] +
            (splits["15-18"] * 17 + splits["15-18"]) +
            (splits["17-18"] * 17 + splits["17-18"]) +
            (splits["18-21"] * 17 + splits["18-21"]) +
            (streets["16-17-18"] * 11 + streets["16-17-18"]) +
            (corners["14-15-17-18"] * 8 + corners["14-15-17-18"]) +
            (corners["17-18-20-21"] * 8 + corners["17-18-20-21"]) +
            (doubleStreets["13 to 18"] * 5 + doubleStreets["13 to 18"]) +
            (doubleStreets["16 to 21"] * 5 + doubleStreets["16 to 21"]) +
            columns["3rd column"] * 3 +
            dozens["2nd dozen"] * 3 +
            oddEven["even"] * 2 +
            highLow["low"] * 2 +
            redBlack["red"] * 2;
          break;
        case "19":
          allPayouts =
            straightUps["19"] * 35 +
            straightUps["19"] +
            (splits["16-19"] * 17 + splits["16-19"]) +
            (splits["19-20"] * 17 + splits["19-20"]) +
            (splits["19-22"] * 17 + splits["19-22"]) +
            (streets["19-20-21"] * 11 + streets["19-20-21"]) +
            (corners["16-17-19-20"] * 8 + corners["16-17-19-20"]) +
            (corners["19-20-22-23"] * 8 + corners["19-20-22-23"]) +
            (doubleStreets["16 to 21"] * 5 + doubleStreets["16 to 21"]) +
            (doubleStreets["19 to 24"] * 5 + doubleStreets["19 to 24"]) +
            columns["1st column"] * 3 +
            dozens["2nd dozen"] * 3 +
            oddEven["odd"] * 2 +
            highLow["high"] * 2 +
            redBlack["red"] * 2;
          break;
        case "20":
          allPayouts =
            straightUps["20"] * 35 +
            straightUps["20"] +
            (splits["17-20"] * 17 + splits["17-20"]) +
            (splits["19-20"] * 17 + splits["19-20"]) +
            (splits["20-21"] * 17 + splits["20-21"]) +
            (splits["20-23"] * 17 + splits["20-23"]) +
            (streets["19-20-21"] * 11 + streets["19-20-21"]) +
            (corners["16-17-19-20"] * 8 + corners["16-17-19-20"]) +
            (corners["17-18-20-21"] * 8 + corners["17-18-20-21"]) +
            (corners["19-20-22-23"] * 8 + corners["19-20-22-23"]) +
            (corners["20-21-23-24"] * 8 + corners["20-21-23-24"]) +
            (doubleStreets["16 to 21"] * 5 + doubleStreets["16 to 21"]) +
            (doubleStreets["19 to 24"] * 5 + doubleStreets["19 to 24"]) +
            columns["2nd column"] * 3 +
            dozens["2nd dozen"] * 3 +
            oddEven["even"] * 2 +
            highLow["high"] * 2 +
            redBlack["black"] * 2;
          break;
        case "21":
          allPayouts =
            straightUps["21"] * 35 +
            straightUps["21"] +
            (splits["18-21"] * 17 + splits["18-21"]) +
            (splits["20-21"] * 17 + splits["20-21"]) +
            (splits["21-24"] * 17 + splits["21-24"]) +
            (streets["19-20-21"] * 11 + streets["19-20-21"]) +
            (corners["17-18-20-21"] * 8 + corners["17-18-20-21"]) +
            (corners["20-21-23-24"] * 8 + corners["20-21-23-24"]) +
            (doubleStreets["16 to 21"] * 5 + doubleStreets["16 to 21"]) +
            (doubleStreets["19 to 24"] * 5 + doubleStreets["19 to 24"]) +
            columns["3rd column"] * 3 +
            dozens["2nd dozen"] * 3 +
            oddEven["odd"] * 2 +
            highLow["high"] * 2 +
            redBlack["red"] * 2;
          break;
        case "22":
          allPayouts =
            straightUps["22"] * 35 +
            straightUps["22"] +
            (splits["19-22"] * 17 + splits["19-22"]) +
            (splits["22-23"] * 17 + splits["22-23"]) +
            (splits["22-25"] * 17 + splits["22-25"]) +
            (streets["22-23-24"] * 11 + streets["22-23-24"]) +
            (corners["19-20-22-23"] * 8 + corners["19-20-22-23"]) +
            (corners["22-23-25-26"] * 8 + corners["22-23-25-26"]) +
            (doubleStreets["19 to 24"] * 5 + doubleStreets["19 to 24"]) +
            (doubleStreets["22 to 27"] * 5 + doubleStreets["22 to 27"]) +
            columns["1st column"] * 3 +
            dozens["2nd dozen"] * 3 +
            oddEven["even"] * 2 +
            highLow["high"] * 2 +
            redBlack["black"] * 2;
          break;
        case "23":
          allPayouts =
            straightUps["23"] * 35 +
            straightUps["23"] +
            (splits["20-23"] * 17 + splits["20-23"]) +
            (splits["22-23"] * 17 + splits["22-23"]) +
            (splits["23-24"] * 17 + splits["23-24"]) +
            (splits["23-26"] * 17 + splits["23-26"]) +
            (streets["22-23-24"] * 11 + streets["22-23-24"]) +
            (corners["19-20-22-23"] * 8 + corners["19-20-22-23"]) +
            (corners["20-21-23-24"] * 8 + corners["20-21-23-24"]) +
            (corners["22-23-25-26"] * 8 + corners["22-23-25-26"]) +
            (corners["23-24-26-27"] * 8 + corners["23-24-26-27"]) +
            (doubleStreets["19 to 24"] * 5 + doubleStreets["19 to 24"]) +
            (doubleStreets["22 to 27"] * 5 + doubleStreets["22 to 27"]) +
            columns["2nd column"] * 3 +
            dozens["2nd dozen"] * 3 +
            oddEven["odd"] * 2 +
            highLow["high"] * 2 +
            redBlack["red"] * 2;
          break;
        case "24":
          allPayouts =
            straightUps["24"] * 35 +
            straightUps["24"] +
            (splits["21-24"] * 17 + splits["21-24"]) +
            (splits["23-24"] * 17 + splits["23-24"]) +
            (splits["24-27"] * 17 + splits["24-27"]) +
            (streets["22-23-24"] * 11 + streets["22-23-24"]) +
            (corners["20-21-23-24"] * 8 + corners["20-21-23-24"]) +
            (corners["23-24-26-27"] * 8 + corners["23-24-26-27"]) +
            (doubleStreets["19 to 24"] * 5 + doubleStreets["19 to 24"]) +
            (doubleStreets["22 to 27"] * 5 + doubleStreets["22 to 27"]) +
            columns["3rd column"] * 3 +
            dozens["2nd dozen"] * 3 +
            oddEven["even"] * 2 +
            highLow["high"] * 2 +
            redBlack["black"] * 2;
          break;
        case "25":
          allPayouts =
            straightUps["25"] * 35 +
            straightUps["25"] +
            (splits["22-25"] * 17 + splits["22-25"]) +
            (splits["25-26"] * 17 + splits["25-26"]) +
            (splits["25-28"] * 17 + splits["25-28"]) +
            (streets["25-26-27"] * 11 + streets["25-26-27"]) +
            (corners["22-23-25-26"] * 8 + corners["22-23-25-26"]) +
            (corners["25-26-28-29"] * 8 + corners["25-26-28-29"]) +
            (doubleStreets["22 to 27"] * 5 + doubleStreets["22 to 27"]) +
            (doubleStreets["25 to 30"] * 5 + doubleStreets["25 to 30"]) +
            columns["1st column"] * 3 +
            dozens["3rd dozen"] * 3 +
            oddEven["odd"] * 2 +
            highLow["high"] * 2 +
            redBlack["red"] * 2;
          break;
        case "26":
          allPayouts =
            straightUps["26"] * 35 +
            straightUps["26"] +
            (splits["23-26"] * 17 + splits["23-26"]) +
            (splits["25-26"] * 17 + splits["25-26"]) +
            (splits["26-27"] * 17 + splits["26-27"]) +
            (splits["26-29"] * 17 + splits["26-29"]) +
            (streets["25-26-27"] * 11 + streets["25-26-27"]) +
            (corners["22-23-25-26"] * 8 + corners["22-23-25-26"]) +
            (corners["23-24-26-27"] * 8 + corners["23-24-26-27"]) +
            (corners["25-26-28-29"] * 8 + corners["25-26-28-29"]) +
            (corners["26-27-29-30"] * 8 + corners["26-27-29-30"]) +
            (doubleStreets["22 to 27"] * 5 + doubleStreets["22 to 27"]) +
            (doubleStreets["25 to 30"] * 5 + doubleStreets["25 to 30"]) +
            columns["2nd column"] * 3 +
            dozens["3rd dozen"] * 3 +
            oddEven["even"] * 2 +
            highLow["high"] * 2 +
            redBlack["black"] * 2;
          break;
        case "27":
          allPayouts =
            straightUps["27"] * 35 +
            straightUps["27"] +
            (splits["24-27"] * 17 + splits["24-27"]) +
            (splits["26-27"] * 17 + splits["26-27"]) +
            (splits["27-30"] * 17 + splits["27-30"]) +
            (streets["25-26-27"] * 11 + streets["25-26-27"]) +
            (corners["23-24-26-27"] * 8 + corners["23-24-26-27"]) +
            (corners["26-27-29-30"] * 8 + corners["26-27-29-30"]) +
            (doubleStreets["22 to 27"] * 5 + doubleStreets["22 to 27"]) +
            (doubleStreets["25 to 30"] * 5 + doubleStreets["25 to 30"]) +
            columns["3rd column"] * 3 +
            dozens["3rd dozen"] * 3 +
            oddEven["odd"] * 2 +
            highLow["high"] * 2 +
            redBlack["red"] * 2;
          break;
        case "28":
          allPayouts =
            straightUps["28"] * 35 +
            straightUps["28"] +
            (splits["24-27"] * 17 + splits["24-27"]) +
            (splits["26-27"] * 17 + splits["26-27"]) +
            (splits["27-30"] * 17 + splits["27-30"]) +
            (streets["28-29-30"] * 11 + streets["28-29-30"]) +
            (corners["25-26-28-29"] * 8 + corners["25-26-28-29"]) +
            (corners["28-29-31-32"] * 8 + corners["28-29-31-32"]) +
            (doubleStreets["25 to 30"] * 5 + doubleStreets["25 to 30"]) +
            (doubleStreets["28 to 33"] * 5 + doubleStreets["28 to 33"]) +
            columns["1st column"] * 3 +
            dozens["3rd dozen"] * 3 +
            oddEven["even"] * 2 +
            highLow["high"] * 2 +
            redBlack["black"] * 2;
          break;
        case "29":
          allPayouts =
            straightUps["29"] * 35 +
            straightUps["29"] +
            (splits["26-29"] * 17 + splits["26-29"]) +
            (splits["28-29"] * 17 + splits["28-29"]) +
            (splits["29-30"] * 17 + splits["29-30"]) +
            (splits["29-32"] * 17 + splits["29-32"]) +
            (streets["28-29-30"] * 11 + streets["28-29-30"]) +
            (corners["25-26-28-29"] * 8 + corners["25-26-28-29"]) +
            (corners["26-27-29-30"] * 8 + corners["26-27-29-30"]) +
            (corners["28-29-31-32"] * 8 + corners["28-29-31-32"]) +
            (corners["29-30-32-33"] * 8 + corners["29-30-32-33"]) +
            (doubleStreets["25 to 30"] * 5 + doubleStreets["25 to 30"]) +
            (doubleStreets["28 to 33"] * 5 + doubleStreets["28 to 33"]) +
            columns["2nd column"] * 3 +
            dozens["3rd dozen"] * 3 +
            oddEven["odd"] * 2 +
            highLow["high"] * 2 +
            redBlack["black"] * 2;
          break;
        case "30":
          allPayouts =
            straightUps["30"] * 35 +
            straightUps["30"] +
            (splits["27-30"] * 17 + splits["27-30"]) +
            (splits["29-30"] * 17 + splits["29-30"]) +
            (splits["30-33"] * 17 + splits["30-33"]) +
            (streets["28-29-30"] * 11 + streets["28-29-30"]) +
            (corners["26-27-29-30"] * 8 + corners["26-27-29-30"]) +
            (corners["29-30-32-33"] * 8 + corners["29-30-32-33"]) +
            (doubleStreets["25 to 30"] * 5 + doubleStreets["25 to 30"]) +
            (doubleStreets["28 to 33"] * 5 + doubleStreets["28 to 33"]) +
            columns["3rd column"] * 3 +
            dozens["3rd dozen"] * 3 +
            oddEven["even"] * 2 +
            highLow["high"] * 2 +
            redBlack["red"] * 2;
          break;
        case "31":
          allPayouts =
            straightUps["31"] * 35 +
            straightUps["31"] +
            (splits["28-31"] * 17 + splits["28-31"]) +
            (splits["31-32"] * 17 + splits["31-32"]) +
            (splits["31-34"] * 17 + splits["31-34"]) +
            (streets["31-32-33"] * 11 + streets["31-32-33"]) +
            (corners["28-29-31-32"] * 8 + corners["28-29-31-32"]) +
            (corners["31-32-34-35"] * 8 + corners["31-32-34-35"]) +
            (doubleStreets["28 to 33"] * 5 + doubleStreets["28 to 33"]) +
            (doubleStreets["31 to 36"] * 5 + doubleStreets["31 to 36"]) +
            columns["1st column"] * 3 +
            dozens["3rd dozen"] * 3 +
            oddEven["odd"] * 2 +
            highLow["high"] * 2 +
            redBlack["black"] * 2;
          break;
        case "32":
          allPayouts =
            straightUps["32"] * 35 +
            straightUps["32"] +
            (splits["29-32"] * 17 + splits["29-32"]) +
            (splits["31-32"] * 17 + splits["31-32"]) +
            (splits["32-33"] * 17 + splits["32-33"]) +
            (splits["31-34"] * 17 + splits["31-34"]) +
            (streets["31-32-33"] * 11 + streets["31-32-33"]) +
            (corners["28-29-31-32"] * 8 + corners["28-29-31-32"]) +
            (corners["29-30-32-33"] * 8 + corners["29-30-32-33"]) +
            (corners["31-32-34-35"] * 8 + corners["31-32-34-35"]) +
            (corners["32-33-35-36"] * 8 + corners["32-33-35-36"]) +
            (doubleStreets["28 to 33"] * 5 + doubleStreets["28 to 33"]) +
            (doubleStreets["31 to 36"] * 5 + doubleStreets["31 to 36"]) +
            columns["2nd column"] * 3 +
            dozens["3rd dozen"] * 3 +
            oddEven["even"] * 2 +
            highLow["high"] * 2 +
            redBlack["red"] * 2;
          break;
        case "33":
          allPayouts =
            straightUps["33"] * 35 +
            straightUps["33"] +
            (splits["30-33"] * 17 + splits["30-33"]) +
            (splits["32-33"] * 17 + splits["32-33"]) +
            (splits["33-36"] * 17 + splits["33-36"]) +
            (streets["31-32-33"] * 11 + streets["31-32-33"]) +
            (corners["29-30-32-33"] * 8 + corners["29-30-32-33"]) +
            (corners["32-33-35-36"] * 8 + corners["32-33-35-36"]) +
            (doubleStreets["28 to 33"] * 5 + doubleStreets["28 to 33"]) +
            (doubleStreets["31 to 36"] * 5 + doubleStreets["31 to 36"]) +
            columns["3rd column"] * 3 +
            dozens["3rd dozen"] * 3 +
            oddEven["odd"] * 2 +
            highLow["high"] * 2 +
            redBlack["black"] * 2;
          break;
        case "34":
          allPayouts =
            straightUps["34"] * 35 +
            straightUps["34"] +
            (splits["31-34"] * 17 + splits["31-34"]) +
            (splits["34-35"] * 17 + splits["34-35"]) +
            (streets["34-35-36"] * 11 + streets["34-35-36"]) +
            (corners["31-32-34-35"] * 8 + corners["31-32-34-35"]) +
            (doubleStreets["31 to 36"] * 5 + doubleStreets["31 to 36"]) +
            columns["1st column"] * 3 +
            dozens["3rd dozen"] * 3 +
            oddEven["even"] * 2 +
            highLow["high"] * 2 +
            redBlack["red"] * 2;
          break;
        case "35":
          allPayouts =
            straightUps["35"] * 35 +
            straightUps["35"] +
            (splits["32-35"] * 17 + splits["32-35"]) +
            (splits["34-35"] * 17 + splits["34-35"]) +
            (splits["35-36"] * 17 + splits["35-36"]) +
            (streets["34-35-36"] * 11 + streets["34-35-36"]) +
            (corners["31-32-34-35"] * 8 + corners["31-32-34-35"]) +
            (corners["32-33-35-36"] * 8 + corners["32-33-35-36"]) +
            (doubleStreets["31 to 36"] * 5 + doubleStreets["31 to 36"]) +
            columns["2nd column"] * 3 +
            dozens["3rd dozen"] * 3 +
            oddEven["odd"] * 2 +
            highLow["high"] * 2 +
            redBlack["black"] * 2;
          break;
        case "36":
          allPayouts =
            straightUps["36"] * 35 +
            straightUps["36"] +
            (splits["33-36"] * 17 + splits["33-36"]) +
            (splits["35-36"] * 17 + splits["35-36"]) +
            (streets["34-35-36"] * 11 + streets["34-35-36"]) +
            (corners["32-33-35-36"] * 8 + corners["32-33-35-36"]) +
            (doubleStreets["31 to 36"] * 5 + doubleStreets["31 to 36"]) +
            columns["3rd column"] * 3 +
            dozens["3rd dozen"] * 3 +
            oddEven["even"] * 2 +
            highLow["high"] * 2 +
            redBlack["red"] * 2;
          break;
        case "00":
          allPayouts =
            straightUps["00"] * 35 +
            straightUps["00"] +
            (splits["0-00"] * 17 + splits["0-00"]) +
            (splits["00-3"] * 17 + splits["00-3"]) +
            (streets["00-2-3"] * 11 + streets["00-2-3"]) +
            (streets["0-00-2"] * 11 + streets["0-00-2"]) +
            (basket * 6 + basket);
          break;
        default:
          console.log(
            "Something went wrong in App.js > // Payout Section > UseEffect()"
          );
          break;
      }
      setTotalAmountWon(totalAmountWon + allPayouts);
      setPreviousTotalBet(pendingTotalBet)
      setAllPreviousBets(recentBets);
    }
  }, [previousTwenty]);

  return (
    <div className="app">

      <BettingOptions
        chipCount={chipCount}
        collectWinnings={collectWinnings}
        currentBetValue={currentBetValue}
        isSpinComplete={isSpinComplete}
        isWheelSpinning={isWheelSpinning}
        pendingTotalBet={pendingTotalBet}
        previousTotalBet={previousTotalBet}
        recentBets={recentBets}
        resetLayout={resetLayout}
        sameBet={sameBet}
        setCurrentBetValue={setCurrentBetValue}
        spinTheWheel={spinTheWheel}
        totalAmountWon={totalAmountWon}
        undoRecentBet={undoRecentBet}
        whichMessage={whichMessage}
        winningNumber={winningNumber}
      />
      <div className="wheel-history">

        <div className="previous-numbers-div">{wheelHistoryLine}</div>
      </div>
      <div className="wood-railing">
        <Layout
          basket={basket}
          chipCount={chipCount}
          columns={columns}
          corners={corners}
          currentBetValue={currentBetValue}
          doubleStreets={doubleStreets}
          dozens={dozens}
          highLow={highLow}
          isSpinComplete={isSpinComplete}
          oddEven={oddEven}
          pendingTotalBet={pendingTotalBet}
          recentBets={recentBets}
          redBlack={redBlack}
          setBasket={setBasket}
          setChipCount={setChipCount}
          setColumns={setColumns}
          setCorners={setCorners}
          setDoubleStreets={setDoubleStreets}
          setDozens={setDozens}
          setHighLow={setHighLow}
          setOddEven={setOddEven}
          setPendingTotalBet={setPendingTotalBet}
          setRecentBets={setRecentBets}
          setRedBlack={setRedBlack}
          setSplits={setSplits}
          setStraightUps={setStraightUps}
          setStreets={setStreets}
          splits={splits}
          straightUps={straightUps}
          streets={streets}
          winningNumber={winningNumber}
        />
      </div>

      <div className="footer-container">
        <img alt="Twitter Logo" className="twitter-logo" src="twitter-logo.svg" />
        <a
          className="footer-text"
          href="https://twitter.com/SOLuckyLotto"
          target="_blank"
          rel="noreferrer"
        >built by @SOLuckyCasino</a>
      </div>
    </div>

  );
}

export default App;
