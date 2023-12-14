
const TestEnvironment = true;
const timeout = 2000;

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
            console.log(status);

        } catch(error) {

            console.error("Error: could not submit new note to server.")
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

    init: () => {
        Remove.el.checkbox = document.getElementById('remove-confirmation');
        Remove.button.submit = document.getElementsByClassName('btn-remove')[0];
        //// Events
        Remove.el.checkbox.addEventListener('click', (e) => {
            if (e.target.checked) { Remove.enableSubmit(true) }
            else { Remove.enableSubmit(false); }
        })
    }
}


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

const Ui = {
    el: {},
    main: {},

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

    init: () => {       
        Ui.el.main = {};
        Ui.main.notes = document.getElementById('main-section-notes');
        Ui.main.newNote = document.getElementById('main-section-newNote');
        Ui.main.remove = document.getElementById('main-section-remove');
        Ui.main.status = document.getElementById('main-section-status');
    }
}


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

}


const init = () => {
    Ui.init();
    Tabs.init();
    NewNote.init();
    Remove.init();

}

init();






function setDisplay(el, action) {
    if (action === 'show') {
        el.classList.remove('nodisplay');
        window.scrollTo({ top: 0, behavior: 'instant' });
    }

    if (action === 'hide') {
        el.classList.contains('nodisplay') || el.classList.add('nodisplay');
    }
}
