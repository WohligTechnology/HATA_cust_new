var adminurl = "http://htbttesting.wohlig.co.in/api/"; //test server
// var adminurl = "http://htbt.wohlig.co.in/api/"; //server
// var adminurl = "http://192.168.2.21:1337/api/"; //server
// var imgpath = adminurl + "uploadfile/getupload?file=";
var imgurl = adminurl + "upload/";
var imgpath = imgurl + "readFile?file=";
// var uploadurl = imgurl;
angular.module('starter.services', [])
    .factory('MyServices', function ($http) {
        var appDetails = {};
        var calDate = new Date();
        var incorrect = false;

        function getProductPrice(product, quantity) {
            var foundPrice = {};
            var orderedPrice = _.orderBy(product.priceList, function (n) {
                return parseInt(n.endRange);
            });

            if (orderedPrice.length === 0) {
                product.finalPrice = product.price;
                product.priceUsed = product.price;
                product.finalQuantity = quantity;
                product.totalPriceUsed = product.price * parseInt(quantity);
                return parseInt(product.price);
            } else {
                _.each(orderedPrice, function (obj) {
                    if (parseInt(quantity) <= parseInt(obj.endRange)) {
                        foundPrice = obj;
                        product.priceUsed = obj.finalPrice;
                        product.totalPriceUsed = obj.finalPrice * parseInt(quantity);
                        return false;
                    }
                });
                if (quantity > parseInt(orderedPrice[orderedPrice.length - 1].endRange)) {
                    product.priceUsed = orderedPrice[orderedPrice.length - 1].finalPrice;
                    product.totalPriceUsed = orderedPrice[orderedPrice.length - 1].finalPrice * parseInt(quantity);

                }
            }

            return product.priceUsed;
        }
        appDetails.cartQuantity = $.jStorage.get("cartQuantity");
        return {
            getAppDetails: function () {
                return appDetails;
            },
            getProfile: function (id, callback) {

                $http({
                    url: adminurl + 'user/getProfile',
                    method: 'POST',
                    withCredentials: true,
                    data: id
                }).success(callback);
            },
            setDate: function (sDate) {
                calDate = sDate;
            },

            getDate: function () {

                return calDate;
            },
            getOrderByRM: function (data, callback) {

                $http({
                    url: adminurl + 'order/getOrderByRM',
                    method: 'POST',
                    withCredentials: true,
                    data: data
                }).success(callback);
            },
            getAllDeliveryReqByRP: function (data, callback) {
                $http({
                    url: adminurl + 'deliveryRequest/getAllDeliveryReqByRP',
                    method: 'POST',
                    withCredentials: true,
                    data: data
                }).success(callback);
            },
            getNextDate: function (stringArr) {
                var objs = [];
                _.each(stringArr, function (day) {
                    var dateDay = moment(day, "dddd").toDate();
                    objs.push(dateDay);
                });
                _.each(stringArr, function (day) {
                    var dateDay = moment(day, "dddd").add(1, "week").toDate();
                    objs.push(dateDay);
                });
                var remaining = _.filter(objs, function (dat) {
                    return !moment(dat).isSameOrBefore(moment(), 'day');
                });
                console.log(remaining[0]);
                return remaining[0];
            },
            scheduleDelivery: function (data, callback) {
                $http({
                    url: adminurl + 'deliveryRequest/scheduleDelivery',
                    method: 'POST',
                    withCredentials: true,
                    data: data
                }).success(callback);
            },
            getLastJarScheduledByUser: function (data, callback) {
                $http({
                    url: adminurl + 'deliveryRequest/getLastJarScheduledByUser',
                    method: 'POST',
                    withCredentials: true,
                    data: data
                }).success(callback);
            },
            getByMobileNo: function (data, callback) {
                $http({
                    url: adminurl + 'user/getByMobileNo',
                    method: 'POST',
                    withCredentials: true,
                    data: data
                }).success(callback);
            },
            OrderGetOne: function (data, callback) {
                $http({
                    url: adminurl + 'Order/getOne',
                    method: 'POST',
                    withCredentials: true,
                    data: data
                }).success(callback);
            },
            OrderSave: function (data, callback) {
                $http({
                    url: adminurl + 'Order/save',
                    method: 'POST',
                    withCredentials: true,
                    data: data
                }).success(callback);
            },
            getCust: function (data, callback) {

                $http({
                    url: adminurl + 'user/getone',
                    method: 'POST',
                    withCredentials: true,
                    data: data
                }).success(callback);
            },
            signup: function (data, callback) {
                console.log(data);
                $http({
                    url: adminurl + 'User/saveUserData',
                    method: 'POST',
                    withCredentials: true,
                    data: data
                }).success(callback);
            },
            saveData: function (data, callback) {
                console.log(data);
                $http({
                    url: adminurl + 'User/save',
                    method: 'POST',
                    withCredentials: true,
                    data: data
                }).success(callback);
            },
            getonePro: function (data, callback) {
                $http({
                    url: adminurl + 'User/getone',
                    method: 'POST',
                    withCredentials: true,
                    data: data
                }).success(callback);
            },
            getProduct: function (data, callback) {
                var id = {
                    _id: data
                }
                $http({
                    url: adminurl + 'Product/getone',
                    method: 'POST',
                    withCredentials: true,
                    data: id
                }).success(callback);
            },
            getByPin: function (data, callback) {
                $http({
                    url: adminurl + 'Pincode/getByPin',
                    method: 'POST',
                    withCredentials: true,
                    data: data
                }).success(callback);
            },
            updateAndGetResponse: function (data, callback) {
                $http({
                    url: adminurl + 'User/updateAndGetResponse',
                    method: 'POST',
                    withCredentials: true,
                    data: data
                }).success(callback);
            },
            categories: function (callback) {
                $http({
                    url: adminurl + 'Categories/getCategories',
                    method: 'POST',
                    withCredentials: true,
                }).success(callback);
            },
            getDeliveryRequestByUser: function (data, callback) {
                $http({
                    url: adminurl + 'deliveryRequest/getDeliveryRequestByUser',
                    method: 'POST',
                    withCredentials: true,
                    data: data
                }).success(callback);
            },
            DeliverGetone: function (data, callback) {
                $http({
                    url: adminurl + 'deliveryRequest/getOne',
                    method: 'POST',
                    withCredentials: true,
                    data: data
                }).success(callback);
            },
            cancelJarDelivery: function (data, callback) {
                $http({
                    url: adminurl + 'deliveryRequest/cancelJarDelivery',
                    method: 'POST',
                    withCredentials: true,
                    data: data
                }).success(callback);
            },
            getDeliveryRequestByOrder: function (data, callback) {
                $http({
                    url: adminurl + 'deliveryRequest/getDeliveryRequestByOrder',
                    method: 'POST',
                    withCredentials: true,
                    data: data
                }).success(callback);
            },
            featureprods: function (callback) {
                $http({
                    url: adminurl + 'product/getAllFeaturedProduct',
                    method: 'POST',
                    withCredentials: true,
                }).success(callback);
            },
            products: function (data, callback) {
                $http({
                    url: adminurl + 'product/getAllCategoryProduct',
                    method: 'POST',
                    withCredentials: true,
                    data: data
                }).success(callback);
            },
            orderConfirmationOrPay: function (data, callback) {
                $http({
                    url: adminurl + 'order/orderConfirmationOrPay',
                    method: 'POST',
                    withCredentials: true,
                    data: data
                }).success(callback);
            },

            showCardQuantity: function (callback) {
                var obj = {
                    user: $.jStorage.get("profile")._id
                };
                $http({
                    url: adminurl + 'user/showCartQuantity',
                    method: 'POST',
                    withCredentials: true,
                    data: obj
                }).then(function (data) {
                    appDetails.cartQuantity = data.data.data;
                    $.jStorage.set("cartQuantity", data.data.data);
                    callback(appDetails.cartQuantity);
                });
            },
            addToCart: function (products, callback) {
                var obj = {
                    user: $.jStorage.get("profile")._id,
                    products: products,
                };
                $http({
                    url: adminurl + 'user/addToCart',
                    method: 'POST',
                    withCredentials: true,
                    data: obj
                }).then(function (data) {
                    appDetails.cartQuantity = data.data.data;
                    $.jStorage.set("cartQuantity", data.data.data);
                    callback(data);
                });
            },
            removeFromCart: function (productId, callback) {
                var obj = {
                    user: $.jStorage.get("profile")._id,
                    product: productId,
                };
                $http({
                    url: adminurl + 'user/removeFromCart',
                    method: 'POST',
                    withCredentials: true,
                    data: obj
                }).then(function (data) {
                    appDetails.cartQuantity = data.data.data;
                    $.jStorage.set("cartQuantity", data.data.data);
                    callback(data);
                });
            },
            showCart: function (callback) {
                var obj = {
                    user: $.jStorage.get("profile")._id
                };
                $http({
                    url: adminurl + 'user/showCart',
                    method: 'POST',
                    withCredentials: true,
                    data: obj
                }).then(function (data) {
                    callback(data);
                });
            },
            getProductPrice: function (product, quantity) {
                return getProductPrice(product, quantity);
            },
            getOtherProducts: function (callback) {
                $http({
                    url: adminurl + 'Product/getAllOtherProduct',
                    method: 'POST',
                    withCredentials: true,
                }).then(function (data) {
                    callback(data);
                });
            },

            saveOrderCheckout: function (data, callback) {
                var data2 = data;
                data2.productDetail.productQuantity = data.product[0].quantity;
                var num = 1;
                data2.product = [];
                switch (data.plan) {
                    case "Monthly":
                        num = 4;
                        break;
                    case "Quarterly":
                        num = 12;
                        break;
                    case "Onetime":
                        num = 1;
                        break;
                }
                data2.product.push({
                    product: data2.productDetail,
                    productQuantity: parseInt(data2.productDetail.productQuantity) * num,
                    jarDeposit: data2.deposit
                });


                _.each(data2.otherProducts, function (n) {
                    data2.product.push({
                        product: n,
                        productQuantity: n.productQuantity,
                        jarDeposit: n.AmtDeposit
                    });
                });

                delete data2.productDetail;
                delete data2.otherProducts;
                data2.orderFor = "CustomerForSelf";
                data2.methodOfOrder = data.methodOfOrder;;
                data2.methodofjoin = data.methodofjoin;
                data2.user = $.jStorage.get("profile")._id;


                $http({
                    url: adminurl + 'Order/saveOrderCheckout',
                    method: 'POST',
                    withCredentials: true,
                    data: data2
                }).then(function (data) {
                    callback(data);
                });
            },

            saveOrderCheckoutCart: function (data, callback) {
                $http({
                    url: adminurl + 'Order/saveOrderCheckoutCart',
                    method: 'POST',
                    withCredentials: true,
                    data: data
                }).success(callback);
            },
            getOrderWithDelivery: function (data, callback) {
                $http({
                    url: adminurl + 'Order/getOrderWithDelivery',
                    method: 'POST',
                    withCredentials: true,
                    data: data
                }).success(callback);
            },
            getOrderByUser: function (data, callback) {
                $http({
                    url: adminurl + 'Order/getOrderByUser',
                    method: 'POST',
                    withCredentials: true,
                    data: data
                }).success(callback);
            },
            //to get OTP
            getOTP: function (data, callback) {
                $http({
                    url: adminurl + 'user/generateOtp',
                    method: 'POST',
                    withCredentials: true,
                    data: data
                }).then(callback);
            },

            //To verfiy OTP
            verifyOTP: function (data, callback) {
                $http({
                    url: adminurl + 'user/verifyOTP',
                    method: 'POST',
                    withCredentials: true,
                    data: data
                }).success(callback);
            },
            getDashboard: function (callback) {
                var obj = {
                    user: $.jStorage.get("profile")._id
                };
                $http({
                    url: adminurl + 'user/getDashboard',
                    method: 'POST',
                    withCredentials: true,
                    data: obj
                }).then(callback);
            }
        };
    });