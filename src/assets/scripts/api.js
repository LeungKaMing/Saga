import axios from 'axios'

// axios.defaults.baseURL = 'https://web-api.juejin.im/query';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.headers.post['X-Agent'] = 'Juejin/Web';

function fetchAPI (ajaxObj) {
	return new Promise((resolve, reject) => {
		axios[ajaxObj.method](ajaxObj.url, ajaxObj.data)
			.then((res) => {
                // 默认都走成功回调
                // if (res.data.code === 200) {
				// 	resolve(ajaxObj.onSuccess(res.data))
				// } else {
				// 	resolve(ajaxObj.onFailure(res.data))
				// }
                resolve(res.data)
			})
			.catch((err) => {
				reject(err)
			})
	})
}

export function getNewsList (params) {
	const {onSuccess, onFailure, data} = params
	setTimeout(() => {
		return fetchAPI({
			method: 'post',
			url: 'https://web-api.juejin.im/query',
			data,
			onSuccess,
			onFailure
		})
	}, 2000)
}

export function login () {
	return Promise.resolve({
		token: 'abc12345678'
	})
}

export function logout () {
	return Promise.resolve({
		msg: 'logout success'
	})
}