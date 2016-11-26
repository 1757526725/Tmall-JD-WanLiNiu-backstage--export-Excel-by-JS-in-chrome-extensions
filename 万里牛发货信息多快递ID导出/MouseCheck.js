
$(function () {
 
 function getExcelContent(json){
 	console.log(json);
    var arrStr =  json;
    var formatArr = [];
    var ik = 0;
    for (var i = 0; i < arrStr.length; i++) {
        var salercpt_no = arrStr[i].salercpt_no+"'";
        var tp_tid = arrStr[i].tp_tid+"'";
        if (tp_tid==="'") {
tp_tid=salercpt_no;

        }
       var express_uid=arrStr[i].express_uid+"'";
        var expressNoArr = arrStr[i].expressNos;
        var expressNo = '';
        var expressSubNo = '';
                    if (expressNoArr.length===0) {

            	expressNo=express_uid;
            }
        for (var j = 0; j < expressNoArr.length; j++) {
            expressNo = expressNoArr[0]+"'";

            if(j == 0){
                continue;
            }
            expressSubNo =expressSubNo+ '|'+expressNoArr[j] ;
            
        }
        expressSubNo = expressSubNo.substring(0, expressSubNo.length);
        formatArr[ik] = salercpt_no+','+tp_tid+','+expressNo+','+expressSubNo;
        ik++;   
    } 
    var excelFormat = '系统订单号,天猫订单号,母件单号,子件单号\r\n';
    for (var i = 0; i < formatArr.length; i++) {
        excelFormat += formatArr[i]+'\r\n';
    }
    return excelFormat;
}
           localStorage.items="";
 function BigConsole(consoleStr){

     console.log('%c'+consoleStr, 'background-image:-webkit-gradient( linear, left top, right top, color-stop(0, #f22), color-stop(0.15, #f2f), color-stop(0.3, #22f), color-stop(0.45, #2ff), color-stop(0.6, #2f2),color-stop(0.75, #2f2), color-stop(0.9, #ff2), color-stop(1, #f22) );color:transparent;-webkit-background-clip: text;font-size:5em;');
 }
 function SendAjax(jsonStr,extData,i,url){

      ajax({
                    type:"post",
                    url:url, //添加自己的接口链接
                    timeOut:5000,
                    data:JSON.parse(jsonStr),
                    contentType:"text/javascript",

                     dataType: "json", //表示返回值类型，不必须
                    before:function(){
                      console.log("正准备请求第"+i+"次");  
                    },
                    success:function(res){
                                 var jsonResult=JSON.parse(res.substr(0,res.length)) ; 
               
                                var okdata={ 
                                    expressNos:[],
                                    salercpt_no:extData.salercpt_no,
                                    tp_tid:extData.tp_tid ,
                                      express_uid:extData.express_uid
                                }; 
                           
                      
                                for (var i = 0; i <jsonResult.data.length; i++) {
                                     okdata.expressNos.push(jsonResult.data[i].expressNo);
                              
                                }  
                                       
                                    //     console.log(okdata.expressNos);  
                         localStorage.items+="#"+JSON.stringify(okdata);
                    },
                    error:function(){
                        console.log("请求出错"); 
                    }
                });
 }
    console.log("提取订单程序加载完成"); 
    var btn = $("<button  >开始提取</button>").click(function () {
        console.clear();
       
        var self = this;
        console.log("我要开始搞了！！！");
        var jsonVal = $("#jsonVal").val();
        if ($.trim(jsonVal)==="") {
            BigConsole("请去NetWork中寻找有$isWrapper的json数据");
            return;
        }
        var mainJson=JSON.parse(jsonVal).data.data;
        console.log('一共' + mainJson.length+"条记录");
        if (mainJson.length==0) {

                BigConsole("没有找到数据");
        }

        var url = "http://erp.hupun.com/dorado/view-service";

        var self=this;
 
var expressRequest= {"action":"load-data","dataProvider":"saleInterceptor#querySFPacking","supportsEntity":true,"parameter":{"billUid":"553911372608313881CED21A830D3A46"},"resultDataType":"v:sale.query$[dtSalePacking]","context":{},"loadedDataTypes":["_dtGoods","GoodsSpec","Shop","dtStorage","dtMarkType","dtSide","dtSearch","dtGoods","MultiShop","PrintConfig","Order","dtSearchHistory","Catagory","Region","Trade","dtInvoice","dtCondition","TradeLog","dtBatch","dtSalePacking","dtJzPartner","dtSerialNumber","dtSearchGoods","dtTradeAddition","DistrCompany"]};
          localStorage.items="";
        for (var i = 0; i <= mainJson.length-1; i++) { 
            expressRequest.parameter.billUid=mainJson[i].salercpt_uid;
 
            var extData=Object.assign({},{ 
                    salercpt_no:mainJson[i].salercpt_no,
                    tp_tid:mainJson[i].tp_tid,
                    express_uid:mainJson[i].express_uid
            });
      
            var jsonStr=JSON.stringify(expressRequest) ;
  
      SendAjax(jsonStr,extData,i,url);
              
        }
       
       BigConsole("提取完成"+(new Date()).toString());
 

})
 var exportBtn=   $("<button id='saveBtn'>保存excel文件</button>").click(function(){

        var BB = self.Blob;
        var jsonStr = localStorage.items;
        if(!jsonStr){
            alert('内容不能为空');
            return false;
        }
        var allItemsArrayStr=jsonStr.split("#");
        var allItemsArray=[];
        for (var i =0; i <=allItemsArrayStr.length; i++) {
             var oneitem=allItemsArrayStr[i];
            if (oneitem!==""&& oneitem!==undefined) { 
                          var jsonItem=JSON.parse(oneitem);
                          allItemsArray.push(jsonItem);

            }
  
        } 
        if (allItemsArray.length===0) {
            BigConsole("元神护体，无导出数据");
            return ;
        }
        var excelFormat = getExcelContent(allItemsArray); 
        var filename=(new Date()).valueOf()+"_双11大卖.csv";
        saveAs(
              new BB(
                  ["\ufeff" + excelFormat] //\ufeff防止utf8 bom防止中文乱码
                , {type: "text/plain;charset=utf8"}
            )
            ,filename
        );
    
       BigConsole("已导出文件："+filename);
    });

        var json=$("<textarea id='jsonVal' style='margin: 0px; width: 208px; border-left-width: 10px;'></textarea>");
        $("#container").append(json);
                 $("#container").append(btn);
          $("#container").append(exportBtn);   
  console.clear();
        console.log("空间加载完成");


})
