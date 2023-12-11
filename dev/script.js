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
/**                 Form Section                        **/
/*********************************************************/
const Form = {
    el: {},
    input: {},
    button: {},
    vars: {
        title: "Complete the form below to register for cover classes."
    },

    changeTitle: (title) => {
        if (title) { Form.el.title.innerText = title; }
    },

    resetTitle: () => {
        Form.el.title.innerText = Form.vars.title;
    },

    populateCentreDropdown: (centres) => {
        centres.forEach(centre => {
            let html = "<option>" + centre + "</option>";
            Form.input.centre.insertAdjacentHTML('beforeend', html);
        })
    },

    populateFields: () => {
        for (prop in Teacher.data) {
            let val = Teacher.data[prop];
            Form.input[prop].value = val;
        }

        Form.setCoverTypes();
        Form.setAvail();
        
        Form.input.email.value = Teacher.userEmail;
       
    },

    clearAll: () => {
        let allInputs = document.querySelectorAll('.section-form form input');
        allInputs.forEach(input => input.value = null);
        let allSelects = document.querySelectorAll('.section-form form select');
        allSelects.forEach(select => select.value = null);
        let allChecks = document.querySelectorAll(".section-form input[type='checkbox']")
        allChecks.forEach(check => check.checked = false);

        Form.input.email.value = Teacher.userEmail;
        
    },

    stripAsteriks: (text) => {
        return text.indexOf('*') > 0 ? text.slice(0,-2) : text;
    },

    setCoverTypes: () => {

        if (!Teacher.data.coverType) { return };

        const labels = document.querySelectorAll('#user-form-coverType label');
        Teacher.data.coverType.forEach(cover => {
            labels.forEach(label => {
                let text = Form.stripAsteriks(label.innerText);
                if (text === cover) {
                    let id = label.htmlFor;
                    document.getElementById(id).checked = true;
                }
            })
        })
    },

    setAvail: () => {
        let avail = Teacher.data.availability;
        for (prop in avail) {
            let day = avail[prop];
            let times = ["Morning", "Afternoon", "Evening"];
            day.forEach((boolean, index) => {
                if (boolean) {
                    document.getElementById(prop + times[index]).checked = true;
                }
            })
        }

    },

    getCoverTypesResponses: () => {
        let types = document.querySelectorAll(".coverType-check-group input[type='checkbox']");
        let checked = [...types].filter(type => type.checked);
        return checked.map(el => {
            let text = el.nextSibling.nextSibling.innerText;
            return Form.stripAsteriks(text);
        })
        
    },

    getAvailResponses: () => {
        //// availability
        let elChecks = document.querySelectorAll('#user-form-availability td input');
        objAvail = {};
        elChecks.forEach(check => {
            let index = check.id.indexOf("day");
            let day = check.id.slice(0, index + 3);
            if (!objAvail[day]) { objAvail[day] = [] };
            objAvail[day].push(check.checked);
        })

        return objAvail;
    },

    validateResponses: (resp) => {
        return false;
    },

    submit: () => {
        //// get values (except 'coverTypes' and 'availability')
        let responses = {};
        for (prop in Form.input) {
            let val = Form.input[prop].value;
            responses[prop] = val;
        }      
        responses.availability = Form.getAvailResponses();
        responses.coverType = Form.getCoverTypesResponses();

        
        let resp = Form.validateResponses(responses);
        console.log(`Form Submitted. JSON object = ${JSON.stringify(responses)}`);

        if (resp) {
            Ui.hideForm();
            Ui.showLoader();
            Server.writeUserData(resp);
        }
        
    },


    init: (centres) => {
        Form.el.title = document.getElementsByClassName('form-status-title')[0];
        Form.input.name = document.getElementById('user-form-name');
        Form.input.email = document.getElementById('user-form-email');
        Form.input.phone = document.getElementById('user-form-phone');
        Form.input.centre = document.getElementById('user-form-centre');
        Form.input.coverType = document.getElementById('user-form-coverType');
        Form.input.availability = document.getElementById('user-form-availability');
        Form.input.endDate = document.getElementById('user-form-endDate');

        Form.button.submit = document.getElementById('user-form-submit');

        Form.populateCentreDropdown(centres);
        Form.populateFields();

        //// Events
        Form.button.submit.addEventListener('click', () => { Form.submit() });
        /* let checkLabels = document.querySelectorAll('#user-form-coverType label');
        [...checkLabels].forEach(el => {
            el.addEventListener('click', (e) => {
                console.log(e);
            })
        }); */
        
    }
}

/*********************************************************/
/**               Details Section                       **/
/*********************************************************/
const Details = {

    el: {},

    button: {},

    vars: {
        title: "Congrats! You are currently registered for cover classes",
        subtitle: "See the details below. You can edit or unregister at anytime."
    },

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

        let list = document.getElementById('coverType-list');
        Teacher.data.coverType.forEach(cover => {
            let newChild = document.createElement("li");
            newChild.classList.add('coverType-list-item');
            let newList = list.appendChild(newChild);
            newList.innerText = cover;
        });


    },

    changeTitle: (title, subtitle) => {
        if (title) { Details.el.title.innerText = title; }
        if (subtitle) { Details.el.subtitle.innerText = subtitle; }
    },

    resetTitle: () => {
        Details.el.title.innerText = Details.vars.title;
        Details.el.subtitle.innerText = Details.vars.subtitle;
    },

    init: () => {
        Details.el.name = document.getElementById('details-name');
        Details.el.email = document.getElementById('details-email');
        Details.el.phone = document.getElementById('details-phone');
        Details.el.centre = document.getElementById('details-centre');
        Details.el.coverType = document.getElementById('details-coverType');
        Details.el.title = document.getElementById('details-status-title');
        Details.el.subtitle = document.getElementById('details-status-subtitle');

        Details.button.edit = document.getElementById('btn-details-edit');
        Details.button.unregister = document.getElementById('btn-details-unregister');
        

        Details.button.edit.addEventListener('click', () => {
            Ui.hideDetails();
            Form.changeTitle("Edit your details below and then click 'Submit'");
            Ui.showForm();
        });
        Details.button.unregister.addEventListener('click', () => {
            Ui.hideDetails();
            Unregister.deleteUser();
            Ui.showSignup();
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

    deleteUser: () => {
        Teacher.data = {};
        ///TO DO: remove user from Sheets        
        ///Server.writeUserData();
        Form.clearAll();
    },

    init: () => {
        Unregister.button.exit = document.getElementById('btn-unregister-exit');
        
        Unregister.button.exit.addEventListener('click', () => { Unregister.exit() });
    }
}


/*********************************************************/
/**              Teacher                                **/
/*********************************************************/
const Teacher = {    
    data: {},
    userEmail: null
};


/*********************************************************/
/**               Loader Section                       **/
/*********************************************************/
const Loader = {
    el: {},
    vars: {
        title: "Loading...",
        subtitle: "This should only take a few seconds."
    },

    changeTitle: (title, subtitle) => {

    },

    resetTitle: () => {
        Loader.el.title.innerText = Loader.vars.title;
        Loader.el.subtitle.innerText = Loader.vars.subtitle;
    },

    init: () => {
        Loader.el.title = document.getElementById('loader-title');
        Loader.el.subtitle = document.getElementById('loader-subtitle');
    }
}



/*********************************************************/
/**              User Interface (UI)                    **/
/*********************************************************/
const Ui = {

  el: {},

    showLoader: () => { setDisplay(Ui.el.sectionLoader, 'show'); },
    hideLoader: () => { 
        setDisplay(Ui.el.sectionLoader, 'hide'); 
    },
    showDetails: () => { setDisplay(Ui.el.sectionDetails, 'show'); },
    hideDetails: () => { 
        setDisplay(Ui.el.sectionDetails, 'hide'); 
        Details.resetTitle();
    },  
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



//// DEV GLOBAL!!!
const dev_isTeacherExist = false;
const timeout = 2000;
const allCentres = ["TC-HCMC2", "TC-HCMC5", "TC-HCMC8", "TC-HCMC12", "TC-HCMC14", "TC-HCMC18"];

/*********************************************************/
/**             SERVER FUNCTIONS                        **/
/*********************************************************/
const Server = {

    writeUserData: async (resp) => {
        ///// simulate call to server
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(true);
            }, timeout);
        });
    },


    getAllData: async () => {
        ///// simulate call to server
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                let teacher = dev_isTeacherExist ? TestTeacherData_EXISTS : TestTeacherData_NONE;
                let data = {                    
                    centres: allCentres,
                    teacher: teacher
                }
                resolve(data);
            }, timeout);
        });
    }    
}




///////////////////////////  ALL CODE BELOW FOR DEV IN LIVE SERVER ONLY!!!!  ////////////////////////////////

const init = async () => {

    Ui.init();
    Loader.init();
    Details.init();
    Unregister.init();
    Signup.init();


    try {

        let data = await Server.getAllData();

        console.log(data);

        if (data.teacher.data) { Teacher.data = data.teacher.data; }
        if (data.teacher.userEmail) { Teacher.userEmail = data.teacher.userEmail; }

        
        Ui.hideLoader();

        // if UserData has a "name" assigned, then it exists in the table
        if (Object.keys(Teacher.data).length === 0 && Teacher.data.constructor === Object) {
            Form.init(data.centres);
            Details.updateHtml();
            Ui.showDetails();
        } else {
            Ui.showSignup()
            ///Ui.showForm(); /// For dev of Form only; delete when done
        }

    } catch (error) {
        console.log(error)
    }

    
}

init()




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



/*********************************************************/
/**          DEVELOPMENT ONLY!!!!!!!!!                  **/
/*********************************************************/

function delay(time, msg) {
    return new Promise(resolve => {
        console.log(msg);
        setTimeout(resolve, time)
    });
}


const TestTeacherData_EXISTS = {
    userEmail: "freddie@mymail.net",
    data: {
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
        coverType: ["ILA / OLA Classes", "Public School Classes"],
        endDate: "05/06/2024"
    }
}


const TestTeacherData_NONE = {
    userEmail: "freddie@mymail.net",
    data: {}
}

  
  