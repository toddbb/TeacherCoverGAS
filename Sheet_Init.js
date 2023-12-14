/*****************************************************/
/*******           GLOBAL VARIABLES           ********/
/*****************************************************/

const $ss = SpreadsheetApp.getActiveSpreadsheet();

const $sheets = {
  dB: $ss.getSheetByName('Database'),
  settings: $ss.getSheetByName('Settings'),
  ui: $ss.getSheetByName('Cover Teachers'),
  log: $ss.getSheetByName('Log')
}

const $g = {
  uiFirstCol: "B",
  uiLastCol: "AP"
}

const $ui = {
  alert: (msg) => {
    SpreadsheetApp.getUi().alert(msg);
  },

  showSidebar: (teacher) => {
    let template = HtmlService.createTemplateFromFile('Sheet_Sidebar');
    template.teacher = teacher;
    let html = template.evaluate().setWidth(700).setHeight(500);
    SpreadsheetApp.getUi().showModalDialog(html, "Teacher Profile");
  }
}

const $log = (msg) => {
  const timestamp = Utilities.formatDate(new Date(), "GMT+7", "dd-MM-yyyy HH:mm:ss");
  $sheets.log.appendRow([timestamp, msg]);
}




/*****************************************************/
/*******           EVENTS                     ********/
/*****************************************************/

const seeTeacherDetails = () => {
  //// get the row that is checked
  const checkboxes = $sheets.ui.getRange('B6:B').getValues();
  const index = checkboxes.findIndex(row => row[0]) + 6;

  if (index < 6) {
    $ui.alert("No teacher selected. Please select a teacher using the checkboxes.")
    return;
  }

  const rowVals = $sheets.ui.getRange($g.uiFirstCol + index + ":" + $g.uiLastCol + index).getValues()[0].filter(v=>v);

  let teacher = {
    name: rowVals[1],
    email: rowVals[2],
    centre: rowVals[4]
  }

  $ui.showSidebar(teacher);

}



