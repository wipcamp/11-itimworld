import React, { Fragment } from 'react'
import Router from 'next/router'
import Complete from './Complete'
import RegisterService from '../../service/RegisterService';
import Cookies from './CookieService'

let nickname
export default class RegisComplete extends React.Component {
  
  componentDidMount = async () => {
    this.handleCheckLoginState()
  }
  handleCheckLoginState = async () => {
    const profile = await RegisterService.getProfile()
    if (profile.data.confirm_register !== 1) {
      Router.push({
        pathname: '/register'
      })
    }
  }

  render() {
    if(Cookies.getCookie('tokenJWT')){
      Router.push({
        pathname: '/index'
      })
    }
  nickname = Cookies.getCookie('name')
  Cookies.removeCookie('name')
    return (
      <Fragment>
        <Complete
          handleCheckLoginState={this.handleCheckLoginState}
          name={this.props.name||nickname}
        />
      </Fragment>
    )
  }
}
