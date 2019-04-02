import {ADD, MINUS, FETCH_NEWS_LIST} from './mutation-types'

export function addCreator (msg) {
    return {
        type: ADD,
        msg
    }
}

export function minusCreator (msg) {
    return {
        type: MINUS,
        msg
    }
}

export function fetchNewsList (data) {
    return {
        type: FETCH_NEWS_LIST,
        data
    }
}
