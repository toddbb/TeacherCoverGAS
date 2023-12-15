/******** FOR TESTING ONLY   ****/
const $testData = testTeacher.data;  /// from Middleware.gs



/******************************************************************/
/**                HELPER FUNCTIONS                              **/
/******************************************************************/

/// convert some data so it can be interpreted in the email template (Availabilitiy, coverType, and locations)
const createObjectTemplate = (obj) => {

  //// convert availability to "Yes" or (blank)
  for (p in obj.availability) {
    obj.availability[p] = obj.availability[p].map(v => v ? "Yes" : "")
  }
  //// convert coverType array to string
  obj.coverType = obj.coverType.join(", ");
  //// conver locations array to string
  obj.locations = obj.locations.join(", ");

  return obj;
}

/// create the email subject depending on the type of email
const setSubject = (emailName) => {
  let subject = "Automatic Email from Cover Teacher Registration Form";

  switch (emailName) {
    case 'Email_ConfirmRegistration':
      subject = "Confirmation: Cover Classes Registration";
      break;
    
    case 'Email_UpdateRegistration':
      subject = "Confrimation: Your Cover Classes Registration has been updated";
      break;
    
    case 'Email_ConfirmUnregister':
      subject = "Confirmation: Unregistered for Cover Classes";
      break;

    default:
      subject = "Automatic Email from Cover Teacher Registration Form";
      break;
  }
  return subject;

}


/******************************************************************/
/**                   MAIN EMAIL HANDLER                         **/
/******************************************************************/

function sendEmail(data, emailName) {

  //// Object Builder
  let $email = {
    to: data.email,
    subject: setSubject(emailName),
    body: "",
    options: {
      htmlBody: null,
      cc: null,
      bcc: null,
      name: null,
      noReply: null,
      replyTo: null,
    }
  }

  //// update and determine the object "data" based on the type of email being sent
  if (emailName === 'Email_ConfirmRegistration' || emailName === 'Email_UpdateRegistration') {
    data = createObjectTemplate(data);
  }

  ////// create the html content; use a simple email if no data is necessary (i.e. make data = {})
  if (Object.keys($testData).length > 0) {
    const template = HtmlService.createTemplateFromFile(emailName);
    template.data = data;
    $email.options.htmlBody = template.evaluate().getContent(); 
  } else {
    $email.options.htmlBody = HtmlService.createHtmlOutputFromFile('Email').getContent();
  }

  ///// only declare email options that exist (i.e. not null);
  let options = {};
  for (prop in $email.options) {
    if ($email.options[prop]) { options[prop] = $email.options[prop]; };
  }

  //// Send email
  MailApp.sendEmail(
    $email.to,
    $email.subject,
    $email.body,
    options
  )

  return true;
}

