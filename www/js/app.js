// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'angular-flexslider'])

  .run(function ($ionicPlatform, $state, $ionicPopup) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

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
    });
    $ionicPlatform.registerBackButtonAction(function (event) {
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
    }, 100);

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
      .state('app.browse-more', {
        cache: false,
        url: '/browse-more/:catId',
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
