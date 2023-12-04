

/*********************************************************/
/**               Details Section                       **/
/*********************************************************/
const Details = {

    el: {},

    updateHtml: () => {
        Details.el.name.innerText = Teacher.data.name;
        Details.el.email.innerText = Teacher.data.email;
        Details.el.phone.innerText = Teacher.data.phone;
        Details.el.centre.innerText = Teacher.data.centre;
        //// availabilitiy table
        for (const day in Teacher.data.availability) {
            console.log(`${day}: ${Teacher.data.availability[day]}`)
            let elRow = document.getElementById('row-' + day);
            console.log(elRow);
        }

    },



    init: () => {
        Details.el.name = document.getElementById('details-name');
        Details.el.email = document.getElementById('details-email');
        Details.el.phone = document.getElementById('details-phone');
        Details.el.centre = document.getElementById('details-centre');
    }

}


/*********************************************************/
/**              Teacher                                **/
/*********************************************************/
const Teacher = { data: {} };



/*********************************************************/
/**              User Interface (UI)                    **/
/*********************************************************/
const Ui = {

  el: {},

  showLoader: () => { setDisplay(Ui.el.sectionLoader, 'show'); },
  hideLoader: () => { setDisplay(Ui.el.sectionLoader, 'hide'); },
  showDetails: () => { setDisplay(Ui.el.sectionDetails, 'show'); },
  hideDetails: () => { setDisplay(Ui.el.sectionDetails, 'hide'); },  
  showSignup: () => { setDisplay(Ui.el.sectionSignup, 'show'); },
  hideSignup: () => { setDisplay(Ui.el.sectionSignup, 'hide'); },
  showForm: () => { setDisplay(Ui.el.sectionForm, 'show'); },
  hideForm: () => { setDisplay(Ui.el.sectionForm, 'hide'); },
  showStatus: () => { setDisplay(Ui.el.sectionStatus, 'show'); },
  hideStatus: () => { setDisplay(Ui.el.sectionStatus, 'hide'); },
  showDev: () => { setDisplay(Ui.el.sectionDev, 'show'); },
  hideDev: () => { setDisplay(Ui.sectionDev, 'hide'); },

  init: () => {
    Ui.el.sectionLoader = document.getElementsByClassName("section-loader")[0];
    Ui.el.sectionDetails = document.getElementsByClassName("section-details")[0];
    Ui.el.sectionSignup = document.getElementsByClassName("section-signup")[0];
    Ui.el.sectionForm = document.getElementsByClassName("section-form")[0];
    Ui.el.sectionStatus = document.getElementsByClassName("section-status")[0];
    Ui.el.sectionDev = document.getElementsByClassName("section-dev")[0];
  }
}


/*********************************************************/
/**             HELPER FUNCTIONS                        **/
/*********************************************************/
function setDisplay(el, action) {
    if (action === 'show') {
        el.classList.remove('nodisplay');
    }

    if (action === 'hide') {
        el.classList.contains('nodisplay') || el.classList.add('nodisplay');
    }
}








///////////////////////////  ALL CODE BELOW FOR DEV IN LIVE SERVER ONLY!!!!  ////////////////////////////////

const init = async () => {
    Ui.init();
    Details.init();

    /// simulate server call and getting Teacher class
    delay(0, 'Making call to server').then(() => {
        console.log('Received response from server');
        Teacher.data = TestTeacherData_EXISTS;
        console.log(Teacher.data);
        Ui.hideLoader();

        // if UserData has a "name" assigned, then it exists in the table
        if (Teacher.data.name) {
            Details.updateHtml();
            Ui.showDetails();
        } else {
            Ui.showSignup()
        }
    });

}

init()



///////////// SIMULATED FUNCTIONS AND DATA FOR DEV ONLY //////////////////////////
function delay(time, msg) {
    return new Promise(resolve => {
        console.log(msg);
        setTimeout(resolve, time)
    });
}


const TestTeacherData_EXISTS = {
    name: "Freddie Mercury",
    email: "freddie@mymail.net",
    phone: "012 345 6789",
    centre: "TC-HCMC99",
    availability: {
        monday: [false, false, true],
        tuesday: [false, false, false],
        wednesday: [true, true, true],
        thursday: [true, true, false],
        friday: [false, false, false],
        saturday: [false, true, false],
        sunday: [false, true, false]
    },
    type: null
}


const TestTeacherData_NONE = {
    name: "Freddie Mercury",
    email: "freddie@mymail.net",
    phone: "012 345 6789"
}
  
  