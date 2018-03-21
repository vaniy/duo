var express = require('express');
var router = express.Router();
var BSON = require('bson');
var request = require('request');

var config = require('../config/config');
var aotuConfig = config.wx_config.aotu;
var dbHandler = require('../lib/dbHandler');

var util = require('../util/util');

// const language = require('../lib/resource')

router.get('/login', function(req, res, next) {
    if (req.session && req.session.user && req.session.user.openId) {
        res.redirect('/' + req.query.url);
    } else {
        var host = req.headers.host;
        var rUrl = encodeURIComponent('http://www.taduoke.com/getWechatUserInfo?url=' + req.query.url);
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
                        .then(function(data) {
                            return res.status(200).send(data);
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
        res.render('account', { title: '' });
    } else {
        res.redirect('/login?url=account');
    }
});

router.get("/person", function(req, res, next) {
    res.render('person', { title: '' });
});

router.get("/myOrder", function(req, res, next) {
    res.render('myOrder', { title: '' });
});

router.get("/myDistributor", function(req, res, next) {
    res.render('myDistributor', { title: '' });
});

router.get("/myProfit", function(req, res, next) {
    res.render('myProfit', { title: '' });
});

router.get("/myWithdraw", function(req, res, next) {
    res.render('myWithdraw', { title: '' });
});

router.get("/clockIndex", function(req, res, next) {
    if (req.session && req.session.user && req.session.user.openId) {
        dbHandler.getUserClock(req, res, req.session.user.openId)
    } else {

    }
    res.render('clockIndex', { title: '' });
});

router.get("/addClock", function(req, res, next) {
    res.render('addClock', { title: '' });
});

router.get("/ranking", function(req, res, next) {
    res.render('ranking', { title: '' });
});

router.get("/checkClock", function(req, res, next) {
    res.render('checkClock', { title: '' });
});

router.get("/order", function(req, res, next) {
    res.render('order', { title: '' });
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

module.exports = router;