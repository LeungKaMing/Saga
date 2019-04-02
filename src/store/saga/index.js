// 感觉saga拆分更细化了，中间件内部做的每一个小事务
// 统一用帮助函数是为了写测试代码更方便
import { call, put, take, takeEvery, all, select, fork, cancel, cancelled } from 'redux-saga/effects'
import * as API from '../../assets/scripts/api'
import {FETCH_NEWS_LIST, FETCH_NEWS_LIST_SUCCEEDED, FETCH_NEWS_LIST_FAILED} from '../mutation-types'

// worker Saga : 将在 USER_FETCH_REQUESTED action 被 dispatch 时调用
function* fetchNewsList (action) {
	try {
		const result = yield call(API.getNewsList, action.data.params);	// call作为帮助函数，代替了API.getNewsList直接调用api
		yield put({type: FETCH_NEWS_LIST_SUCCEEDED, result});	// put作为帮助函数，代替了dispatch直接发起action
	} catch (e) {
		yield put({type: FETCH_NEWS_LIST_FAILED, message: e.message});
	}
}

/*
	在每个 `USER_FETCH_REQUESTED` action 被 dispatch 时调用 fetchNewsList
	允许并发（译注：即同时处理多个相同的 action）
*/
function* watchFetchNewsList () {
	yield takeEvery(FETCH_NEWS_LIST, fetchNewsList);
}

// // 跟take相比，并没有任何控制权
// function* watchAndLog () {
// 	yield takeEvery('*', function* logger (action) {
// 		const state = yield select()
// 		console.log('action', action)
// 		console.log('state after', state)
// 	});
// }

// // 跟takeEvery相比，是具有控制权的，体现在只有在执行流达到时才会响应对应的action，否则action还没分发前是会阻塞掉整个Generator; 而前者一经注册，都会响应actioin，并不论上次的请求是否返回。
// function* watchAndLog2 () {
// 	while (true) {
// 		const action = yield take('*')
// 		const state = yield select()
// 		console.log('action', action)
// 		console.log('state after', state)
// 	}
// }

// // 例子 - 伪代码
// // 如果用takeEvery则需要
// function* watchLogin () {
// 	yield takeEvery('LOGIN', function* () {
// 		try {
// 			const user = yield call(API.login)
// 			yield put({type: 'LOGIN_SUCCESS', user})
// 		} catch (e) {
// 			yield put({type: 'LOGIN_FAILED', message: e.message})
// 		}
// 	})
// }
// function* watchLogout () {
// 	yield takeEvery('LOGOUT', function* () {
// 		try {
// 			const user = yield call(API.logout)
// 			yield put({type: 'LOGOUT_SUCCESS', user})
// 		} catch (e) {
// 			yield put({type: 'LOGOUT_FAILED', message: e.message})
// 		}
// 	})
// }
// ...yield all([watchLogin(), watchLogout()])

// 换个写法 - 将ui的想法融合到saga，试想一个完整的应用程序从开始到结束只会有一次登陆和一次注销
function* authoration () {
	try {
		const token = yield call(API.login)
		yield put({type: 'LOGIN_SUCCESS', ...token})
		return token
	} catch (error) {
		yield put({type: 'LOGIN_FAILED', ...error})
	} finally {
		if (yield cancelled()) {
			console.log('证明可能在触发LOGIN的情况下，用户又触发了LOGOUT')
		}
	}
}

function* userFlow () {
	while (true) {
		// 监听登陆actioin，加登陆逻辑
		yield take('LOGIN')
		const task = yield fork(authoration)
		// 监听注销actioin，加注销逻辑
		const action = yield take(['LOGOUT', 'LOGIN_FAILED'])
		if (action.type === 'LOGOUT')
			// 证明可能在触发LOGIN的情况下，用户又触发了LOGOUT	
			yield cancel(task)
		yield call(API.logout)
	}
}

// 同时执行多个任务：yield [call(fetch, '/users'), call(fetch, '/repos')] 等同于 Promise.all

// 一次过启动全部sagas
export default function* rootSaga () {
	yield all([
		watchFetchNewsList(),
		userFlow()
	])
};