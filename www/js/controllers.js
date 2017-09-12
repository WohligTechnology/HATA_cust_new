angular.module('starter.controllers', ['starter.services'])

  .controller('AppCtrl', function ($scope, $stateParams, $state, $ionicPopover, $ionicSideMenuDelegate) {
    $scope.goBackHandler = function () {
      window.history.back(); //This works
    };

    $scope.logout = function () {
      $.jStorage.set('profile', {});
      $.jStorage.flush();
      $state.go('landing');

    };

    $scope.$on('$ionicView.enter', function () {
      $ionicSideMenuDelegate.canDragContent(false);
    });
    $scope.$on('$ionicView.leave', function () {
      $ionicSideMenuDelegate.canDragContent(false);
    });

  })
  .controller('LandingCtrl', function ($scope, $stateParams, $state) {
    if ($.jStorage.get('profile')) {
      $state.go('app.dashboard');
    }
  })
  .controller('VerifyCtrl', function ($scope, $stateParams, MyServices, $timeout, $ionicPopup, $state) {
    var mobileData = {};
    mobileData.mobile = $stateParams.mobNo;
    $scope.resend = false;
    MyServices.apiCallWithData('User/createUser', mobileData, function (data) {
      if (data.value) {
        $scope.getOtpData = data.data;
        $timeout(function () {
          $scope.resend = true;
        }, 10000);
      }
    });
    $scope.verifyOtp = function (otp) {
      var otpData = {};
      otpData.otp = otp;
      otpData.mobile = $stateParams.mobNo;
      otpData._id = $scope.getOtpData._id;
      MyServices.apiCallWithData('User/verifyOtp', otpData, function (data) {
        if (data.value) {
          $.jStorage.set('profile', data.data);
          $state.go('signup');
        } else {
          $ionicPopup.alert({
            title: "OTP verification failed",
            template: data.error
          });
        }
      });
    };
    $scope.resenOtp = function () {
      MyServices.apiCallWithData('User/sendOtp', mobileData, function (data) {
        if (data.value) {
          $scope.getOtpData = data.data;
          $timeout(function () {
            $scope.resend = true;
          }, 10000);
        }
      });
    };
  })
  .controller('SignupCtrl', function ($scope, $stateParams, $state, $ionicPopover, $ionicPopup, MyServices) {
    $ionicPopover.fromTemplateUrl('templates/modal/terms.html', {
      scope: $scope,
      cssClass: 'menupop',

    }).then(function (terms) {
      $scope.terms = terms;
    });
    $scope.closePopover = function () {
      $scope.terms.hide();
    };
    $scope.userType = {
      'Household': 'Household',
      'Corporate': 'Corporate',
      'Other': 'Other'
    };
    $scope.signupForm = {};
    $scope.lockData = false;
    $scope.getUserData = function () {
      if ($.jStorage.get('profile')._id) {
        if ($.jStorage.get('profile').pincode) {
          $scope.lockData = true;
        }
        var userData = {};
        userData._id = $.jStorage.get('profile')._id;
        MyServices.apiCallWithData('User/getOne', userData, function (data) {
          if (data.value) {
            $scope.signupForm = data.data;
            _.forEach($scope.signupForm.mobile, function (value) {
              if (value.accessLevel == 'Registered Mobile') {
                $scope.signupForm.registerMobile = value.mobileNo;
              }
            });
          }
        });
      }
    };

    $scope.getUserData();
    $scope.saveUser = function () {
      _.forEach($scope.signupForm.mobile, function (value) {
        if (value.accessLevel == 'Registered Mobile') {
          value.mobileNo = $scope.signupForm.registerMobile;
          value.name = $scope.signupForm.name;
        }
      });
      MyServices.apiCallWithData('User/saveUserData', $scope.signupForm, function (data) {
        if (data.value) {
          $scope.signupForm = data.data;
          $scope.getUserData();
          var pinData = {
            pinCode: $scope.signupForm.pinCode
          };
          MyServices.apiCallWithData("pincode/checkPinCode", pinData, function (data) {
            if (data.value) {
              var userInfo = {};
              userInfo = $.jStorage.get('profile');
              userInfo.pincode = data.data[0].pincode;
              $.jStorage.set('profile', userInfo);
              $state.go('app.browse');
            } else {
              $ionicPopup.alert({
                title: "Pincode Error",
                template: "We dont deliver to your pin-code."
              });
              $scope.getUserData();
            }
          });

        }
      });
    };

  })
  .controller('BrowseCtrl', function ($scope, $stateParams, MyServices) {
    // home slider start
    $scope.sliderData = {};
    var setupSlider = function () {
      //some options to pass to our slider
      $scope.sliderData.sliderOptions = {
        initialSlide: 0,
        direction: 'horizontal', //or vertical
        speed: 300, //0.3s transition
        autoplay: 5000
      };

      //create delegate reference to link with slider
      $scope.sliderData.sliderDelegate = null;
      //watch our sliderDelegate reference, and use it when it becomes available
      $scope.$watch('data.sliderDelegate', function (newVal, oldVal) {
        if (newVal != null) {
          $scope.sliderData.sliderDelegate.on('slideChangeEnd', function () {
            $scope.sliderData.currentPage = $scope.sliderData.sliderDelegate.activeIndex;
            //use $scope.$apply() to refresh any content external to the slider
            $scope.$apply();
          });
        }
      });
    };

    setupSlider();

    // get all Featured Product Api 
    MyServices.apiCallWithoutData('Product/getAllFeaturedProduct', function (data) {
      if (data.value) {
        $scope.sliderData.allFeaturedProduct = data.data;
      }
    });
    // home slider end
    MyServices.apiCallWithoutData('Subcategory/getAll', function (data) {
      if (data.value) {
        $scope.allSubcategory = data.data;
        $scope.allSubcategory = _.chunk($scope.allSubcategory, 2);
      }
    });
    var userData = {};
    userData._id = $.jStorage.get('profile')._id;
    MyServices.apiCallWithData("user/getCartForCustomer", userData, function (data) {
      if (data.value) {
        $scope.cartData = data.data.cart;
      }
    });


  })
  .controller('BrowseMoreCtrl', function ($scope, $stateParams, MyServices) {

    $scope.categoryData = {};
    $scope.categoryData.category = $stateParams.catId;
    MyServices.apiCallWithData('Product/getAllProductbyCategory', $scope.categoryData, function (data) {
      if (data.value) {
        $scope.products = data.data;
      }
    });
  })
  .controller('RequirementCtrl', function ($scope, $stateParams, MyServices, $ionicPopup, $state) {
    $scope.productData = {};

    $scope.productData._id = $stateParams.productId;
    $scope.userInfo = $.jStorage.get('profile');
    MyServices.apiCallWithData('Product/getOne', $scope.productData, function (data) {
      $scope.require = false;
      if (data.value) {
        $scope.product = data.data;
        $scope.toggleCard();
      }
    });
    $scope.toggleCard = function () {
      $scope.require = !$scope.require;
      $scope.activePlan = null;
      _.forEach($scope.product.plans, function (value) {
        value.selected = false;
      });

    }
    $scope.highlightPlan = function (index) {
      $scope.findQuantity = $scope.product.plans[index].quantity;
      _.forEach($scope.product.plans, function (value) {
        if (value.quantity == $scope.findQuantity) {
          $scope.activePlan = {};
          $scope.activePlan.plan = value;
          value.selected = true;
        } else {
          value.selected = false;
        }
      });
    }
    $scope.getQuantity = function (index, quantity) {
      $scope.activePlan = {};
      $scope.activePlan.quantity = quantity;
      $scope.activePlan.plan = 'One Time';
    }
    $scope.addToCart = function (data) {
      var warehouseQuantity = {};
      warehouseQuantity.product = $scope.product;
      warehouseQuantity.product.plan = data.plan;
      warehouseQuantity.pinCode = $scope.userInfo.pincode;
      if ($scope.userInfo.warehouseId) {
        warehouseQuantity.warehouseId = $scope.warehouseId;
      }

      if (data.plan == 'One Time') {
        warehouseQuantity.product.quantity = data.quantity;
      } else {
        // if (typeof data.plan == 'string') {
        //   data.plan = JSON.parse(data.plan);
        // }
        warehouseQuantity.product.quantity = data.plan.quantity;
      }
      MyServices.apiCallWithData("warehouse/checkProductAvailability", warehouseQuantity, function (warehouseData) {
        if (warehouseData.value) {
          if (warehouseData.data) {

            $scope.userInfo.warehouseId = warehouseData.data._id;
            $scope.userInfo = $.jStorage.set('profile', $scope.userInfo);
          }
          var cartData = {};
          cartData._id = $scope.userInfo._id;
          cartData.productId = $stateParams.productId;
          cartData.plan = $scope.activePlan.plan;
          if (cartData.plan.selected) {
            delete cartData.plan.selected;
          }
          if ($scope.activePlan.quantity) {
            cartData.quantity = $scope.activePlan.quantity;
          }
          MyServices.apiCallWithData("user/addUpdateCart", cartData, function (cartResponse) {
            if (cartResponse.value) {
              $state.go('app.review');
            } else {
              $ionicPopup.alert({
                title: "Failed",
                template: 'error occure in add to cart'
              });
            }

          });

        } else {
          $ionicPopup.alert({
            title: "Failed",
            template: warehouseData.error
          });
        }
      });

    };
  })
  .controller('ReviewCtrl', function ($scope, $stateParams, $ionicPopup, MyServices) {
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
    var userData = {};
    userData._id = $.jStorage.get('profile')._id;
    MyServices.apiCallWithData("user/getCartForCustomer", userData, function (data) {
      if (data.value) {
        $scope.cartData = data.data.cart;
        $scope.getTotal();
      }
    });


    $scope.removeProduct = function (cart) {
      userData.cartId = cart._id;
      MyServices.apiCallWithData("user/deleteFromCart", userData, function (data) {
        if (data.value) {
          $scope.cartData = data.data.cart;
          $scope.getTotal();
          $ionicPopup.alert({
            cssClass: 'removedpopup',
            title: '<img src="img/tick.png">',
            template: "Products Removed Successfully!"
          });
        } else {
          $ionicPopup.alert({
            cssClass: 'productspopup',
            title: '<img src="img/linkexpire.png">',
            template: "Error Occured while Removing Products to Cart"
          });
        }
      });
    }
    $scope.getTotal = function () {
      $scope.total = 0;
      _.forEach($scope.cartData, function (value) {
        if (value.plan == 'One Time') {
          $scope.total = $scope.total + (value.quantity * value.productId.price);
        } else {
          $scope.total = $scope.total + (value.plan.quantity * value.plan.price);
        }
      });
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
