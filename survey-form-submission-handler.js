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
  var form = document.getElementById("religious-director-survey");
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

  if(document.getElementById('age').value === "" ||
     document.getElementById('age').value < 13) {

    document.getElementById('age').className += " border border-danger";
    document.getElementById('age_alert').style.display = "block";
    valid = false;
  }

  if(valid &&
     !document.getElementById('gender_male').checked &&
     !document.getElementById('gender_female').checked ) {

    document.getElementById('gender_alert').style.display = "block";
    valid = false;
  }

  if(valid &&
     !document.getElementById('attendance_frequently').checked &&
     !document.getElementById('attendance_weekly').checked &&
     !document.getElementById('attendance_occasionally').checked &&
     !document.getElementById('attendance_seldom').checked ) {

    document.getElementById('attendance_alert').style.display = "block";
    valid = false;
  }

  if(valid &&
     !document.getElementById('invite_yes').checked &&
     !document.getElementById('invite_no').checked ) {

    document.getElementById('invite_friend_alert').style.display = "block";
    valid = false;
  }

  if(valid &&
     !document.getElementById('ProgDay_Monday').checked &&
     !document.getElementById('ProgDay_Tuesday').checked &&
     !document.getElementById('ProgDay_Wednesday').checked &&
     !document.getElementById('ProgDay_Thursday').checked &&
     !document.getElementById('ProgDay_Friday').checked &&
     !document.getElementById('ProgDay_Saturday').checked &&
     !document.getElementById('ProgDay_Sunday').checked ) {

    document.getElementById('program_day_alert').style.display = "block";
    valid = false;
  }

  if(valid &&
     !document.getElementById('CommPref_InPerson').checked &&
     !document.getElementById('CommPref_Email').checked &&
     !document.getElementById('CommPref_Text').checked &&
     !document.getElementById('CommPref_Phone').checked &&
     !document.getElementById('CommPref_Facebook').checked ) {

    document.getElementById('comm_pref_alert').style.display = "block";
    valid = false;
  }

  if(valid && document.getElementById('spiritual_challenge').value === "") {

    document.getElementById('spiritual_challenge').className += " border border-danger";
    document.getElementById('spiritual_challenge_alert').style.display = "block";
    valid = false;
  }

  if(valid && document.getElementById('topic_of_interest').value === "") {

    document.getElementById('topic_of_interest').className += " border border-danger";
    document.getElementById('topic_interest_alert').style.display = "block";
    valid = false;
  }

  if(valid && document.getElementById('over_addressed_topics').value === "") {

    document.getElementById('over_addressed_topics').className += " border border-danger";
    document.getElementById('overaddressed_topics_alert').style.display = "block";
    valid = false;
  }

  if(valid && document.getElementById('other_programs').value === "") {

    document.getElementById('other_programs').className += " border border-danger";
    document.getElementById('other_programs_alert').style.display = "block";
    valid = false;
  }

  if(valid &&
     !document.getElementById('ImpTopics_Theology').checked &&
     !document.getElementById('ImpTopics_Seerah').checked &&
     !document.getElementById('ImpTopics_Fiqh').checked &&
     !document.getElementById('ImpTopics_Spirituality').checked &&
     !document.getElementById('ImpTopics_Tafseer').checked &&
     !document.getElementById('ImpTopics_Other').checked ) {

    document.getElementById('important_topics_alert').style.display = "block";
    valid = false;
  }

  if(valid &&
     document.getElementById('ImpTopics_Other').checked &&
     document.getElementById('other_text').value === "") {

    document.getElementById('other_text_alert').style.display = "block";
    valid = false;
  }

  if(valid &&
     !document.getElementById('women_yes').checked &&
     !document.getElementById('women_no').checked ) {

    document.getElementById('women_alert').style.display = "block";
    valid = false;
  }

  if(valid &&
     document.getElementById('women_no').checked &&
     document.getElementById('women_other_text').value === "") {

    document.getElementById('women_other_text_alert').style.display = "block";
    valid = false;
  }

  if(valid &&
     !document.getElementById('Characteristic_Religion').checked &&
     !document.getElementById('Characteristic_Ethinicity_Race').checked &&
     !document.getElementById('Characteristic_Academic').checked &&
     !document.getElementById('Characteristic_Parents_Friends').checked ) {

    document.getElementById('common_characteristics_alert').style.display = "block";
    valid = false;
  }


  if(valid &&
     !document.getElementById('Knowledge_Textual').checked &&
     !document.getElementById('Knowledge_Local').checked &&
     !document.getElementById('Knowledge_WellKnown').checked &&
     !document.getElementById('Knowledge_Family').checked &&
     !document.getElementById('Knowledge_Online').checked &&
     !document.getElementById('Knowledge_Peers').checked &&
     !document.getElementById('Knowledge_Other').checked ) {

    document.getElementById('knowledge_alert').style.display = "block";
    valid = false;
  }

  var leader_rank = ""
  if(document.getElementById('leader_rank_1').checked) {
      leader_rank = document.getElementById('leader_rank_1').value;
  } else if(document.getElementById('leader_rank_2').checked) {
      leader_rank = document.getElementById('leader_rank_2').value;
  } else if (document.getElementById('leader_rank_3').checked) {
      leader_rank = document.getElementById('leader_rank_3').value;
  } else if (document.getElementById('leader_rank_4').checked) {
      leader_rank = document.getElementById('leader_rank_4').value;
  } else if (document.getElementById('leader_rank_5').checked) {
      leader_rank = document.getElementById('leader_rank_5').value;
  }

  var peer_rank = ""
  if(document.getElementById('peer_rank_1').checked) {
      peer_rank = document.getElementById('peer_rank_1').value;
  } else if (document.getElementById('peer_rank_2').checked) {
      peer_rank = document.getElementById('peer_rank_2').value;
  } else if (document.getElementById('peer_rank_3').checked) {
      peer_rank = document.getElementById('peer_rank_3').value;
  } else if (document.getElementById('peer_rank_4').checked) {
      peer_rank = document.getElementById('peer_rank_4').value;
  } else if (document.getElementById('peer_rank_5').checked) {
      peer_rank = document.getElementById('peer_rank_5').value;
  }

  var family_rank = ""
  if(document.getElementById('family_rank_1').checked) {
      family_rank = document.getElementById('family_rank_1').value;
  } else if (document.getElementById('family_rank_2').checked) {
      family_rank = document.getElementById('family_rank_2').value;
  } else if (document.getElementById('family_rank_3').checked) {
      family_rank = document.getElementById('family_rank_3').value;
  } else if (document.getElementById('family_rank_4').checked) {
      family_rank = document.getElementById('family_rank_4').value;
  } else if (document.getElementById('family_rank_5').checked) {
      family_rank = document.getElementById('family_rank_5').value;
  }

  var org_rank = ""
  if(document.getElementById('org_rank_1').checked) {
      org_rank = document.getElementById('org_rank_1').value;
  } else if (document.getElementById('org_rank_2').checked) {
      org_rank = document.getElementById('org_rank_2').value;
  } else if (document.getElementById('org_rank_3').checked) {
      org_rank = document.getElementById('org_rank_3').value;
  } else if (document.getElementById('org_rank_4').checked) {
      org_rank = document.getElementById('org_rank_4').value;
  } else if (document.getElementById('org_rank_5').checked) {
      org_rank = document.getElementById('org_rank_5').value;
  }

  var colleague_rank = ""
  if(document.getElementById('colleague_rank_1').checked) {
      colleague_rank = document.getElementById('colleague_rank_1').value;
  } else if (document.getElementById('colleague_rank_2').checked) {
      colleague_rank = document.getElementById('colleague_rank_2').value;
  } else if (document.getElementById('colleague_rank_3').checked) {
      colleague_rank = document.getElementById('colleague_rank_3').value;
  } else if (document.getElementById('colleague_rank_4').checked) {
      colleague_rank = document.getElementById('colleague_rank_4').value;
  } else if (document.getElementById('colleague_rank_5').checked) {
      colleague_rank = document.getElementById('colleague_rank_5').value;
  }

  if(valid &&
     leader_rank === "" &&
     peer_rank === "" &&
     family_rank === "" &&
     org_rank === "" &&
     colleague_rank === "") {

    document.getElementById('influencers_alert').style.display = "block";
    valid = false;
  }

  if(valid && leader_rank !== "" && (leader_rank === peer_rank ||
                                     leader_rank === family_rank ||
                                     leader_rank === org_rank ||
                                     leader_rank === colleague_rank)) {

    document.getElementById('influencers_ranking_alert').style.display = "block";
    valid = false;
  }

  if(valid && peer_rank !== "" && (peer_rank === family_rank ||
                                   peer_rank === org_rank ||
                                   peer_rank === colleague_rank)) {

    document.getElementById('influencers_ranking_alert').style.display = "block";
    valid = false;
  }

  if(valid && family_rank !== "" && (family_rank === org_rank ||
                                     family_rank === colleague_rank)) {

    document.getElementById('influencers_ranking_alert').style.display = "block";
    valid = false;
  }

  if(valid && org_rank !== "" && org_rank === colleague_rank) {

    document.getElementById('influencers_ranking_alert').style.display = "block";
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

  // Form is ready to for submission

  // Disable the submit button to prevent the user from submitting the form
  // more than one time.
  document.getElementById('submit-form').disabled = true;

  var url = event.target.action;
  var xhr = new XMLHttpRequest();
  xhr.open('POST', url);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onreadystatechange = function() {
      console.log( xhr.status, xhr.statusText )
      console.log(xhr.responseText);
      //document.location.replace('http://www.mccgp.org/survey-submitted.html');
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
  var form = document.getElementById('religious-director-survey');
  form.addEventListener("submit", handleFormSubmit, false);
};

document.addEventListener('DOMContentLoaded', loaded, false);

// ============================================================== //
// Reset Eventlisteners: Restore original state when the control is clicked

// Age
document.getElementById("age").addEventListener("keypress", function() {
  document.getElementById('age').classList.remove("border");
  document.getElementById('age').classList.remove("border-danger");
  document.getElementById("age_alert").style.display = "none";
  document.getElementById('submit_alert').style.display = "none";
});

// Gender
document.getElementById("gender_male").addEventListener("click", function() {
  document.getElementById("gender_alert").style.display = "none";
  document.getElementById('submit_alert').style.display = "none";
});
document.getElementById("gender_female").addEventListener("click", function() {
  document.getElementById("gender_alert").style.display = "none";
  document.getElementById('submit_alert').style.display = "none";
});

// Attendance
document.getElementById("attendance_frequently").addEventListener("click", function() {
  document.getElementById("attendance_alert").style.display = "none";
  document.getElementById('submit_alert').style.display = "none";
});
document.getElementById("attendance_weekly").addEventListener("click", function() {
  document.getElementById("attendance_alert").style.display = "none";
  document.getElementById('submit_alert').style.display = "none";
});
document.getElementById("attendance_occasionally").addEventListener("click", function() {
  document.getElementById("attendance_alert").style.display = "none";
  document.getElementById('submit_alert').style.display = "none";
});
document.getElementById("attendance_seldom").addEventListener("click", function() {
  document.getElementById("attendance_alert").style.display = "none";
  document.getElementById('submit_alert').style.display = "none";
});

// Invite a friend
document.getElementById("invite_yes").addEventListener("click", function() {
  document.getElementById("invite_friend_alert").style.display = "none";
  document.getElementById('submit_alert').style.display = "none";
});
document.getElementById("invite_no").addEventListener("click", function() {
  document.getElementById("invite_friend_alert").style.display = "none";
  document.getElementById('submit_alert').style.display = "none";
});

// Program Day
document.getElementById("ProgDay_Monday").addEventListener("click", function() {
  document.getElementById("program_day_alert").style.display = "none";
  document.getElementById('submit_alert').style.display = "none";
});
document.getElementById("ProgDay_Tuesday").addEventListener("click", function() {
  document.getElementById("program_day_alert").style.display = "none";
  document.getElementById('submit_alert').style.display = "none";
});
document.getElementById("ProgDay_Wednesday").addEventListener("click", function() {
  document.getElementById("program_day_alert").style.display = "none";
  document.getElementById('submit_alert').style.display = "none";
});
document.getElementById("ProgDay_Thursday").addEventListener("click", function() {
  document.getElementById("program_day_alert").style.display = "none";
  document.getElementById('submit_alert').style.display = "none";
});
document.getElementById("ProgDay_Friday").addEventListener("click", function() {
  document.getElementById("program_day_alert").style.display = "none";
  document.getElementById('submit_alert').style.display = "none";
});
document.getElementById("ProgDay_Saturday").addEventListener("click", function() {
  document.getElementById("program_day_alert").style.display = "none";
  document.getElementById('submit_alert').style.display = "none";
});
document.getElementById("ProgDay_Sunday").addEventListener("click", function() {
  document.getElementById("program_day_alert").style.display = "none";
  document.getElementById('submit_alert').style.display = "none";
});

// Communication Preference
document.getElementById("CommPref_InPerson").addEventListener("click", function() {
  document.getElementById("comm_pref_alert").style.display = "none";
  document.getElementById('submit_alert').style.display = "none";
});
document.getElementById("CommPref_Email").addEventListener("click", function() {
  document.getElementById("comm_pref_alert").style.display = "none";
  document.getElementById('submit_alert').style.display = "none";
});
document.getElementById("CommPref_Text").addEventListener("click", function() {
  document.getElementById("comm_pref_alert").style.display = "none";
  document.getElementById('submit_alert').style.display = "none";
});
document.getElementById("CommPref_Phone").addEventListener("click", function() {
  document.getElementById("comm_pref_alert").style.display = "none";
  document.getElementById('submit_alert').style.display = "none";
});
document.getElementById("CommPref_Facebook").addEventListener("click", function() {
  document.getElementById("comm_pref_alert").style.display = "none";
  document.getElementById('submit_alert').style.display = "none";
});

// Biggest spiritual challenge
document.getElementById("spiritual_challenge").addEventListener("keypress", function() {
  document.getElementById('spiritual_challenge').classList.remove("border");
  document.getElementById('spiritual_challenge').classList.remove("border-danger");
  document.getElementById("spiritual_challenge_alert").style.display = "none";
  document.getElementById('submit_alert').style.display = "none";
});

// topics and issues
document.getElementById("topic_of_interest").addEventListener("keypress", function() {
  document.getElementById('topic_of_interest').classList.remove("border");
  document.getElementById('topic_of_interest').classList.remove("border-danger");
  document.getElementById("topic_interest_alert").style.display = "none";
  document.getElementById('submit_alert').style.display = "none";
});

// over-addressed topics
document.getElementById("over_addressed_topics").addEventListener("keypress", function() {
  document.getElementById('over_addressed_topics').classList.remove("border");
  document.getElementById('over_addressed_topics').classList.remove("border-danger");
  document.getElementById("overaddressed_topics_alert").style.display = "none";
  document.getElementById('submit_alert').style.display = "none";
});

// Other programs
document.getElementById("other_programs").addEventListener("keypress", function() {
  document.getElementById('other_programs').classList.remove("border");
  document.getElementById('other_programs').classList.remove("border-danger");
  document.getElementById("other_programs_alert").style.display = "none";
  document.getElementById('submit_alert').style.display = "none";
});

// Important Topics
document.getElementById("ImpTopics_Theology").addEventListener("click", function() {
  document.getElementById("important_topics_alert").style.display = "none";
  document.getElementById('submit_alert').style.display = "none";
});
document.getElementById("ImpTopics_Seerah").addEventListener("click", function() {
  document.getElementById("important_topics_alert").style.display = "none";
  document.getElementById('submit_alert').style.display = "none";
});
document.getElementById("ImpTopics_Fiqh").addEventListener("click", function() {
  document.getElementById("important_topics_alert").style.display = "none";
  document.getElementById('submit_alert').style.display = "none";
});
document.getElementById("ImpTopics_Spirituality").addEventListener("click", function() {
  document.getElementById("important_topics_alert").style.display = "none";
  document.getElementById('submit_alert').style.display = "none";
});
document.getElementById("ImpTopics_Tafseer").addEventListener("click", function() {
  document.getElementById("important_topics_alert").style.display = "none";
  document.getElementById('submit_alert').style.display = "none";
});
document.getElementById("ImpTopics_Other").addEventListener("click", function() {
  document.getElementById("important_topics_alert").style.display = "none";
  document.getElementById("other_text_alert").style.display = "none";
  document.getElementById('submit_alert').style.display = "none";

  // Enable/Disable the input text field
  document.getElementById("other_text").value = '';
  if(document.getElementById("ImpTopics_Other").checked) {
      document.getElementById("other_text").disabled = false;
  } else {
      document.getElementById("other_text").disabled = true;
  }
});

// Inclusive of women
document.getElementById("women_yes").addEventListener("click", function() {
  document.getElementById("women_alert").style.display = "none";
  document.getElementById('submit_alert').style.display = "none";

  // Enable the input text field
  document.getElementById("women_other_text").value = '';
  document.getElementById("women_other_text").disabled = true;
});
document.getElementById("women_no").addEventListener("click", function() {
  document.getElementById("women_alert").style.display = "none";
  document.getElementById("women_other_text_alert").style.display = "none";
  document.getElementById('submit_alert').style.display = "none";

  // Enable the input text field
  document.getElementById("women_other_text").value = '';
  document.getElementById("women_other_text").disabled = false;
});

// Common Characteristics
document.getElementById("Characteristic_Religion").addEventListener("click", function() {
  document.getElementById("common_characteristics_alert").style.display = "none";
  document.getElementById('submit_alert').style.display = "none";
});
document.getElementById("Characteristic_Ethinicity_Race").addEventListener("click", function() {
  document.getElementById("common_characteristics_alert").style.display = "none";
  document.getElementById('submit_alert').style.display = "none";
});
document.getElementById("Characteristic_Academic").addEventListener("click", function() {
  document.getElementById("common_characteristics_alert").style.display = "none";
  document.getElementById('submit_alert').style.display = "none";
});
document.getElementById("Characteristic_Parents_Friends").addEventListener("click", function() {
  document.getElementById("common_characteristics_alert").style.display = "none";
  document.getElementById('submit_alert').style.display = "none";
});

// Source of knowledge
document.getElementById("Knowledge_Textual").addEventListener("click", function() {
  document.getElementById("knowledge_alert").style.display = "none";
  document.getElementById('submit_alert').style.display = "none";
});
document.getElementById("Knowledge_Local").addEventListener("click", function() {
  document.getElementById("knowledge_alert").style.display = "none";
  document.getElementById('submit_alert').style.display = "none";
});
document.getElementById("Knowledge_WellKnown").addEventListener("click", function() {
  document.getElementById("knowledge_alert").style.display = "none";
  document.getElementById('submit_alert').style.display = "none";
});
document.getElementById("Knowledge_Family").addEventListener("click", function() {
  document.getElementById("knowledge_alert").style.display = "none";
  document.getElementById('submit_alert').style.display = "none";
});
document.getElementById("Knowledge_Online").addEventListener("click", function() {
  document.getElementById("knowledge_alert").style.display = "none";
  document.getElementById('submit_alert').style.display = "none";
});
document.getElementById("Knowledge_Peers").addEventListener("click", function() {
  document.getElementById("knowledge_alert").style.display = "none";
  document.getElementById('submit_alert').style.display = "none";
});
document.getElementById("Knowledge_Other").addEventListener("click", function() {
  document.getElementById("knowledge_alert").style.display = "none";
  document.getElementById('submit_alert').style.display = "none";
});

// Religious leader
document.getElementById("leader_rank_1").addEventListener("click", function() {
  document.getElementById("influencers_alert").style.display = "none";
  document.getElementById("influencers_ranking_alert").style.display = "none";
  document.getElementById('submit_alert').style.display = "none";
});
document.getElementById("leader_rank_2").addEventListener("click", function() {
  document.getElementById("influencers_alert").style.display = "none";
  document.getElementById("influencers_ranking_alert").style.display = "none";
  document.getElementById('submit_alert').style.display = "none";
});
document.getElementById("leader_rank_3").addEventListener("click", function() {
  document.getElementById("influencers_alert").style.display = "none";
  document.getElementById("influencers_ranking_alert").style.display = "none";
  document.getElementById('submit_alert').style.display = "none";
});
document.getElementById("leader_rank_4").addEventListener("click", function() {
  document.getElementById("influencers_alert").style.display = "none";
  document.getElementById("influencers_ranking_alert").style.display = "none";
  document.getElementById('submit_alert').style.display = "none";
});
document.getElementById("leader_rank_5").addEventListener("click", function() {
  document.getElementById("influencers_alert").style.display = "none";
  document.getElementById("influencers_ranking_alert").style.display = "none";
  document.getElementById('submit_alert').style.display = "none";
});

// Peer
document.getElementById("peer_rank_1").addEventListener("click", function() {
  document.getElementById("influencers_alert").style.display = "none";
  document.getElementById("influencers_ranking_alert").style.display = "none";
  document.getElementById('submit_alert').style.display = "none";
});
document.getElementById("peer_rank_2").addEventListener("click", function() {
  document.getElementById("influencers_alert").style.display = "none";
  document.getElementById("influencers_ranking_alert").style.display = "none";
  document.getElementById('submit_alert').style.display = "none";
});
document.getElementById("peer_rank_3").addEventListener("click", function() {
  document.getElementById("influencers_alert").style.display = "none";
  document.getElementById("influencers_ranking_alert").style.display = "none";
  document.getElementById('submit_alert').style.display = "none";
});
document.getElementById("peer_rank_4").addEventListener("click", function() {
  document.getElementById("influencers_alert").style.display = "none";
  document.getElementById("influencers_ranking_alert").style.display = "none";
  document.getElementById('submit_alert').style.display = "none";
});
document.getElementById("peer_rank_5").addEventListener("click", function() {
  document.getElementById("influencers_alert").style.display = "none";
  document.getElementById("influencers_ranking_alert").style.display = "none";
  document.getElementById('submit_alert').style.display = "none";
});

// Family
document.getElementById("family_rank_1").addEventListener("click", function() {
  document.getElementById("influencers_alert").style.display = "none";
  document.getElementById("influencers_ranking_alert").style.display = "none";
  document.getElementById('submit_alert').style.display = "none";
});
document.getElementById("family_rank_2").addEventListener("click", function() {
  document.getElementById("influencers_alert").style.display = "none";
  document.getElementById("influencers_ranking_alert").style.display = "none";
  document.getElementById('submit_alert').style.display = "none";
});
document.getElementById("family_rank_3").addEventListener("click", function() {
  document.getElementById("influencers_alert").style.display = "none";
  document.getElementById("influencers_ranking_alert").style.display = "none";
  document.getElementById('submit_alert').style.display = "none";
});
document.getElementById("family_rank_4").addEventListener("click", function() {
  document.getElementById("influencers_alert").style.display = "none";
  document.getElementById("influencers_ranking_alert").style.display = "none";
  document.getElementById('submit_alert').style.display = "none";
});
document.getElementById("family_rank_5").addEventListener("click", function() {
  document.getElementById("influencers_alert").style.display = "none";
  document.getElementById("influencers_ranking_alert").style.display = "none";
  document.getElementById('submit_alert').style.display = "none";
});

// Organization
document.getElementById("org_rank_1").addEventListener("click", function() {
  document.getElementById("influencers_alert").style.display = "none";
  document.getElementById("influencers_ranking_alert").style.display = "none";
  document.getElementById('submit_alert').style.display = "none";
});
document.getElementById("org_rank_2").addEventListener("click", function() {
  document.getElementById("influencers_alert").style.display = "none";
  document.getElementById("influencers_ranking_alert").style.display = "none";
  document.getElementById('submit_alert').style.display = "none";
});
document.getElementById("org_rank_3").addEventListener("click", function() {
  document.getElementById("influencers_alert").style.display = "none";
  document.getElementById("influencers_ranking_alert").style.display = "none";
  document.getElementById('submit_alert').style.display = "none";
});
document.getElementById("org_rank_4").addEventListener("click", function() {
  document.getElementById("influencers_alert").style.display = "none";
  document.getElementById("influencers_ranking_alert").style.display = "none";
  document.getElementById('submit_alert').style.display = "none";
});
document.getElementById("org_rank_5").addEventListener("click", function() {
  document.getElementById("influencers_alert").style.display = "none";
  document.getElementById("influencers_ranking_alert").style.display = "none";
  document.getElementById('submit_alert').style.display = "none";
});

// Colleague
document.getElementById("colleague_rank_1").addEventListener("click", function() {
  document.getElementById("influencers_alert").style.display = "none";
  document.getElementById("influencers_ranking_alert").style.display = "none";
  document.getElementById('submit_alert').style.display = "none";
});
document.getElementById("colleague_rank_2").addEventListener("click", function() {
  document.getElementById("influencers_alert").style.display = "none";
  document.getElementById("influencers_ranking_alert").style.display = "none";
  document.getElementById('submit_alert').style.display = "none";
});
document.getElementById("colleague_rank_3").addEventListener("click", function() {
  document.getElementById("influencers_alert").style.display = "none";
  document.getElementById("influencers_ranking_alert").style.display = "none";
  document.getElementById('submit_alert').style.display = "none";
});
document.getElementById("colleague_rank_4").addEventListener("click", function() {
  document.getElementById("influencers_alert").style.display = "none";
  document.getElementById("influencers_ranking_alert").style.display = "none";
  document.getElementById('submit_alert').style.display = "none";
});
document.getElementById("colleague_rank_5").addEventListener("click", function() {
  document.getElementById("influencers_alert").style.display = "none";
  document.getElementById("influencers_ranking_alert").style.display = "none";
  document.getElementById('submit_alert').style.display = "none";
});

// ============================================================== //
