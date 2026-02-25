/**
 * 携程景点数据接口
 * 基于携程移动端API获取北京地标和景点信息
 */

import { getMockBeijingLandmarks } from './mock-data.js';

// 配置：是否使用模拟数据（true=总是用模拟数据，false=先尝试真实API）
const USE_MOCK_DATA = false;

// 携程API接口地址
const CTRIP_POI_API = 'https://m.ctrip.com/restapi/soa2/13342/json/getSightRecreationList';

// 北京的城市ID（根据携程API，北京ID是9）
const BEIJING_DISTRICT_ID = 9;

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
		sortType = 0 // 排序类型：0-综合排序，1-人气，2-好评
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
		console.log('开始请求携程API...');
		console.log('请求参数:', { index, count, districtId, sortType });
		
		uni.request({
			url: CTRIP_POI_API,
			method: 'POST',
			data: requestData,
			header: {
				'content-type': 'application/json'
			},
			success: (res) => {
				console.log('API响应状态码:', res.statusCode);
				console.log('API响应数据:', res.data);
				
				if (res.statusCode === 200) {
					if (res.data && res.data.result) {
						const poiList = res.data.result.sightRecreationList || [];
						console.log('获取到景点列表，数量:', poiList.length);
						
						if (poiList.length === 0) {
							console.warn('景点列表为空');
							resolve([]);
							return;
						}
						
						// 格式化数据
						const formattedList = poiList.map(poi => ({
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
						}));
						
						console.log('格式化后的数据示例:', formattedList[0]);
						resolve(formattedList);
					} else {
						console.error('API返回数据格式错误:', res.data);
						reject(new Error('数据格式错误: ' + JSON.stringify(res.data)));
					}
				} else {
					console.error('API请求失败，状态码:', res.statusCode);
					reject(new Error('请求失败，状态码: ' + res.statusCode));
				}
			},
			fail: (err) => {
				console.error('API请求失败:', err);
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
	// 如果配置为使用模拟数据，直接返回
	if (USE_MOCK_DATA) {
		console.log('配置为使用模拟数据');
		return Promise.resolve(getMockBeijingLandmarks(limit));
	}
	
	// 为了获取足够的数据，请求数量应该是limit的2-3倍
	const requestCount = Math.max(40, limit * 2);
	
	return getAttractionsList({
		index: 1,
		count: requestCount,
		districtId: BEIJING_DISTRICT_ID,
		sortType: 2 // 好评排序
	}).then(async (list) => {
		console.log('API返回的原始数据数量:', list.length);
		
		// 过滤掉评分为0的
		let filteredList = list.filter(item => item.rating > 0);
		
		// 如果数据不够，再请求第二页
		if (filteredList.length < limit && list.length >= requestCount) {
			console.log('数据不足，获取第二页...');
			try {
				const secondPage = await getAttractionsList({
					index: 2,
					count: requestCount,
					districtId: BEIJING_DISTRICT_ID,
					sortType: 2
				});
				filteredList = [...filteredList, ...secondPage.filter(item => item.rating > 0)];
			} catch (e) {
				console.warn('获取第二页失败:', e);
			}
		}
		
		// 如果仍然没有数据，使用模拟数据
		if (filteredList.length === 0) {
			console.warn('API未返回有效数据，使用模拟数据');
			return getMockBeijingLandmarks(limit);
		}
		
		// 按评分降序排序，取前limit个
		const result = filteredList
			.sort((a, b) => b.rating - a.rating)
			.slice(0, limit);
			
		console.log('最终返回的数据数量:', result.length);
		return result;
	}).catch(error => {
		// API请求失败，使用模拟数据
		console.error('API请求失败，切换到模拟数据:', error);
		return getMockBeijingLandmarks(limit);
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

// 导出城市ID常量，方便其他模块使用
export const CITY_IDS = {
	BEIJING: 9,      // 北京
	SHANGHAI: 2,     // 上海
	GUANGZHOU: 32,   // 广州
	SHENZHEN: 30,    // 深圳
	HANGZHOU: 14,    // 杭州
	NANJING: 9,      // 南京（注：config.ini中显示南京ID也是9，可能需要验证）
	CHENGDU: 28,     // 成都
	XIAN: 45         // 西安
};
