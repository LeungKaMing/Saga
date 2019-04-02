import {ADD, MINUS, FETCH_NEWS_LIST_SUCCEEDED, FETCH_NEWS_LIST_FAILED, LOGIN_SUCCESS, LOGIN_FAILED, LOGOUT} from './mutation-types'

// 初始化状态
const initalState = {
    count: 0,
    msg: 'inited',
    newsListData: '',
    token: ''
}

export function rootReducer (state=initalState, action) {
    switch (action.type) {
        case ADD:
            return {
                count: state.count + 1,
                msg: action.msg
            }
        case MINUS:
            return {
                count: state.count - 1,
                msg: action.msg
            }
        case FETCH_NEWS_LIST_SUCCEEDED:
            const newsListData = action.result.data.articleFeed.items.edges[0].node.content
            return {...state, newsListData}
        case FETCH_NEWS_LIST_FAILED:
            return {...state}
        case LOGIN_SUCCESS:
            return {...state, token: action.token}
        case LOGIN_FAILED:
            return {...state, token: ''}
        case LOGOUT:
            return {...state, token: ''}
        default:
            return state
    }
}