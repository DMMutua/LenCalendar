// (J) DELETE EVENT
del : () => { if (confirm("Delete Event?")) {
    cal.ajax("delete", { id : parseInt(cal.hfID.value) }, res => {
      if (res=="OK") {
        cal.transit(() => cal.hFormWrap.close());
        cal.load();
      } else { alert(res); }
    });
  }}