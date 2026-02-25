/**
 * 携程景点数据接口
 * 基于携程移动端API获取北京地标和景点信息
 */

// 携程API接口地址
const CTRIP_POI_API = 'https://m.ctrip.com/restapi/soa2/13342/json/getSightRecreationList';
const CTRIP_SEARCH_API = 'https://m.ctrip.com/restapi/soa2/13342/json/SearchSightRecreation';
const CTRIP_DETAIL_API = 'https://m.ctrip.com/restapi/soa2/18254/json/getPoiMoreDetail';

// 北京的城市ID
const BEIJING_DISTRICT_ID = 1;

function formatPoi(poi) {
	return {
		id: poi.id || '',
		poiId: poi.poiId || '',
		name: poi.name || '',
		eName: poi.eName || '',
		rating: poi.commentScore || 0,
		commentCount: poi.commentCount || 0,
		image: poi.coverImageUrl || '',
		price: poi.price || 0,
		minPrice: poi.displayMinPrice || 0,
		latitude: poi.coordInfo?.gDLat || 0,
		longitude: poi.coordInfo?.gDLon || 0,
		tags: [
			...(poi.resourceTags || []),
			...(poi.tagNameList || []),
			...(poi.themeTags || [])
		],
		features: poi.shortFeatures || [],
		address: poi.address || ''
	};
}

function pickBestMatch(list, name) {
	if (!list || list.length === 0) return null;
	const exact = list.find(item => item.name === name);
	if (exact) return exact;
	const includes = list.find(item => item.name.includes(name) || name.includes(item.name));
	if (includes) return includes;
	const strong = list.find(item => item.name.replace(/-/g, '') === name);
	return strong || list[0];
}

function pickBestMatchWithAliases(list, name, aliases = []) {
	const pool = [name, ...aliases].filter(Boolean);
	for (const keyword of pool) {
		const exact = list.find(item => item.name === keyword);
		if (exact) return exact;
	}
	for (const keyword of pool) {
		const direct = list.find(item => item.name.includes(keyword));
		if (direct) return direct;
	}
	for (const keyword of pool) {
		const clean = list.find(item => item.name.replace(/-/g, '').includes(keyword));
		if (clean) return clean;
	}
	return list[0] || null;
}

function formatSearchResult(item) {
	return {
		id: item.id || item.bizId || '',
		poiId: item.poiId || item.bizId || '',
		name: item.name || '',
		eName: item.eName || '',
		rating: item.commentScore || 0,
		commentCount: item.commentCount || 0,
		image: item.coverImageUrl || '',
		price: item.price || 0,
		minPrice: item.displayMinPrice || 0,
		latitude: item.coordInfo?.gDLat || 0,
		longitude: item.coordInfo?.gDLon || 0,
		tags: [
			...(item.resourceTags || []),
			...(item.tagNameList || []),
			...(item.themeTags || []),
			...(item.tagName ? [item.tagName] : [])
		],
		features: item.shortFeatures || [],
		address: item.address || ''
	};
}

function extractDetailImage(detailData = {}) {
	const candidates = [
		detailData?.result?.basicInfo?.coverImageUrl,
		detailData?.result?.basicInfo?.imageUrl,
		detailData?.result?.basicInfo?.headImage,
		detailData?.result?.basicInfo?.image,
		detailData?.basicInfo?.coverImageUrl,
		detailData?.basicInfo?.imageUrl,
		detailData?.basicInfo?.headImage,
		detailData?.basicInfo?.image
	];
	return candidates.find(url => typeof url === 'string' && url.length > 0) || '';
}

/**
 * 获取景点列表
 * @param {Object} options 配置参数
 * @returns {Promise} 返回景点数据
 */
export function getAttractionsList(options = {}) {
	const {
		index = 1, // 页码
		count = 20, // 每页数量
		districtId = BEIJING_DISTRICT_ID, // 城市ID，默认北京
		sortType = 1 // 排序类型：0-综合排序，1-人气，2-好评
	} = options;

	const requestData = {
		fromChannel: 2,
		index,
		count,
		districtId,
		sortType,
		categoryId: 0,
		lat: 0,
		lon: 0,
		showNewVersion: true,
		locationFilterDistance: 300,
		locationDistrictId: 0,
		themeId: 0,
		level2ThemeId: 0,
		locationFilterId: 0,
		locationFilterType: 0,
		sightLevels: [],
		ticketType: null,
		commentScore: null,
		showAgg: true,
		fromNearby: '',
		sourceFrom: 'sightlist',
		themeName: '',
		scene: '',
		hiderank: '',
		isLibertinism: false,
		hideTop: false,
		head: {
			cid: '09031065211914680477',
			ctok: '',
			cver: '1.0',
			lang: '01',
			sid: '8888',
			syscode: '09',
			auth: '',
			xsid: '',
			extension: []
		}
	};

	return new Promise((resolve, reject) => {
		uni.request({
			url: CTRIP_POI_API,
			method: 'POST',
			data: requestData,
			header: {
				'content-type': 'application/json'
			},
			success: (res) => {
				if (res.statusCode === 200 && res.data && res.data.result) {
					const poiList = res.data.result.sightRecreationList || [];
					// 格式化数据
					const formattedList = poiList.map(formatPoi);
					resolve(formattedList);
				} else {
					reject(new Error('数据格式错误'));
				}
			},
			fail: (err) => {
				reject(err);
			}
		});
	});
}

/**
 * 获取北京热门地标（评分排序）
 * @param {Number} limit 限制数量，默认10个
 * @returns {Promise} 返回地标数据
 */
export function getBeijingLandmarks(limit = 10) {
	return getAttractionsList({
		index: 1,
		count: 30,
		districtId: BEIJING_DISTRICT_ID,
		sortType: 2 // 好评排序
	}).then(list => {
		// 过滤掉评分为0的，按评分降序排序，取前limit个
		return list
			.filter(item => item.rating > 0)
			.sort((a, b) => b.rating - a.rating)
			.slice(0, limit);
	});
}

/**
 * 获取北京热门景点（人气排序）
 * @param {Number} limit 限制数量，默认10个
 * @returns {Promise} 返回景点数据
 */
export function getBeijingPopularSpots(limit = 10) {
	return getAttractionsList({
		index: 1,
		count: limit,
		districtId: BEIJING_DISTRICT_ID,
		sortType: 1 // 人气排序
	});
}

/**
 * 按景点名检索景点
 * @param {String} keyword 景点关键词
 * @param {Object} options 配置参数
 * @returns {Promise} 返回景点数据
 */
export function searchAttractionsByName(keyword, options = {}) {
	const {
		districtId = BEIJING_DISTRICT_ID,
		categoryId = 0
	} = options;

	const requestData = {
		KeyWord: keyword,
		DistrictId: districtId,
		CategoryId: categoryId,
		head: {
			cid: '09031065211914680477',
			ctok: '',
			cver: '1.0',
			lang: '01',
			sid: '8888',
			syscode: '09',
			auth: '',
			xsid: '',
			extension: []
		}
	};

	return new Promise((resolve, reject) => {
		uni.request({
			url: CTRIP_SEARCH_API,
			method: 'POST',
			data: requestData,
			header: {
				'content-type': 'application/json'
			},
			success: (res) => {
				if (res.statusCode === 200 && res.data) {
					const payload = res.data.sightRecreationResult || res.data.result || res.data || {};
					const poiList = payload.sightRecreationList || payload.sightRecreationListResult || [];
					const districtList = payload.districtResult || res.data.districtResult || [];
					const normalized = poiList.length > 0
						? poiList.map(formatPoi)
						: districtList.map(formatSearchResult);
					resolve(normalized);
					return;
				}
				reject(new Error('数据格式错误'));
			},
			fail: (err) => {
				reject(err);
			}
		});
	});
}

/**
 * 获取景点详情
 * @param {String|Number} poiId 景点ID
 * @returns {Promise} 返回详情数据
 */
export function getAttractionDetail(poiId) {
	const requestData = {
		poiId,
		scene: 'basic',
		head: {
			cid: '09031065211914680477',
			ctok: '',
			cver: '1.0',
			lang: '01',
			sid: '8888',
			syscode: '09',
			auth: '',
			xsid: '',
			extension: []
		}
	};

	return new Promise((resolve, reject) => {
		uni.request({
			url: CTRIP_DETAIL_API,
			method: 'POST',
			data: requestData,
			header: {
				'content-type': 'application/json'
			},
			success: (res) => {
				if (res.statusCode === 200 && res.data) {
					resolve(res.data);
					return;
				}
				reject(new Error('数据格式错误'));
			},
			fail: (err) => {
				reject(err);
			}
		});
	});
}

/**
 * 获取指定北京地标
 * @param {Array} names 地标名称数组
 * @returns {Promise} 返回地标数据
 */
export async function getBeijingLandmarksByNames(names = []) {
	const nameAliases = {
		'北海': ['北海公园'],
		'地坛': ['地坛公园'],
		'颐和园': ['颐和园'],
		'什刹海': ['什刹海风景区', '什刹海'],
		'景山': ['景山公园'],
		'天坛': ['天坛公园']
	};

	const tasks = names.map(async (name) => {
		try {
			const list = await searchAttractionsByName(name, { districtId: BEIJING_DISTRICT_ID });
			const match = pickBestMatchWithAliases(list, name, nameAliases[name]);
			return match ? { ...match, keyword: name } : null;
		} catch (error) {
			return null;
		}
	});

	const results = await Promise.all(tasks);
	const needsFallback = results.some(item => !item || !item.image || !item.poiId);
	let fallbackList = [];

	if (needsFallback) {
		try {
			const pages = [1, 2, 3, 4, 5];
			const pageTasks = pages.map(page => getAttractionsList({
				index: page,
				count: 80,
				districtId: BEIJING_DISTRICT_ID,
				sortType: 1
			}));
			const pageResults = await Promise.all(pageTasks);
			fallbackList = pageResults.flat();
		} catch (error) {
			fallbackList = [];
		}
	}

	const filled = results.map((item, index) => {
		const name = names[index];
		const fallback = pickBestMatchWithAliases(fallbackList, name, nameAliases[name]);
		if (!fallback && item) return item;
		if (!fallback) return null;
		return {
			...fallback,
			...(item || {}),
			image: fallback.image || (item ? item.image : ''),
			poiId: (item && item.poiId) ? item.poiId : fallback.poiId,
			id: (item && item.id) ? item.id : fallback.id,
			keyword: name
		};
	});

	const detailTasks = filled.map(async (item) => {
		if (!item || item.image) return item;
		const poiId = item.poiId || item.id;
		if (!poiId) return item;
		try {
			const detail = await getAttractionDetail(poiId);
			const image = extractDetailImage(detail);
			return image ? { ...item, image } : item;
		} catch (error) {
			return item;
		}
	});

	const withDetail = await Promise.all(detailTasks);
	return withDetail.filter(Boolean);
}

// 导出城市ID常量，方便其他模块使用
export const CITY_IDS = {
	BEIJING: 1,
	SHANGHAI: 2,
	GUANGZHOU: 32,
	SHENZHEN: 30,
	HANGZHOU: 14,
	NANJING: 9,
	CHENGDU: 28,
	XIAN: 45
};
