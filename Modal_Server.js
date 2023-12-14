
/*****************************************************/
/*******         MODAL ENDPOINTS              ********/
/*****************************************************/
//// add a New Note for a teacher
function createNewNote(payload) {
  let date = payload.date.slice(0,payload.date.indexOf("T")).slice(1);
  const arrDate = date.split("-");
  const newDate = arrDate[2] + "/" + arrDate[1] + "/" + arrDate[0];

  const array = [
    newDate,
    payload.name,
    payload.email,
    payload.centre,
    payload.userEmail,
    payload.tag,
    payload.note
  ]

  $sheets.notes.appendRow(array);

  //// update Column date format to text
  $formatting.setColumnFormatToText($sheets.notes, 1);
  
  return true;
}



//// remove a teacher from the Cover list
function removeTeacher(payload) {

    Logger.log(payload);

    const allData = readAllDatabaseVals();
    const index = allData.map(row => row[1]).indexOf(payload.teacher.email);

    $sheets.dB.deleteRow(index+2);

    ////uncheck all checkboxes so it doesn't check the next teacher
    const range = $sheets.ui.getRange('B6:B');
    range.uncheck();

    ///// log the event
    const msg = `${payload.teacher.name} (${payload.teacher.email}) manually removed from database by user ${payload.userEmail}`
    log(msg);

    return true;
}

