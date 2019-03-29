import {ADD, MINUS, REQUEST} from './mutation-types'

// 初始化状态
const initalState = {
    count: 0,
    msg: 'inited'
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
        case REQUEST:
            return {...state}
        default:
            return state
    }
}