// (D) SHIFT CURRENT PERIOD BY 1 MONTH
pshift : forward => {
    cal.sMth = parseInt(cal.hMth.value);
    cal.sYear = parseInt(cal.hYear.value);
    if (forward) { cal.sMth++; } else { cal.sMth--; }
    if (cal.sMth > 12) { cal.sMth = 1; cal.sYear++; }
    if (cal.sMth < 1) { cal.sMth = 12; cal.sYear--; }
    cal.hMth.value = cal.sMth;
    cal.hYear.value = cal.sYear;
    cal.load();
  },

  // (E) JUMP TO TODAY
today : () => {
  let now = new Date(), ny = now.getFullYear(), nm = now.getMonth()+1;
  if (ny!=cal.sYear || (ny==cal.sYear && nm!=cal.sMth)) {
    cal.hMth.value = nm;
    cal.hYear.value = ny;
    cal.load();
  }
},