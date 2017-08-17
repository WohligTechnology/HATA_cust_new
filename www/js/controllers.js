angular.module('starter.controllers', ['starter.services'])

.controller('AppCtrl', function($scope, $stateParams, $ionicPopover, $ionicSideMenuDelegate) {
    $scope.goBackHandler = function() {
      window.history.back(); //This works
    };
    $ionicPopover.fromTemplateUrl('templates/modal/terms.html', {
      scope: $scope,
      cssClass: 'menupop',

    }).then(function(terms) {
      $scope.terms = terms;
    });

    $scope.closePopover = function() {
      $scope.terms.hide();
    };
    $scope.$on('$ionicView.enter', function() {
      $ionicSideMenuDelegate.canDragContent(false);
    });
    $scope.$on('$ionicView.leave', function() {
      $ionicSideMenuDelegate.canDragContent(true);
    });
  })
  .controller('LandingCtrl', function($scope, $stateParams) {})
  .controller('VerifyCtrl', function($scope, $stateParams) {})
  .controller('SignupCtrl', function($scope, $stateParams) {})
  .controller('BrowseCtrl', function($scope, $stateParams) {
    $scope.feaprods = [{
      bigImage: "../img/feature.png"
    }, {
      bigImage: "../img/feature.png"
    }, {
      bigImage: "../img/feature.png"
    }];
    $scope.product = [{
      catImage: "../img/20liter.jpeg",
      category: "20 Liter"
    }, {
      catImage: "../img/1liter.jpeg",
      category: "20 Liter"
    }, {
      catImage: "../img/500ml.jpeg",
      category: "500 ml"
    }, {
      catImage: "../img/500ml.jpeg",
      category: "250 ml"
    }, {
      catImage: "../img/others.jpeg",
      category: "Others"
    }];
    $scope.product = _.chunk($scope.product, 2);

  })
  .controller('BrowseMoreCtrl', function($scope, $stateParams) {
    $scope.title = $stateParams.category;
    $scope.products = [{
      smallImage: "./img/bisleriaquacan.png",
      name: "Aquafina",
      tag: "Purified water",
      price: "90"
    }, {
      smallImage: "./img/greenbottle.png",
      name: "Bisleri",
      tag: "Purified water",
      price: "90"
    }, {
      smallImage: "./img/bisleriaquacan.png",
      name: "Aquafina",
      tag: "Purified water",
      price: "90"
    }];
  })
  .controller('RequirementCtrl', function($scope, $stateParams) {

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

    $scope.highlightPlan = function(index) {
      $scope.findQuantity = $scope.planArray[index].quantity;
      _.forEach($scope.planArray, function(value) {
        if (value.quantity == $scope.findQuantity) {
          value.selected = true;
        } else {
          value.selected = false;
        }
      });
    }
  })
  .controller('ReviewCtrl', function($scope, $stateParams) {
    $scope.product = [{
      name: "Kinley 1L Carton",
      unit: "Carton",
      quantity: 10,
      price: 240,
      img: "../img/1l_carton.jpeg",
      date: "14 March 2017",
      plan: false
    }, {
      name: "Kinley 20L Jar",
      unit: "Jar",
      quantity: 30,
      price: 90,
      img: "../img/20l_jar.jpeg",
      plan: true
    }, {
      name: "Kinley 20L Jar",
      unit: "Jar",
      quantity: 4,
      price: 90,
      img: "../img/20l_jar.jpeg",
      date: "14 March 2017",
      deposit: 150,
      plan: false
    }];
  })
  .controller('DeliveryCtrl', function($scope, $stateParams) {})
  .controller('PaymentCtrl', function($scope, $stateParams) {

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
      img: "../img/Paytm_logo.png",
      status: false
    }, {
      name: "Other Wallets",
      status: false
    }, {
      name: "Cash On Delivery",
      status: false
    }];
    $scope.selectPayment = function(index) {
      $scope.findPayment = $scope.payment[index].name;
      _.forEach($scope.payment, function(value) {
        if (value.name == $scope.findPayment) {
          value.status = true;
        } else {
          value.status = false;
        }
      });
    }
  })
  .controller('ConfirmCtrl', function($scope, $stateParams) {})
  .controller('OrderhistoryCtrl', function($scope, $stateParams) {
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
  .controller('OrderDetailCtrl', function($scope, $stateParams) {
    $scope.orderId = $stateParams.orderId;
    $scope.product = [{
      name: "Kinley 20L Jar",
      unit: "Jar",
      quantity: 30,
      price: 90,
      img: "../img/20l_jar.jpeg",
      plan: true
    }, {
      name: "Kinley 1L Carton",
      unit: "Carton",
      quantity: 10,
      price: 240,
      img: "../img/1l_carton.jpeg",
      date: "13/04/17",
      plan: false
    }];
  })
  .controller('DeliveryHistoryCtrl', function($scope, $stateParams) {
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
    _.forEachRight($scope.delivery, function(value) {

      if (value.productQuantity) {
        jarBalance = jarBalance + value.productQuantity;
        value.balance = jarBalance;

      } else {

        jarBalance = jarBalance - value.QuantityDelivered;
        value.balance = jarBalance;

      }

    });
  })
  .controller('DashboardCtrl', function($scope, $window, $stateParams) {
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
  .controller('ScheduleCtrl', function($scope, $window,$stateParams) {
    $scope.flexwidth = $window.innerWidth;
    $scope.CurrentDate = new Date();
    $scope.getDateArry = [];
    for (var i = 1; i <= 30; i++) {
      $scope.newDate=$scope.CurrentDate.setDate($scope.CurrentDate.getDate() + 1);
      if(new Date($scope.newDate).getDay!=0){
        $scope.getDateArry.push($scope.newDate);
      }
    }
    $scope.getDateArry = _.chunk($scope.getDateArry, 7);
    console.log("$scope.getDateArry",$scope.getDateArry);
  })
  .controller('ThankyouCtrl', function($scope, $stateParams) {})
  .controller('HelpCtrl', function($scope, $stateParams) {})
  .controller('AccountCtrl', function($scope, $stateParams) {});
