import React, { Component } from 'react';
import {addCreator, minusCreator, requestCreator} from '../store/actions'
// 引入资源
import logo from '../logo.svg';
import '../App.css';
// 引入请求脚本
import {getNewsList} from '../assets/scripts/api'

export default class Root extends Component {
    constructor (props) {
      super(props)
      this.state = {
        content: []
      }
    }
    render() {
      const {count, msg} = this.props
      return (
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p>Count: {count}</p>
            <h3>{msg}</h3>
            {this.state.content.length && <h4>{this.state.content}</h4>}
            <button onClick={this.add.bind(this)}>add</button>
            <button onClick={this.minus.bind(this)}>minus</button>
            <button onClick={this.request.bind(this)}>ajax</button>
          </header>
        </div>
      )
    }
    
    add () {
      const {dispatch} = this.props
      dispatch(addCreator('add btn clicked'))
    }
    minus () {
      const {dispatch} = this.props
      dispatch(minusCreator('minus btn clicked'))
    }
    request () {
      const self = this
      // const {dispatch} = this.props
      // dispatch(requestCreator())
      getNewsList({
        data: {
          operationName:'',
          query:'',
          variables:{
            first:20,
            after:'',
            order:'POPULAR'
          },
          extensions:{
            query:{
              id:'21207e9ddb1de777adeaca7a2fb38030'
            }
          }
        },
        onSuccess (res) {
          self.setState({
            content: res.data.articleFeed.items.edges[0].node.content
          })
        },
        onFailure (err) {
          console.log(err)
        }
      })
    }
  }
