// 可以根据 id、class、element 查找元素 
// param (字符串) : #id    .class    tag
// obj : 父元素
function $(param, obj) { // #box
	
}

// 如何解决 getElementsByClassName 兼容问题
function getByClass(className, obj) {
	
	 // 支持 getElementsByClassName 方法的使用
		
	/* 不支持 getElementsByClassName 方法的使用 */
	// 保存所有查找到的元素的数组结构
	
	// 查找出 obj 对象后代所有元素
	
	// 遍历每个元素
	

	// 返回结果集

}
//获取指定元素的某一个css属性值
//attr:指定的css属性名称（字符串）
function css(obj,attr){
	/*if (obj.crrentStyle) {
		return obj.currentStyle[attr];
	}
	return getComputedStyle(obj)[attr];*/
	return obj.currentStyle ? obj.currentStyle[attr] : getComputedStyle(obj,null)[attr];
}

// 为指定元素添加指定的事件绑定
function bind( element,type,fn){
	if ( element.addEventListener){//支持使用 addEventlistener 方法添加事件监听
		if( type.indexOf("on") === 0)
			type = type.slice(2);

		element.addEventListener(type, fn, false);
	}else {//attachEvent()
		if ( type.indexOf("on") !== 0)
			type = "on" + type;
		element.attachEvent(type,fn);
	}
}

//找出指定的元素在文档中 top 定位坐标
function getOffetTop(element){
	//先获取一次 element 元素距离祖先节点中有定位节点的顶部高度
	
	//获取 element 元素祖先节点中有定位的最近的节点
	

	// 可能在 element 的祖先节点中有多个节点有定位
	// 则每个节点的定位位置都应该获取到并且累加起来
	
}

// 获取/设置指定元素在文档中的（绝对）定位坐标
// 返回元素在文档中定位坐标的对象
// 该对象有两个属性：{top, left}
function offset(element, coordinates) {
	
	
	// 将 current 元素在文档中的定位坐标累加计算出来
	// true时为 element 本身，false为 element 元素其祖先元素中最近的有定位的元素节点
	

	
}

function innerWidth(element) {
	
}

function innerHeight(element) {
	
}

function outerWidth(element, bool) {
	
}

function outerHeight(element, bool) {
	
}

// 保存 cookie
// key : cookie 名
// value : cookie 值
// options : 可选配置参数
//		options = {
//			expires : 7|new Date(), // 失效时间
//			path : "/", // 路径
//			domain : "", // 域名
//			secure : true // 安全连接
//		}

function cookie(key, value, options) {
	/* read 读取 */
	// 如果没有传递 value ，则表示根据 key 读取 cookie 值
	

	/* write 设置 */
	// 设置 options 默认为空对象
	options = options || {};
	// key = value，对象 key，value 编码
	var cookie = encodeURIComponent(key) + "=" + encodeURIComponent(value);
	// 失效时间
	if ((typeof options.expires) !== "undefined") { // 有配置失效时间
		if (typeof options.expires === "number") { // 失效时间为数字
			var days = options.expires, 
				t = options.expires = new Date();
			t.setDate(t.getDate() + days);
		} 
		cookie += ";expires=" + options.expires.toUTCString();
	}
	// 路径
	if (typeof options.path !== "undefined")
		cookie += ";path=" + options.path;
	// 域名
	if (typeof options.domain !== "undefined")
		cookie += ";domain=" + options.domain;
	// 安全连接
	if (options.secure)
		cookie += ";secure";

	// 保存
	document.cookie = cookie;
}

// 从所有的 cookie 中删除指定的 cookie
function removeCookie(key, options) {
	options = options || {};
	options.expires = -1; // 将失效时间设置为 1 天前
	cookie(key, "", options);
}