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
  constructor(name, email, phone, centre, availability, coverType, locations, endDate) {
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.centre = centre;
    this.availability = availability;
    this.coverType = coverType;
    this.locations = locations;
    this.endDate = endDate;
  }
}


/*** EXAMPLE OF TEACHER OBJECT  ****/
/* 
{
  userEmail: "freddie@mymail.net",
  data: {
      name: "Freddie Mercury",
      email: "freddie@mymail.net",
      phone: "012 345 6789",
      centre: "TC-HCMC12",
      availability: {
          monday: [false, false, true],
          tuesday: [false, false, false],
          wednesday: [true, true, true],
          thursday: [true, true, false],
          friday: [false, false, false],
          saturday: [false, true, false],
          sunday: [false, true, false]
      },
      coverType: ["ILA / OLA Classes", "Public School Classes"],
      locations: ["North", "East", "Central"],
      endDate: "05/06/2024"
  }
} */