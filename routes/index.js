var express = require('express');
var router = express.Router();
var BSON = require('bson');
var request = require('request');

var config = require('../config/config');
var aotuConfig = config.wx_config.aotu;
var dbHandler = require('../lib/dbHandler');

var wxConfig = require('../config/wxConfig');
var cryptoMO = require('crypto'); // MD5算法
var parseString = require('xml2js').parseString; // xml转js对象
var key = wxConfig.Mch_key;

var util = require('../util/util');

// const language = require('../lib/resource')

router.get('/login', function(req, res, next) {
    if (req.session && req.session.user && req.session.user.openId) {
        res.redirect('/' + req.query.url);
    } else {
        var host = req.headers.host;
        var tep = 'http://www.taduoke.com/getWechatUserInfo?url=' + req.query.url;
        if (req.query.openId) {
            tep += '&preLevel=' + req.query.openId;
        }
        var rUrl = encodeURIComponent(tep);
        console.log('rul', rUrl)
        var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + aotuConfig.appid + '&redirect_uri=' + rUrl + '&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect';
        res.redirect(url);
    }
});

router.get('/getWechatUserInfo', function(req, res) {
    if (req.query.code) {
        var url = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=' + aotuConfig.appid + '&secret=' + aotuConfig.secret + '&code=' + req.query.code + '&grant_type=authorization_code';
        request.get(url, function(err, httpResponse, body) {
            //res.json(body);
            if (err) return res.send({ status: 'failed' });
            var data = JSON.parse(body);
            var access_token = data.access_token;
            var openid = data.openid;
            if (openid) {
                util.getToken(aotuConfig, function(result) {
                    if (result.err) return res.status(500).send(result.msg);
                    var access_token = result.data.access_token;
                    new getUserInfoByOpenid(access_token, openid)
                        .then(function(info) {
                            req.session.user = {};
                            req.session.user.openId = openid;
                            console.log('info', info)
                            dbHandler.checkUserExists(openid, info, req, res, function(info, req, res) {
                                if (!info) {
                                    res.redirect('/' + req.query.url);
                                } else {
                                    dbHandler.createUser(JSON.parse(info), req.query.preLevel || "", req, res);
                                }
                            })

                            // return res.redirect('/' + req.query.url);
                        })
                        .catch(function(err) {
                            return res.status(500).send('get user info by openid error:' + err);
                        });
                })
            } else {
                res.sendStatus(200).send({ status: 'failed' })
            }
            // res.render('index', { title: '' });
        });
    } else {
        res.sendStatus(200).send({ status: 'failed' })
    }
    // res.render('index', { title: '' });
});


router.get("/account", function(req, res, next) {
    if (req.session && req.session.user && req.session.user.openId) {
        request.get('http://www.taduoke.com/api/user?openId=' + req.session.user.openId, function(err, httpResponse, body) {
            //res.json(body);
            if (err) return res.send({ status: 'failed' });
            var data = JSON.parse(body);
            res.render('account', { title: '', data: data.data });
        });
    } else {
        res.redirect('/login?url=account');
    }
});

router.get("/person", function(req, res, next) {
    if (req.session && req.session.user && req.session.user.openId) {
        request.get('http://www.taduoke.com/api/user?openId=' + req.session.user.openId, function(err, httpResponse, body) {
            //res.json(body);
            if (err) return res.send({ status: 'failed' });
            var data = JSON.parse(body);
            res.render('person', { title: '', data: data.data });
        });
    } else {
        res.redirect('/login?url=account');
    }
});

router.get("/myOrder", function(req, res, next) {
    if (req.session && req.session.user && req.session.user.openId) {
        request.get('http://www.taduoke.com/api/myOrder?openId=' + req.session.user.openId, function(err, httpResponse, body) {
            //res.json(body);
            if (err) return res.send({ status: 'failed' });
            var data = JSON.parse(body);
            res.render('myOrder', { title: '', data: data.data });
        });
    } else {
        res.redirect('/login?url=account');
    }
});

router.get("/myDistributor", function(req, res, next) {
    if (req.session && req.session.user && req.session.user.openId) {
        request.get('http://www.taduoke.com/api/getPreLevel?openId=' + req.session.user.openId, function(err, httpResponse, body) {
            //res.json(body);
            if (err) return res.send({ status: 'failed' });
            var data = JSON.parse(body);
            res.render('myDistributor', { title: '', data: data.data });
        });
    } else {
        res.redirect('/login?url=account');
    }
});

router.get("/myProfit", function(req, res, next) {
    if (req.session && req.session.user && req.session.user.openId) {
        request.get('http://www.taduoke.com/api/getBenfits?openId=' + req.session.user.openId, function(err, httpResponse, body) {
            //res.json(body);
            if (err) return res.send({ status: 'failed' });
            var data = JSON.parse(body);
            var benfits = 0;
            var canTakeBenfits = 0;
            if (data && data.benfits) {
                canTakeBenfits = data.benfits;
            }
            if (data && data.data && data.data.length > 0) {
                data.data.map((child, index) => {
                    if (child.benfits > 0) {
                        benfits += child.benfits;
                    }
                })
            }
            res.render('myProfit', { title: '', data: data.data || {}, benfits, canTakeBenfits });
        });
    } else {
        res.redirect('/login?url=account');
    }
});

router.get("/myWithdraw", function(req, res, next) {
    res.render('myWithdraw', { title: '' });
});

router.get("/clockIndex", function(req, res, next) {
    if (req.session && req.session.user && req.session.user.openId) {
        request.get('http://www.taduoke.com/api/getClockIndex?openId=' + req.session.user.openId, function(err, httpResponse, body) {
            //res.json(body);
            if (err) return res.send({ status: 'failed' });
            var data = JSON.parse(body);
            var clock = [];
            var isToday = false;
            if (data.data && data.data.clock && data.data.clock.length > 0) {
                var time = new Date().toLocaleDateString();
                var arr = time.split('/');
                var day = arr.length === 3 ? arr[2] + '-' + arr[0] + '-' + arr[1] : arr[0];
                isToday = data.data.clockTime == day;
                data.data.clock.map((child, index) => {
                    clock.push({ link: 1, pass: 1 })
                })
            }
            var length = clock.length;
            for (var i = length; i < 42; i++) {
                if (!isToday && i === length) {
                    clock.push({ link: 0, pass: 0 });
                } else {
                    clock.push({ link: 1, pass: 0 });
                }
            }
            res.render('clockIndex', { title: '', result: data, clock });
        });
    } else {
        res.redirect('/login?url=clockIndex');
    }
});

router.get("/addClock", function(req, res, next) {
    if (req.session && req.session.user && req.session.user.openId) {
        request.get('http://www.taduoke.com/api/getClockIndex?ranking=1&openId=' + req.session.user.openId, function(err, httpResponse, body) {
            //res.json(body);
            if (err) return res.send({ status: 'failed' });
            var data = JSON.parse(body);
            res.render('addClock', { title: '', day: req.query.day, result: data });
        });
    } else {
        res.redirect('/login?url=clockIndex');
    }
});

router.get("/ranking", function(req, res, next) {
    if (req.session && req.session.user && req.session.user.openId) {
        request.get('http://www.taduoke.com/api/getClockIndex?ranking=1&openId=' + req.session.user.openId, function(err, httpResponse, body) {
            //res.json(body);
            if (err) return res.send({ status: 'failed' });
            var data = JSON.parse(body);
            res.render('ranking', { title: '', result: data, today: new Date().toLocaleDateString() });
        });
    } else {
        res.redirect('/login?url=clockIndex');
    }
});

router.get("/checkClock", function(req, res, next) {
    if (req.session && req.session.user && req.session.user.openId) {
        request.get('http://www.taduoke.com/api/getClockIndex?openId=' + req.session.user.openId, function(err, httpResponse, body) {
            //res.json(body);
            if (err) return res.send({ status: 'failed' });
            var data = JSON.parse(body);
            res.render('checkClock', { title: '', result: data });
        });
    } else {
        res.redirect('/login?url=clockIndex');
    }
});

router.get("/order", function(req, res, next) {
    if (req.session && req.session.user && req.session.user.openId) {
        req.session.user = null;
        res.render('order', { title: '' });
    } else {
        res.redirect('/login?url=order');
    }
});

router.get("/qrcode", function(req, res, next) {
    if ((req.session && req.session.user && req.session.user.openId) || (req.query.qrcode && req.query.qrcode.length > 0)) {
        res.render('qrcode', { title: '', url: 'http://www.taduoke.com/login?url=account&openId=' + req.session.user.openId, qrcode: req.query.qrcode ? req.query.qrcode : '' });
    } else {
        res.redirect('/login?url=account');
    }
});
// router.get("/zh-CN", function (req, res, next) {
// 	let translate = {
// 		home: language.cn.home,
// 		common: language.cn.common
// 	}
// 	dbHandler.getAllNews(req, res, 'CHN', translate);
// 	// res.render("homepage", { language: translate, route: '' });
// });

// router.get("/en-US", function (req, res, next) {
// 	let translate = {
// 		home: language.en.home,
// 		common: language.en.common
// 	}
// 	dbHandler.getAllNews(req, res, 'USA', translate);
// 	// res.render("homepage", { language: translate, route: '' });
// });

// router.get("/zh-CN/product", function (req, res, next) {
// 	let translate = {
// 		product: language.cn.product,
// 		home: language.cn.home,
// 		common: language.cn.common
// 	}
// 	if (req.query.sid) {
// 		dbHandler.getProductlist(req, res, 'CHN', translate);
// 		// res.render("product", { language: translate, route: '/product' });
// 	}
// 	else {
// 		res.redirect("/");
// 	}
// });

// router.get("/en-US/product", function (req, res, next) {
// 	let translate = {
// 		product: language.en.product,
// 		home: language.en.home,
// 		common: language.en.common
// 	}
// 	if (req.query.sid) {
// 		dbHandler.getProductlist(req, res, 'USA', translate);
// 		// res.render("product", { language: translate, route: '/product' });
// 	}
// 	else {
// 		res.redirect("/");
// 	}
// });

// router.get("/zh-CN/productdetail", function (req, res, next) {
// 	let translate = {
// 		product: language.cn.product,
// 		home: language.cn.home,
// 		common: language.cn.common
// 	}
// 	if (req.query.pid) {
// 		dbHandler.getProductDetail(req, res, 'CHN', translate);
// 		// res.render("product", { language: translate, route: '/product' });
// 	}
// 	else {
// 		res.redirect("/");
// 	}
// });

// router.get("/en-US/productdetail", function (req, res, next) {
// 	let translate = {
// 		product: language.en.product,
// 		home: language.en.home,
// 		common: language.en.common
// 	}
// 	if (req.query.pid) {
// 		dbHandler.getProductDetail(req, res, 'USA', translate);
// 		// res.render("product", { language: translate, route: '/product' });
// 	}
// 	else {
// 		res.redirect("/");
// 	}
// });

// router.get("/zh-CN/news", function (req, res, next) {
// 	let translate = {
// 		product: language.cn.product,
// 		home: language.cn.home,
// 		common: language.cn.common
// 	}
// 	if (req.query.nid) {
// 		dbHandler.getNews(req, res, 'CHN', translate);
// 		// res.render("product", { language: translate, route: '/product' });
// 	}
// 	else {
// 		res.redirect("/");
// 	}
// });

// router.get("/en-US/news", function (req, res, next) {
// 	let translate = {
// 		product: language.en.product,
// 		home: language.en.home,
// 		common: language.en.common
// 	}
// 	if (req.query.nid) {
// 		dbHandler.getNews(req, res, 'USA', translate);
// 		// res.render("product", { language: translate, route: '/product' });
// 	}
// 	else {
// 		res.redirect("/");
// 	}
// });

// router.get("/weichat", function (req, res, next) {
// 	res.render("weichat");
// });


// router.get("/image", function (req, res, next) {
// 	var imageUrl = [
// 		"https://c10.neweggimages.com.cn/hero_banner/171109_Hero_Banner_01/171109/171109_Hero_Banner_01@Web.jpg",
// 		"https://c10.neweggimages.com.cn/Hero_Banner/171213_HB_Swarovski359up/171213_HB_Swarovski359up@Web.jpg",
// 		"https://c10.neweggimages.com.cn/Hero_Banner/171215_MonAndBaby40off/171215_MonAndBaby40off@Web.jpg",
// 		"https://c10.neweggimages.com.cn/Hero_Banner/171212_HB_Cuisinart20off/171212/171212_HB_Cuisinart20off@Web.jpg",
// 		"https://c10.neweggimages.com.cn/Hero_Banner/171215_HB_3cShowiPhone7988/171215_HB_3cShowiPhone7988@Web.jpg",
// 		"https://c10.neweggimages.com.cn/hero_banner/171109_Hero_Banner_01/171109/171109_Hero_Banner_01@Web.jpg",
// 		"https://c10.neweggimages.com.cn/Hero_Banner/171213_HB_Swarovski359up/171213_HB_Swarovski359up@Web.jpg"
// 	]
// 	res.send(imageUrl);
// });
//获取用户信息
var getUserInfoByOpenid = function(access_token, openid) {
    return new Promise(function(resolve, reject) {
        var url = 'https://api.weixin.qq.com/cgi-bin/user/info?access_token=' + access_token + '&openid=' + openid + '&lang=zh_CN';
        request.get(url, function(err, httpResponse, body) {
            if (err) return reject(err);
            resolve(body);
        });
    });
}


router.get('/wxpay', function() {
    res.status(200).send('api');
})

/*
 * 根据openid 发起微信支付  
 */
router.all('/pay', function(req, res, next) {
    // var param = req.query || req.params;
    if (!req.session.user && !req.session.user.openId) {
        res.send({ status: 'failed' })
    }
    var openid = req.session.user.openId;

    var spbill_create_ip = req.ip.replace(/::ffff:/, ''); // 获取客户端ip
    // var spbill_create_ip = "10.16.50.34";
    var body = '测试支付'; // 商品描述
    var notify_url = 'http://www.taduoke.com/weichat/wxpay' // 支付成功的回调地址  可访问 不带参数
    var nonce_str = getNonceStr(); // 随机字符串
    var out_trade_no = wxConfig.getWxPayOrdrID(); // 商户订单号
    var total_fee = '42'; // 订单价格 单位是 分
    var timestamp = Math.round(new Date().getTime() / 1000); // 当前时间

    var bodyData = '<xml>';
    bodyData += '<appid>' + wxConfig.AppID + '</appid>'; // 小程序ID
    bodyData += '<body>' + body + '</body>'; // 商品描述
    bodyData += '<mch_id>' + wxConfig.Mch_id + '</mch_id>'; // 商户号
    bodyData += '<nonce_str>' + nonce_str + '</nonce_str>'; // 随机字符串
    bodyData += '<notify_url>' + notify_url + '</notify_url>'; // 支付成功的回调地址 
    bodyData += '<openid>' + openid + '</openid>'; // 用户标识
    bodyData += '<out_trade_no>' + out_trade_no + '</out_trade_no>'; // 商户订单号
    bodyData += '<spbill_create_ip>' + spbill_create_ip + '</spbill_create_ip>'; // 终端IP
    bodyData += '<total_fee>' + total_fee + '</total_fee>'; // 总金额 单位为分
    bodyData += '<trade_type>JSAPI</trade_type>'; // 交易类型 小程序取值如下：JSAPI
    // 签名
    var sign = paysignjsapi(
        wxConfig.AppID,
        body,
        wxConfig.Mch_id,
        nonce_str,
        notify_url,
        openid,
        out_trade_no,
        spbill_create_ip,
        total_fee
    );
    bodyData += '<sign>' + sign + '</sign>';
    bodyData += '</xml>';
    // 微信小程序统一下单接口
    var urlStr = 'https://api.mch.weixin.qq.com/pay/unifiedorder';
    request({
        url: urlStr,
        method: 'POST',
        body: bodyData
    }, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var returnValue = {};
            parseString(body, function(err, result) {
                if (result.xml.return_code[0] == 'SUCCESS') {
                    returnValue.msg = '操作成功';
                    returnValue.status = '100';
                    returnValue.out_trade_no = out_trade_no; // 商户订单号
                    // 小程序 客户端支付需要 nonceStr,timestamp,package,paySign  这四个参数
                    returnValue.nonceStr = result.xml.nonce_str[0]; // 随机字符串
                    returnValue.timestamp = timestamp.toString(); // 时间戳
                    returnValue.package = 'prepay_id=' + result.xml.prepay_id[0]; // 统一下单接口返回的 prepay_id 参数值
                    returnValue.paySign = paysignjs(wxConfig.AppID, returnValue.nonceStr, returnValue.package, 'MD5', timestamp); // 签名
                    res.end(JSON.stringify(returnValue));
                } else {
                    returnValue.msg = result.xml.return_msg[0];
                    returnValue.status = '102';
                    res.end(JSON.stringify(returnValue));
                }
            });
        }
    })
});

function paysignjsapi(appid, body, mch_id, nonce_str, notify_url, openid, out_trade_no, spbill_create_ip, total_fee) {
    var ret = {
        appid: appid,
        body: body,
        mch_id: mch_id,
        nonce_str: nonce_str,
        notify_url: notify_url,
        openid: openid,
        out_trade_no: out_trade_no,
        spbill_create_ip: spbill_create_ip,
        total_fee: total_fee,
        trade_type: 'JSAPI'
    };
    var str = raw(ret);
    str = str + '&key=' + key;
    var md5Str = cryptoMO.createHash('md5').update(str).digest('hex');
    md5Str = md5Str.toUpperCase();
    return md5Str;
};

function raw(args) {
    var keys = Object.keys(args);
    keys = keys.sort();
    var newArgs = {};
    keys.forEach(function(key) {
        newArgs[key.toLowerCase()] = args[key];
    });

    var str = '';
    for (var k in newArgs) {
        str += '&' + k + '=' + newArgs[k];
    }
    str = str.substr(1);
    return str;
};

function paysignjs(appid, nonceStr, package, signType, timeStamp) {
    var ret = {
        appId: appid,
        nonceStr: nonceStr,
        package: package,
        signType: signType,
        timeStamp: timeStamp
    };
    var str = raw1(ret);
    str = str + '&key=' + key;
    return cryptoMO.createHash('md5').update(str).digest('hex');
};

function raw1(args) {
    var keys = Object.keys(args);
    keys = keys.sort()
    var newArgs = {};
    keys.forEach(function(key) {
        newArgs[key] = args[key];
    });

    var str = '';
    for (var k in newArgs) {
        str += '&' + k + '=' + newArgs[k];
    }
    str = str.substr(1);
    return str;
};

function getNonceStr() {
    return Math.random().toString(36).substr(2, 15)
};

router.post('/login/wechat', function(req, res) {
    console.log('aa')
})
module.exports = router;