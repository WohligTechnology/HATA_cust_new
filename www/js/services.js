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
      getAllSubcategory: function (callback) {
        $http({
          url: adminurl + 'Subcategory/getAll',
          method: 'POST',
          withCredentials: true
        }).success(callback);
      },
      getAllFeaturedProduct: function (callback) {
        $http({
          url: adminurl + 'Product/getAllFeaturedProduct',
          method: 'POST',
          withCredentials: true
        }).success(callback);
      },
      getAllProductbyCategory: function (data, callback) {
        console.log(data);
        $http({
          url: adminurl + 'Product/getAllProductbyCategory',
          method: 'POST',
          withCredentials: true,
          data: data
        }).success(callback);
      }

    };
  });
