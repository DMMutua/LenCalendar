var cal = {
    // PROPERTIES
    // FLAGS & DATA
    mon : false, // monday first
    events : null, // events data for current month/year
    sMth : 0, // selected month
    sYear : 0, // selected year
    sDIM : 0, // number of days in selected month
    sF : 0, // first date of the selected month (yyyymmddhhmm)
    sL : 0, // last date of the selected month (yyyymmddhhmm)
    sFD : 0, // first day of the selected month (mon-sun)
    sLD : 0, // last day of the selected month (mon-sun)
    ready : 0, // to track loading
   
    // HTML ELEMENTS
    hMth : null, hYear : null, // month & year
    hCD : null, hCB : null, // calendar days & body
    hFormWrap : null, hForm : null, // event form
    hfID : null, hfStart : null, // event form fields
    hfEnd : null, hfTxt : null,
    hfColor : null, hfBG : null,
    hfDel : null,
   
    // SUPPORT FUNCTION - AJAX FETCH
    ajax : (req, data, onload) => {
      // (B1) FORM DATA
      let form = new FormData();
      for (let [k,v] of Object.entries(data)) { form.append(k,v); }
   
      // (B2) FETCH
      fetch(req + "/", { method:"POST", body:form })
      .then(res => res.text())
      .then(txt => onload(txt))
      .catch(err => console.error(err));
    },
    // ...
  };