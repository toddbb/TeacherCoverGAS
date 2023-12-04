/************************************************/
/**          PROJECT NOTES                      */
/************************************************/
// TO DO
// 1. Handle duplication
// 2. Error handling




/***********************************************/
/**            GLOBAL VARS                     */
/***********************************************/

const $ss = SpreadsheetApp.getActiveSpreadsheet();

const $sheets = {
  tAvail: $ss.getSheetByName('Teacher Availability')
}


/***********************************************/
/**        TEACHER CLASS                       */
/***********************************************/

const Teacher = class {
  constructor(name, email, phone) {
    this.name = name;
    this.email = email;
    this.phone = phone;
  }
}
