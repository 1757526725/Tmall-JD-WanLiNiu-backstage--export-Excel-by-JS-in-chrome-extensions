# Tmall-JD-WanLiNiu-backstage--export-Excel-by-JS-in-chrome-extensions
京东 天猫 后台评价管理 Chrome插件 导出Excel

这三个文件夹分别是三个Chrome 插件

若要下载使用，打开chrome 浏览器>>扩展程序>>加载已解压的扩展程序。选择一个插件的文件夹

天猫后台 只针对 商品评价管理 ，可根据所有条件导出查询到的所有结果，csv
    天猫只导出了订单号 和商品ID
![image](https://raw.githubusercontent.com/shan333chao/Tmall-JD-WanLiNiu-backstage--export-Excel-by-JS-in-chrome-extensions/master/images/tmall.png)

京东商家管理后台 只针对 商品管理>>评价管理 ，将查询所有结果后直接导出csv文件，可选择用户评价的星级自定义导出
    京东导出了  订单编号、评分： 、用户昵称、SKU ID
![image](https://raw.githubusercontent.com/shan333chao/Tmall-JD-WanLiNiu-backstage--export-Excel-by-JS-in-chrome-extensions/master/images/jd.png)
万里牛后台  只针对  订单导出，支持一单多件快递的信息，每页支持最大200个，需要手动从请求信息中提取列表信息，然后填入才能导出
