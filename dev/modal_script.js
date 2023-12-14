
const TestEnvironment = true;
const timeout = 2000;

/********************************************************************************/
/*                    MAIN: NEW NOTE                                            */
/********************************************************************************/

const NewNote = {
    el: {},
    tag: {},
    button: {},

    getSelectedTag: () => {

    },

    setTag: (tag) => {
        const allTags = document.querySelectorAll('.newNote-statuses .tag');
        [...allTags].forEach(tag => {
            if (!tag.classList.contains('tag-noSelect')) { tag.classList.add('tag-noSelect'); };
        })
        tag.classList.remove('tag-noSelect');
    },

    getTag: () => {
        const allTags = document.querySelectorAll('.newNote-statuses .tag');
        const tagSelect = [...allTags].filter(tag => !tag.classList.contains('tag-noSelect'));
        return tagSelect.length > 0 ? tagSelect[0].id.slice(12) : null;
    },    

    submit: async () => {
        
        const objNote = {
            user: Ui.getUserEmail(),
            timestamp: new Date(),
            tag: NewNote.getTag(),
            note: NewNote.el.textarea.value
        }

        try {
            const status = await Server.createNewNote(objNote);
            //console.log(status);
            if (status) { 
                Status.showStatus(
                    "A new note has been added for " + Ui.getStoredData().teacher.name,
                    "Click 'Close' to close the window and return to the Teacher Cover list."
                )
            } else {
                throw new Error("Error submitting new note. (func: NewNote.submit)");
            }

        } catch(error) {
            console.error(error)
            Status.showStatus(
                "Oops. We're experiencing technical difficulties.",
                "Could not submit the new note.",
                "Please close this window and refresh your browser before trying again. If the problem continues, please provide feedback in menu: Cover -> Submit Feedback."
            )
        }

    },

    init: () => {
        NewNote.el.textarea = document.getElementById('newNote-textarea');
        NewNote.tag.positive = document.getElementById('newNote-tag-positive');
        NewNote.tag.neutral = document.getElementById('newNote-tag-neutral');
        NewNote.tag.caution = document.getElementById('newNote-tag-caution');
        NewNote.button.submit = document.getElementsByClassName('btn-submit-newNote')[0];

        /// Events
        const allTags = document.querySelectorAll('.newNote-statuses .tag');
        [...allTags].forEach(tag => {
            tag.addEventListener('click', (e) => {
                NewNote.setTag(e.target);
            })
        })

        NewNote.button.submit.addEventListener('click', () => { NewNote.submit(); })

    }
}


/********************************************************************************/
/*                          MAIN: REMOVE                                        */
/********************************************************************************/
const Remove = {

    el: {},
    button: {},

    enableSubmit: (state) => {
        if (state) {
            Remove.button.submit.classList.remove('disabled');
        } else if (!state && !Remove.button.submit.classList.contains('disabled')) { 
            Remove.button.submit.classList.add('disabled');
        }
    },

    isChecked: () => {
        return Remove.el.checkbox.checked;
    },

    submit: async () => {
        try {
            const status = await Server.removeTeacher(Ui.getStoredData());
            //console.log(status);
            if (status) { 
                Status.showStatus(
                    Ui.getStoredData().teacher.name + " has been removed from the Teacher Cover list.",
                    "Click 'Close' to close the window and return to the Teacher Cover list."
                )
            } else {
                throw new Error("Error removing teacher. (func: Remove.submit)");
            }

        } catch(error) {
            console.error(error)
            Status.showStatus(
                "Oops. We're experiencing technical difficulties.",
                "Could not remove the teacher.",
                "Please close this window and refresh your browser before trying again. If the problem continues, please provide feedback in menu: Cover -> Submit Feedback."
            )
        }
    },  

    init: () => {
        Remove.el.checkbox = document.getElementById('remove-confirmation');
        Remove.button.submit = document.getElementsByClassName('btn-remove')[0];
        //// Events
        Remove.el.checkbox.addEventListener('click', (e) => {
            if (e.target.checked) { Remove.enableSubmit(true) }
            else { Remove.enableSubmit(false); }
        })
        Remove.button.submit.addEventListener('click', () => { 
            if (Remove.isChecked()) { Remove.submit(); };
        })
    }
}


/********************************************************************************/
/*                       MAIN: STATUS                                           */
/********************************************************************************/
const Status = {

    showStatus: (title, subtitle, body) => {
        if (title) { document.getElementsByClassName('status-title')[0].innerText = title; }
        if (subtitle) { document.getElementsByClassName('status-subtitle')[0].innerText = subtitle; }
        if (body) { document.getElementsByClassName('status-body')[0].innerText = body; }

        /// first, hide all other main sections
        const mainSections = document.querySelectorAll('.main-section');
        [...mainSections].forEach(section => {
            setDisplay(section, 'hide');
        })
        const statusSection = document.getElementById('main-section-status');
        setDisplay(statusSection, 'show');
    },
}

/********************************************************************************/
/*                             TABS                                             */
/********************************************************************************/
const Tabs = {
    el: {},

    setActive: (tab) => {
        Tabs.el.allTabs.forEach(tab => tab.classList.remove('tab-active'));
        tab.classList.add('tab-active');
    },

    getActive: () => {
        return [...Tabs.el.allTabs].filter(tab => tab.classList.contains('tab-active'))[0];
    },

    init: () => {
        Tabs.el.notes = document.getElementById('tab-notes');
        Tabs.el.newNotes = document.getElementById('tab-newNotes');
        Tabs.el.remove = document.getElementById('tab-remove');

        /// Events
        Tabs.el.allTabs = document.querySelectorAll('.tab');
        Tabs.el.allTabs.forEach(tab =>  {
            tab.addEventListener('click', (e) => { 
                if (e.target.id != Tabs.getActive().id )
                Tabs.setActive(e.target);
                const section = e.target.id.slice(4);
                Ui.showSection(section);
            });
        });
    }
}


/********************************************************************************/
/*                               UI                                             */
/********************************************************************************/
const Ui = {
    el: {},
    main: {},
    button: {},

    showSection: (section) => {
        const sections = document.querySelectorAll('.main-section');
        sections.forEach(section => {
            if (!section.classList.contains('nodisplay')) { section.classList.add('nodisplay'); }
        });
        Ui.main[section].classList.remove('nodisplay');
    },

    getUserEmail: () => {
        return document.getElementById('newNote-userEmail').innerText;
    },

    getStoredData: () => {
        return {
            userEmail: Ui.getUserEmail(),
            teacher: {
                name: document.getElementById('name').innerText,
                email: document.getElementById('email').innerText,
                centre: document.getElementById('centre').innerText
            }
        }
    },

    init: () => {       
        Ui.el.main = {};
        Ui.main.notes = document.getElementById('main-section-notes');
        Ui.main.newNote = document.getElementById('main-section-newNote');
        Ui.main.remove = document.getElementById('main-section-remove');
        Ui.main.status = document.getElementById('main-section-status');
        Ui.button.close = document.getElementsByClassName('btn-closeWindow')[0];

        Ui.button.close.addEventListener('click', () => { google.script.host.close(); });
    }
}


/********************************************************************************/
/*                             SERVER                                           */
/********************************************************************************/
const Server = {

    createNewNote: async (payload) => {

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
                .createNewNote(payload);
            });
        }
    },

    removeTeacher: async (payload) => {

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
                .removeTeacher(payload);
            });
        }
    },

}


/********************************************************************************/
/*                             INIT                                             */
/********************************************************************************/

const init = () => {
    Ui.init();
    Tabs.init();
    NewNote.init();
    Remove.init();
}

init();



/********************************************************************************/
/*                          HELPER FUNCTIONS                                    */
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
