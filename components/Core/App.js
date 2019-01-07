import React from 'react'
import Router from 'next/router'
import ProgressBar from './ProgressBar.js'
import Register from '../Register'
import Questions from '../Questions'
import Confirm from '../Confirm'
import RegisComplete from '../RegisterComplete'
import QuestionService from '../../service/QuestionService'
import Navbar from './Navbar'
import CookiesService from '../../service/CookieService.js'
import RegisterService from '../../service/RegisterService'

class App extends React.Component {
  state = {
    questions: [],
    questionStartIndex: 0,
    answers: [],
    pageIndex: 0,
    wipid: 0,
    nickname: '',
    registerDetail: {
      fistname_th: '',
      lastname_th: '',
      fistname_en: '',
      lastname_en: '',
      nickname: '',
      gender: '',
      dob: '',
      religion: '',
      citizen_no: '',
      cangenital_disease: '',
      allergic_drug: '',
      prefix_name: '',
      allergic_food: '',
      medical_approved: '',
      telno: '',
      guardian_telno: '',
      guardian_relative: '',
      school_id: '',
      school_level: '',
      school_major: '',
      gpax: '',
      email: '',
      school_name: '',
      wip_id: '',
      confirm_register: ''
    },
    schoolname: ''
  }

  componentDidMount = async () => {
      await this.getProfilefromDB()
      await this.getAllQuestion()
    
  }
  getAllQuestion = async () => {
    let queryQuestion = await QuestionService.getAllQuestion()
    let queryAns = await QuestionService.getAns()
    console.log(queryAns)
    this.setState({
      questions: queryQuestion.data,
      answers: queryAns.data
    })

    for (let index = 0; index < this.state.questions.length; index++) {
      this.state.answers.push({ question_id: index + 1, ans_content: '' })
    }
  }

  getProfilefromDB = async () => {
    try{
      const profile = await RegisterService.getProfile()

    this.setState({
      registerDetail: profile.data
    })
    this.setWipId(
      this.state.registerDetail.wip_id,
      this.state.registerDetail.nickname
    )
    if ((await this.state.registerDetail.confirm_register) === 1) {
      Router.push({
        pathname: '/regiscomplete'
      })
    }
  }
  catch(err){
    CookiesService.removeJWTAndEmailCookie()
    Router.push({
      pathname: '/index'
    })
    }
  }

  setPageIndex = async count => {
    this.setState({
      pageIndex: this.state.pageIndex + count
    })
  }

  setConfirm = async confirm => {
    const { registerDetail } = this.state
    this.setState({
      registerDetail: {
        ...registerDetail,
        confirm_register: confirm
      }
    })
  }
  setWipId = async (id, nickname) => {
    this.setState({
      wipid: await id,
      nickname: await nickname
    })
  }

  handleFields = (name, value) => {
    const { registerDetail } = this.state
    this.setState({
      registerDetail: {
        ...registerDetail,
        [name]: value
      }
    })
  }

  handleDate = (date, dateString) => {
    console.log(date && date.format('Y-M-D'))
    const { registerDetail } = this.state
    this.setState({
      registerDetail: {
        ...registerDetail,
        dob: date && date.format('Y-M-D')
      }
    })
  }

  handleGender = e => {
    const { registerDetail } = this.state
    this.setState({
      registerDetail: {
        ...registerDetail,
        gender: e.target.value
      }
    })
  }

  handleReligion = e => {
    const { registerDetail } = this.state
    this.setState({
      registerDetail: {
        ...registerDetail,
        religion: e
      }
    })
  }

  handleChange = async data => {
    const { registerDetail } = this.state
    const school = (await data.id) + 1
    const schoolNameFromInput = data.value
    this.setState({
      registerDetail: {
        ...registerDetail,
        school_id: school,
        school_name: schoolNameFromInput
      }
    })
  }

  handleschoolGrade = e => {
    const { registerDetail } = this.state
    this.setState({
      registerDetail: {
        ...registerDetail,
        school_level: e
      }
    })
  }

  handlemajor = e => {
    const { registerDetail } = this.state
    this.setState({
      registerDetail: {
        ...registerDetail,
        school_major: e
      }
    })
  }

  handleCheckLoginState = async () => {
    if (await CookiesService.gettokenJWTCookie()) {
    } else {
      Router.push({
        pathname: '/index'
      })
    }
  }

  handlePrefixName = valuePrefix => {
    const { registerDetail } = this.state
    this.setState({
      registerDetail: {
        ...registerDetail,
        prefix_name: valuePrefix
      }
    })
  }

  setAnswerByQuestionId = (question_id, newAnswer) => {
    return this.state.answers.map(answer => {
      if (answer.question_id === question_id) {
        answer.ans_content = newAnswer
      }
      return answer
    })
  }
  handleAnswerFields = e => {
    const newAnswer = e.target.value
    const question_id = parseInt(e.target.id)
    const answers = this.setAnswerByQuestionId(question_id, newAnswer)
    this.setState({ answers })
  }

  changeQuestionStartIndex = number => {
    this.setState({ questionStartIndex: number })
  }

  render() {
    this.handleCheckLoginState()
    return (
      <div className="container-fluid">
        <Navbar state={this.state.registerDetail} />
        <div className="container mt-5">
          <div className="row">
            <div className="col-12">
              {this.state.pageIndex <=
                Math.ceil(this.state.questions.length / 3) && (
                <ProgressBar
                  current={this.state.pageIndex}
                  questions={this.state.questions}
                />
              )}
            </div>
          </div>
          <div className="mt-5">
            {this.state.pageIndex === 0 && (
              <Register
                setPageIndex={this.setPageIndex}
                setWipId={this.setWipId}
                profileData={this.state.registerDetail}
                handleFields={this.handleFields}
                handleDate={this.handleDate}
                handleGender={this.handleGender}
                handleReligion={this.handleReligion}
                handleChange={this.handleChange}
                handleschoolGrade={this.handleschoolGrade}
                handlemajor={this.handlemajor}
                handlePrefixName={this.handlePrefixName}
                changeQuestionStartIndex={this.changeQuestionStartIndex}
                questionStartIndex={this.state.questionStartIndex}
              />
            )}
            {this.state.pageIndex > 0 &&
              this.state.pageIndex <=
                Math.ceil(this.state.questions.length / 3) && (
                <Questions
                  setPageIndex={this.setPageIndex}
                  questions={this.state.questions}
                  answers={this.state.answers}
                  questionStartIndex={this.state.questionStartIndex}
                  handleFields={this.handleAnswerFields}
                  changeQuestionStartIndex={this.changeQuestionStartIndex}
                />
              )}
            {this.state.pageIndex >
              Math.ceil(this.state.questions.length / 3) &&
              this.state.pageIndex <=
                Math.ceil(this.state.questions.length / 3) + 1 && (
                <Confirm
                  setPageIndex={this.setPageIndex}
                  confirm={this.setConfirm}
                  questions={this.state.questions}
                  answers={this.state.answers}
                  registerDetail={this.state.registerDetail}
                />
              )}
            {this.state.registerDetail.confirm_register == 1 && (
              <RegisComplete name={this.state.registerDetail.fistname_th} />
            )}
          </div>
        </div>
      </div>
    )
  }
}

export default App
