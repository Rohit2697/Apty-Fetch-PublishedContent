const express = require("express");
const request = require("request");
const path = require("path");
const hbs = require("hbs");
//const getFlowIDname = require("../getFlows");

const app = express();
const port = process.env.PORT || 3000;
const viewPath = path.join(__dirname, "/templates/views");
const partialPath = path.join(__dirname, "/templates/partials");

app.set("views", viewPath); // this is required to set the view path unless it can not find the view path
app.set("view engine", "hbs");
hbs.registerPartials(partialPath);

//set up static directory to serve
const publicFileDirectory = path.join(__dirname, "../public");
app.use(express.static(publicFileDirectory));

// var envNo = 1;
// var aptyRegion = "app";

const parse = (tenantKey, appID, envNo, aptyRegion, contentType) => {
  return new Promise((resolve, reject) => {
    try {
      const url =
        "https://client." +
        aptyRegion +
        ".apty.io/tenant-" +
        tenantKey +
        "/app-" +
        appID +
        "/env-" +
        envNo +
        "/" +
        contentType +
        ".json?timestamp=" +
        Date.now();

      request(url, { json: true }, (e, res) => {
        if (e) return reject(e);
        if (!res.body || typeof res.body === "string")
          return reject({ error: "Unable to fetch" });
        const body = res.body;
        resolve(body);
      });
    } catch (err) {
      reject(err);
    }
  });
};

const parseAppIdsEnvs = (tenantKey, aptyRegion) => {
  return new Promise((resolve, reject) => {
    const appIdEnvsArr = [];
    try {
      const url =
        "https://client." +
        aptyRegion +
        ".apty.io/tenant-" +
        tenantKey +
        "/app-urls.json?timestamp" +
        Date.now();

      request(url, { json: true }, (error, response) => {
        if (error) return reject(error);
        if (!response.body || typeof response.body === "string")
          return reject({ error: "Unable to fetch" });

        const body = response.body;

        for (let i = 0; i < body.length; i++) {
          const envArr = Object.keys(body[i].environments);
          for (let j = 0; j < envArr.length; j++) {
            appIdEnvsArr.push({
              appID: body[i].id,
              envNo: body[i].environments[envArr[j]].order,
              envName: body[i].environments[envArr[j]].name,
              enablePlayer: body[i].environments[envArr[j]].enablePlayer,
            });
          }
        }
        //console.log(response.body[0].environments)
        resolve(appIdEnvsArr);
      });
    } catch (err) {
      reject(err);
    }
  });
};

const parseSteps = (tenantID, appID, aptyRegion, flowId) => {
  return new Promise((resolve, reject) => {
    try {
      const url =
        "https://" +
        aptyRegion +
        ".apty.io/assist/api/flows/v5/tenant/" +
        tenantID +
        "/application/" +
        appID +
        "/flow/" +
        flowId +
        "/steps";
      //console.log(url);
      request(url, { json: true }, (e, res) => {
        if (e) return reject(e);
        if (!res.body || typeof res.body === "string") {
          return reject({ error: "Unable to fetch" });
        }
        resolve(res.body);
      });
    } catch (err) {
      reject(err);
    }
  });
};

app.get("", (req, res) => {
  res.render("index", {
    title: "Fetch Content Details",
    createdBy: "Rohit Dey",
  });
});

app.get("/workflow", async (req, res) => {
  const flowIdNameObjarr = [];
  const tenantKey = req.query.tenantKey;
  const appID = req.query.appID;
  const envNo = req.query.envNo;
  const aptyRegion = req.query.aptyRegion;
  if (tenantKey && appID && envNo && aptyRegion) {
    try {
      const flowObj = await parse(tenantKey, appID, envNo, aptyRegion, "flow");

      for (let i = 0; i < flowObj.length; i++) {
        flowIdNameObjarr.push({
          workflowId: flowObj[i].id,
          workflowName: flowObj[i].name["1"],
        });
      }
      res.send(flowIdNameObjarr);
    } catch (e) {
      res.status(400).send({ error: e });
    }
  } else {
    res.status(500).send({ error: "Internal Error Please try again later!" });
  }
});

app.get("/announcement", async (req, res) => {
  const announcementObjarr = [];
  const tenantKey = req.query.tenantKey;
  const appID = req.query.appID;
  const envNo = req.query.envNo;
  const aptyRegion = req.query.aptyRegion;
  if (tenantKey && appID && envNo && aptyRegion) {
    try {
      const Obj = await parse(
        tenantKey,
        appID,
        envNo,
        aptyRegion,
        "announcement"
      );
      for (let i = 0; i < Obj.length; i++) {
        announcementObjarr.push({
          announcementId: Obj[i].id,
          announcementName: Obj[i].name,
        });
      }
      res.send(announcementObjarr);
    } catch (e) {
      res.status(400).send({ error: e });
    }
  } else {
    res.status(500).send({ error: "Internal Error Please try again later!" });
  }
});

app.get("/validation", async (req, res) => {
  const validationObjarr = [];
  const tenantKey = req.query.tenantKey;
  const appID = req.query.appID;
  const envNo = req.query.envNo;
  const aptyRegion = req.query.aptyRegion;
  if (tenantKey && appID && envNo && aptyRegion) {
    try {
      const Obj = await parse(
        tenantKey,
        appID,
        envNo,
        aptyRegion,
        "validation"
      );
      for (let i = 0; i < Obj.length; i++) {
        validationObjarr.push({
          validationId: Obj[i].id,
          validationName: Obj[i].name,
        });
      }
      res.send(validationObjarr);
    } catch (e) {
      res.status(400).send({ error: e });
    }
  } else {
    res.status(500).send({ error: "Internal Error Please try again later!" });
  }
});

app.get("/tooltip", async (req, res) => {
  const tooltipObjarr = [];
  const tenantKey = req.query.tenantKey;
  const appID = req.query.appID;
  const envNo = req.query.envNo;
  const aptyRegion = req.query.aptyRegion;
  if (tenantKey && appID && envNo && aptyRegion) {
    try {
      const Obj = await parse(tenantKey, appID, envNo, aptyRegion, "tooltip");
      for (let i = 0; i < Obj.length; i++) {
        tooltipObjarr.push({
          tooltipId: Obj[i].id,
          tooltipName: Obj[i].name,
        });
      }
      res.send(tooltipObjarr);
    } catch (e) {
      res.status(400).send({ error: e });
    }
  } else {
    res.status(500).send({ error: "Internal Error Please try again later!" });
  }
});

app.get("/steps", async (req, res) => {
  const stepsObjarr = [];
  const tenantID = req.query.tenantID;
  const appID = req.query.appID;
  const aptyRegion = req.query.aptyRegion;
  const flowId = req.query.flowId;

  try {
    const Obj = await parseSteps(tenantID, appID, aptyRegion, flowId);
    for (let i = 0; i < Obj.length; i++) {
      stepsObjarr.push({
        flowId: Obj[i].flowId,
        stepId: Obj[i].id,
        stepName: Obj[i].title,
      });
    }
    res.send(stepsObjarr);
  } catch (err) {
    res.status(500).send({ error: "Internal Error Please try again later!" });
  }
});
app.get("/workflow-steps", (req, res) => {
  res.render("steps", {
    title: "Fetch Workflow Steps",
    createdBy: "Rohit Dey",
  });
});

app.get("/get-appId-envs", async (req, res) => {
  //const appIdEnvsArr = [];
  const tenantKey = req.query.tenantKey;
  const aptyRegion = req.query.aptyRegion;
  try {
    const Obj = await parseAppIdsEnvs(tenantKey, aptyRegion);

    res.send(Obj);
  } catch (e) {
    // res.status(500).send({ error: "Internal Error Please try again later!" });
    res.send(e);
  }
});

app.get("*", (req, res) => {
  res.status(404).send("404 Page Not Found");
});

app.listen(port, () => {
  console.log("App is running in port: " + port);
});
