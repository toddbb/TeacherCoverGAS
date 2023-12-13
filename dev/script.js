//// DEV GLOBALS!!!
const dev_isTeacherExist = true;
const TestEnvironment = true;
const testErrorHandling = false;
const timeout = 1000;
const allCentres = ["TC-HCMC2", "TC-HCMC5", "TC-HCMC8", "TC-HCMC12", "TC-HCMC14", "TC-HCMC18"];


/********************************************************************************/
/**                          SECTION: Signup                                   **/
/********************************************************************************/
const Signup = {

    el: {},
    button: {},
    vars: {
        title: "You are currently not registered for cover classes. Register here!"
    },

    setTitle: (title) => {
        Signup.el.title.innerText = title;
    },

    resetTitle: () => {
        Signup.el.title.innerText = Signup.vars.title;
    },

    init: () => {
        Signup.el.title = document.getElementById('signup-status-title');
        Signup.button.register = document.getElementsByClassName('btn-signup')[0];

        Signup.button.register.addEventListener('click', () => {
            Ui.hideSignup();
            Ui.showForm();
        })
    }
}


/********************************************************************************/
/**                            SECTION: Form                                   **/
/********************************************************************************/
const Form = {
    el: {},
    input: {},
    button: {},
    vars: {
        title: "Complete the form below to register for cover classes."
    },

    setTitle: (title) => {
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
        if (Teacher.isExist()) {
            for (prop in Teacher.data) {
                let val = prop === 'endDate' ? convertToYMD(Teacher.data[prop]) : Teacher.data[prop];
                Form.input[prop].value = val;
            }

            Form.setCoverTypes();
            Form.setLocations();
            Form.setAvail();
        }
        
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

        if (!Teacher.isExist()) { return };

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

    setLocations: () => {
        if (!Teacher.isExist()) { return };

        const labels = document.querySelectorAll('#user-form-locations label');
        Teacher.data.locations.forEach(location => {
            labels.forEach(label => {
                if (label.innerText === location) {
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

    getLocationsResponses: () => {
        let types = document.querySelectorAll(".locations-check-group input[type='checkbox']");
        let checked = [...types].filter(type => type.checked);
        return checked.map(el => {
            return el.nextSibling.nextSibling.innerText;
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

    clearAllValidation: () => {
        let inputs = document.querySelectorAll('.user-form-input');
        inputs.forEach(input => {
            input.classList.remove('invalidInput');
        });
        setDisplay(Form.el.errorMsg, 'hide');
    },

    validateResponses: (userInput) => {
        //// reset all validation errors and messages
        Form.clearAllValidation();
        let invalids = [];

        //// validate most form inputs to make sure they are not blank
        for (prop in userInput) {
            if (!(userInput[prop].length > 0) && prop != 'endDate' && prop != 'availability') {
                invalids.push(prop);
            }
        }
        //// validate phone number        
        const regex = /^[+()\d][\d\s-()+]+$/;
        if (!regex.test(userInput.phone) || userInput.phone.length < 7) { invalids.push('phone'); };

        /// validate availability
        let availIsValid = false;
        for (day in userInput.availability) {
            userInput.availability[day].forEach(time => availIsValid = time || availIsValid)
        }

        if (!availIsValid) { invalids.push("availability")};
        
        if (invalids.length > 0) {            
            invalids.forEach(inputName => {
                if (!Form.input[inputName].classList.contains('invalidInput')) {
                    Form.input[inputName].classList.add('invalidInput');
                }
            });
            setDisplay(Form.el.errorMsg, 'show');
            window.scrollTo(0, {behavior: 'smooth'});

            return false;
        }

        return true;
    },

    submit: async () => {

        const isNewRegistration = Teacher.isExist() ? false : true;

        // make an object 'formInputs' based on entry, similar to Teacher.data object
        let formInputs = {};
        for (prop in Form.input) {
            let val = Form.input[prop].value;
            formInputs[prop] = val;
        }        

        formInputs.availability = Form.getAvailResponses();
        formInputs.coverType = Form.getCoverTypesResponses();
        formInputs.locations = Form.getLocationsResponses();
        formInputs.endDate = convertToDMY(formInputs.endDate);  

        let resp = Form.validateResponses(formInputs);
        //console.log(`Form Submitted. JSON object = ${JSON.stringify(responses)}`);

        if (resp) {
            Ui.hideForm();
            Form.clearAllValidation();
            Loader.setTitle("We're saving your details...")
            Ui.showLoader();

            try {

                let status = await Server.writeUserData(resp, "submit");

                //if (testErrorHandling) { throw new Error("Testing Error Handler; func: Form.submit()")}

                if (status) {
                    Teacher.data = formInputs;
                    Details.updateHtml();
                    Form.populateFields();
                    Loader.resetTitle();
                    let title = isNewRegistration ? 
                        "Congratulations! You're registered for cover. We'll be in touch :)" :
                        "Your details have been updated."
                    Details.setTitle(title)
                    Ui.hideLoader();
                    Ui.showDetails();
                }

            } catch (error) { 
                console.error(error);               
                const suggestion = "Please make sure you are logged into your ILA account and refresh your browser.";
                const errorMsg = "Error: Could not connect to the database (func: Form.submit)"
                ErrorHandler.activateError(errorMsg, suggestion);
            }
        }
        
    },


    init: (centres) => {

        Form.el.title = document.getElementsByClassName('form-status-title')[0];
        Form.el.errorMsg = document.getElementById('form-title-error');

        Form.input.name = document.getElementById('user-form-name');
        Form.input.email = document.getElementById('user-form-email');
        Form.input.phone = document.getElementById('user-form-phone');
        Form.input.centre = document.getElementById('user-form-centre');
        Form.input.coverType = document.getElementById('user-form-coverType');
        Form.input.availability = document.getElementById('user-form-availability');
        Form.input.locations = document.getElementById('user-form-locations');
        Form.input.endDate = document.getElementById('user-form-endDate');

        Form.button.submit = document.getElementById('user-form-submit');
        Form.button.cancel = document.getElementById('user-form-cancel');

        Form.populateCentreDropdown(centres);
        Form.populateFields();

        //// Events
        Form.button.submit.addEventListener('click', () => { Form.submit() });
        Form.button.cancel.addEventListener('click', () => {
            Ui.hideForm();            
            Form.clearAllValidation();
            
            if (Teacher.isExist()) {
                Ui.showDetails();
                Form.populateFields();
            } else {                
                Form.clearAll();
                Ui.showSignup();
            }
        });

        // Events for datepicker
        Form.input.endDate.addEventListener('click', (e) => {
            e.target.showPicker();
        })
        Form.input.endDate.addEventListener('keydown', (e) => {
            if (e.key === 'Delete' || e.key === 'Backspace') {
                e.target.value = '';
            }
        })
        
    }
}

/********************************************************************************/
/**                            SECTION: Details                                **/
/********************************************************************************/
const Details = {

    el: {},

    button: {},

    vars: {
        title: "Congrats! You are currently registered for cover classes",
        subtitle: "See the details below. You can edit or unregister at anytime."
    },    

    setTitle: (title, subtitle) => {
        if (title) { Details.el.title.innerText = title; }
        if (subtitle) { Details.el.subtitle.innerText = subtitle; }
    },

    resetTitle: () => {
        Details.el.title.innerText = Details.vars.title;
        Details.el.subtitle.innerText = Details.vars.subtitle;
    },

    clearAllHtml: () => {

        Details.el.name.innerText = "";
        Details.el.email.innerText = Teacher.userEmail;
        Details.el.phone.innerText = "";
        Details.el.centre.innerText = "";
        Details.el.endDate.innerText = "";

        //// availability table
        let cells = document.querySelectorAll('.availability-table-cell');
        cells.forEach(cell => {
            if (cell.hasChildNodes()) {
                let childNode = cell.childNodes[0];
                cell.removeChild(childNode);
            }
        })

        //// coverTypes list items
        let coverTypeLists = document.querySelectorAll('.coverType-list-item');
        coverTypeLists.forEach(list => list.remove());

        //// Locations list items
        let locationLists = document.querySelectorAll('.locations-list-item');
        locationLists.forEach(list => list.remove());

        
    },

    updateHtml: () => {

        Details.clearAllHtml();         // reset all Html first

        Details.el.name.innerText = Teacher.data.name;
        Details.el.email.innerText = Teacher.data.email;
        Details.el.phone.innerText = Teacher.data.phone;
        Details.el.centre.innerText = Teacher.data.centre;
        Details.el.endDate.innerText = Teacher.data.endDate || "(none)";

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

        //// coverTpe list items
        let list = document.getElementById('coverType-list');
        Teacher.data.coverType.forEach(cover => {
            let newChild = document.createElement("li");
            newChild.classList.add('coverType-list-item');
            newChild.innerText = cover;
            list.appendChild(newChild);
        }); 

        
        //// Locations list items
        list = document.getElementById('locations-list');
        Teacher.data.locations.forEach(location => {
            let newChild = document.createElement("li");
            newChild.classList.add('locations-list-item');
            //location = location[0].toUpperCase() + location.slice(1-location.length);
            newChild.innerText = location;
            list.appendChild(newChild);
        });


    },


    unregister: async () => {

        Ui.hideDetails();
        Loader.setTitle("Sorry to see you go.", "We're removing you from the registration...");
        Ui.showLoader();

        try {

            let status = await Server.deleteUser(Teacher.userEmail);

            //if (testErrorHandling) { throw new Error ("Testing Error Handler; func: Details.unregister()"); }

            if (status) {
                Teacher.data = {};
                Ui.hideLoader();
                Ui.showUnregister();
                Form.clearAll();
                Details.clearAllHtml();
                Details.resetTitle();
                Form.resetTitle();
                Loader.resetTitle();
            } else {
                throw new Error("No response from server. Could not delete the user.")
            }

        } catch (error) {
            console.error(error);               
            const suggestion = "Please make sure you are logged into your ILA account and refresh your browser.";
            const errorMsg = "Error: Could not connect to the database (func: Details.unregister)"
            ErrorHandler.activateError(errorMsg, suggestion);
        }
    },


    init: () => {
        Details.el.name = document.getElementById('details-name');
        Details.el.email = document.getElementById('details-email');
        Details.el.phone = document.getElementById('details-phone');
        Details.el.centre = document.getElementById('details-centre');
        Details.el.coverType = document.getElementById('details-coverType');
        Details.el.locations = document.getElementById('details-locations');
        Details.el.endDate = document.getElementById('details-endDate');
        Details.el.title = document.getElementById('details-status-title');
        Details.el.subtitle = document.getElementById('details-status-subtitle');

        Details.button.edit = document.getElementById('btn-details-edit');
        Details.button.unregister = document.getElementById('btn-details-unregister');
        

        Details.button.edit.addEventListener('click', () => {
            Ui.hideDetails();
            Form.setTitle("Edit your details below and then click 'Submit'");
            Ui.showForm();
        });
        Details.button.unregister.addEventListener('click', () => { Details.unregister(); });

    }
}

/********************************************************************************/
/**                           SECTION: Unregister                              **/
/********************************************************************************/
const Unregister = {
    
    button: {},

    exit: () => {
        Ui.hideUnregister();
        Ui.showSignup();
    },

    init: () => {
        Unregister.button.exit = document.getElementById('btn-unregister-exit');
        
        Unregister.button.exit.addEventListener('click', () => { Unregister.exit() });
    }
}





/********************************************************************************/
/**                             SECTION: Loader                                **/
/********************************************************************************/
const Loader = {
    el: {},
    vars: {
        title: "Loading...",
        subtitle: "This should only take a few seconds."
    },

    setTitle: (title, subtitle) => {
        if (title) { Loader.el.title.innerText = title; }
        if (subtitle) { Loader.el.subtitle.innerText = subtitle; }
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



/********************************************************************************/
/**                             METHOD: Error Handling                         **/
/********************************************************************************/
const ErrorHandler = {

    el: {},
    button: {},

    hideAllSections: () => {
        const sectionCollection = document.getElementsByTagName('section');
        [...sectionCollection].forEach(section => {
            setDisplay(section, 'hide');
        })
    },

    activateError: (error, suggest) => {
        ErrorHandler.hideAllSections();
        ErrorHandler.el.description.innerText = error;
        let urlSuffix = error.split(" ").join("+");
        let url = "https://docs.google.com/forms/d/e/1FAIpQLSfZUQRPo10plLvPLEFqMcTfVB9VWM0eJMLBvE819fBpFPgcoQ/viewform?usp=pp_url&entry.1204352290=%7BERRORMESSAGE%7D";
        url = url.replace("%7BERRORMESSAGE%7D", urlSuffix);
        ErrorHandler.el.feedbackLink.href = url;
        Ui.showStatus();
    },


    init: () => {

        ErrorHandler.el.title = document.getElementById('section-status-title');
        ErrorHandler.el.subtitle = document.getElementById('section-status-subtitle');
        ErrorHandler.el.description = document.getElementById('section-status-description');
        ErrorHandler.el.suggestion = document.getElementById('section-status-suggestion');
        ErrorHandler.el.feedbackLink = document.getElementById('feedback-link');

        ErrorHandler.button.refresh = document.getElementById('btn-status');

        /// TO DO: test this in GAS iFrame
        ErrorHandler.button.refresh.addEventListener('click', () => { window.location.reload(); });
    }



};



/********************************************************************************/
/**                             METHOD: Ui                                     **/
/********************************************************************************/
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


/********************************************************************************/
/**                             METHOD: Teacher                                **/
/********************************************************************************/
const Teacher = {    
    data: {},
    userEmail: null,

    isExist: () => {
        return Object.keys(Teacher.data).length > 0 && Teacher.userEmail.length > 0;
    }
};


/********************************************************************************/
/**                             METHOD: Server                                 **/
/********************************************************************************/
const Server = {

    writeUserData: async (payload) => {

        if (TestEnvironment) {
            ///// running in test environment; simulate call to server
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve(true);
                }, timeout);
            });
        } else {
            ///// running in Google Web App environment            
            return new Promise((resolve, reject) => {
                google.script.run
                .withSuccessHandler(resolve)
                .withFailureHandler(reject)
                .writeDataToTable(payload);
            });
        }
    },

    deleteUser: async (userEmail) => {
        
        if (TestEnvironment) {
            ///// running in test environment; simulate call to server
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve(true);
                }, timeout)
            });
        } else {
            ///// running in Google Web App environment            
            return new Promise((resolve, reject) => {
                google.script.run
                .withSuccessHandler(resolve)
                .withFailureHandler(reject)
                .deleteUser(userEmail);
            });
        }
    },

    ////// returns the centre table, userEmail and user data
    getAll: async () => {        
        if (TestEnvironment) {
            ///// running in test environment; simulate call to server        
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
        } else {
            ///// running in Google Web App environment            
            return new Promise((resolve, reject) => {
                google.script.run
                .withSuccessHandler(resolve)
                .withFailureHandler(reject)
                .getAll(userEmail);
            });
        }
    }    
}



/********************************************************************************/
/**                             METHOD: Init                                   **/
/********************************************************************************/
const init = async () => {

    Ui.init();
    Loader.init();
    Details.init();
    Unregister.init();
    Signup.init();
    ErrorHandler.init();


    try {

        let response = await Server.getAll();

        
        //if (testErrorHandling) { throw new Error("Testing Error Handler; func: init()")}

        Teacher.data = response.teacher.data;
        Teacher.userEmail = response.teacher.userEmail;
        
        Ui.hideLoader();
        
        Form.init(response.centres);

        if (Teacher.isExist()) {
            console.log("Detected teacher registration.")
            Details.updateHtml();
            Ui.showDetails();
        } else {
            //Ui.showSignup()
            Ui.showForm(); /// For dev of Form only; delete when done
        }

    } catch (error) {
        console.error(error);               
        const suggestion = "Please make sure you are logged into your ILA account and refresh your browser.";
        const errorMsg = "Error: Could not connect to the database (func: init)"
        ErrorHandler.activateError(errorMsg, suggestion);
    }

    
}


init();



/********************************************************************************/
/**                           Helper Functions                                 **/
/********************************************************************************/
function setDisplay(el, action) {
    if (action === 'show') {
        el.classList.remove('nodisplay');
        window.scrollTo({ top: 0, behavior: 'instant' });
    }

    if (action === 'hide') {
        el.classList.contains('nodisplay') || el.classList.add('nodisplay');
    }
}

function convertToYMD(string) {
    //// date in 'dd/mm/yyyy' format
    let arr = string.split("/");
    //// new date in 'yyyy-MM-dd' format    
    return arr[2] + "-" + arr[1] + "-" + arr[0];
}


function convertToDMY(string) {
    //// date in 'yyyy-MM-dd' format
    let arr = string.split("-");
    //// new date in 'dd/mm/yyyy' format    
    return arr[2] + "/" + arr[1] + "/" + arr[0];
}






/////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////           ALL CODE BELOW FOR DEV IN LIVE SERVER ONLY!!!!         //////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////



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
        centre: "TC-HCMC12",
        availability: {
            monday: [true, true, true],
            tuesday: [false, false, false],
            wednesday: [false, false, false],
            thursday: [false, false, false],
            friday: [false, false, false],
            saturday: [true, true, true],
            sunday: [false, false, false]
        },
        coverType: ["ILA / OLA Classes", "Public School Classes"],
        locations: ["North", "East", "Central"],
        endDate: "05/06/2024"
    }
}


const TestTeacherData_NONE = {
    userEmail: "freddie@mymail.net",
    data: {}
}

  
  