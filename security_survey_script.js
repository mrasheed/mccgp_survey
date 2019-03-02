var ip_addr = "";
function getIP(json) {
  ip_addr = json.ip;
}

function isNumber(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}

// get all data in form and return object
function getFormData() {
  var form = document.getElementById("security-survey");
  var elements = form.elements; // all form elements

  var fields = Object.keys(elements).map(function(k) {
    if(elements[k].name !== undefined) {
      return elements[k].name;
    // special case for Edge's html collection
    } else if(elements[k].length > 0) {
      return elements[k].item(0).name;
    }
  }).filter(function(item, pos, self) {
    return self.indexOf(item) == pos && item;
  });

  var data = {};
  fields.forEach(function(k) {
    data[k] = elements[k].value;
    var str = ""; // declare empty string outside of loop to allow
                  // it to be appended to for each item in the loop
    if(elements[k].type === "checkbox") { // special case for Edge's html collection
      str = str + elements[k].checked + ", "; // take the string and append
                                              // the current checked value to
                                              // the end of it, along with
                                              // a comma and a space
      data[k] = str.slice(0, -2); // remove the last comma and space
                                  // from the string to make the output
                                  // prettier in the spreadsheet
    } else if(elements[k].length) {
      for(var i = 0; i < elements[k].length; i++) {
        if(elements[k].item(i).checked) {
          str = str + elements[k].item(i).value + ", "; // same as above
          data[k] = str.slice(0, -2);
        }
      }
    }
  });

  // add form-specific values into the data
  data.IP_Address = ip_addr;
  data.formDataNameOrder = JSON.stringify(fields);
  data.formGoogleSheetName = form.dataset.sheet || "Survey"; // default sheet name
  data.formGoogleSendEmail = form.dataset.Email || ""; // no email by default

  return data;
}

// Checks the form for completion and ensures consistency of data
function checkCompletion(data) {
  var valid = true;

  if(valid &&
     !document.getElementById('gate_yes').checked &&
     !document.getElementById('gate_no').checked ) {

    document.getElementById('gate_alert').style.display = "block";
    valid = false;
  }

  if(valid &&
     !document.getElementById('window_glass_yes').checked &&
     !document.getElementById('window_glass_no').checked ) {

    document.getElementById('window_glass_alert').style.display = "block";
    valid = false;
  }

  if(valid &&
     !document.getElementById('main_door_yes').checked &&
     !document.getElementById('main_door_no').checked ) {

    document.getElementById('main_door_alert').style.display = "block";
    valid = false;
  }

  if(valid &&
     !document.getElementById('badge_access_yes').checked &&
     !document.getElementById('badge_access_no').checked ) {

    document.getElementById('badge_access_alert').style.display = "block";
    valid = false;
  }

  if(valid &&
     !document.getElementById('security_guard_yes').checked &&
     !document.getElementById('security_guard_no').checked ) {

    document.getElementById('security_guard_alert').style.display = "block";
    valid = false;
  }

  if(valid &&
     !document.getElementById('security_guard_approach_yes').checked &&
     !document.getElementById('security_guard_approach_no').checked ) {

    document.getElementById('security_guard_approach_alert').style.display = "block";
    valid = false;
  }

  if(valid &&
     !document.getElementById('security_trial_safety_yes').checked &&
     !document.getElementById('security_trial_safety_no').checked &&
     !document.getElementById('security_trial_safety_not_sure').checked) {

    document.getElementById('security_trial_safety_alert').style.display = "block";
    valid = false;
  }

  if(valid &&
     !document.getElementById('security_trial_diligent_yes').checked &&
     !document.getElementById('security_trial_diligent_no').checked &&
     !document.getElementById('security_trial_diligent_not_sure').checked) {

    document.getElementById('security_trial_diligent_alert').style.display = "block";
    valid = false;
  }

  if(valid &&
     !document.getElementById('security_trial_professional_yes').checked &&
     !document.getElementById('security_trial_professional_no').checked &&
     !document.getElementById('security_trial_professional_not_sure').checked) {

    document.getElementById('security_trial_professional_alert').style.display = "block";
    valid = false;
  }

  if(valid &&
     !document.getElementById('security_committee_yes').checked &&
     !document.getElementById('security_committee_no').checked ) {

    document.getElementById('security_committee_alert').style.display = "block";
    valid = false;
  }

  if(valid &&
     !document.getElementById('security_team_yes').checked &&
     !document.getElementById('security_team_no').checked ) {

    document.getElementById('security_team_alert').style.display = "block";
    valid = false;
  }

  if(valid &&
     !document.getElementById('security_team_volunteer_yes').checked &&
     !document.getElementById('security_team_volunteer_no').checked ) {

    document.getElementById('security_team_volunteer_alert').style.display = "block";
    valid = false;
  }

  if(valid &&
     !document.getElementById('security_drill_yes').checked &&
     !document.getElementById('security_drill_no').checked ) {

    document.getElementById('security_drill_alert').style.display = "block";
    valid = false;
  }

  if(!valid) {
    document.getElementById('submit_alert').style.display = "block";
  }

  return valid;
}

// Handles form submit withtout any jquery. This is the main handler called
// when the user presses the submit button
function handleFormSubmit(event) {
  event.preventDefault();           // we are submitting via xhr below

  var data = getFormData();         // get the values submitted in the form

  // If form isn't complete, don't proceed
  if(!checkCompletion(data)) {
    return false;
  }

  // Form is ready for submission

  // Disable the submit button to prevent the user from submitting the form
  // more than one time.
  document.getElementById('submit-form').disabled = true;

  var url = event.target.action;
  var xhr = new XMLHttpRequest();
  xhr.open('POST', url);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onreadystatechange = function() {
    if(xhr.readyState === 4 && xhr.status === 200) {
      console.log( xhr.status, xhr.statusText )
      console.log(xhr.responseText);

      // Parse the response text and look for "result":"error"
      var result = JSON.parse(xhr.responseText);
      if(result['result'] === 'success') {
        // Display the survey submitted page
        document.location.replace('http://www.mccgp.org/survey-submitted.html');
      } else {
        // Display the error page if error was returned
        document.location.replace('http://www.mccgp.org/survey-already-submitted.html');
      }

    }
    return;
  };

  // url encode form data for sending as post data
  var encoded = Object.keys(data).map(function(k) {
      return encodeURIComponent(k) + '=' + encodeURIComponent(data[k])
  }).join('&')
  xhr.send(encoded);
}

// Event listeners
function loaded() {
  // bind to the submit event of our form
  var form = document.getElementById('security-survey');
  form.addEventListener("submit", handleFormSubmit, false);
};

document.addEventListener('DOMContentLoaded', loaded, false);

// ============================================================== //
// Reset Eventlisteners: Restore original state when the control is clicked

// Gate
document.getElementById("gate_yes").addEventListener("click", function() {
  document.getElementById("gate_alert").style.display = "none";
  document.getElementById('submit_alert').style.display = "none";
});
document.getElementById("gate_no").addEventListener("click", function() {
  document.getElementById("gate_alert").style.display = "none";
  document.getElementById('submit_alert').style.display = "none";
});

// Window Glass
document.getElementById("window_glass_yes").addEventListener("click", function() {
  document.getElementById("window_glass_alert").style.display = "none";
  document.getElementById('submit_alert').style.display = "none";
});
document.getElementById("window_glass_no").addEventListener("click", function() {
  document.getElementById("window_glass_alert").style.display = "none";
  document.getElementById('submit_alert').style.display = "none";
});

// Main Door
document.getElementById("main_door_yes").addEventListener("click", function() {
  document.getElementById("main_door_alert").style.display = "none";
  document.getElementById('submit_alert').style.display = "none";
});
document.getElementById("main_door_no").addEventListener("click", function() {
  document.getElementById("main_door_alert").style.display = "none";
  document.getElementById('submit_alert').style.display = "none";
});

// Badge Access
document.getElementById("badge_access_yes").addEventListener("click", function() {
  document.getElementById("badge_access_alert").style.display = "none";
  document.getElementById('submit_alert').style.display = "none";
});
document.getElementById("badge_access_no").addEventListener("click", function() {
  document.getElementById("badge_access_alert").style.display = "none";
  document.getElementById('submit_alert').style.display = "none";
});

// Security Guard
document.getElementById("security_guard_yes").addEventListener("click", function() {
  document.getElementById("security_guard_alert").style.display = "none";
  document.getElementById('submit_alert').style.display = "none";
});
document.getElementById("security_guard_no").addEventListener("click", function() {
  document.getElementById("security_guard_alert").style.display = "none";
  document.getElementById('submit_alert').style.display = "none";
});

// Security Guard Approach
document.getElementById("security_guard_approach_yes").addEventListener("click", function() {
  document.getElementById("security_guard_approach_alert").style.display = "none";
  document.getElementById('submit_alert').style.display = "none";
});
document.getElementById("security_guard_approach_no").addEventListener("click", function() {
  document.getElementById("security_guard_approach_alert").style.display = "none";
  document.getElementById('submit_alert').style.display = "none";
});

// Security Trial Safety
document.getElementById("security_trial_safety_yes").addEventListener("click", function() {
  document.getElementById("security_trial_safety_alert").style.display = "none";
  document.getElementById('submit_alert').style.display = "none";
});
document.getElementById("security_trial_safety_no").addEventListener("click", function() {
  document.getElementById("security_trial_safety_alert").style.display = "none";
  document.getElementById('submit_alert').style.display = "none";
});
document.getElementById("security_trial_safety_not_sure").addEventListener("click", function() {
  document.getElementById("security_trial_safety_alert").style.display = "none";
  document.getElementById('submit_alert').style.display = "none";
});

// Security Trial diligent
document.getElementById("security_trial_diligent_yes").addEventListener("click", function() {
  document.getElementById("security_trial_diligent_alert").style.display = "none";
  document.getElementById('submit_alert').style.display = "none";
});
document.getElementById("security_trial_diligent_no").addEventListener("click", function() {
  document.getElementById("security_trial_diligent_alert").style.display = "none";
  document.getElementById('submit_alert').style.display = "none";
});
document.getElementById("security_trial_diligent_not_sure").addEventListener("click", function() {
  document.getElementById("security_trial_diligent_alert").style.display = "none";
  document.getElementById('submit_alert').style.display = "none";
});

// Security Trial professional
document.getElementById("security_trial_professional_yes").addEventListener("click", function() {
  document.getElementById("security_trial_professional_alert").style.display = "none";
  document.getElementById('submit_alert').style.display = "none";
});
document.getElementById("security_trial_professional_no").addEventListener("click", function() {
  document.getElementById("security_trial_professional_alert").style.display = "none";
  document.getElementById('submit_alert').style.display = "none";
});
document.getElementById("security_trial_professional_not_sure").addEventListener("click", function() {
  document.getElementById("security_trial_professional_alert").style.display = "none";
  document.getElementById('submit_alert').style.display = "none";
});

// Security Committee
document.getElementById("security_committee_yes").addEventListener("click", function() {
  document.getElementById("security_committee_alert").style.display = "none";
  document.getElementById('submit_alert').style.display = "none";
});
document.getElementById("security_committee_no").addEventListener("click", function() {
  document.getElementById("security_committee_alert").style.display = "none";
  document.getElementById('submit_alert').style.display = "none";
});

// Security Team
document.getElementById("security_team_yes").addEventListener("click", function() {
  document.getElementById("security_team_alert").style.display = "none";
  document.getElementById('submit_alert').style.display = "none";
});
document.getElementById("security_team_no").addEventListener("click", function() {
  document.getElementById("security_team_alert").style.display = "none";
  document.getElementById('submit_alert').style.display = "none";
});

// Security Team Volunteer
document.getElementById("security_team_volunteer_yes").addEventListener("click", function() {
  document.getElementById("security_team_volunteer_alert").style.display = "none";
  document.getElementById('submit_alert').style.display = "none";
});
document.getElementById("security_team_volunteer_no").addEventListener("click", function() {
  document.getElementById("security_team_volunteer_alert").style.display = "none";
  document.getElementById('submit_alert').style.display = "none";
});

// Security Drill
document.getElementById("security_drill_yes").addEventListener("click", function() {
  document.getElementById("security_drill_alert").style.display = "none";
  document.getElementById('submit_alert').style.display = "none";
});
document.getElementById("security_drill_no").addEventListener("click", function() {
  document.getElementById("security_drill_alert").style.display = "none";
  document.getElementById('submit_alert').style.display = "none";
});

// ============================================================== //
