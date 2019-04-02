import React, { Component } from 'react';
// 引入根组件
import Root from './components/Index'

// redux相关
import { createStore, applyMiddleware } from 'redux'
import { Provider, connect } from 'react-redux'
// 根reducer
import { rootReducer } from './store/reducers'

// redux-saga中间件 - 用于处理异步dispatch
import createSagaMiddleware from 'redux-saga'
import rootSaga from './store/saga/index'

// 日志中间件 - 记录redux的变化，输出在控制台
import { createLogger } from 'redux-logger'

// 初始化logger中间件
const loggerMiddleware = createLogger()
// 初始化saga中间件
const sagaMiddleware = createSagaMiddleware()

// 初始化store - applyMiddleware 用于挂载中间件
const store = createStore(
  rootReducer,
  applyMiddleware(loggerMiddleware, sagaMiddleware)
)

// 通常中间件内部的方法都需要：先挂载，后调用
sagaMiddleware.run(rootSaga)

function mapStateToProps (state) {
  // 将store的state注入到根组件
  const {count, msg, newsListData, token} = state
  return {
    count,
    msg,
    newsListData,
    token
  }
}

const Container = connect(mapStateToProps)(Root)

export default class App extends Component {
  render () {
    return (
      <Provider store={store}>
        <Container />
      </Provider>
    )
  }
}
