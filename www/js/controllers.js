angular.module('starter.controllers', ['starter.services', 'ngCordova'])

  .controller('AppCtrl', function ($scope, $stateParams, $state, $ionicPopover, $ionicSideMenuDelegate, MyServices) {
    $scope.goBackHandler = function () {
      window.history.back(); //This works
    };

    $scope.logout = function () {
      $.jStorage.set('profile', {});
      $.jStorage.flush();
      $state.go('landing');
    };

    $scope.$watch(function () {
        return $ionicSideMenuDelegate.isOpenLeft();
      },
      function (isOpen) {
        if (isOpen) {
          // MyServices.getNavDetails(function (data) {
          $scope.userInfo = $.jStorage.get('profile');
          // });
        }
      });

    $scope.$on('$ionicView.enter', function () {
      $ionicSideMenuDelegate.canDragContent(false);
    });
    $scope.$on('$ionicView.leave', function () {
      $ionicSideMenuDelegate.canDragContent(false);
    });

  })
  .controller('LandingCtrl', function ($scope, $stateParams, $state) {
    if ($.jStorage.get('profile') && $.jStorage.get('profile').pincode) {
      $state.go('app.dashboard');
    }
  })
  .controller('VerifyCtrl', function ($scope, $stateParams, MyServices, $timeout, $ionicPopup, $state) {
    var mobileData = {};
    $scope.otp = null;
    mobileData.mobile = $stateParams.mobNo;
    $scope.resend = true;
    MyServices.apiCallWithData('User/createUser', mobileData, function (data) {
      if (data.value) {
        $scope.getOtpData = data.data;

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
            cssClass: 'removedpopup',
            title: '<img src="img/warning.png">',
            template: "<h4>Incorrect OTP</h4><label>Please try again!</label>"
          });
        }
      });
    };
    $scope.resenOtp = function () {
      $scope.resend = false;
      MyServices.apiCallWithData('User/sendOtp', mobileData, function (data) {
        if (data.value) {
          $scope.getOtpData = data.data;
          $scope.otp = null;
          $timeout(function () {
            $scope.resend = true;
          }, 10000);
        }
      });
    };
  })
  .controller('SignupCtrl', function ($scope, $stateParams, $state, $ionicPopover, $ionicPlatform, $ionicPopup, MyServices) {
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
        if ($.jStorage.get('profile').email) {
          $scope.lockData = true;
        }
        MyServices.getUserData(function (data) {
          $scope.signupForm = data.data;
        });
      }
    };

    $scope.getUserData();
    $scope.saveUser = function () {
      $scope.changePincode = false;
      _.forEach($scope.signupForm.mobile, function (value) {
        if (value.accessLevel == 'Registered Mobile') {
          value.mobileNo = $scope.signupForm.registerMobile;
          value.name = $scope.signupForm.name;
        }
      });
      $scope.signupForm.loginStatus = true;
      MyServices.apiCallWithData('User/saveUserData', $scope.signupForm, function (data) {
        if (data.value) {
          $scope.signupForm = data.data;
          var userInfo = {};
          userInfo = $.jStorage.get('profile');
          userInfo.pincode = data.data.pinCode;
          if (!userInfo.name) {
            userInfo.name = data.data.name;
          }
          $.jStorage.set('profile', userInfo);
          $state.go('app.browse');

        } else {
          if (data.error == 'noPincodeFound') {
            $ionicPopup.alert({
              cssClass: 'removedpopup',
              title: '<img src="img/warning.png">',
              template: "<h4>Sorry!</h4><label>We don't currently serve your pincode. We've saved your details, so you'll be one of the first to know when we start.</label>",
              buttons: [{
                  text: 'Leave app',
                  cssClass: 'leaveApp',
                  onTap: function (e) {
                    ionic.Platform.exitApp();
                    $ionicPlatform.registerBackButtonAction(function (event) {
                      ionic.Platform.exitApp();
                    });
                  }
                },
                {
                  text: 'Retry',
                  type: 'button-positive',
                  onTap: function (e) {
                    $scope.changePincode = true;
                  }
                }
              ]
            });
          } else {
            $ionicPopup.alert({
              cssClass: 'removedpopup',
              title: '<img src="img/warning.png">',
              template: "Error Occured while updating order"
            });
          }
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
    $scope.userInfo = $.jStorage.get('profile');
    var userData = {};
    userData._id = $scope.userInfo._id;
    userData.pincode = $scope.userInfo.pincode;
    userData.warehouseId = $scope.userInfo.warehouseId;
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

    $scope.categoryData = {};
    $scope.categoryData._id = $stateParams.catId;
    MyServices.apiCallWithData('Subcategory/getOne', $scope.categoryData, function (data) {
      if (data.value) {
        $scope.category = data.data;
      }
    });
  })
  .controller('RequirementCtrl', function ($scope, $stateParams, MyServices, $ionicPopup, $state) {
    $scope.productData = {};
    $scope.productData._id = $stateParams.productId;
    $scope.userInfo = $.jStorage.get('profile');

    $scope.isNumberKey = function (evt) {
      var charCode = (evt.which) ? evt.which : event.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;

      return true;
    }
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
      $scope.quantity = 0;
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
    $scope.getQuantity = function (num) {
      $scope.quantity += num;
      if ($scope.quantity > 0) {
        $scope.activePlan = {};
        $scope.activePlan.quantity = $scope.quantity;
        $scope.activePlan.plan = 'One Time';
      } else {
        $scope.activePlan = null;
      }
    }
    $scope.addToCart = function (data) {
      var warehouseQuantity = {};
      warehouseQuantity.product = $scope.product;
      warehouseQuantity.product.plan = data.plan;
      warehouseQuantity.pinCode = $scope.userInfo.pincode;
      if ($.jStorage.get('profile').warehouseId) {
        warehouseQuantity._id = $.jStorage.get('profile').warehouseId;
      }

      if (data.plan == 'One Time') {
        warehouseQuantity.product.quantity = data.quantity;
      } else {
        if (typeof data.plan == 'string') {
          data.plan = JSON.parse(data.plan);
        }
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
            cssClass: 'removedpopup',
            title: '<img src="img/warning.png">',
            template: "Sorry! Product is out of stock."
          });
        }
      });

    };
  })
  .controller('ReviewCtrl', function ($scope, $stateParams, $ionicPopup, MyServices) {
    $scope.userInfo = $.jStorage.get('profile');

    var userData = {};
    userData._id = $scope.userInfo._id;
    userData.pincode = $scope.userInfo.pincode;
    userData.warehouseId = $scope.userInfo.warehouseId;
    $scope.outOfStock = false;

    function getCustomerCart() {
      MyServices.apiCallWithData("user/getCartForCustomer", userData, function (data) {
        $scope.cartData = [];
        console.log($scope.cartData);
        if (data.value) {
          $scope.outOfStock = false;
          if (data.data.cart) {
            $scope.cartData = data.data.cart;
          }
          $scope.getTotal();
          if (!data.data.cart || $scope.cartData.length == 0) {
            delete $scope.userInfo.warehouseId;
            $.jStorage.set('profile', $scope.userInfo);
          }
        }
      });
    }
    getCustomerCart();
    $scope.removeProduct = function (cart) {
      userData.cartId = cart._id;
      MyServices.apiCallWithData("user/deleteFromCart", userData, function (data) {
        console.log(data);
        if (data.value) {
          $ionicPopup.alert({
            cssClass: 'removedpopup',
            title: '<img src="img/cart.png">',
            template: "Removed from Cart"
          });
          getCustomerCart();
        } else {
          $ionicPopup.alert({
            cssClass: 'removedpopup',
            title: '<img src="img/warning.png">',
            template: "Error Occured while Removing Products to Cart"
          });
        }
      });
    }
    $scope.getTotal = function () {
      $scope.total = 0;
      _.forEach($scope.cartData, function (value) {
        if (value.outOfStock) {
          $scope.outOfStock = true;
        }
        if (value.plan == 'One Time') {
          if (value.deposit > 0) {
            $scope.total = $scope.total + value.deposit;
          }
          $scope.total = $scope.total + (value.quantity * value.productId.price);
        } else {
          $scope.total = $scope.total + (value.plan.quantity * value.plan.price);
        }
      });
    }
  })
  .controller('DeliveryCtrl', function ($scope, $stateParams) {})
  .controller('PaymentCtrl', function ($scope, $stateParams, $ionicPlatform, $state, MyServices, $ionicPopup) {
    $scope.total = $stateParams.total;
    $scope.userInfo = $.jStorage.get('profile');
    $scope.called = false;
    $scope.payment = [{
        name: "Credit Card",
        status: false
      }, {
        name: "Debit Card",
        status: false
      }, {
        name: "Net Banking",
        status: false
      },
      // {
      //   name: "Paytm",
      //   img: "img/paytm_logo.png",
      //   status: false
      // }, 
      {
        name: "Other Wallets",
        status: false
      }, {
        name: "Cash On Delivery",
        status: false
      }
    ];
    $scope.selectPayment = function (index) {
      $scope.called = false;
      $scope.findPayment = $scope.payment[index].name;
      _.forEach($scope.payment, function (value) {
        if (value.name == $scope.findPayment) {
          value.status = true;
        } else {
          value.status = false;
        }
      });
    }
    $scope.options = {};
    $scope.createOrder = function () {
      var userData = {};
      userData._id = $scope.userInfo._id;
      userData.paymentMethod = $scope.findPayment;
      MyServices.apiCallWithData("user/generateUserOrder", userData, function (data) {
        console.log(data);
        if (data.value) {
          $scope.orderInfo = data.data;
          delete $scope.userInfo.warehouseId;
          $.jStorage.set('profile', $scope.userInfo);
          switch ($scope.orderInfo.paymentMethod) {
            case 'Credit Card':
              $scope.paymentMethod = 'card';
              break;
            case 'Debit Card':
              $scope.paymentMethod = 'card';
              break;
            case 'Net Banking':
              $scope.paymentMethod = 'netbanking';
              break;
              // case 'Paytm':
              //   $scope.paymentMethod = 'wallet';
              //   break;
            case 'Other Wallets':
              $scope.paymentMethod = 'wallet';
              break;
            case 'Cash On Delivery':
              $state.go('app.confirm');
              break;
            default:
              $scope.paymentMethod = '';
          }
          if ($scope.orderInfo.paymentMethod != 'Cash On Delivery') {
            MyServices.getUserData(function (data) {
              $scope.userData = data.data;
              $scope.options = {
                description: 'Pay for Order ' + $scope.orderInfo.orderId,
                image: 'https://i.imgur.com/3g7nmJC.png',
                currency: 'INR',
                // key: 'rzp_test_BrwXxB7w8pKsfS', //this payment id i have used twice Please change both
                //please see line no(802)
                key: 'rzp_live_gFWckrbme2wT4J', //this live payment id
                // external: {
                //   wallets: ['paytm']
                // },
                amount: parseInt($scope.orderInfo.totalAmount) * 100,
                name: $scope.userData.name,
                prefill: {
                  email: $scope.userData.email,
                  contact: $scope.userData.registerMobile,
                  name: $scope.userData.name,
                  method: $scope.paymentMethod
                },
                // 'handler': function (transaction) {
                //   $scope.transactionHandler(transaction);
                // },
                theme: {
                  color: '#FF414D'
                }
              };
              $scope.pay();
            });
          }
        } else {
          if (data.error) {
            var alertPopup = $ionicPopup.alert({
              cssClass: 'removedpopup',
              title: '<img src="img/warning.png">',
              template: data.error
            });
            alertPopup.then(function (res) {
              $state.go('app.review');
            });
          } else {
            $ionicPopup.alert({
              cssClass: 'removedpopup',
              title: '<img src="img/warning.png">',
              template: "Error Occured while creating order"
            });
          }

        }
      });
    }

    // $scope.transactionHandler = function (success) {
    //   console.log("success", success);
    //   console.log(success);
    //   var orderId = success.razorpay_order_id;
    //   var signature = success.razorpay_signature;
    //   $scope.paymentInfo = {};
    //   if (success.razorpay_payment_id) {
    //     $scope.paymentInfo.paymentId = success.razorpay_payment_id;
    //     $scope.paymentInfo._id = $scope.orderInfo._id;
    //     $scope.paymentInfo.razorpay_order_id = $scope.orderInfo.razorpay_order_id;
    //     console.log("payAndCapture", success);
    //     MyServices.apiCallWithData("order/verifyOrderPaymentStatus", $scope.paymentInfo, function (data) {
    //       if (data.value === true) {
    //         $state.go('app.confirm');
    //         //redirect to thank you page
    //       }
    //     });
    //   }
    // }


    var successCallback = function (success) {
      $scope.called = false;
      $scope.paymentInfo = {};
      if (success) {
        $scope.paymentInfo.paymentId = success;
        $scope.paymentInfo._id = $scope.orderInfo._id;
        MyServices.apiCallWithData("order/verifyOrderPaymentStatus", $scope.paymentInfo, function (data) {
          if (data.value) {
            $state.go('app.confirm');
            //redirect to thank you page
          }
        });
      }
    }

    var cancelCallback = function (error) {
      console.log();
      $scope.called = false;
      var alertPopup = $ionicPopup.alert({
        cssClass: 'removedpopup',
        title: '<img src="img/warning.png">',
        template: error
      });
      alertPopup.then(function (res) {
        $state.go('app.review');
      });
    }

    $ionicPlatform.ready(function () {
      $scope.pay = function () {
        if (!$scope.called) {

          // $.getScript('https://checkout.razorpay.com/v1/checkout.js', function () {
          //   var rzp1 = new Razorpay($scope.options);
          //   rzp1.open();
          //   called = true;
          // });
          RazorpayCheckout.on('payment.success', successCallback);
          RazorpayCheckout.on('payment.cancel', cancelCallback);
          RazorpayCheckout.open($scope.options, successCallback, cancelCallback);

          // console.log(successCallback);
          // // RazorpayCheckout.on('payment.external_wallet', externalWalletCallback)
          // $scope.called = true;

        }
      }
    });
  })
  .controller('ConfirmCtrl', function ($scope, $stateParams) {})
  .controller('OrderhistoryCtrl', function ($scope, $stateParams, MyServices, $timeout) {
    var userData = {};
    var page = null;
    $scope.stop = true;
    $scope.orderList = [];
    $scope.getOrders = function (orderPage, noLoader) {
      $scope.$broadcast('scroll.refreshComplete');
      userData._id = $.jStorage.get('profile')._id;
      userData.page = page = orderPage;
      userData.noLoader = noLoader;
      if (userData.page == 1) {
        $scope.orderList = [];
      }
      MyServices.apiCallWithData("Order/getOrdersForUser", userData, function (data) {
        if (data.value) {
          if (data.data.results == 0) {
            $scope.stop = true;
          } else {
            $scope.orderList = _.concat($scope.orderList, data.data.results);
            $scope.stop = false;
          }
        } else {
          $scope.stop = true;
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
      });
    }
    $scope.getOrders(1, false);
    $scope.loadMore = function (loadMoreStatus) {
      if (loadMoreStatus) {
        console.log("in loadmore", page);
        page += 1;
        $scope.getOrders(page, true);
      }
    }

    $scope.doRefresh = function () {
      $scope.refreshing = true;
      // fetch remote data
      $scope.getOrders(1, true);
      $timeout(function () {
        $scope.refreshing = false;
      }, 1000);

    };

  })
  .controller('OrderDetailCtrl', function ($scope, $stateParams, MyServices) {
    var orderData = {};
    orderData._id = $stateParams.orderId;
    MyServices.apiCallWithData("order/getOneOrder", orderData, function (data) {
      if (data.value) {
        $scope.orderDetail = data.data.order;
      }
    });


  })
  .controller('DeliveryHistoryCtrl', function ($scope, $stateParams, MyServices) {
    var deliveryInfo = {};
    var page = null;
    $scope.stop = true;
    $scope.deliveryData = [];
    $scope.getDelivery = function (orderPage, noLoader) {
      deliveryInfo.page = page = orderPage;
      deliveryInfo.noLoader = $scope.showSpin = noLoader;
      if (deliveryInfo.page == 1) {
        $scope.deliveryData = [];
      }
      deliveryInfo.customerId = $.jStorage.get('profile')._id;
      deliveryInfo.productId = $stateParams.productId;
      MyServices.apiCallWithData('DeliveryRequest/getDeliveryHistoryOfProduct', deliveryInfo, function (data) {
        if (data.value) {
          if (data.data == 0) {
            $scope.stop = true;
          } else {
            $scope.deliveryData = _.concat(data.data, $scope.deliveryData);
            $scope.stop = false;
          }
        } else {
          $scope.stop = true;
        }
      });
      $scope.$broadcast('scroll.infiniteScrollComplete');
      $scope.$broadcast('scroll.refreshComplete');
    }
    $scope.getDelivery(1, false);
    $scope.loadMore = function () {
      console.log("in loadmore");
      page += 1;
      $scope.getDelivery(page, false);
    };
    $scope.doRefresh = function () {
      $scope.refreshing = true;
      // fetch remote data
      $scope.getDelivery(1, true);
      $timeout(function () {
        $scope.refreshing = false;
      }, 1000);

    };




  })
  .controller('DashboardCtrl', function ($scope, $window, $stateParams, $state, MyServices, $ionicPopup) {
    $scope.reloadDashboard = function () {
      $state.reload();
    }
    $scope.getPlans = function () {
      var userData = {};

      userData._id = $.jStorage.get('profile')._id;
      MyServices.apiCallWithData('user/getPlansProductSDDetails', userData, function (data) {
        $scope.plans = [];
        if (data.value) {
          $scope.plans = data.data.results;
        }
        $scope.$broadcast('scroll.refreshComplete');
      });
    }

    $scope.cancelDelivery = function (deliveryId) {
      $ionicPopup.alert({
        cssClass: 'removedpopup',
        title: '<img src="img/warning.png">',
        template: "<h4>Cancel Delivery</h4><label>Are you sure ?</label>",
        buttons: [{
          text: 'Yes',
          onTap: function (e) {
            var deliveryReq = {};
            deliveryReq._id = deliveryId;
            MyServices.apiCallWithData('DeliveryRequest/cancelDeliveryRequest', deliveryReq, function (data) {
              if (data.value) {
                $state.reload();
              } else {
                $ionicPopup.alert({
                  cssClass: 'removedpopup',
                  title: '<img src="img/warning.png">',
                  template: "Error Occured while canceling order"
                });
              }
            });
          }
        }, {
          text: 'No',
          type: 'button-positive',
          onTap: function (e) {}
        }]
      });

    }
    if (!$.jStorage.get('profile')) {
      $state.go('landing');
    } else {
      $scope.getPlans();
      $scope.flexwidth = $window.innerWidth - 40;
      $scope.flexStyle = {
        "width": $window.innerWidth.toString() + "px"
      };
      var pinData = {};
      pinData.pinCode = $.jStorage.get('profile').pincode;

      MyServices.apiCallWithData('pincode/getEstimatedDeliveryDate', pinData, function (data) {
        if (data.value) {
          $scope.estimatedDate = data.data.estimatedDate;
        }
      });
    }

  })
  .controller('ScheduleCtrl', function ($scope, $window, $stateParams, MyServices, $ionicPopup, $state, $filter) {
    $scope.scheduleData = {};
    $scope.scheduleData.scheduledDeliveryTime = '8 AM to 1 PM';
    $scope.flexwidth = $window.innerWidth;
    var productData = {};
    productData.productId = $stateParams.productId;
    productData._id = $.jStorage.get('profile')._id;
    MyServices.apiCallWithData('user/getPlanProductSDDetails', productData, function (data) {
      $scope.productPlan = data.data;
      $scope.products = data.data.userPlan.planBalance[0];
      $scope.products.deliverQuantity = null;
    });


    $scope.generateArray = function (days, estimatedDate) {
      $scope.CurrentDate = new Date(estimatedDate);
      $scope.getDateArray = [];
      $scope.CurrentDay = new Date(estimatedDate).getDay();
      for (var j = $scope.CurrentDay; j >= 1; j--) {
        $scope.getDateArray.push({
          date: new Date(estimatedDate).setDate(new Date(estimatedDate).getDate() - j),
          status: false,
          selected: false,
          available: false
        });

      }
      // $scope.getDateArray.push({
      //   date: new Date().setDate(new Date(date).getDate()),
      //   status: false,
      //   selected: true,
      //   available: false

      // });

      for (var i = 0; i < 28 - $scope.CurrentDay; i++) {
        $scope.getDateArray.push({
          date: new Date(estimatedDate).setDate(new Date(estimatedDate).getDate() + i),
          status: true,
          selected: false,
          available: false
        });

      }
      $scope.getDateArray = _.chunk($scope.getDateArray, 7);

      _.forEach(days, function (value) {
        _.forEach(_.flatten($scope.getDateArray), function (value1) {
          if ($filter('date')(estimatedDate) == $filter('date')(value1.date)) {
            value1.selected = true;
          }
          if ($filter('date')(value1.date, 'EEEE') == value) {
            value1.available = true;
          }

        });
      });

    };

    var pinData = {};
    pinData.pinCode = $.jStorage.get('profile').pincode;
    MyServices.apiCallWithData('pincode/checkPincode', pinData, function (data) {
      if (data.value) {
        $scope.pindays = data.data;
        MyServices.apiCallWithData('pincode/getEstimatedDeliveryDate', pinData, function (data) {
          if (data.value) {
            $scope.estimatedDate = $scope.scheduleData.scheduleDeliveryDate = data.data.estimatedDate;
            $scope.generateArray($scope.pindays.days, $scope.estimatedDate);

          }
        });
      }
    });

    $scope.selectDate = function (date) {
      $scope.scheduleData.scheduleDeliveryDate = date;
      _.forEach(_.flatten($scope.getDateArray), function (value) {
        if (value.date == date) {
          value.selected = true;
        } else {
          value.selected = false;
        }
      });
    };

    $scope.createDelivery = function () {
      $scope.scheduleData.products = [{
        productId: null,
        quantity: null,
        planBased: true
      }];
      $scope.scheduleData.products[0].productId = $scope.products.product._id;
      $scope.scheduleData.products[0].quantity = $scope.products.deliverQuantity;
      $scope.scheduleData.customerId = $.jStorage.get('profile')._id;
      MyServices.apiCallWithData('DeliveryRequest/createUserDeliveryRequest', $scope.scheduleData, function (data) {
        if (data.value) {
          $state.go('app.thankyou', {
            productId: $stateParams.productId
          });
        } else {
          if (data.error == 'lowPlanBalance') {
            $ionicPopup.alert({
              cssClass: 'removedpopup',
              title: '<img src="img/warning.png">',
              template: "Your plan balance is lower than requested quantity"
            });

          } else if (data.error == 'Sorry! Product is out of stock.') {
            $ionicPopup.alert({
              cssClass: 'removedpopup',
              title: '<img src="img/warning.png">',
              template: data.error
            });
          } else {
            $ionicPopup.alert({
              cssClass: 'removedpopup',
              title: '<img src="img/warning.png">',
              template: "Error Occurred"
            });
          }

        }
      });

    }
    $scope.changeQuantity = function (quantity) {

      if ($scope.products.deliverQuantity != null) {
        $scope.products.deliverQuantity = $scope.products.deliverQuantity + quantity;
      } else {
        $scope.endRange = $scope.products.quantity;
        if ($scope.products.product.minDeliverySize <= $scope.products.quantity) {
          $scope.products.deliverQuantity = $scope.startRange = $scope.products.product.minDeliverySize;

        } else {
          $scope.products.deliverQuantity = $scope.startRange = $scope.products.quantity;
        }
      }
      // if ($scope.products.deliverQuantity == $scope.products.product.minDeliverySize) {
      //   $scope.products.deliverQuantity = null;
      // }
    }

  })
  .controller('ThankyouCtrl', function ($scope, $stateParams, MyServices) {
    var deliveryRequest = {};
    deliveryRequest.customerId = $.jStorage.get('profile')._id;
    deliveryRequest.productId = $stateParams.productId;
    MyServices.apiCallWithData('DeliveryRequest/getLastDeliveryScheduledForProduct', deliveryRequest, function (data) {
      if (data.value) {
        $scope.deliveryData = data.data;
      }
    })
  })
  .controller('HelpCtrl', function ($scope, $stateParams) {})
  .controller('AccountCtrl', function ($scope, $stateParams, MyServices, $ionicPopup) {
    MyServices.getUserData(function (data) {
      $scope.signupForm = data.data;
    });
    $scope.saveUser = function () {
      MyServices.apiCallWithData('User/saveUserData', $scope.signupForm, function (data) {
        if (data.value) {
          $ionicPopup.alert({
            cssClass: 'removedpopup',
            title: '<img src="img/tick.png">',
            template: "Your profile updated successfully!"
          });
          MyServices.getUserData(function (data) {
            $scope.signupForm = data.data;
          });
        }
      });

    }

  });
