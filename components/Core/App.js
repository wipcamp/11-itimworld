import React from 'react'
import Router from 'next/router'
import ProgressBar from './ProgressBar.js'
import Register from '../Register'
import Questions from '../Questions'
import Confirm from '../Confirm'
import QuestionService from '../../service/QuestionService'
import Navbar from './Navbar'
import CookiesService from '../../service/CookieService.js';
import RegisterService from '../../service/RegisterService'

class App extends React.Component {
  state = {
    questions: [],
    questionStartIndex: 0,
    answers: [],
    pageIndex: 0,
    registerVisible: 'none',
    questionVisible: 'none',
    confirmVisible: 'none',
    wipid: 0,
    nickname:'',
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
      confirm_register: '',
    },
    schoolname: '',
  }

  componentDidMount = async () => {
    await this.getAllQuestion()
    await this.getProfilefromDB()
    this.handleChangePage()
  }
  getAllQuestion = async () => {
    let queryQuestion = await QuestionService.getAllQuestion()

    this.setState({
      questions: queryQuestion.data
    })
    for (let index = 0; index < this.state.questions.length; index++) {
      this.state.answers.push({ question_id: index + 1, ans_content: '' })
    }
  }

  getProfilefromDB = async () => {
    const profile = await RegisterService.getProfile()
    this.setState({
      registerDetail: profile.data
    })
    this.setWipId(
      this.state.registerDetail.wip_id,
      this.state.registerDetail.nickname
      )
    if (await this.state.registerDetail.confirm_register === 1) {
      Router.push({
        pathname: '/regiscomplete'
      })
    }
  }

  handleChangePage = () => {
    if (this.state.pageIndex == 0) {
      this.setState({
        registerVisible: 'block',
        questionVisible: 'none',
        confirmVisible: 'none'
      })
    } else if (
      this.state.pageIndex >= 1 &&
      this.state.pageIndex <= Math.ceil(this.state.questions.length / 3)
    ) {
      this.setState({
        questionVisible: 'block',
        registerVisible: 'none',
        confirmVisible: 'none'
      })
    } else if (
      this.state.pageIndex > Math.ceil(this.state.questions.length / 3) &&
      this.state.pageIndex <= Math.ceil(this.state.questions.length / 3) + 1
    ) {
      this.setState({
        questionVisible: 'none',
        registerVisible: 'none',
        confirmVisible: 'block'
      })
    } else {
      this.setState({
        registerVisible: 'none',
        questionVisible: 'none',
        confirmVisible: 'none'
      })
    }
  }
  setPageIndex = async count => {
    this.setState({
      pageIndex: (await this.state.pageIndex) + count
    })
    this.handleChangePage()
  }
  setWipId = async (id,nickname) => {
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
        religion: e.key
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
    console.log(this.state.schoolname)
  }

  handleschoolGrade = e => {
    const { registerDetail } = this.state
    this.setState({
      registerDetail: {
        ...registerDetail,
        school_level: e.key
      }
    })
  }

  handlemajor = e => {
    const { registerDetail } = this.state
    this.setState({
      registerDetail: {
        ...registerDetail,
        school_major: e.key
      }
    })
  }

  handleCheckLoginState = async() => {
    if (await CookiesService.gettokenJWTCookie()) {
    }else{
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
    this.setState({ questionStartIndex: number})
  }

  render() { 
    this.handleCheckLoginState()
    return (
      <div className="container-fluid">
        <Navbar state={this.state} />
        <div className="container mt-5">
          <ProgressBar
            current={this.state.pageIndex}
            questions={this.state.questions}
          />
          <div className="mt-5">
            <Register
              visible={this.state.registerVisible}
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
              questionStartIndex = {this.state.questionStartIndex}
            />
          </div>
          <div className="mt-5">
            <Questions
              visible={this.state.questionVisible}
              setPageIndex={this.setPageIndex}
              questions = {this.state.questions}
              answers = {this.state.answers}
              questionStartIndex = {this.state.questionStartIndex}
              handleFields={this.handleAnswerFields}
              changeQuestionStartIndex={this.changeQuestionStartIndex}
            />
          </div>
          <div className="mt-5">
            <Confirm
              visible={this.state.confirmVisible}
              setPageIndex={this.setPageIndex}
              questions={this.state.questions}
              answers={this.state.answers}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default App
