

/*****************************************************/
/*******           GLOBAL  FUNCTIONS          ********/
/*****************************************************/
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/*****************************************************/
/*******           GLOBAL VARIABLES           ********/
/*****************************************************/

const $ss = SpreadsheetApp.getActiveSpreadsheet();

const $sheets = {
  dB: $ss.getSheetByName('Database'),
  settings: $ss.getSheetByName('Settings'),
  ui: $ss.getSheetByName('Cover Teachers'),
  notes: $ss.getSheetByName('Lookup Table (Notes)'),
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

  showModal: (payload) => {
    let template = HtmlService.createTemplateFromFile('Modal_Index');
    template.data = payload;
    let html = template.evaluate().setWidth(700).setHeight(500);
    SpreadsheetApp.getUi().showModalDialog(html, "Teacher Profile");
  }

}

/*****************************************************/
/*******             METHODS                 ********/
/*****************************************************/
const $formatting = {

  setColumnFormatToText: (sheet, columnNumber) => {
      // Set the column range to format
      var range = sheet.getRange(1, columnNumber, sheet.getLastRow(), 1);
      // Set the format to "Text"
      range.setNumberFormat("@"); // Use "@" for text format
  }
}

function test_5() {
  $formatting.setColumnFormatToText($sheets.notes, 1);
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

  /// get teacher information
  const rowVals = $sheets.ui.getRange($g.uiFirstCol + index + ":" + $g.uiLastCol + index).getValues()[0].filter(v=>v);
  const teacherEmail = rowVals[2];

  /// get teacher notes
  const notesVals = $sheets.notes.getRange(2,1,$sheets.notes.getLastRow()-1,$sheets.notes.getLastColumn()).getValues();
  const teacherNotes = notesVals.filter(row => row[2] === teacherEmail);
  const numBlankNotesNeeded = 10 - teacherNotes.length;
  for (let i = 0; i<numBlankNotesNeeded; i++) {
    teacherNotes.push(["", "", "", "", "", "", ""])
  }

  Logger.log(teacherNotes);

  /// put teacher notes in object
  let objNotes = {};
  teacherNotes.forEach((note, index) => {
    const noteIndex = index;
    objNotes[noteIndex] = {};
    objNotes[noteIndex].date = note[0];
    objNotes[noteIndex].userEmail = note[4];
    objNotes[noteIndex].tag = note[5];
    objNotes[noteIndex].note = note[6];
  })

  //Logger.log(objNotes);

  let payload = {
    userEmail: Session.getActiveUser().getEmail(),
    teacher: {
      name: rowVals[1],   //name
      email: teacherEmail,  //email
      centre: rowVals[4]  //centre
    },
    notes: objNotes
  }

  Logger.log(payload);

  $ui.showModal(payload);

}




/*****************************************************/
/*******          LOGGING                    ********/
/*****************************************************/

function log(msg) {
  const timestamp = Utilities.formatDate(new Date(), "GMT+7", "dd-MM-yyyy HH:mm:ss");
  $sheets.log.appendRow([timestamp, msg]);
}

