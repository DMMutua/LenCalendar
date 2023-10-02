// (F) LOAD EVENTS
load : () => {
  // (F1) SET SELECTED PERIOD
  cal.sMth = parseInt(cal.hMth.value);
  cal.sYear = parseInt(cal.hYear.value);
  cal.sDIM = new Date(cal.sYear, cal.sMth, 0).getDate();
  cal.sFD = new Date(cal.sYear, cal.sMth-1, 1).getDay();
  cal.sLD = new Date(cal.sYear, cal.sMth-1, cal.sDIM).getDay();
  let m = cal.sMth;
  if (m < 10) { m = "0" + m; } cal.sF = parseInt(String(cal.sYear) + String(m) + "010000"); cal.sL = parseInt(String(cal.sYear) + String(m) + String(cal.sDIM) + "2359"); // (D2) AJAX GET EVENTS cal.ajax("get", { month : cal.sMth, year : cal.sYear }, evt => {
    cal.events = JSON.parse(evt);
    cal.draw();
  });
},
 
// (G) DRAW CALENDAR
draw : () => {
  // (G1) CALCULATE DAY MONTH YEAR
  // note - jan is 0 & dec is 11 in js
  // note - sun is 0 & sat is 6 in js
  let now = new Date(), // current date
      nowMth = now.getMonth()+1, // current month
      nowYear = parseInt(now.getFullYear()), // current year
      nowDay = cal.sMth==nowMth && cal.sYear==nowYear ? now.getDate() : null ;

  // (G2) DRAW CALENDAR ROWS & CELLS
  // (G2-1) INIT + HELPER FUNCTIONS
  let rowA, rowB, rowC, rowMap = {}, rowNum = 1, cell, cellNum = 1,
 
  // (G2-2) HELPER - DRAW A NEW ROW
  rower = () => {
    rowA = document.createElement("div");
    rowB = document.createElement("div");
    rowC = document.createElement("div");
    rowA.className = "calRow";
    rowA.id = "calRow" + rowNum;
    rowB.className = "calRowHead";
    rowC.className = "calRowBack";
    cal.hCB.appendChild(rowA);
    rowA.appendChild(rowB);
    rowA.appendChild(rowC);
  },
 
  // (G2-3) HELPER - DRAW A NEW CELL
  celler = day => {
    cell = document.createElement("div");
    cell.className = "calCell";
    if (day) {
      cell.innerHTML = day;
      cell.classList.add("calCellDay");
      cell.onclick = () => {
        cal.show();
        let d = +day, m = +cal.hMth.value,
            s = `${cal.hYear.value}-${String(m<10 ? "0"+m : m)}-${String(d<10 ? "0"+d : d)}T00:00:00`;
        cal.hfStart.value = s;
        cal.hfEnd.value = s;
      };
    }
    rowB.appendChild(cell);
    cell = document.createElement("div");
    cell.className = "calCell";
    if (day===undefined) { cell.classList.add("calBlank"); }
    if (day!==undefined && day==nowDay) { cell.classList.add("calToday"); }
    rowC.appendChild(cell);
  };
 
  // (G2-4) RESET CALENDAR
  cal.hCB.innerHTML = ""; rower();

  // (G2-5) BLANK CELLS BEFORE START OF MONTH
  if (cal.mon && cal.sFD != 1) {
    let blanks = cal.sFD==0 ? 7 : cal.sFD ;
    for (let i=1; i<blanks; i++) { celler(); cellNum++; }
  }
  if (!cal.mon && cal.sFD != 0) {
    for (let i=0; i<cal.sFD; i++) { celler(); cellNum++; }
  }

  // (G2-6) DAYS OF THE MONTH
  for (let i=1; i<=cal.sDIM; i++) {
    rowMap[i] = { r : rowNum, c : cellNum };
    celler(i);
    if (cellNum%7==0 && i!=cal.sDIM) { rowNum++; rower(); }
    cellNum++;
  }
  
  // (G2-7) BLANK CELLS AFTER END OF MONTH
  if (cal.mon && cal.sLD != 0) {
    let blanks = cal.sLD==6 ? 1 : 7-cal.sLD;
    for (let i=0; i<blanks; i++) { celler(); cellNum++; }
  }
  if (!cal.mon && cal.sLD != 6) {
    let blanks = cal.sLD==0 ? 6 : 6-cal.sLD;
    for (let i=0; i<blanks; i++) { celler(); cellNum++; }
  }
 
  // (G3) DRAW EVENTS
  if (Object.keys(cal.events).length > 0) { for (let [id,evt] of Object.entries(cal.events)) {
    // (G3-1) EVENT START & END DAY
    let sd = new Date(evt.s), ed = new Date(evt.e);
    if (sd.getFullYear() < cal.sYear) { sd = 1; }
    else { sd = sd.getMonth()+1 < cal.sMth ? 1 : sd.getDate(); }
    if (ed.getFullYear() > cal.sYear) { ed = cal.sDIM; }
    else { ed = ed.getMonth()+1 > cal.sMth ? cal.sDIM : ed.getDate(); }

    // (G3-2) "MAP" ONTO HTML CALENDAR
    cell = {}; rowNum = 0;
    for (let i=sd; i<=ed; i++) {
      if (rowNum!=rowMap[i]["r"]) {
        cell[rowMap[i]["r"]] = { s:rowMap[i]["c"], e:0 };
        rowNum = rowMap[i]["r"];
      }
      if (cell[rowNum]) { cell[rowNum]["e"] = rowMap[i]["c"]; }
    }
 
    // (G3-3) DRAW HTML EVENT ROW
    for (let [r,c] of Object.entries(cell)) {
      let o = c.s - 1 - ((r-1) * 7), // event cell offset
          w = c.e - c.s + 1; // event cell width
      rowA = document.getElementById("calRow"+r);
      rowB = document.createElement("div");
      rowB.className = "calRowEvt";
      rowB.innerHTML = cal.events[id]["t"];
      rowB.style.color = cal.events[id]["c"];
      rowB.style.backgroundColor = cal.events[id]["b"];
      rowB.classList.add("w"+w);
      if (o!=0) { rowB.classList.add("o"+o); }
      rowB.onclick = () => cal.show(id);
      rowA.appendChild(rowB);
    }
  }}
},