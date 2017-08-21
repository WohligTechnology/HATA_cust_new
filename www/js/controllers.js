angular.module('starter.controllers', ['starter.services'])

  .controller('AppCtrl', function ($scope, $stateParams, $state, $ionicPopover, $ionicSideMenuDelegate) {
    $scope.goBackHandler = function () {
      window.history.back(); //This works
    };
    $ionicPopover.fromTemplateUrl('templates/modal/terms.html', {
      scope: $scope,
      cssClass: 'menupop',

    }).then(function (terms) {
      $scope.terms = terms;
    });
    $scope.logout = function () {
      $.jStorage.set('profile', {});
      $.jStorage.flush();
      $state.go('landing');

    };
    $scope.closePopover = function () {
      $scope.terms.hide();
    };
    $scope.$on('$ionicView.enter', function () {
      $ionicSideMenuDelegate.canDragContent(false);
    });
    $scope.$on('$ionicView.leave', function () {
      $ionicSideMenuDelegate.canDragContent(true);
    });

  })
  .controller('LandingCtrl', function ($scope, $stateParams, $state) {
    if ($.jStorage.get('profile')) {
      $state.go('app.dashboard');
    }
  })
  .controller('VerifyCtrl', function ($scope, $stateParams) {})
  .controller('SignupCtrl', function ($scope, $stateParams, $state) {
    $scope.signupForm = {};
    $scope.saveUser = function (user) {
      console.log("in save", user);
      $.jStorage.set('profile', user);
      $state.go('app.browse');
    }
  })
  .controller('BrowseCtrl', function ($scope, $stateParams) {
    $scope.feaprods = [{
      bigImage: "img/feature.png"
    }, {
      bigImage: "img/feature.png"
    }, {
      bigImage: "img/feature.png"
    }];
    $scope.product = [{
      catImage: "img/20liter.jpeg",
      category: "20 Liter"
    }, {
      catImage: "img/1liter.jpeg",
      category: "20 Liter"
    }, {
      catImage: "img/500ml.jpeg",
      category: "500 ml"
    }, {
      catImage: "img/500ml.jpeg",
      category: "250 ml"
    }, {
      catImage: "img/others.jpeg",
      category: "Others"
    }];
    $scope.product = _.chunk($scope.product, 2);

  })
  .controller('BrowseMoreCtrl', function ($scope, $stateParams) {
    $scope.title = $stateParams.category;
    $scope.products = [{
      smallImage: "img/bisleriaquacan.png",
      name: "Aquafina",
      tag: "Purified water",
      price: "90"
    }, {
      smallImage: "img/greenbottle.png",
      name: "Bisleri",
      tag: "Purified water",
      price: "90"
    }, {
      smallImage: "img/bisleriaquacan.png",
      name: "Aquafina",
      tag: "Purified water",
      price: "90"
    }];
  })
  .controller('RequirementCtrl', function ($scope, $stateParams) {

    $scope.planArray = [{
      quantity: "10",
      price: "90",
      selected: false
    }, {
      quantity: "20",
      price: "90",
      selected: false
    }, {
      quantity: "30",
      price: "90",
      selected: false
    }, {
      quantity: "40",
      price: "90",
      selected: false
    }, {
      quantity: "50",
      price: "90",
      selected: false
    }, {
      quantity: "60",
      price: "90",
      selected: false
    }, {
      quantity: "70",
      price: "90",
      selected: false
    }];

    $scope.highlightPlan = function (index) {
      $scope.findQuantity = $scope.planArray[index].quantity;
      _.forEach($scope.planArray, function (value) {
        if (value.quantity == $scope.findQuantity) {
          value.selected = true;
        } else {
          value.selected = false;
        }
      });
    }
  })
  .controller('ReviewCtrl', function ($scope, $stateParams, $ionicPopup) {
    $scope.product = [{
      name: "Kinley 1L Carton",
      unit: "Carton",
      quantity: 10,
      price: 240,
      img: "img/1l_carton.jpeg",
      date: "14 March 2017",
      plan: false,
      id: 1
    }, {
      name: "Kinley 20L Jar",
      unit: "Jar",
      quantity: 30,
      price: 90,
      img: "img/20l_jar.jpeg",
      plan: true,
      id: 2
    }, {
      name: "Kinley 20L Jar",
      unit: "Jar",
      quantity: 4,
      price: 90,
      img: "img/20l_jar.jpeg",
      date: "14 March 2017",
      deposit: 150,
      plan: false,
      id: 3
    }];
    $scope.removeProduct = function (product) {
      $ionicPopup.alert({
        cssClass: 'removedpopup',
        title: '<img src="img/tick.png">',
        template: "Products Removed Successfully!"
      });
      _.remove($scope.product, function (n) {
        return n.id == product.id;
      });
    }
    $scope.getTotal = function () {
      var total = 0;
      _.forEach($scope.product, function (value) {
        total = total + (value.quantity * value.price);
      });
      return total;
    }
  })
  .controller('DeliveryCtrl', function ($scope, $stateParams) {})
  .controller('PaymentCtrl', function ($scope, $stateParams) {

    $scope.payment = [{
      name: "Credit Card",
      status: false
    }, {
      name: "Debit Card",
      status: false
    }, {
      name: "Net Banking",
      status: false
    }, {
      img: "img/Paytm_logo.png",
      status: false
    }, {
      name: "Other Wallets",
      status: false
    }, {
      name: "Cash On Delivery",
      status: false
    }];
    $scope.selectPayment = function (index) {
      $scope.findPayment = $scope.payment[index].name;
      _.forEach($scope.payment, function (value) {
        if (value.name == $scope.findPayment) {
          value.status = true;
        } else {
          value.status = false;
        }
      });
    }
  })
  .controller('ConfirmCtrl', function ($scope, $stateParams) {})
  .controller('OrderhistoryCtrl', function ($scope, $stateParams) {
    $scope.history = [{
      orderId: "#170631",
      product: [{
        quantity: 10,
        unit: "Carton",
        name: "Kinley 1L",
        plan: false
      }, {
        quantity: 30,
        unit: "Jar",
        name: "Kinley 20L",
        plan: true
      }],
      total: 5100,
      date: "13/04/17"
    }]
  })
  .controller('OrderDetailCtrl', function ($scope, $stateParams) {
    $scope.orderId = $stateParams.orderId;
    $scope.product = [{
      name: "Kinley 20L Jar",
      unit: "Jar",
      quantity: 30,
      price: 90,
      img: "img/20l_jar.jpeg",
      plan: true
    }, {
      name: "Kinley 1L Carton",
      unit: "Carton",
      quantity: 10,
      price: 240,
      img: "img/1l_carton.jpeg",
      date: "13/04/17",
      plan: false
    }];
  })
  .controller('DeliveryHistoryCtrl', function ($scope, $stateParams) {
    var jarBalance = 4;
    $scope.delivery = [{
      name: "Kinley 20L Jar",
      date: "February 21, 2017",
      unit: "Jar",
      QuantityDelivered: 2
    }, {
      name: "Kinley 20L Jar",
      date: "February 15, 2017",
      unit: "Jar",
      QuantityDelivered: 2
    }, {
      name: "Kinley 20L Jar",
      date: "February 13, 2017",
      unit: "Jar",
      productQuantity: 20
    }]
    _.forEachRight($scope.delivery, function (value) {

      if (value.productQuantity) {
        jarBalance = jarBalance + value.productQuantity;
        value.balance = jarBalance;

      } else {

        jarBalance = jarBalance - value.QuantityDelivered;
        value.balance = jarBalance;

      }

    });
  })
  .controller('DashboardCtrl', function ($scope, $window, $stateParams) {
    $scope.dasharray = [{
      name: "20L Kinley",
      unit: "Jar",
      balance: 40
    }, {
      name: "Kinley (1 Liter)",
      unit: "Carton",
      balance: 40
    }];
    $scope.flexwidth = $window.innerWidth - 45;

  })
  .controller('ScheduleCtrl', function ($scope, $window, $stateParams, MyServices, $filter) {
    $scope.productArray = [{
      name: '20L Kinley',
      quantity: 0,
      limit: 12,
      unit: 'Jar'
    }, {
      name: '1L Kinley',
      quantity: 0,
      limit: 20,
      unit: 'Carton'
    }]
    $scope.flexwidth = $window.innerWidth;
    $scope.CurrentDate = new Date();
    $scope.getDateArray = [];
    $scope.CurrentDay = new Date().getDay();
    console.log($scope.CurrentDay);
      for (var j = $scope.CurrentDay; j >= 1; j--) {
        $scope.getDateArray.push({
          date: new Date().setDate(new Date().getDate() - j),
          status: false,
          selected: false,
          available: false
        });
      }
    
    $scope.getDateArray.push({
      date: new Date().setDate(new Date().getDate()),
      status: true,
      selected: true,
      available: false

    });
    for (var i = 1; i <= 30; i++) {
      $scope.getDateArray.push({
        date: new Date().setDate(new Date().getDate() + i),
        status: true,
        selected: false,
        available: false
      });
    }
    $scope.getDateArray = _.chunk($scope.getDateArray, 7);
    $scope.user = {};
    $scope.user.pin = "400031";
    MyServices.getByPin($scope.user, function (data) {
      if (data.value) {
        $scope.pindays = data.data;
        _.forEach($scope.pindays.days, function (value) {
          _.forEach(_.flatten($scope.getDateArray), function (value1) {
            if ($filter('date')(value1.date, 'EEEE') == value) {
              console.log($filter('date')(value1.date, 'EEEE'), value);
              value1.available = true;
            }
          });
        });
        $scope.getDateArray = _.chunk($scope.getDateArray, 7);
        console.log("hellloassdasd", $scope.getDateArray);

      }

    });

    $scope.selectDate = function (date) {
      console.log("date", date);
      _.forEach(_.flatten($scope.getDateArray), function (value1) {
        _.forEach(value1, function (value) {
          if (value.date == date) {
            value.selected = true;
            console.log(value);
          } else {
            value.selected = false;
          }
        });
      });
    }
  })
  .controller('ThankyouCtrl', function ($scope, $stateParams) {})
  .controller('HelpCtrl', function ($scope, $stateParams) {})
  .controller('AccountCtrl', function ($scope, $stateParams) {});
