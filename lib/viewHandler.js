function buildProductListItemView(data, language, languageCode) {
    if (data && data.products && data.products.length > 0) {
        var featureItem = '<div class="products-list row">';
        var normalItem = '<div class="products-list row">';
        var languageRoute = languageCode === 'USA' ? 'en-US' : 'zh-CN';
        data.products.map((child, index) => {
            if (index < 3) {
                featureItem = `${featureItem}
                <div class="product-card col-xs-6 col-md-3 toggle-element">
                    <div class="card-container">
                        <div class="product-image">
                            <a href="/${languageRoute}/productdetail?pid=${child.productId}">
                                <img src="${child.productImage}" class="lazyloaded">
                            </a>
                        </div>
                        <hr>
                        <h4>
                            <a href="/${languageRoute}/productdetail?pid=${child.productId}">${child.prodcutTitle}
                                <span class="glyphicon glyphicon-play"></span></a>
                        </h4>
                        <div class="description item-open">
                            <p>
                            ${child.productDescription}
                            </p>
                        </div>
                        <div class="footer-right">
                            <a href="#" class="toggle-card toggle-element-link initialize">
                                <span class="item-closed">${language.common.seeMore}</span>
                            </a>
                        </div>
                    </div>
                </div>`
            }
            else {
                if (index % 4 === 0 && index !== 4) {
                    normalItem = `${normalItem}</div><div class="products-list row">
                    <div class="product-card col-xs-6 col-md-3 toggle-element">
                    <div class="card-container">
                        <div class="product-image">
                            <a href="/${languageRoute}/productdetail?pid=${child.productId}">
                                <img src="${child.productImage}" class="lazyloaded">
                            </a>
                        </div>
                        <hr>
                        <h4>
                            <a href="/${languageRoute}/productdetail?pid=${child.productId}">${child.prodcutTitle}
                                <span class="glyphicon glyphicon-play"></span></a>
                        </h4>
                        <div class="description item-open">
                            <p>
                            ${child.productDescription}
                            </p>
                        </div>
                        <div class="footer-right">
                            <a href="#" class="toggle-card toggle-element-link initialize">
                                <span class="item-closed">${language.common.seeMore}</span>
                            </a>
                        </div>
                    </div>
                </div>`
                    if (index === data.products.length - 1) {
                        normalItem = `${normalItem}</div>`
                    }
                }
                else if (index === data.products.length - 1) {
                    normalItem = `${normalItem}
                    <div class="product-card col-xs-6 col-md-3 toggle-element">
                        <div class="card-container">
                            <div class="product-image">
                                <a href="/${languageRoute}/productdetail?pid=${child.productId}">
                                    <img src="${child.productImage}" class="lazyloaded">
                                </a>
                            </div>
                            <hr>
                            <h4>
                                <a href="/${languageRoute}/productdetail?pid=${child.productId}">${child.prodcutTitle}
                                    <span class="glyphicon glyphicon-play"></span></a>
                            </h4>
                            <div class="description item-open">
                                <p>
                                ${child.productDescription}
                                </p>
                            </div>
                            <div class="footer-right">
                                <a href="#" class="toggle-card toggle-element-link initialize">
                                    <span class="item-closed">${language.common.seeMore}</span>
                                </a>
                            </div>
                        </div>
                    </div></div>`
                }
                else {
                    normalItem = `${normalItem}
                    <div class="product-card col-xs-6 col-md-3 toggle-element">
                        <div class="card-container">
                            <div class="product-image">
                                <a href="/${languageRoute}/productdetail?pid=${child.productId}">
                                    <img src="${child.productImage}" class="lazyloaded">
                                </a>
                            </div>
                            <hr>
                            <h4>
                                <a href="/${languageRoute}/productdetail?pid=${child.productId}">${child.prodcutTitle}
                                    <span class="glyphicon glyphicon-play"></span></a>
                            </h4>
                            <div class="description item-open">
                                <p>
                                ${child.productDescription}
                                </p>
                            </div>
                            <div class="footer-right">
                                <a href="#" class="toggle-card toggle-element-link initialize">
                                    <span class="item-closed">${language.common.seeMore}</span>
                                </a>
                            </div>
                        </div>
                    </div>`
                }

            }
        })
        featureItem = `${featureItem}</div>`
        return {
            featureItem: featureItem ? featureItem : '',
            normalItem: data.products.length > 3 ? normalItem : ''
        }
    }
    else {
        return {
            featureItem: '',
            normalItem: ''
        }
    }
}

function buildProductDetailView(data, language, languageCode) {
    var benefits = '';
    if (data.productCharacter && data.productCharacter.length > 0) {
        benefits = '<ul>'
        data.productCharacter.map((child, index) => {
            benefits = `${benefits}<li>${child}</li>`
        })
        benefits = `${benefits}</ul>`
    }
    var overView = '';
    if (data.productOverView && data.productOverView !== '') {
        overView = `    
        <div class="container benefit-story">
            <div class="row">
            <div class="col-sm-11">
                <div class="row row-centered">
                <div class="col-xs-4 col-sm-6 benefit-story-image">
                    <img src="${data.productOverViewImages}" alt="" class="img-responsive img-circle lazyloaded">
                </div>
                <div class="col-xs-8 col-sm-6 benefit-story-content">
                    <h3>${data.productOverTitle}</h3>
                    <p>${data.productOverView}</p>
                </div>
                </div>
            </div>
            </div>
        </div>`
    }

    return {
        benefits: benefits,
        overView: overView
    }
}

function buildHomeView(data, language, languageCode) {
    if (data && data.length > 0) {
        var languageRoute = languageCode === 'USA' ? 'en-US' : 'zh-CN';
        let newsScroll = `<div class="carousel-items slick-initialized slick-slider"><div aria-live="polite" class="slick-list-1" tabindex="0"><div class="slick-track">`;
        let newsCase = `
        <section class="cases">
          <div class="container">
            <div class="row row-centered element-heading">
              <div class="col-xs-12 col-sm-9 col-md-7">
                <h2 class="sub-heading">案例分析</h2>
              </div>
            </div>`;
        let newsScrollArr = [];
        let newsCaseArr = [];
        data.map((child, index) => {
            if (child.type === '1') {
                newsScrollArr.push(child);
            }
            else {
                newsCaseArr.push(child);
            }
        })

        if (newsScrollArr.length > 0) {
            newsScrollArr.map((child, index) => {
                if (index % 2 === 0 && index !== 0) {
                    newsScroll = `${newsScroll}</div><div class="slick-track">
                    <div class="carousel-item dark-element slick-slide slick-cloned" style="background-image:url(/img/kemppi_weld_1.jpg);width:566px;">
                    <div class="carousel-parent">
                    <div class="vertical-content">
                        <div class="item-content">
                        <h2 class="sub-heading">${child.newsTitle}</h2>
                        <p class="description">${child.newsDescription}</p>
                        <div class="cta-buttons">
                            <a href="/${languageRoute}/news?nid=${child.newsId}" class="cta-button main-cta">${language.common.knowMore}</a>
                        </div>
                        </div>
                     </div>
                    </div>
                </div>`
                    if (index === newsScrollArr.length - 1) {
                        newsScroll = `${newsScroll}</div>`
                    }
                }
                else {
                    newsScroll = `${newsScroll}
                    <div class="carousel-item dark-element slick-slide slick-cloned" style="background-image:url(${child.newsImages});width:566px;">
                        <div class="carousel-parent">
                        <div class="vertical-content">
                            <div class="item-content">
                            <h2 class="sub-heading">${child.newsTitle}</h2>
                            <p class="description">${child.newsDescription}</p>
                            <div class="cta-buttons">
                                <a href="/${languageRoute}/news?nid=${child.newsId}" class="cta-button main-cta">${language.common.knowMore}</a>
                            </div>
                            </div>
                         </div>
                        </div>
                    </div>`

                    if (index === newsScrollArr.length - 1) {
                        newsScroll = `${newsScroll}</div>`
                    }
                    //   <button type="button" class="slick-next" style="display:block;">
                    //     <span class="kemppi-icon icon-carousel-next">></span>
                    //   </button>
                    // </div>`
                }
            })
            newsScroll = `${newsScroll}<button type="button" class="slick-next" style="display:block;">
            <span class="kemppi-icon icon-carousel-next">></span>
          </button>
        </div>`
        }
        else {
            newsScroll = '';
        }

        if (newsCaseArr.length > 0) {
            newsCaseArr.map((child, index) => {
                newsCase = `${newsCase}
                <div class="row featurette">
                <div class="col-md-7 text">
                  <h3 class="featurette-heading">${child.newsTitle}</h3>
                  <p class="lead">${child.newsDescription}</p>
                  <div class="cta-buttons">
                    <a href="/${languageRoute}/news?nid=${child.newsId}" class="cta-button main-cta">${language.common.knowMore}</a>
                  </div>
                </div>
                <div class="col-md-5">
                  <img src="${child.newsImages}" class="featurette-image img-responsive center-block">
                </div>
              </div>`
            })
            newsCase = `${newsCase}</div></section>`
        }
        else {
            newsCase = '';
        }

        return {
            newsScroll: newsScroll,
            newsCase: newsCase
        }
    }
}

function buildFugeManagementView() {
    return `
    <div class="sidebar-nav">
    <div class='leftNavigation'>
        <button class='left btn create'>创建用户</button>
        <button class='left btn user'>用户管理</button>
    </div>
</div>
<div class="main_container">
    <div class="createStar_main main">
        <div class="create_container"></div>
        <!--</form>-->
    </div>
    <div class="user_main main" style="display:none">
        <input class='searchInput' type="text" placeholder="请输入要修改人物的名字"><button class='searchStar'>确认</button>
        <p>用户管理</p>
        <div class="user_container"></div>
    </div>
</div>`
}

function buildTenZhongMangementView() {
    return `
    <div class="sidebar-nav">
        <div class='leftNavigation'>
            <button class='left btn itemcreate'>创建产品</button>
            <button class='left btn item'>产品管理</button>
            <button class='left btn menu'>分类管理</button>
            <button class='left btn newsCreate'>创建新闻</button>
            <button class='left btn news'>新闻管理</button>
        </div>
    </div>
    <div class="main_container">
        <div class="createItem_main main">
            <div class="createItem_container"></div>
            <!--</form>-->
        </div>
        <div class="item_main main" style="display:none">
            <input class='searchItemInput' type="text" placeholder="请输入要修改产品设备号"><button class='searchItem'>确认</button>
            <p>产品管理</p>
            <div class="item_container"></div>
        </div>
        <div class="menu_main main" style="display:none">
            <input class='searchMenuInput' type="text" placeholder="请输入要修分类编号(三级分类)"><button class='searchMenu'>确认</button>
            <p>菜单管理</p>
            <div class="menu_container"></div>
        </div>
        <div class="createNews_main main" style="display:none">
            <div class="createNews_container"></div>
            <!--</form>-->
        </div>
        <div class="news_main main" style="display:none">
            <input class='searchNewsInput' type="text" placeholder="请输入要修改新闻编号"><button class='searchNews'>确认</button>
            <p>新闻管理</p>
            <div class="news_container"></div>
        </div>
    </div>`
}

module.exports.buildProductListItemView = buildProductListItemView;
module.exports.buildProductDetailView = buildProductDetailView;
module.exports.buildHomeView = buildHomeView;
module.exports.buildFugeManagementView = buildFugeManagementView;
module.exports.buildTenZhongMangementView = buildTenZhongMangementView;