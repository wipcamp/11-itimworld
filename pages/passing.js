import React, { Component } from 'react'
import Router from 'next/router'
import Pass from '../components/Pass'
import CookiesService from '../service/CookieService';


export default class testPass extends Component {
  componentDidMount() {
    this.changetoRegisterPage()
  }
  changetoRegisterPage = async () => {
    try {
      if (!CookiesService.gettokenJWTCookie()) {
        Router.push('/index')
      } 
    } catch (error) {
      console.log(error)
    }
  }
  render () {
    return (
      <div>
        <Pass />
      </div>
    )
  }
}
