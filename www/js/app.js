// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'angular-flexslider'])

  .run(function ($ionicPlatform, $state, $ionicHistory, $rootScope, $ionicPopup, $cordovaAppVersion, MyServices) {
    $ionicPlatform.ready(function () {
      $rootScope.appclose = false;
      $ionicPlatform.registerBackButtonAction(function (event) {
        if ($rootScope.appclose) {
          navigator.app.exitApp();
        }
        if ($.jStorage.get('profile')) {
          if (($state.current.name == "app.browse" || $state.current.name == "app.dashboard") && $.jStorage.get('profile').pincode) {
            navigator.app.exitApp();
          } else {
            if ($state.current.name == "signup") {
              navigator.app.exitApp();
            } else {
              window.history.back();
            }
          }
          if ($state.current.name == "app.thankyou" && $state.current.name == "app.confirm") {
            //no back or exit on this
          }
        } else {
          if ($state.current.name == "landing") {
            navigator.app.exitApp();
          } else {
            window.history.back();
          }
        }
      }, 402);
      //for ios

      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        // cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }

      if (window.Connection) {
        if (navigator.connection.type == Connection.NONE) {
          $ionicPopup.confirm({
              title: "Internet Disconnected",
              content: "The internet is disconnected on your device."
            })
            .then(function (result) {
              if (!result) {
                ionic.Platform.exitApp();
              }
            });
        }
      }
      if (window.plugins) {
        if (window.plugins.OneSignal) {
          var notificationOpenedCallback = function (jsonData) {
            console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
          };

          window.plugins.OneSignal
            .startInit("1aea8525-9a6b-4900-91c0-b9dfda016e11")
            .handleNotificationOpened(notificationOpenedCallback)
            .endInit();

          window.plugins.OneSignal.getIds(function (ids) {
            console.log('getIds: ' + JSON.stringify(ids));
            // $rootScope.$broadcast('proximityCatched', null);
            $rootScope.deviceId = ids.userId;
            if ($.jStorage.get('profile')) {
              var userRequest = {
                _id: $.jStorage.get('profile')._id
              };
              MyServices.apiCallWithData('user/getOne', userRequest, function (data) {
                if (data.value) {
                  var userData = data.data;
                  _.forEach(userData.mobile, function (value) {
                    if (value.mobileNo == $.jStorage.get('profile').mobile) {
                      value.deviceId = ids.userId;
                    }
                  });
                  MyServices.apiCallWithData('User/saveUserData', userData, function (userResponse) {
                    if (userResponse.value) {
                      console.log("got deviceId");
                    }
                  });
                }
              });
            }

          });
        }
      };
    });
    document.addEventListener("deviceready", function () {

      $cordovaAppVersion.getVersionNumber().then(function (version) {
        var appVersion = version.split('.');
        var deregisterBackButton;
        console.log(appVersion);
        MyServices.apiCallWithoutData('AppVersion/getAppVersions', function (data) {
          if (data.value) {
            var versionData = data.data;
            if (ionic.Platform.isIOS()) {
              var iosVersion = versionData.iosVersion.split('.');
              if (parseInt(iosVersion[0]) > parseInt(appVersion[0]) || parseInt(iosVersion[1]) > parseInt(appVersion[1]) || parseInt(iosVersion[2]) > parseInt(appVersion[2])) {
                if (versionData.iosCritical || parseInt(iosVersion[0]) > parseInt(appVersion[0])) {
                  $rootScope.appclose = true;
                }
                var versionPopupIos = $ionicPopup.alert({
                  cssClass: 'removedpopup',
                  title: '<img src="img/warning.png">',
                  template: "Hi! We've got many new features for you on the new, improved version of the Freshflow App. Upgrade Today!",
                  buttons: [{
                      text: 'Update Now',
                      cssClass: 'leaveApp',
                      onTap: function (e) {
                        e.preventDefault();
                        var ref = window.cordova.InAppBrowser.open(
                          versionData.iosUrl,
                          "_blank",
                          "hidden=no,location=no,clearsessioncache=yes,clearcache=yes,hardwareback=no"
                        );
                      }
                    },
                    {
                      text: 'Update Later',
                      type: 'button-positive',
                      onTap: function (e) {
                        if (versionData.iosCritical || parseInt(iosVersion[0]) > parseInt(appVersion[0])) {
                          ionic.Platform.exitApp();
                        } else {
                          versionPopupIos.close();
                        }
                      }
                    }
                  ]
                });
                versionPopupIos.then(function (res) {})

              }
            }
            if (ionic.Platform.isAndroid()) {
              var androidVersion = versionData.androidVersion.split('.');
              if (parseInt(androidVersion[0]) > parseInt(appVersion[0]) || parseInt(androidVersion[1]) > parseInt(appVersion[1]) || parseInt(androidVersion[2]) > parseInt(appVersion[2])) {
                if (versionData.androidCritical || parseInt(androidVersion[0]) > parseInt(appVersion[0])) {
                  $rootScope.appclose = true;
                }
                var versionPopupAndroid = $ionicPopup.alert({
                  cssClass: 'removedpopup',
                  title: '<img src="img/warning.png">',
                  template: "Hi! We've got many new features for you on the new, improved version of the Freshflow App. Upgrade Today!",
                  buttons: [{
                      text: 'Update Now',
                      cssClass: 'leaveApp',
                      onTap: function (e) {
                        e.preventDefault();
                        var ref = window.cordova.InAppBrowser.open(
                          versionData.androidUrl,
                          "_blank",
                          "hidden=no,location=no,clearsessioncache=yes,clearcache=yes,hardwareback=no"
                        );
                      }
                    },
                    {
                      text: 'Update Later',
                      type: 'button-positive',
                      onTap: function (e) {
                        if (versionData.androidCritical || parseInt(androidVersion[0]) > parseInt(appVersion[0])) {
                          ionic.Platform.exitApp();
                        } else {}
                      }
                    }
                  ]
                });
                versionPopupAndroid.then(function (res) {})
              }
            }

          }

        });
      });
      // $cordovaAppVersion.getVersionCode().then(function (build) {
      //   var appBuild = build;
      //   console.log(appBuild);
      // });


      // $cordovaAppVersion.getAppName().then(function (name) {
      //   var appName = name;
      // });


      // $cordovaAppVersion.getPackageName().then(function (package) {
      //   var appPackage = package;
      // });
    }, false);





  })

  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider

      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
      })


      .state('landing', {
        cache: false,
        url: '/landing',
        templateUrl: 'templates/landing.html',
        controller: 'LandingCtrl'
      })
      .state('verify', {
        cache: false,
        url: '/verify/:mobNo',
        templateUrl: 'templates/verify.html',
        controller: 'VerifyCtrl'
      })
      .state('signup', {
        cache: false,
        url: '/signup',
        templateUrl: 'templates/signup.html',
        controller: 'SignupCtrl'
      })
      .state('app.browse', {
        cache: false,
        url: '/browse',
        views: {
          'menuContent': {
            templateUrl: 'templates/browse.html',
            controller: 'BrowseCtrl'
          }
        }
      })
      .state('app.subCategory', {
        cache: false,
        url: '/subCategory/:category',
        views: {
          'menuContent': {
            templateUrl: 'templates/subCategory.html',
            controller: 'SubCategoryCtrl'
          }
        }
      })
      .state('app.browse-more', {
        cache: false,
        url: '/browse-more/:subCategory',
        views: {
          'menuContent': {
            templateUrl: 'templates/browse-more.html',
            controller: 'BrowseMoreCtrl'
          }
        }
      })
      .state('app.requirement', {
        cache: false,
        url: '/requirement/:productId',
        views: {
          'menuContent': {
            templateUrl: 'templates/requirement.html',
            controller: 'RequirementCtrl'
          }
        }
      })
      .state('app.review', {
        cache: false,
        url: '/review',
        views: {
          'menuContent': {
            templateUrl: 'templates/review.html',
            controller: 'ReviewCtrl'
          }
        }
      })
      .state('app.delivery', {
        cache: false,
        url: '/delivery',
        views: {
          'menuContent': {
            templateUrl: 'templates/delivery.html',
            controller: 'DeliveryCtrl'
          }
        }
      })
      .state('app.payment', {
        cache: false,
        url: '/payment/:total',
        views: {
          'menuContent': {
            templateUrl: 'templates/payment.html',
            controller: 'PaymentCtrl'
          }
        }
      })
      .state('app.confirm', {
        cache: false,
        url: '/confirm',
        views: {
          'menuContent': {
            templateUrl: 'templates/confirm.html',
            controller: 'ConfirmCtrl'
          }
        }
      })
      .state('app.orderhistory', {
        cache: false,
        url: '/orderhistory',
        views: {
          'menuContent': {
            templateUrl: 'templates/orderhistory.html',
            controller: 'OrderhistoryCtrl'
          }
        }
      })
      .state('app.order-detail', {
        cache: false,
        url: '/order-detail/:orderId',
        views: {
          'menuContent': {
            templateUrl: 'templates/order-detail.html',
            controller: 'OrderDetailCtrl'
          }
        }
      })
      .state('app.deliveryhistory', {
        cache: false,
        url: '/deliveryhistory/:productId',
        views: {
          'menuContent': {
            templateUrl: 'templates/deliveryhistory.html',
            controller: 'DeliveryHistoryCtrl'
          }
        }
      })
      .state('app.dashboard', {
        cache: false,
        url: '/dashboard',
        views: {
          'menuContent': {
            templateUrl: 'templates/dashboard.html',
            controller: 'DashboardCtrl'
          }
        }
      })
      .state('app.schedule', {
        url: '/schedule/:productId',
        cache: false,
        views: {
          'menuContent': {
            templateUrl: 'templates/schedule.html',
            controller: 'ScheduleCtrl'
          }
        }
      })
      .state('app.thankyou', {
        cache: false,
        url: '/thankyou/:productId',
        views: {
          'menuContent': {
            templateUrl: 'templates/thankyou.html',
            controller: 'ThankyouCtrl'
          }
        }
      })
      .state('app.help', {
        cache: false,
        url: '/help',
        views: {
          'menuContent': {
            templateUrl: 'templates/help.html',
            controller: 'HelpCtrl'
          }
        }
      })
      .state('app.account', {
        cache: false,
        url: '/account',
        views: {
          'menuContent': {
            templateUrl: 'templates/account.html',
            controller: 'AccountCtrl'
          }
        }
      })
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/landing');
  })
  .directive('focusMe', function ($timeout) {
    return {
      link: function (scope, element, attrs) {
        function inputValue(val) {
          if (val) {
            $timeout(function () {
              element[0].focus();
            });
          }
        }

      }
    };
  })

  .directive('onlyDigits', function () {
    return {
      require: 'ngModel',
      restrict: 'A',
      link: function (scope, element, attr, ctrl) {
        var digits;

        function inputValue(val) {
          if (val) {
            if (attr.type == "tel") {
              digits = val.replace(/[^0-9\+\\]/g, '');
            } else {
              digits = val.replace(/[^0-9\-\\]/g, '');
            }


            if (digits !== val) {
              ctrl.$setViewValue(digits);
              ctrl.$render();
            }
            return parseInt(digits, 10);
          }
          return undefined;
        }
        ctrl.$parsers.push(inputValue);
      }
    };
  })

  .filter('uploadpath', function () {
    return function (input, width, height, style) {
      var other = "";
      if (width && width != "") {
        other += "&width=" + width;
      }
      if (height && height != "") {
        other += "&height=" + height;
      }
      if (style && style != "") {
        other += "&style=" + style;
      }
      if (input) {
        if (input.indexOf('https://') == -1) {
          return imgpath + input + other;

        } else {
          return input;
        }
      }
    }

  })

  .filter('rangecal', function () {
    return function (input, total) {
      total = parseInt(total);

      for (var i = 0; i < total; i++) {
        input.push(i);
      }

      return input;
    };
  })

  .directive("limitTo", [function () {
    return {
      restrict: "A",
      link: function (scope, elem, attrs) {
        var limit = parseInt(attrs.limitTo);
        angular.element(elem).on("keypress", function (e) {
          if (this.value.length == limit) e.preventDefault();
        });
      }
    }
  }]);
