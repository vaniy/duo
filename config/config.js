module.exports = {
    wx_config: {
        aotu: {
            token: 'taduoke',
            appid: 'wx4c10b88f9a6c8bc8',
            secret: '24c86fbe8899ca57b59213147df4c120',
            cached: {},
            menu: {
                "button": [{
                    "name": "Hello Electone",
                    "sub_button": [{
                        "type": "view",
                        "name": "Hello Electone",
                        "url": "http://www.stayniche.com/"
                    }, {
                        "type": "view",
                        "name": "点我",
                        "url": "http://www.stayniche.com"
                    }]
                }, {
                    "name": "小小音乐厅",
                    "sub_button": [{
                        "type": "view",
                        "name": "小小音乐厅",
                        "url": "http://www.stayniche.com/"
                    }, {
                        "type": "view",
                        "name": "精品课程",
                        "url": "http://www.cztzhg.com/view"
                    }, {
                        "type": "view",
                        "name": "预约课程",
                        "url": "http://www.stayniche.com/"
                    }]
                }, {
                    "name": "商城",
                    "sub_button": [{
                        "type": "view",
                        "name": "乐器商城",
                        "url": "https://weidian.com/item.html?itemID=2165033587&string=b2M1b050ODd6d0xpUXMtTlpaa3RqdTlkZFRQQQ&state=H5WXshareOld&share_relation=c6191fa80118e91b_735743339_1&wfr=wxShare&from=singlemessage&isappinstalled=0"
                    }, {
                        "type": "view",
                        "name": "课程购买",
                        "url": "http://www.stayniche.com/"
                    }]
                }]
            }
        },
        tq: {
            "ipURL": "http://whois.pconline.com.cn/ipJson.jsp?json=true",
            "ipToCityNameURL": "http://apis.baidu.com/apistore/iplookupservice/iplookup?ip=",
            "ipToCityNameApiKey": "7328474baf90532437b4becdc5f65706",
            'cityUrl': 'http://apistore.baidu.com/microservice/cityinfo?cityname=',
            'weatherApikey': '7328474baf90532437b4becdc5f65706',
            'weatherUrl': 'http://apis.baidu.com/apistore/weatherservice/recentweathers?cityid='
        }
    }
};