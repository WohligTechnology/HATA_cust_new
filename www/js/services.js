// var adminurl = "https://freshflow.wohlig.co.in/api/"; //test server
// var adminurl = "http://wohlig.io/api/"; //server
var adminurl = "http://192.168.1.21:80/api/"; //server
// var imgpath = adminurl + "uploadfile/getupload?file=";
var imgurl = adminurl + "upload/";
var imgpath = imgurl + "readFile?file=";
// var uploadurl = imgurl;
angular.module('starter.services', [])
  .factory('MyServices', function ($http, $ionicLoading, $timeout, $ionicPopup) {

    return {

      apiCallWithData: function (url, formData, callback) {
        $ionicLoading.show({
          content: 'Loading',
          animation: 'fade-in',
          showBackdrop: true,
          maxWidth: 200,
          showDelay: 0
        });

        $http.post(adminurl + url, formData).then(function (data) {
          if (data) {
            $ionicLoading.hide();
            data = data.data;
            callback(data);
          }

        }, function errorCallback(response) {
          $ionicLoading.hide();
          $ionicLoading.show({
            template: 'Something went wrong',
            noBackdrop: true,
            duration: 2000
          });
        });
      },

      apiCallWithoutData: function (url, callback) {
        $ionicLoading.show({
          content: 'Loading',
          animation: 'fade-in',
          showBackdrop: true,
          maxWidth: 200,
          showDelay: 0
        });
        $http.post(adminurl + url).then(function (data) {
          if (data) {
            $ionicLoading.hide();
            data = data.data;
            callback(data);
          }

        }, function errorCallback(response) {
          $ionicLoading.hide();
          $ionicLoading.show({
            template: 'Something went wrong',
            noBackdrop: true,
            duration: 2000
          });
        });
      },

      getUserData: function (callback) {
        if ($.jStorage.get('profile')) {
          $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
          });
          var userData = {};
          userData._id = $.jStorage.get('profile')._id;
          $http.post(adminurl + 'User/getOne', userData).then(function (data) {
            data = data.data;
            $ionicLoading.hide();
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
          }, function errorCallback(response) {
            $ionicLoading.hide();
            $ionicLoading.show({
              template: 'Something went wrong',
              noBackdrop: true,
              duration: 2000
            });
          });
        } else {
          $ionicLoading.show({
            template: 'Something went wrong',
            noBackdrop: true,
            duration: 2000
          });
        }
      },



    };
  });
