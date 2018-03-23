function buildManagementView() {
    return `
    <div class="sidebar-nav">
    <div class='leftNavigation'>
        <button class='left btn order'>订单管理</button>
        <button class='left btn money'>提现管理</button>
    </div>
</div>
<div class="main_container">
    <div class="order_main main" style="display:none">
        <input class='searchInput' type="text" placeholder="请输入要查询的订单号"><button class='searchOrder'>确认</button>
        <p>订单管理</p>
        <div class="order_container"></div>
    </div>
    <div class="money_main main" style="display:none">
        <p>提现管理</p>
        <div class="money_container"></div>
        <!--</form>-->
    </div>
</div>`
}

module.exports.buildManagementView = buildManagementView;