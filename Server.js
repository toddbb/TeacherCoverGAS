/******************************************************************/
/**                      INITIALIZATIONS                         **/
/******************************************************************/
// This function is executed when the web app is loaded
function doGet() {
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
}






/******************************************************************/
/**                    ENDPOINTS                                 **/
/******************************************************************/

/*********************************
* getAll()
* Retrieves and returns an object with Teacher data and all Centres  
* *******************************/
function getAll() {

    let userEmail = Session.getActiveUser().getEmail();

    //// get user data; if it doesn't exist, return an empty object
    const userArray = getUserFromDatabase(userEmail);
    const data = userArray ? createTeacherObject(userArray, userEmail) : {};

    //// get list of centres
    const centreVals = $sheets.settings.getRange('A2:A').getValues();
    const centres = centreVals.map(centre => centre[0]).filter(centre => centre.length > 0);

    return { 
      teacher: {
        userEmail: userEmail,
        data: data
      },
      centres: centres
    }

}



/*********************************
* writeDataToTable()
* Writes the user info to a table;
* If user already exists, overwrite; if user is new, append new row 
* *******************************/
function writeDataToTable (payload) {

    //// check if the active user is the same as the person in the email
    const user = Session.getActiveUser().getEmail(); 
    if (user != payload.email) { return false };

    Logger.log(payload);

    const writeArray = createTeacherArray(payload);

    const userArray = getUserFromDatabase(payload.email);

    Logger.log(`endDate value is ${payload.endDate}; typeof = ${typeof payload.endDate}`);

    //// write data; if exists, then overwrite; if new, then append
    if (userArray) {
      const allData = readAllDatabaseVals();
      const index = allData.map(row => row[1]).indexOf(payload.email);
      const userRange = $sheets.dB.getRange(index+2,1,1, $sheets.dB.getLastColumn());
      userRange.setValues([writeArray])
    } else {
      $sheets.dB.appendRow(writeArray);
    }

    return true;
}



/*********************************
* deleteUser()
* Remove user from the database
* *******************************/
function deleteUser(email) {

    //// check if the active user is the same as the person in the email
    const user = Session.getActiveUser().getEmail(); 
    if (user != email) { return false };

    const allData = readAllDatabaseVals();
    const index = allData.map(row => row[1]).indexOf(email);

    $sheets.dB.deleteRow(index+2);

    return true;


}



function test_3() {
writeDataToTable(testTeacher.data);
}


























/*********************************************************/
/**                  TESTING ONLY                       **/
/*********************************************************/
// Function to handle data request from the client-side
function getData() {
  const data = $sheets.tAvail.getDataRange().getValues();
  return JSON.stringify(data);
}

// Function to handle data submission from the client-side
function setData(data) {
  $sheets.tAvail.appendRow(data);
}


function testGetAll() {
console.log(getAll());
}


function testClass() {  

let userEmail = 'todd@ilavietnam.edu.vn';

const lastRow = sheets.tAvail.getLastRow();
const lastCol = sheets.tAvail.getLastColumn();

const data = sheets.tAvail.getRange(2, 1, lastRow - 1, lastCol).getValues();
const userData = data.filter(row => row[1] === userEmail)[0];

let t = new Teacher(...userData);
console.log(JSON.stringify(t));
console.log(t.email);

}




