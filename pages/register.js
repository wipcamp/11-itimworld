import React from 'react'
import App from '../components/Core/App'
import Bg from '../components/Core/Bg'
import colors from '../config/colors'
import styled from 'styled-components'
import Router from 'next/router'
import CookiesService from '../service/CookieService.js'

const BgColors = styled.div`
  background: ${colors.bgcolor};
  @media (max-width : 768px) {
    height: 100%;
  }
`

class Register extends React.Component {
  componentDidMount(){
    this.handleCheckLoginState()
  }
  handleCheckLoginState = async () => {
    if (CookiesService.gettokenJWTCookie()) {
    } else {
      Router.push({
        pathname: '/index'
      })
    }
  }
  render() {
    return (
      <BgColors>
        <App />
        <Bg />
      </BgColors>
    )
  }
}

export default Register
