import {ADD, MINUS, REQUEST} from './mutation-types'

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

export function requestCreator () {
    return {
        type: REQUEST
    }
}