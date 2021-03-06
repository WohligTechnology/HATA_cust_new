var adminurl = "https://backend.freshflow.in/api/"; //main server
//also uncommented live razor payement id
// var adminurl = "http://staging.freshflow.in/api/"; //staging server
// var adminurl = "http://wohlig.io/api/"; //local server
// var adminurl = "http://192.168.1.14:80/api/"; //local server
var imgurl = adminurl + "upload/";
var imgpath = imgurl + "readFile?file=";
// var uploadurl = imgurl;
angular.module('starter.services', [])
  .factory('MyServices', function ($http, $ionicLoading, $timeout, $ionicPopup) {

    return {
      setIp: function (ip) {
        adminurl = ip + '/api/';
      },
      apiCallWithData: function (url, formData, callback) {
        if (!formData.noLoader) {
          $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
          });
        }
        delete formData.noLoader;
        $http.post(adminurl + url, formData).then(function (data) {
          if (data) {
            if (!formData.noLoader) {
              $ionicLoading.hide();
            }
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
      paytmData: function (formData, callback) {
        console.log(formData);
        $ionicLoading.show({
          content: 'Loading',
          animation: 'fade-in',
          showBackdrop: true,
          maxWidth: 200,
          showDelay: 0
        });
        // http://192.168.1.14:3000/paytm/generate_checksum
        $http.post("https://backend.freshflow.in/paytm/generate_checksum", formData).then(function (data) {
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
