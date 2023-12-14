/*************************************************************/
/**                    READ/WRITE DATABASE                   */
/*************************************************************/

/******** GET THE DATABASE HEADERS AND RETURN A 1D ARRAY   **********/
const getHeaders = () => {
  return $sheets.dB.getRange('1:1').getValues()[0].filter(val => val.length > 0);
}


/********* RETURN ALL VALUES IN THE DATABASE AS A 2D ARRAY    ********/
const readAllDatabaseVals = () => {
  //// get Teacher info from Teacher Database
  const lastRow = $sheets.dB.getLastRow();
  const lastCol = $sheets.dB.getLastColumn();
  return $sheets.dB.getRange(2, 1, lastRow - 1, lastCol).getValues();
}

/*********  RETURN INFORMATION ABOUT A SINGLE USER IN A 1D ARRAY    ********/
const getUserFromDatabase = (email) => {
  const allData = readAllDatabaseVals();
  return allData.filter(row => row[1] === email)[0];
}




/*******************************************************************/
/**                    HELPER FUNCTIONS                            */
/*******************************************************************/

/******** CONVERT ARRAY FROM SHEET TO TEACHER DATA OBJECT   *********/
const createTeacherObject = (array,email) => {

  const addLeadingZero = (int) => {
    return int.toString().length === 2 ? int.toString() : "0" + int.toString();
  }

  const headers = getHeaders();

  let obj = {}
  headers.forEach((head,index) => {
    obj[head] = array[index];
  })

  let sanitized = {
    email: email,
    availability: {}
  };

  /// add properties and values based on header and array information
  for(prop in obj) {
    if (prop.indexOf("avail") > -1) {
      const day = prop.slice(prop.indexOf(":")+2);
      let arr = obj[prop].split(",");
      sanitized.availability[day] = arr.map(v => v.trim() === 'true' ? true : false);
      

    } else if (prop === 'coverType' || prop === 'locations') {
      let arr = obj[prop].split(",");
      sanitized[prop] = arr.map(v => v.trim());

    } else if (prop === 'endDate') {
      let date = obj[prop];
      if (typeof date === 'object') {
        sanitized[prop] = addLeadingZero(date.getDate()) + "/" + addLeadingZero(date.getMonth()+1) + "/" + date.getFullYear();
      } else {
        sanitized[prop] = date;
      }

    } else {
      sanitized[prop] = obj[prop];
    }
  }

  return sanitized;
}



/******** CONVERT ARRAY FROM SHEET TO TEACHER DATA OBJECT   *********/
const createTeacherArray = (obj) => {
  const headers = getHeaders();

  const row = headers.map(header => {

    if (header.indexOf('avail') > -1) {
      let dayInHeader = header.slice(header.indexOf(":")+2);
      return obj.availability[dayInHeader].join(",");

    } else if (header === 'coverType' || header === 'locations') {
      return obj[header].join(", ");

    } /* else if (header === 'endDate') {
      let strDate = obj[header];
      if (strDate.length > 0 && strDate != '' && strDate.indexOf("none") < 0) {
        let arr = strDate.split("/");
        let day = parseInt(arr[0]);
        let month = parseInt(arr[1]) - 1; // months are indexed 0-11
        let year = parseInt(arr[2]);
        return new Date(year, month, day);
      } else {
        return null;
      }
      
    } */ else {      
      return obj[header];
    }

  })

 return row;

}



/********* TESTING ONLY ***************/
function test_1() {
  let userEmail = Session.getActiveUser().getEmail();
  let array = getUserFromDatabase(userEmail);

  Logger.log(createTeacherObject(array));
}




function test_2() {
  Logger.log(createTeacherArray(testTeacher.data));
}



/*** EXAMPLE OF TEACHER OBJECT  ****/

const testTeacher = {
  userEmail: "freddie@mymail.net",
  data: {
      name: "Freddie Mercury",
      email: "todd@ilavietnam.edu.vn",
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
}




/***********************************************/
/**           CLASS: Teacher                   */
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
