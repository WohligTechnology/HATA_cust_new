// var adminurl = "http://htbttesting.wohlig.co.in/api/"; //test server
var adminurl = "http://wohlig.io/api/"; //server
// var adminurl = "http://192.168.1.21:80/api/"; //server
// var imgpath = adminurl + "uploadfile/getupload?file=";
var imgurl = adminurl + "upload/";
var imgpath = imgurl + "readFile?file=";
// var uploadurl = imgurl;
angular.module('starter.services', [])
  .factory('MyServices', function ($http) {

    return {

      apiCallWithData: function (url, formData, callback) {
        $http.post(adminurl + url, formData).then(function (data) {
          data = data.data;
          callback(data);
        });
      },

      apiCallWithoutData: function (url, callback) {
        $http.post(adminurl + url).then(function (data) {
          data = data.data;
          callback(data);
        });
      },

      getUserData: function (callback) {
        var userData = {};
        userData._id = $.jStorage.get('profile')._id;
        $http.post(adminurl + 'User/getOne', userData).then(function (data) {
          data = data.data;
          if (data.value) {
            _.forEach(data.data.mobile, function (value) {
              if (value.accessLevel == 'Registered Mobile') {
                data.data.registerMobile = value.mobileNo;
                callback(data);
              } else {
                callback(data);
              }
            });
          }
        });
      },


    };
  });
