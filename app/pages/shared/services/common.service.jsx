import fetch from "isomorphic-fetch";
import { Utility } from '../../../common/utility/';
import FormData from 'form-data'
import { API_URLs, Constants } from "../../../common/app-settings/constants";
import { LoginService } from "../../login/services/login.service";
/**
 * Set the request body and headers.
 */
var CommonService = {
  getRoleSettings: function () {
    let roleName = null;
    let logindetails = JSON.parse(localStorage.getItem("loginDetails"));
    if (!logindetails) {
      LoginService.checkLogin();
      roleName = null;
    }
    else {
      roleName = logindetails.selectedRole;
      return API_URLs[roleName];
    }
    return null;
  },
  /**
   * get current login user role
   */
  isNonAdmin: function () {
    let roleName = null;
    let logindetails = JSON.parse(localStorage.getItem("loginDetails"));
    if (!logindetails) {
      LoginService.checkLogin();
    }
    else {
      roleName = logindetails.selectedRole;
    }
    return roleName == Constants.loginUserTypes.sfUser;
  },
  isSFOUser: function () {
    let loginDetails = JSON.parse(localStorage.getItem("loginDetails"));
    let isSFOUser = false;
    if (loginDetails) {
      isSFOUser = loginDetails.isSFOUser;
    }
    return isSFOUser;
  },
  /**
   * Set the content type for graphQL.
   */
  getHeaders: function () {
    return { "content-type": "application/json" };
  },
  /**
   * Ajax call to the graphQL endpoint.
   */
  sendNonGraphQLRequest: function (assignmentNames, pageNumber, pageSize,qcinstances) {
    debugger;
    let sessionDetails = CommonService.getRoleSettings();
    if (sessionDetails) {
      let URL = Utility.stringFormat(CommonService.getRoleSettings().SURVEY_SUBMITTED_EXCEL_URL);
      return fetch(URL,
        {
          method: 'POST',
          headers: this.getHeaders(),
          body: JSON.stringify({ assignment_names: assignmentNames, page_number: pageNumber, page_size: pageSize })
        })
        .then(response => {
          if (!response.ok) {
            throw Error(response.statusText);
          }
          return response.json();
        });
    }
    else {
      LoginService.checkLogin();
      return new Promise(() => console.log("logout"), () => console.log("error"))
    }
  },
  sendRequest: function (variables, queryType, mutation) {
    let sessionDetails = CommonService.getRoleSettings();
    let JSONRequestBody;
    if (queryType == Constants.queryTypes.select)
      JSONRequestBody = JSON.stringify({ query: this.getQueryType(queryType), variables: variables });
    else if (queryType == Constants.queryTypes.mutation)
      JSONRequestBody = JSON.stringify({ query: mutation });
    if (sessionDetails) {
      return fetch(CommonService.getRoleSettings().SERVER_BASE_URL,
        {
          method: 'POST',
          body: JSONRequestBody,
          headers: this.getHeaders()
        })
        .then(response => {
          if (!response.ok) {
            throw Error(response.statusText);
          }
          return response.json();
        });
    }
    else {
      LoginService.checkLogin();
      return new Promise(() => console.log("logout"), () => console.log("error"))
    }

  },
  renderError: function (errorResponse) {
    console.log("Error :: ", errorResponse);
  },
  getGeoJSON: function (Geo_JSON_URL) {
    return fetch(Geo_JSON_URL,
      {
        method: 'GET',
      })
      .then(response => {
        if (!response.ok)
          throw Error(response.statusText);
        return response.json();
      });
  },
  downloadExcel: (assignmentName) => {
    let excelURL = Utility.stringFormat(CommonService.getRoleSettings().SURVEY_EXCEL_DOWNLOAD_URL, assignmentName);
    let method = "get";
    var form = document.createElement("form");
    form.setAttribute("method", method);
    form.setAttribute("action", excelURL);
    form.setAttribute("target", "_blank");
    document.body.appendChild(form);
    form.submit();
    form.remove();
  },

  sendGraphQLWithTeamAndRouteFormData: function (variables, queryType, mutation, routeDescriptor, siteDescriptor) {
    const formData = new FormData();
    const query = mutation;
    const vars = `{}`;
    formData.append('query', query);
    formData.append('variables', vars);
    if (siteDescriptor.length > 0 && siteDescriptor[0] instanceof File)
    { formData.append('assignments', siteDescriptor[0], siteDescriptor[0].name); }
    if (routeDescriptor.length > 0 && routeDescriptor[0] instanceof File)
    { formData.append('routeGeometry', routeDescriptor[0], routeDescriptor[0].name); }

    const sessionDetails = CommonService.getRoleSettings();
    if (sessionDetails) {
      return fetch(sessionDetails.SERVER_BASE_URL, {
        method: 'POST',
        body: formData,
      }).then(response => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response.json();
      });
    } else {
      LoginService.checkLogin();
      return new Promise(() => console.log("logout"), () => console.log("error"))
    }
  },

  postDownloadExcel: (params, fileName, dispatch, channelName, eventName) => {
    let method = "POST"; // Set method to post by default if not specified.
    let path = CommonService.getRoleSettings().SURVEY_EXCEL_DOWNLOAD_URL;
    let sessionDetails = CommonService.getRoleSettings();
    if (sessionDetails) {
      let URL = Utility.stringFormat(CommonService.getRoleSettings().SURVEY_SUBMITTED_EXCEL_URL);

      return fetch(path,
        {
          method: 'POST',
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            assignment_name: "[" + params + "]",
            file_name: fileName,
            channel_name: channelName,
            event_name: eventName
          })
        })
        .then(response => {
          if (!response.ok) {
            throw Error(response.statusText);
          }
          return response.json();
        });
    }
    else {
      LoginService.checkLogin();
      return new Promise(() => console.log("logout"), () => console.log("error"))
    }
    // // The rest of this code assumes you are not using a library.
    // // It can be made less wordy if you use one.
    // var form = document.createElement("form");
    // form.setAttribute("method", method);
    // form.setAttribute("action", path);

    // var hiddenField1 = document.createElement("input");
    // hiddenField1.setAttribute("type", "hidden");
    // hiddenField1.setAttribute("name", "assignment_name");
    // hiddenField1.setAttribute("value", "[" + params + "]");

    // var hiddenField2 = document.createElement("input");
    // hiddenField2.setAttribute("type", "hidden");
    // hiddenField2.setAttribute("name", "file_name");
    // hiddenField2.setAttribute("value", fileName);
    // form.appendChild(hiddenField1);
    // form.appendChild(hiddenField2);

    // document.body.appendChild(form);

    // form.submit();
  },
  downloadCanvassers: (channelName, eventName, countInstanceId, boroughId, siteId) => {
    let path = CommonService.getRoleSettings().downloadUsersURL;

    const c = countInstanceId || 0;
    const b = boroughId || 0;
    const s = siteId || 0;

    window.open(`${path}?count_instance_id=${c}&borough_id=${b}&site_id=${s}`);
    // return fetch(path,
    //   {
    //     method: 'POST',
    //     headers: { "content-type": "application/json" },
    //     body: JSON.stringify({
    //       channel_name: channelName,
    //       event_name: eventName,
    //       count_instance_id: countInstanceId,
    //       borough_id: boroughId,
    //       site_id: siteId,
    //     })
    //   })
    //   .then(response => {
    //     if (!response.ok) {
    //       throw Error(response.statusText);
    //     }
    //     return response.json();
    //   });
  },
  getQueryType: (queryType) => {
    return `query A($contextAssignmentIds: [Int!]!, $types: [AssignmentTypeInput]!) {
                            assignmentGraph(contextAssignmentIds: $contextAssignmentIds, types: $types) {
                              assignments {
                                id
                                name
                                label
                                assignmentType
                                {
                                  id
                                  name
                                }
                                properties
                              }
                              assignmentRelations {
                                assignment1Id
                                assignment2Id
                              }
                            }
                          }`;
  },
  checkUserExists: (email) => {
    let path = CommonService.getRoleSettings().checkUser;
    return fetch(path,
      {
        method: 'POST',
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: email,
        })
      })
      .then(response => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response.json();
      });
  },
  getRegisteredUserEmails: () => {
    let path = CommonService.getRoleSettings().getUsers;
    return fetch(path,
      {
        method: 'GET',
        headers: {}
      })
      .then(response => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response.json();
      });
  },
  fetchTemplates: () => {
    let path = CommonService.getRoleSettings().fetchTemplates;
    return fetch(path,
      {
        method: 'GET',
        headers: {}
      })
      .then(response => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response.json();
      });
  },
  fetchUserSource: (id) => {
    let path = CommonService.getRoleSettings().fetchUserSource;
    return fetch(path+id,
      {
        method: 'GET',
        headers: {}
      })
      .then(response => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response.json();
      });
  },
  sendInvitationToUsers: (emailArray, file, isUploaded) => {
    let path = CommonService.getRoleSettings().sendInvitation;
    let formData = new FormData();
    formData.append('user_emails', emailArray);
    if (file&&file.length > 0 && file[0] instanceof File) {
      formData.append('file', file[0], file[0].name);
      isUploaded = true;
    }else{
      isUploaded = false;
    }
    formData.append('isUploaded', isUploaded);
    return fetch(path,
      {
        method: 'POST',
        //headers: { "content-type": "application/json" },
        body: formData
      })
      .then(response => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response.json();
      });
  },
  updateStatusEmailNotifications: (object) => {
    let path = CommonService.getRoleSettings().updateStatusEmailNotifications;
    return fetch(path,
      {
        method: 'POST',
        headers: { "content-type": "application/json" },
        body: JSON.stringify(object)
      })
      .then(response => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response.json();
      });
  },
  updateEmailNotification: (object,file) => {
    let  isUploaded = false;
    let path = CommonService.getRoleSettings().updateEmailNotification;
    let formData = new FormData();
    formData.append('emailObject',JSON.stringify(object));
    if (file&&file.length > 0 && file[0] instanceof File) {
      formData.append('file', file[0], file[0].name);
      isUploaded = true;
    }else{
      isUploaded = false;
    }
    formData.append('isUploaded', isUploaded);
    return fetch(path,
      {
        method: 'PUT',
       // headers: { "content-type": "application/json" },
       body: formData
      })
      .then(response => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response.json();
      });
  },
  addEmailNotification: (object,file) => {
    let  isUploaded = false;
    let path = CommonService.getRoleSettings().sendReminderEmail;
    let formData = new FormData();
    formData.append('emailObject', JSON.stringify(object));
    if (file&&file.length > 0 && file[0] instanceof File) {
      formData.append('file', file[0], file[0].name);
      isUploaded = true;
    }else{
      isUploaded = false;
    }
    formData.append('isUploaded', isUploaded);
    return fetch(path,
      {
        method: 'POST',
       // headers: { "content-type": "application/json" },
        body: formData
      })
      .then(response => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response.json();
      });
  },
  fetchNotificationFilteredUsers: (id) => {
    let path = CommonService.getRoleSettings().fetchNotificationFilteredUsers;
    return fetch(path+id,
      {
        method: 'GET',
        headers: {}
      })
      .then(response => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response.json();
      });
  },
  getEmailNotification: (id) => {
    let path = CommonService.getRoleSettings().listEmailNotifications;
    return fetch(path+id,
      {
        method: 'GET',
        headers: {}
      })
      .then(response => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response.json();
      });
  },
  deleteEmailNotification: (id) => {
    let path = CommonService.getRoleSettings().deleteEmailNotification;
    return fetch(path+id,
      {
        method: 'delete',
        headers: {}
      })
      .then(response => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response.json();
      });
  },
  listEmailNotifications: () => {
    let path = CommonService.getRoleSettings().listEmailNotifications;
    return fetch(path,
      {
        method: 'GET',
        headers: {}
      })
      .then(response => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response.json();
      });
  },
  getVolunteers: (qcinstances) => {
    let path = CommonService.getRoleSettings().fetchUserByQCI;
    return fetch(path+qcinstances,
      {
        method: 'GET',
        headers: {}
      })
      .then(response => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response.json();
      });
  },
  updateVolunteer: (object) => {
    let path = CommonService.getRoleSettings().updateVolunteer;
        return fetch(path,
      {
        method: 'POST',
        headers: { "content-type": "application/json" },
        body:JSON.stringify( object)
      })
      .then(response => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response.json();
      });
  },
  getLogin: (object) => {
    let path = API_URLs.getLogin;
        return fetch(path,
      {
        method: 'POST',
        headers: { "content-type": "application/json" },
        body:JSON.stringify( object)
      })
      .then(response => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response.json();
      });
  }
}


exports.CommonService = CommonService;
