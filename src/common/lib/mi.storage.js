;
(function() {
	var s = window.localStorage;
	function set(key, value, filters) {
		if (key == undefined || value == undefined) return;
		if (typeof value != 'string') {
			value = JSON.stringify(value);
		}
		if (filters) { //如果存在过滤表达式，则先过滤，在保存
			value = filter(value, filters);
		}
		s && s.setItem(key, value);
	}
	function get(key, type) {
		if (!key || ! s) return null;
		var v = s.getItem(key);
		if (type == 'string') return v;
		return JSON.parse(v);
	}
	function remove(key) {
		if (!key || ! s) return;
		s.removeItem(key);
	}
	function clear() {
		s && s.clear();
	}
	function toMd5(value) {
		if (value == undefined) return '';
		if (typeof value != 'string') {
			value = JSON.stringify(value);
		}
		if (!md5) return '';
		return md5(value);
	}
	function isChanged(key, newValue, filters) {
		var v = get(key);
		if (filters) { //先对某些字段进行过滤
			v = filter(v, filters);
			newValue = filter(newValue, filters);
		}
		var oMd5 = toMd5(v);
		var nMd5 = toMd5(newValue);
		return oMd5 != nMd5;
	}
	/**
     * 过滤某些字段，比如cdnDomain这种字段
     * @param data:{string/object}要替换的字符串或者对象
     * @param filters:{Array}被替换的字符的键值对，例如[{reg:/"cdnDomain"\:"([^"]+)",/gm,replacement:'myurl'},{reg:/"remain":(\d+)/gm,replacement:0}] 
     * @param type{string}: 返回值类型，默认是string，可以是object
     * @return 替换后的字符串,如果type='object',返回object对象
     */
	function filter(data, filters, type) {
		if (!data) return '';
		if (typeof data != 'string') {
			data = JSON.stringify(data);
		}
		if (!filters) return data;
		if (! (filters instanceof Array)) {
			filters = [filters];
		}
		var ndata = data,
		len = filters.length,
		filter;
		for (var i = 0; i < len; i++) {
			filter = filters[i];
			if (typeof filter != 'object') continue;
			var reg = filter.reg,
			value = filter.replacement;
			if (! (reg instanceof RegExp)) {
				reg = new RegExp(reg, 'gm');
			}
			if (value == undefined) value = '';
			ndata = ndata.replace(reg, function($, $1) {
				var v = value;
				if (typeof $1 == 'string') { //有子表达式，则替换
					v = $.replace($1, value);
				}
				return v;
			});
		}
		if (type == 'object') {
			ndata = JSON.parse(ndata);
		}
		return ndata;
	}
	window.miStorage = {
		get: get,
		set: set,
		remove: remove,
		clear: clear,
		isChanged: isChanged,
		filter: filter
	};
})();

