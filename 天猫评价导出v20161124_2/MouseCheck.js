$(function() {
    var selfTop = this
    selfTop.defered = $.Deferred()
    selfTop.he = 0;
    ///获取cookie
    function getCookie(name) {
        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg))
            return unescape(arr[2]);
        else
            return null;
    }

    function repeat(target, n) {
        return (new Array(n + 1)).join(target);
    }

    function getAjaxGoBack(urls, zhanghangList) {

        var currentUrl = urls[selfTop.seed]
        $.getJSON(currentUrl).done(function(res) {
            var list = res.data.orderList
            $.each(list, function(index, item) {
                var zhanghang = {
                    oid: item.buyerOrder,
                    pid: item.productId
                }
                zhanghangList.push(zhanghang)
            })
            selfTop.seed++;
            selfTop.he++;
            if (selfTop.he > 3) {
                selfTop.he = 0;
            }
            $("div.layui-m-layercont>p")[0].textContent = "共" + urls.length + "页当前第" + selfTop.seed + "页,请勿操作," + repeat('呵', selfTop.he);
            console.log("正在处理第" + selfTop.seed + "页");
            if (urls.length == selfTop.seed) {
                selfTop.defered.resolve(zhanghangList)
                console.log("处理完成");
                layer.closeAll()
                return selfTop.defered.promise()
            } else {
                getAjaxGoBack(urls, zhanghangList);
            }

        })
        return selfTop.defered;
    }
    var keywordTypeTable = {
            '买家昵称': 'buyerNick',
            '订单编号': 'orderId',
            '宝贝ID': 'itemId',
            '回评者昵称': 'replyNick',
            '关键词': 'keyword'

        }
        //评论类型
    var contentTypeTable = {
        '已解释': 'explained',
        '有图片': 'hasPic',
        '追评': 'hasAppend',
        '未解释': 'notExplained',
        '主评': 'all'
    }

    console.log("提取订单程序加载完成");
    var btn = $("<button class='sui-btn btn-primary action explain' type='button'>开始提取</button>").click(function(event) {
        event.preventDefault();
        selfTop.seed = 0
        selfTop.zhanghangList = []
        console.clear();
        var self = this;
        console.log("我要开始搞了！！！");
        var activeNum = $('span.pager-info>span')[1].textContent
        console.log('最大页码:' + activeNum);
        var tab_token = getCookie('_tb_token_');
        console.log('当前tb_token:' + tab_token);
        var SearchKeywordType = $("div.rct-select-options>ul").find("li.active").html(); 
        var SearchKeyValue = keywordTypeTable[SearchKeywordType] + "=" + $("input.search-ipt").val();
        console.log(SearchKeyValue);
        var datetimeRange = $("span.date-text");
        ///开始时间
        var startTime = "startTime=";
        if (datetimeRange.length > 1) {
            startTime += datetimeRange[0].textContent

        }
        //结束时间
        var endTime = "endTime=";
        if (datetimeRange.length === 2) {
            endTime += datetimeRange[1].textContent

        }

        console.log(startTime, endTime);
        //评论类型筛选
        var contentType = $("div.filter-bar>").find("ul>li.active").html();
        console.log(contentTypeTable[contentType]);
        ///是否有内容的评价
        var validRate = "validRate=" + $("label.checkbox-pretty.inline.valid-rate.checked>input").val();
        console.log("有内容" + validRate);
        // https://seller-rate.tmall.com/evaluation/GetEvaluations.do?_tb_token_=QLSPWl1qXk0O&replyNick=ss&pageNum=1&type=all&filterConditions=all&orderType=gmtCreate%2Cdesc&startTime=2016-11-09&endTime=2016-11-09&validRate=1
        var url = "https://seller-rate.tmall.com/evaluation/GetEvaluations.do?_tb_token_=" + tab_token + "&" + SearchKeyValue + "&type=all&filterConditions=" + contentTypeTable[contentType] + "&orderType=gmtCreate%2Cdesc&" + endTime + "&" + startTime + "&" + validRate + "&pageNum=";

        var maxPage = parseInt(activeNum);
        // var promises = [];
        var urlArrays = []
        for (var i = 1; i <= maxPage; i++) {
            //  promises.push(getAjax(url + i)); 
            urlArrays.push(url + i)
        }
        layer.open({
            content: "请耐心等待有" + activeNum + "页要处理",
            type: 2,
            shadeClose: false
        });
        var items = getAjaxGoBack(urlArrays, selfTop.zhanghangList)

        $.when(items).done(function(items) {
            var list = '订单号,宝贝ID\r\n'
            for (var a = 0; a < items.length; a++) {
                list += items[a].oid + "'," + items[a].pid + "'\r\n"
            }
            var BB = Blob
            var filename = (new Date()).valueOf() + ' 天猫.csv'
            saveAs(
                new BB(
                    ['\ufeff' + list] // \ufeff防止utf8 bom防止中文乱码
                    , { type: 'text/plain;charset=utf8' }
                ), filename.substr(8)
            )
            selfTop.defered = $.Deferred()
        })

        console.log("请耐心等待有" + activeNum + "页要处理");

    })
    $('span.pager-info').parent().append(btn);




})