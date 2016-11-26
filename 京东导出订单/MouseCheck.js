var jq = $.noConflict();
jq(function() {
    function getJsonData(items) {
        var result = [];
        jq(items).each(function(index, item) {
            if (index !== 0) {
                if ((index % 2) !== 0) {
                    var oid = jq(item).children()[0].childNodes[0].childNodes[1].textContent;
                    var star = jq(item).children()[1].childNodes[0].childNodes[1].className;
                    star = star.substr(7, 1);
                    var userName = jq(item).children()[4].childNodes[0].textContent;
                    userName = userName.substr(5);
                    // console.log(oid, star, userName);
                    var resultItem = {
                        orderId: oid,
                        point: star,
                        un: userName
                    }
                    result.push(resultItem);
                }
                if ((index % 2) === 0) {
                    var skuid = jq(item).children()[0].childNodes[0].childNodes[0].textContent;
                    skuid = skuid.substr(7);
                    result[result.length - 1].skid = skuid;
                }
            }
        });
        return result;
    }

    function exportExcel(fixItems) {
        if (fixItems.length == 0) {
            alert("没有找到改星级评价，请检查星级是否选择正确！");
            return;
        }
        var star1Check = jq("#star1")[0].checked;
        var star2Check = jq("#star2")[0].checked;
        var star3Check = jq("#star3")[0].checked;
        var star4Check = jq("#star4")[0].checked;
        var star5Check = jq("#star5")[0].checked;
        var strDic = {
                '1': star1Check,
                '2': star2Check,
                '3': star3Check,
                '4': star4Check,
                '5': star5Check
            }
            ///一个都没选
        var isCheck = star5Check || star4Check || star3Check || star2Check || star1Check;

        var BB = Blob;
        var excelFormat = '订单编号,评分,用户昵称,SKU ID\r\n';
        for (var e = 0; e < fixItems.length; e++) {
            if (!isCheck) {
                excelFormat += fixItems[e].orderId + ',' + fixItems[e].point + ',' + fixItems[e].un + ',' + fixItems[e].skid + '\r\n'
            }
            if (strDic[fixItems[e].point]) {
                excelFormat += fixItems[e].orderId + ',' + fixItems[e].point + ',' + fixItems[e].un + ',' + fixItems[e].skid + '\r\n'
            }
        }
        var startWart = "";
        if (!isCheck) {
            startWart = "全部星级";
        } else {
            for (var i = 1; i <= 5; i++) {
                if (strDic[i]) {
                    startWart += i;
                }
            }
            startWart += "星级";
        }
        var filename = (new Date()).valueOf() + "_" + startWart + "JD数据.csv";
        saveAs(
            new BB(
                ["\ufeff" + excelFormat] //\ufeff防止utf8 bom防止中文乱码
                , { type: "text/plain;charset=utf8" }
            ), filename.substr(8)
        );
    }
    console.log("提取订单程序加载完成");
    var json = jq("<button type='button'>导出</button>").click(function() {

        var lastButton = jq("a.next");
        var lastUrl = "";
        jq.each(lastButton, function(index, item) {
            if (jq(item).html() == "末页") {

                lastUrl = jq(item).attr("href")
                console.log("有多页数据");
            }
        })

        ///当只有一页数据时直接导出
        if (lastUrl == "") {
            var items = jq("div.tbl_box2>table>tbody>tr.thead");
            var onepageResult = getJsonData(items);
            exportExcel(onepageResult);
        } else {
            ///获取当前最大页码
            var pageNumber = parseInt(lastUrl.substr(lastUrl.lastIndexOf('=') + 1));
            //获取当前页
            var pageUrl = lastUrl.substr(0, lastUrl.lastIndexOf('=') + 1);
            var promises = [];
            for (var i = 1; i <= pageNumber; i++) {
                var dataUrl = pageUrl + i;
                var result = (function SendAjax(url) {
                    var deffred = jq.Deferred();
                    jq.get(url, function(data, textStatus, jqXHR) {
                        var reg = /<body>[\s\S]*<\/body>/g;
                        var html = reg.exec(data)[0];
                        var items = jq(html).find("div.tbl_box2>table>tbody>tr.thead");
                        deffred.resolve(getJsonData(items));
                    }).fail(function(error) {
                        deffred.reject(error);
                    });
                    return deffred.promise();
                })(dataUrl);
                promises.push(result);
            }
            //excel导出对象 
            jq.when.apply(this, promises).done(function() {
                var self = this;
                var fixItems = [];
                for (var a = 0; a < arguments.length; a++) {
                    if (arguments[a].length > 0) {
                        Array.prototype.push.apply(fixItems, arguments[a])
                    }
                }
                exportExcel(fixItems);
            });
            console.log("一共" + pageNumber + "页数据请过目");
        }
    });
    var star1 = jq("<label for='star1'>1<label><input id='star1' type=checkbox />");
    var star2 = jq("<label for='star2'>2<label><input id='star2' type=checkbox />");
    var star3 = jq("<label for='star3'>3<label><input id='star3' type=checkbox />");
    var star4 = jq("<label for='star4'>4<label><input id='star4' type=checkbox />");
    var star5 = jq("<label for='star5'>5<label><input id='star5' type=checkbox />");
    jq("select[name='wareAssessQueryParamBean.score']").parent().append(star1).append(star2).append(star3).append(star4).append(star5);
    jq("select[name='venderReplyFlag']").parent().append(json);
    console.clear();
    console.log("控件加载完毕 作者qq:279214779");
})