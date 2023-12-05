/*********************************************************/
/**               Signup Section                       **/
/*********************************************************/
const Signup = {

    el: {},
    button: {},

    init: () => {
        Signup.button.register = document.getElementsByClassName('btn-signup')[0];

        Signup.button.register.addEventListener('click', () => {
            Ui.hideSignup();
            Ui.showForm();
        })
    }
}


/*********************************************************/
/**               Details Section                       **/
/*********************************************************/
const Details = {

    el: {},

    button: {},

    updateHtml: () => {
        Details.el.name.innerText = Teacher.data.name;
        Details.el.email.innerText = Teacher.data.email;
        Details.el.phone.innerText = Teacher.data.phone;
        Details.el.centre.innerText = Teacher.data.centre;
        //// availabilitiy table
        let rowsCollection = document.querySelector('#details-availability-table table').rows;
        [...rowsCollection].forEach((row, index) => {
            if (index != 0) {
                let day = row.id.slice(4);
                [...row.children].forEach((child, index) => {
                    if (index != 0) {
                        let check = Teacher.data.availability[day][index-1];
                        if (check) { child.innerHTML = '<span class="material-symbols-outlined">done</span>'; };
                    }
                })
                
            }
        })
        //// type of cover
        let covers = Teacher.data.coverType.split(",");
        covers = covers.map(e => e.trim());
        let list = document.getElementById('coverType-list');
        covers.forEach(cover => {
            let newChild = document.createElement("li");
            newChild.classList.add('coverType-list-item');
            let newList = list.appendChild(newChild);
            newList.innerText = cover;
        });


    },



    init: () => {
        Details.el.name = document.getElementById('details-name');
        Details.el.email = document.getElementById('details-email');
        Details.el.phone = document.getElementById('details-phone');
        Details.el.centre = document.getElementById('details-centre');
        Details.el.coverType = document.getElementById('details-coverType');
        Details.button.edit = document.getElementById('btn-details-edit');
        Details.button.unregister = document.getElementById('btn-details-unregister');

        Details.button.edit.addEventListener('click', () => {
            Ui.hideDetails();
            Ui.showForm();
        });
        Details.button.unregister.addEventListener('click', () => {
            Ui.hideDetails();
            Ui.showUnregister();
        });

    }
}

/*********************************************************/
/**               Unregister                            **/
/*********************************************************/
const Unregister = {
    
    button: {},

    exit: () => {
        Ui.hideUnregister();
        Ui.showSignup();
    },

    init: () => {
        Unregister.button.exit = document.getElementById('btn-unregister-exit');
        
        Unregister.button.exit.addEventListener('click', () => {
            Unregister.exit()
        });
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
  showUnregister: () => { setDisplay(Ui.el.sectionUnregister, 'show'); },
  hideUnregister: () => { setDisplay(Ui.el.sectionUnregister, 'hide'); },  
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
    Ui.el.sectionUnregister = document.getElementsByClassName("section-unregister")[0];
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
    Unregister.init();
    Signup.init();


    /// simulate server call and getting Teacher class
    delay(2000, 'Making call to server').then(() => {
        console.log('Received response from server');
        Teacher.data = TestTeacherData_EXISTS;
        console.log(JSON.stringify(Teacher.data));
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
    coverType: "ILA / OLA Classes, Public School"
}


const TestTeacherData_NONE = {
    name: "",
    email: "freddie@mymail.net",
    phone: ""
}
  
  