console.log("Client side script is running.....");
const tenantKey = document.getElementById("tenantKey");
const appID = document.getElementById("appID");
const envNo = document.getElementById("envNo");
const aptyRegion = document.getElementById("aptyRegion");
//const isAptyEnabled = document.getElementById("isAptyEnabled");
const getWorkflows = document.getElementById("getWorkflows");
const getAnnouncements = document.getElementById("getAnnouncements");
const getValidations = document.getElementById("getValidations");
const getTooltips = document.getElementById("getTooltips");
const table = document.querySelector("table");
const th = document.querySelector("th");
const loading = "<h2>Loading content...</h2>";
const error = "<h2>Unable to fetch Please try again with correct Details</h2>";
const noData =
  "<h2>There is no Published Content in the selected Environment</h2>";
const provideData = "<h2>You have not entered required details</h2>";

const resetOptionsValue = () => {
  aptyRegion.innerHTML = ` 
  <option disabled selected value="">Select Apty Region*</option>
  <option value="app">App</option>
  <option value="au">Au</option>
`;

  appID.innerHTML = `  
<option disabled selected value=""> Select App ID*</option>
</select>`;

  envNo.innerHTML = `
<option disabled selected value="">Select Environment*</option>
`;
};

const fetchAppIds = (tenantKey, aptyRegion) => {
  table.innerHTML = "";
  if (!tenantKey || !aptyRegion) {
    appID.innerHTML = `<option selected disabled value="">Select App ID*</option>`;
    return (table.innerHTML = provideData);
  }

  try {
    const url =
      "/get-appId-envs?tenantKey=" + tenantKey + "&aptyRegion=" + aptyRegion;
    const uniqueAppIds = [];
    fetch(url).then((response) => {
      response.json().then((Objarr) => {
        if (Objarr.error) {
          appID.innerHTML = `<option selected disabled value="">No App IDs Found*</option>`;
          return (table.innerHTML = error);
        } else {
          appID.innerHTML = "";
          appID.innerHTML = `  
          <option disabled selected value=""> Select App ID*</option>
          </select>`;
          // `<option value="">Select Apty Region*</option>`;
          for (let i = 0; i < Objarr.length; i++) {
            if (
              !uniqueAppIds.length ||
              !uniqueAppIds.includes(Objarr[i].appID)
            ) {
              uniqueAppIds.push(Objarr[i].appID);
            }
          }
          for (let i = 0; i < uniqueAppIds.length; i++) {
            const optionElement = `<option value="${uniqueAppIds[i]}"> ${uniqueAppIds[i]}</option>`;
            appID.insertAdjacentHTML("beforeend", optionElement);
          }
        }
      });
    });
  } catch (e) {
    console.log(e);
  }
};

const fetchEnvs = (tenantKey, aptyRegion) => {
  table.innerHTML = "";

  if (!tenantKey || !aptyRegion || !appID.value) {
    envNo.innerHTML = `<option  selected disabled value="">Select Environment*</option>`;
    return (table.innerHTML = provideData);
  }
  try {
    const url =
      "/get-appId-envs?tenantKey=" + tenantKey + "&aptyRegion=" + aptyRegion;
    // const uniqueAppIds = [];
    fetch(url).then((response) => {
      response.json().then((Objarr) => {
        if (Objarr.error) {
          envNo.innerHTML = `<option selected disabled value="">No Environments Found*</option>`;
          return (table.innerHTML = error);
        } else {
          envNo.innerHTML = "";
          envNo.innerHTML = `
          <option disabled selected value="">Select Environment*</option>
          `;
          for (let i = 0; i < Objarr.length; i++) {
            if (Objarr[i].appID == appID.value) {
              const optionElement = `<option  value="${Objarr[i].envNo}"> ${Objarr[i].envName}</option>`;
              envNo.insertAdjacentHTML("beforeend", optionElement);
            }
          }
        }
      });
    });
  } catch (e) {
    console.log(e);
  }
};

const fetchDetails = (contentId, ContentName, contentType) => {
  table.innerHTML = "";
  table.innerHTML = loading;

  if (!tenantKey.value && !appID.value && !envNo.value && !aptyRegion.value) {
    return (table.innerHTML = provideData);
  }
  fetch(
    "/" +
      contentType +
      "?tenantKey=" +
      tenantKey.value +
      "&appID=" +
      appID.value +
      "&envNo=" +
      envNo.value +
      "&aptyRegion=" +
      aptyRegion.value
  ).then((response) => {
    response.json().then((Objarr) => {
      const objKeys = Object.keys(Objarr);

      //if we receive an error
      if (objKeys[0] === "error") {
        return (table.innerHTML = error);
      }
      //If there is no Data
      else if (Objarr && !Objarr.length) {
        return (table.innerHTML = noData);
      }
      table.innerHTML = "";
      const tableHeaderElement = `
      <th class="${contentId}">${contentId.toUpperCase()}</th>
      <th class="${ContentName}">${ContentName.toUpperCase()}</th>`;
      table.insertAdjacentHTML("afterbegin", tableHeaderElement);
      for (let i = 0; i < Objarr.length; i++) {
        const htmlElement = `
        <tbody><tr>
          <td class="${contentId}">${Objarr[i][contentId]}</td>
          <td class="${ContentName}">${Objarr[i][ContentName]}</td>
      </tbody></tr>`;
        table.insertAdjacentHTML("beforeend", htmlElement);
      }
    });
  });
};

getWorkflows?.addEventListener("click", () => {
  fetchDetails("workflowId", "workflowName", "workflow");
});

getAnnouncements?.addEventListener("click", () => {
  fetchDetails("announcementId", "announcementName", "announcement");
});

getValidations?.addEventListener("click", () => {
  fetchDetails("validationId", "validationName", "validation");
});

getTooltips?.addEventListener("click", () => {
  fetchDetails("tooltipId", "tooltipName", "tooltip");
});

appID.addEventListener("click", () => {
  if (document.querySelector("#appID").childElementCount < 2) {
    fetchAppIds(tenantKey.value, aptyRegion.value);
  }
});

appID.addEventListener("change", () => {
 
  if (this.tenantKey.value && this.aptyRegion.value && this.appID.value) {
    //fetchAppIds(this.tenantKey.value, this.aptyRegion.value);
    fetchEnvs(this.tenantKey.value, this.aptyRegion.value);
  } // fetchEnvs(this.tenantKey.value, this.aptyRegion.value);
  else {
    //appID.innerHTML = `<option value="">Select App ID*</option>`;
    resetOptionsValue();
  }
});

tenantKey.addEventListener("change", () => {
  if (this.tenantKey.value && this.aptyRegion.value) {
    fetchAppIds(this.tenantKey.value, this.aptyRegion.value);
    envNo.innerHTML = `<option selected disabled value="">Select Environment*</option>`;
    //fetchEnvs(this.tenantKey.value, this.aptyRegion.value);
  } // fetchEnvs(this.tenantKey.value, this.aptyRegion.value);
  else if (this.tenantKey.value && this.aptyRegion.value && appID.value) {
    fetchEnvs(this.tenantKey.value, this.aptyRegion.value);
  } else {
    resetOptionsValue();
  }
});
aptyRegion.addEventListener("change", () => {
  if (this.tenantKey.value && this.aptyRegion.value) {
    fetchAppIds(this.tenantKey.value, this.aptyRegion.value);
    envNo.innerHTML = `<option selected disabled value="">Select Environment*</option>`;
    //fetchEnvs(this.tenantKey.value, this.aptyRegion.value);
  } else if (this.tenantKey.value && this.aptyRegion.value && appID.value) {
    fetchEnvs(this.tenantKey.value, this.aptyRegion.value);
  } else {
    appID.innerHTML = `<option selected disabled value="">Select App ID*</option>`;
    envNo.innerHTML = `<option selected disabled value="">Select Environment*</option>`;
  }
  // fetchEnvs(this.tenantKey.value, this.aptyRegion.value);
});
envNo.addEventListener("click", () => {
  if (envNo.childElementCount < 2) {
    fetchEnvs(this.tenantKey.value, this.aptyRegion.value);
  }
});
