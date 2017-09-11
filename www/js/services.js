// var adminurl = "http://htbttesting.wohlig.co.in/api/"; //test server
var adminurl = "http://wohlig.io/api/"; //server
// var adminurl = "http://192.168.2.21:1337/api/"; //server
// var imgpath = adminurl + "uploadfile/getupload?file=";
var imgurl = adminurl + "upload/";
var imgpath = imgurl + "readFile?file=";
// var uploadurl = imgurl;
angular.module('starter.services', [])
  .factory('MyServices', function ($http) {

    return {
      getByPin: function (data, callback) {
        $http({
          url: adminurl + 'Pincode/getByPin',
          method: 'POST',
          withCredentials: true,
          data: data
        }).success(callback);
      },

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

    };
  });
