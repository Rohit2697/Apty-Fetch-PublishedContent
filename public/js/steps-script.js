console.log("Client side script is running.....");

const flowid = document.getElementById("flowid");
const appID = document.getElementById("appID");
const tenantID = document.getElementById("tenantID");
const aptyRegion = document.getElementById("aptyRegion");
const getWorkflowSteps = document.getElementById("getWorkflowSteps");

const table = document.querySelector("table");
const th = document.querySelector("th");
const loading = "<h2>Loading content...</h2>";
const error =
  "<h2>Unable to fetch Content Please try again with correct Details</h2>";
const noData = "<h2>Flow Not Found!</h2>";
const provideData = "<h2>You have not entered required details</h2>";

getWorkflowSteps?.addEventListener("click", () => {
  table.innerHTML = "";
  table.innerHTML = loading;
  if (!flowid.value && !appID.value && !tenantID.value && !aptyRegion.value) {
    return (table.innerHTML = provideData);
  }

  const url =
    "/steps?tenantID=" +
    tenantID.value +
    "&appID=" +
    appID.value +
    "&aptyRegion=" +
    aptyRegion.value +
    "&flowId=" +
    flowid.value;
  fetch(url).then((response) => {
    response.json().then((Objarr) => {
      const objKeys = Object.keys(Objarr);

      //if we receive an error
      if (objKeys[0] === "error") {
        return (table.innerHTML = error);
      } else if (Objarr && !Objarr.length) {
        return (table.innerHTML = noData);
      }

      table.innerHTML = "";
      const tableHeaderElement = `
      <th class="flowId">FlowID</th>
      <th class="stepId">StepId</th>
      <th class="stepName">StepName</th>
      `;
      table.insertAdjacentHTML("afterbegin", tableHeaderElement);
      for (let i = 0; i < Objarr.length; i++) {
        const htmlElement = `
        <tbody><tr>
          <td class="flowId">${Objarr[i].flowId}</td>
          <td class="stepId">${Objarr[i].stepId}</td>
          <td class="stepName">${Objarr[i].stepName}</td>
      </tbody></tr>`;
        table.insertAdjacentHTML("beforeend", htmlElement);
      }
    });
  });
});
