// 可以根据 id、class、element 查找元素 
// param (字符串) : #id    .class    tag
// obj : 父元素
function $(param, obj) { // #box
	obj = obj || document; // 没有传递 obj 参数，则默认使用 document
	if (param.charAt(0) === "#") // id
		return document.getElementById(param.slice(1));
	if (param.indexOf(".") === 0) // class
		return getByClass(param.slice(1), obj);

	return obj.getElementsByTagName(param); // tag
}

// 如何解决 getElementsByClassName 兼容问题
function getByClass(className, obj) {
	obj = obj || document;
	if (obj.getElementsByClassName) // 支持 getElementsByClassName 方法的使用
		return obj.getElementsByClassName(className);
	/* 不支持 getElementsByClassName 方法的使用 */
	// 保存所有查找到的元素的数组结构
	var result = []; 
	// 查找出 obj 对象后代所有元素
	var tags = obj.getElementsByTagName("*");
	// 遍历每个元素
	for (var i = 0, len = tags.length; i < len; i++) {
		// 获取到当前遍历元素所使用的所有类名
		var classNames = tags[i].className.split(" ");
		// 遍历当前元素的每个类名
		for (var j = 0, l = classNames.length; j < l; j++) {
			if ( classNames[j] === className ) { // 说明当前遍历到的元素使用过要查找的类名
				result.push(tags[i]);
				break;
			}
		}
	}

	// 返回结果集
	return result;
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
function getOffsetTop(element){
	//先获取一次 element 元素距离祖先节点中有定位节点的顶部高度
	var offsetTop = element.offsetTop;
	//获取 element 元素祖先节点中有定位的最近的节点
	var current = element.offsetParent;

	// 可能在 element 的祖先节点中有多个节点有定位
	// 则每个节点的定位位置都应该获取到并且累加起来
	while ( current !== null){
		offsetTop += current.offsetTop;
		current = current.offsetParent;
	}
	return offsetTop;
}

// 获取/设置指定元素在文档中的（绝对）定位坐标
// 返回元素在文档中定位坐标的对象
// 该对象有两个属性：{top, left}
function offset(element, coordinates) {
	var offsetTop = 0, // 累加的 top 值
		offsetLeft = 0, // 累加的 left 值
		isGet = (typeof coordinates === "undefined"), // 标记是否获取坐标  true:获取  false:设置
		current = isGet ? element : element.offsetParent;
	
	// 将 current 元素在文档中的定位坐标累加计算出来
	// true时为 element 本身，false为 element 元素其祖先元素中最近的有定位的元素节点
	do {
		offsetTop += current.offsetTop;
		offsetLeft += current.offsetLeft;
		current = current.offsetParent;
	} while (current !== null);

	if (isGet){ // 获取坐标，则返回表示坐标的对象
		return {
			top : offsetTop,
			left : offsetLeft
		};
	} else { // 设置坐标
		element.style.top = (coordinates.top - offsetTop) + "px";
		element.style.left = (coordinates.left - offsetLeft) + "px";
	}
}

function width(element){
	return parseFloat(css(element,"width"));
}

function height(element){
	return parseFloat(css(element,"height"));
}

function innerWidth(element) {
	return element.clientWidth;
}

function innerHeight(element) {
	return element.clientHeight;
}

function outerWidth(element, bool) {
	bool = typeof bool === "undefined" ? false : bool;
	return bool ? element.offsetWidth + parseFloat(css(element,"marginLeft")) +parseFloat(css(element,"marginRight")) : element.offsetWidth;
}

function outerHeight(element, bool) {
	bool = typeof bool === "undefined" ? false : bool;
	return bool ? element.offsetHeight + parseFloat(css(element,"marginTop")) +parseFloat(css(element,"marginBottom")) : element.offsetHeight;
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
	if (typeof value === "undefined") { // 读取
		// 获取当前域下所有的 cookie，保存到 cookies 数组中
		var cookies = document.cookie.split("; ");
		// 遍历 cookies 数组中的每个元素
		for (var i = 0, len = cookies.length; i < len; i++) {
			// cookies[i] : 当前遍历到的元素，代表的是 "key=value" 意思的字符串，
			// 将字符串以 = 号分割返回的数组中第一个元素表示 key，
			// 第二个元素表示 value
			var cookie = cookies[i].split("=");
			// 判断是否是要查找的 key，对查找的 key 、value 都要做解码操作
			if (decodeURIComponent(cookie[0]) === key) {
				return decodeURIComponent(cookie[1]);
			}
		}
		// 没有查找到指定的 key 对应的 value 值，则返回 null
		return null;
	}

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

// 查找指定的值 value 在数组 arrray 中的索引
// -1 表示未找到
function inArray(value, array) {
	for (var i = 0, len = array.length; i < len; i++) {
		if (value === array[i])
			return i;
	}
	return -1;
}

// 运动函数
// element : 待实现运动动画的元素
// options : 运动属性的配置对象
// speed : 运动时间
// fn : 函数，运动动画执行结束后，还需要再执行的函数
function animate(element, options, speed, fn) {
	if (typeof speed === "function"  || typeof speed === "undefined"){
		fn = speed;
		speed = 400;
	}

	// 先取消在 element 元素上的运动计时器
	clearInterval(element.timer);

	// 存放各属性起始值的对象
	var startPosition = {};
	for (var attr in options) {
		startPosition[attr] = parseFloat(css(element, attr));
	}
	
	var startTime = +new Date(); // 记录开始运动的时间
	// 启动计时器，实现运动效果
	element.timer = setInterval(function(){
		var elapse = Math.min(+new Date() - startTime, speed); // 运动时间差
		// 循环为每个属性值赋新计算值
		// 线性运动公式：(终值-初值) / 总时间 * 运动耗时 + 初值
		for (var attr in options) {
			var val = (options[attr] - startPosition[attr]) / speed * elapse + startPosition[attr];
			element.style[attr] = val + (attr === "opacity" ? "" : "px");
			if (attr === "opacity")
				element.style.filter = "alpha(opacity="+ (val * 100) +")";
		}
		if (elapse === speed){ // 到达运动总时间，则停止计时器
			clearInterval(element.timer);
			// 运动执行结束后需要继续执行的函数
			fn && fn();
		}
	}, 30);
}

/*
	options = {
		type : "get|post", // 请求方式
		url : "", // 请求资源路径
		async : true, // 是否异步
		data : {"name":"小明","msg":"你好"}, // 需要发送给服务器的数据
		dataType : "text|json", // 预期服务器响应数据的格式
		headers : {"":"", "":""}, // 需要设置的请求头
		complete : function(xhr){}, // 请求资源成功/失败，都会执行的函数
		success : function(data){}, // 请求资源成功时执行的函数, data为响应的数据
		error : function(xhr){} // 请求资源失败时执行的函数
	};		
*/
function ajax(options) {
	if (!options.url) // 没有请求资源，则结束
		return;
	// 创建对象
	var xhr;
	if (window.XMLHttpRequest)
		xhr = new XMLHttpRequest();
	else
		xhr = new ActiveXObject("Microsoft.XMLHTTP");

	var method = options.type || "get", // 请求方式
		url = options.url, // 请求资源
		async = typeof options.async !== "undefined" ? options.async : true, // 是否异步
		param = null; // 查询字符串

	// 有查询字符串，则组装查询字符串
	if (options.data) {
		param = "";
		for (var attr in options.data) {
			param += attr + "=" + options.data[attr] + "&";
		}
		// 如 a=b& 所截取的 param 应该不包含 & 
		param = param.substring(0, param.length - 1);//不包括结束位置
	}
	if (method === "get"){ // get 请求，将查询字符串连接到 url 后
		url += "?" + param;
		param = null;
	}

	// 建立连接
	xhr.open(method, url, async);
	// 如果是 post 提交请求，则设置头信息
	if (method === "post")
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	// 有其它头信息的设置
	if (options.headers) {
		for (var attr in options.headers) {
			xhr.setRequestHeader(attr, options.headers[attr]);
		}
	}
	// 发送请求
	xhr.send(param);
	// 回调
	xhr.onreadystatechange = function(){
		if (xhr.readyState === 4) { // 响应就绪
			options.complete && options.complete(xhr);
			if (xhr.status === 200) { // ok
				var data = xhr.responseText;
				if (options.dataType === "json")
					data = JSON.parse(data);
				// 请求资源成功执行函数
				options.success && options.success(data);
			} else {
				options.error && options.error(xhr);
			}
		}
	};
}

// 处理get请求
// get("xxx.php", {name:"小明"}, function(){}, "json");
// get("yyy.php", function(){}, "json");
function get(url, data, fn, dataType){
	if (!url)
		return;
	if (typeof data === "function"){
		dataType = fn;
		fn = data;
	}
	var options = {
		"type" : "get",
		"url" : url,
		"data" : data,
		"success" : fn,
		"dataType" : dataType
	};
	ajax(options);
}

// 处理post请求
function post(url, data, fn, dataType){
	if (!url)
		return;
	if (typeof data === "function"){
		dataType = fn;
		fn = data;
	}
	var options = {
		"type" : "post",
		"url" : url,
		"data" : data,
		"success" : fn,
		"dataType" : dataType
	};
	ajax(options);
}