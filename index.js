// Final Code

const fs = require("fs");
const { parse } = require("csv-parse");
const { resolve } = require("path");
const { on } = require("events");

matchDetails = [];
ballToBallDetails = [];

const getMatchesData = () => {
  return new Promise((resolve, reject) => {
    fs.createReadStream("./DataSet/IPL Matches 2008-2020.csv")
      .pipe(parse({ delimiter: ",", from_line: 2 }))
      .on("data", function (row) {
        let currObj = {};
        currObj.id = parseInt(row[0]);
        currObj.year = parseInt(row[2].substring(0, 4));
        currObj.team1 = row[6];
        currObj.team2 = row[7];
        currObj.winner = row[10];
        matchDetails.push(currObj);
      })
      .on("end", function () {
        resolve(matchDetails);
      })
      .on("error", function (error) {
        reject(error.message);
      });
  });
};

const getBallToBallData = () => {
  return new Promise((resolve, reject) => {
    fs.createReadStream("./DataSet/IPL Ball-by-Ball 2008-2020.csv")
      .pipe(parse({ delimiter: ",", from_line: 2 }))
      .on("data", function (row) {
        let currObj = {};
        currObj.id = parseInt(row[0]);
        currObj.bowler = row[6];
        currObj.batsman_runs = parseInt(row[7]);
        currObj.extras = parseInt(row[8]);
        currObj.battingTeam = row[16];
        currObj.bowlingTeam = row[17];
        ballToBallDetails.push(currObj);
      })
      .on("end", function () {
        resolve(ballToBallDetails);
      })
      .on("error", function (error) {
        reject(error.message);
      });
  });
};

const query1 = (data1) => {
  const ans = {};
  return new Promise((resolve, reject) => {
    for (let i = 0; i < data1.length; i++) {
      if (ans.hasOwnProperty(data1[i].year)) {
        ans[data1[i].year]++;
      } else {
        ans[data1[i].year] = 1;
      }
    }
    if (ans.length !== 0) {
      resolve(ans);
    } else {
      reject("No elements present");
    }
  });
};

const query2 = (data1) => {
  const ans = {};
  return new Promise((resolve, reject) => {
    for (let i = 0; i < data1.length; i++) {
      if (ans.hasOwnProperty(data1[i].year)) {
        if (ans[data1[i].year].hasOwnProperty(data1[i].winner)) {
          ans[data1[i].year][data1[i].winner]++;
        } else {
          ans[data1[i].year][data1[i].winner] = 1;
        }
      } else {
        ans[data1[i].year] = {};
        ans[data1[i].year][data1[i].winner] = 1;
      }
    }
    if (ans.length !== 0) {
      resolve(ans);
    } else {
      reject("No elements present");
    }
  });
};

const query3 = (data1, data2) => {
  const ans = {};
  const tempData1 = [...data1];
  const tempData2 = [...data2];

  return new Promise((resolve, reject) => {
    const tempData1_2016 = tempData1
      .filter((data) => data.year === 2016)
      .map((data) => data.id);

    const ballToBallIds_2016 = tempData2.filter(({ id }) =>
      tempData1_2016.includes(id)
    );

    for (let i = 0; i < ballToBallIds_2016.length; i++) {
      if (ans.hasOwnProperty(ballToBallIds_2016[i].bowlingTeam)) {
        ans[ballToBallIds_2016[i].bowlingTeam] += ballToBallIds_2016[i].extras;
      } else {
        ans[ballToBallIds_2016[i].bowlingTeam] = ballToBallIds_2016[i].extras;
      }
    }

    if (ans.length !== 0) {
      resolve(ans);
    } else {
      reject("No elements present");
    }
  });
};

const query4 = (data1, data2) => {
  const ans = {};
  const tempData1 = [...data1];
  const tempData2 = [...data2];

  return new Promise((resolve, reject) => {
    const tempData1_2015 = tempData1
      .filter((data) => data.year === 2015)
      .map((data) => data.id);

    const ballToBallIds_2015 = tempData2.filter(({ id }) =>
      tempData1_2015.includes(id)
    );

    for (let i = 0; i < ballToBallIds_2015.length; i++) {
      if (ans.hasOwnProperty(ballToBallIds_2015[i].bowler)) {
        ans[ballToBallIds_2015[i].bowler].conceded +=
          ballToBallIds_2015[i].batsman_runs + ballToBallIds_2015[i].extras;
        ans[ballToBallIds_2015[i].bowler].balls++;
      } else {
        ans[ballToBallIds_2015[i].bowler] = {};
        ans[ballToBallIds_2015[i].bowler].conceded =
          ballToBallIds_2015[i].batsman_runs + ballToBallIds_2015[i].extras;
        ans[ballToBallIds_2015[i].bowler].balls = 1;
        ans[ballToBallIds_2015[i].bowler].economy = 0;
      }
    }

    for (let baller in ans) {
      ans[baller].economy = (ans[baller].conceded * 6) / ans[baller].balls;
    }

    let sortedByEconomies = [];
    for (let prop in ans) {
      sortedByEconomies.push([prop, ans[prop].economy]);
    }

    const top10 = sortedByEconomies
      .sort(function (a, b) {
        return a[1] - b[1];
      })
      .slice(0, 10);

    if (ans.length !== 0) {
      resolve(top10);
    } else {
      reject("No elements present");
    }
  });
};

const solve = async () => {
  const data1 = await getMatchesData();

  const ans1 = await query1(data1);
  console.log(ans1);

  const ans2 = await query2(data1);
  console.log(ans2);

  const data2 = await getBallToBallData();

  const ans3 = await query3(data1, data2);
  console.log(ans3);

  const ans4 = await query4(data1, data2);
  console.log(ans4);
};
solve();
