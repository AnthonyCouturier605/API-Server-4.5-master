const server = "http://localhost:5000";
const apiBaseURL = server + "/api/images";

function HEAD(successCallBack, errorCallBack) {
  $.ajax({
    url: apiBaseURL,
    type: "HEAD",
    contentType: "text/plain",
    complete: (request) => {
      successCallBack(request.getResponseHeader("ETag"));
    },
    error: function (jqXHR) {
      errorCallBack(jqXHR.status);
    },
  });
}
function GET_ID(id, successCallBack, errorCallBack) {
  $.ajax({
    url: apiBaseURL + "/" + id,
    type: "GET",
    success: (data) => {
      successCallBack(data);
    },
    error: function (jqXHR) {
      errorCallBack(jqXHR.status);
    },
  });
}
function GET_ALL(successCallBack, errorCallBack, queryString = null) {
  let url = apiBaseURL + (queryString ? queryString : "");
  $.ajax({
    url: url,
    type: "GET",
    success: (data, status, xhr) => {
      successCallBack(data, xhr.getResponseHeader("ETag"));
    },
    error: function (jqXHR) {
      errorCallBack(jqXHR.status);
    },
  });
}
function POST(data, successCallBack, errorCallBack) {
  $.ajax({
    url: apiBaseURL,
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(data),
    headers: {
      authorization: "Bearer " + sessionStorage.getItem("token"),
    },
    success: (data) => {
      successCallBack(data);
    },
    error: function (jqXHR) {
      errorCallBack(jqXHR.status);
    },
  });
}
function PUT(bookmark, successCallBack, errorCallBack) {
  $.ajax({
    url: apiBaseURL + "/" + bookmark.Id,
    type: "PUT",
    contentType: "application/json",
    data: JSON.stringify(bookmark),
    headers: {
      authorization: "Bearer " + sessionStorage.getItem("token"),
    },
    success: () => {
      successCallBack();
    },
    error: function (jqXHR) {
      errorCallBack(jqXHR.status);
    },
  });
}
function DELETE(id, successCallBack, errorCallBack) {
  $.ajax({
    url: apiBaseURL + "/" + id,
    type: "DELETE",
    headers: {
      authorization: "Bearer " + sessionStorage.getItem("token"),
    },
    success: () => {
      successCallBack();
    },
    error: function (jqXHR) {
      errorCallBack(jqXHR.status);
    },
  });
}

//---USER MANAGEMENT--//
const controller = "/accounts";

function Register(data, successCallBack, errorCallBack) {
  $.ajax({
    url: server + controller + "/register",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(data),
    success: (data) => {
      successCallBack(data);
    },
    error: function (jqXHR) {
      errorCallBack(jqXHR.status);
    },
  });
}

function Verify(id, code, successCallBack, errorCallBack) {
  $.ajax({
    url: `${server}${controller}/verify?id=${id}&code=${code}`,
    type: "GET",
    success: (data) => {
      successCallBack(data);
    },
    error: function (jqXHR) {
      errorCallBack(jqXHR.status);
    },
  });
}

function Login(data, successCallBack, errorCallBack) {
  $.ajax({
    url: server + "/token",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(data),
    success: (data) => {
      successCallBack(data);
    },
    error: function (jqXHR) {
      errorCallBack(jqXHR.status);
    },
  });
}
///accounts/logout/id
function LogoutUser(id, successCallBack, errorCallBack) {
  $.ajax({
    url: `${server}${controller}/logout/${id}`,
    type: "GET",
    success: (data) => {
      successCallBack(data);
    },
    error: function (jqXHR) {
      errorCallBack(jqXHR.status);
    },
  });
}
function GETuser(id, successCallBack, errorCallBack) {
  $.ajax({
    url: server + controller + "/index/" + id,
    type: "GET",
    success: (data) => {
      PutUserInStorage(data);
      successCallBack(data);
    },
    error: function (jqXHR) {
      errorCallBack(jqXHR.status);
    },
  });
}
function PutUserInStorage(user) {
  sessionStorage.setItem("User", JSON.stringify(user));

  //si je les veux individuellement
  // sessionStorage.setItem("UserId", user.Id);
  // sessionStorage.setItem("UserName", user.Name);
  // sessionStorage.setItem("UserEmail", user.Email);
  // sessionStorage.setItem("UserPassword", user.Password);
  // sessionStorage.setItem("UserCreated", user.Created);
  // sessionStorage.setItem("UserVerifyCode", user.VerifyCode);
  // sessionStorage.setItem("UserAvatarGUID", user.AvatarGUID);
  // sessionStorage.setItem("UserAvatarURL", user.AvatarURL);
}
function RetrieveUserFromStorage() {
  //si je les veux individuellement
  // let user = {
  //   Id: sessionStorage.getItem("UserId"),
  //   Name: sessionStorage.getItem("UserName"),
  //   Email: sessionStorage.getItem("UserEmail"),
  //   Password: sessionStorage.getItem("UserPassword"),
  //   Created: sessionStorage.getItem("UserCreated"),
  //   VerifyCode: sessionStorage.getItem("UserVerifyCode"),
  //   AvatarGUID: sessionStorage.getItem("UserAvatarGUID"),
  //   AvatarURL: sessionStorage.getItem("UserAvatarURL"),
  // };
  let user = JSON.parse(sessionStorage.getItem("User"));
  return user;
}
function EraseUserFromStorage() {
  sessionStorage.removeItem("User");

  //si je les veux individuellement
  // sessionStorage.removeItem("UserId");
  // sessionStorage.removeItem("UserName");
  // sessionStorage.removeItem("UserEmail");
  // sessionStorage.removeItem("UserPassword");
  // sessionStorage.removeItem("UserCreated");
  // sessionStorage.removeItem("UserVerifyCode");
  // sessionStorage.removeItem("UserAvatarGUID");
  // sessionStorage.removeItem("UserAvatarURL");
}

function ModifyUser(data, successCallBack, errorCallBack) {
  $.ajax({
    url: `${server}${controller}/modify`,
    type: "PUT",
    contentType: "application/json",
    headers: {
      authorization: "Bearer " + sessionStorage.getItem("token"),
    },

    data: JSON.stringify(data),
    success: (data) => {
      successCallBack(data);
    },
    error: function (jqXHR) {
      errorCallBack(jqXHR.status);
    },
  });
}
function RemoveUser(id, successCallBack, errorCallBack){
  $.ajax({
    url: `${server}${controller}/remove/${id}`,
    type: "GET",
    headers: {
      authorization: "Bearer " + sessionStorage.getItem("token"),
    },
    success: (data) => {
      successCallBack(data);
    },
    error: function (jqXHR) {
      errorCallBack(jqXHR.status);
    },
  });
}

function GET_ALL_USERS(successCallBack, errorCallBack, queryString = null){
  let url = `${server}${controller}/${queryString}`;
  $.ajax({
    url: url,
    type: "GET",
    headers: {
      authorization: "Bearer " + sessionStorage.getItem("token"),
    },
    success: (data, status, xhr) => {
      successCallBack(data, xhr.getResponseHeader("ETag"));
    },
    error: function (jqXHR) {
      errorCallBack(jqXHR.status);
    },
  });
}