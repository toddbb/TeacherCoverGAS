

/*********************************************************/
/**               INITIALIZATIONS                       **/
/*********************************************************/
// This function is executed when the web app is loaded
function doGet() {
    return HtmlService.createTemplateFromFile('Index').evaluate();
}

// This function adds the Script and Stylesheet to Index.html
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}


/*********************************************************/
/**          SERVER CUSTOM FUNCTIONS                    **/
/*********************************************************/

// Function to return the user's email who is running the web app
function getUserEmail() {
  return Session.getActiveUser().getEmail();
}

// Find teacher in the 'Teacher Availability' table
// If exists, return all info and preferences
// If does not exist, return the email only
function getUserDataFromTable() {

  let userEmail = getUserEmail();

  const lastRow = $sheets.tAvail.getLastRow();
  const lastCol = $sheets.tAvail.getLastColumn();

  const data = $sheets.tAvail.getRange(2, 1, lastRow - 1, lastCol).getValues();
  const userData = data.filter(row => row[1] === userEmail)[0];   /// only return one row, in case of duplication

  return userData ? new Teacher(...userData) : new Teacher(null, userEmail);

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




