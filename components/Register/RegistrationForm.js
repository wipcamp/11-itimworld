import React from 'react'

import th_TH from 'antd/lib/locale-provider/th_TH'
import {
  Card,
  Dropdown,
  Menu,
  Radio,
  Form,
  LocaleProvider,
  DatePicker,
  Select as AntDesignSelect
} from 'antd'
import moment from 'moment'
import Select from 'react-select'
import InputText from '../Core/InputText'
import ButtonPrimary from '../Core/Button'
import RegisterService from '../../service/RegisterService'

const DateFormat = `DD/MM/YYYY`
const FormItem = Form.Item
const Option = AntDesignSelect.Option

class RegistrationForm extends React.Component {
  state = {
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
      wip_id: ''
    },
    schoolOptions: [],
    schoolname: ''
  }
  componentDidMount = async () => {
    const schoolname = await RegisterService.getSchoolname()
    console.log(schoolname)
    this.getSchool(schoolname.data)
    this.getProfilefromDB()
  }
  getProfilefromDB = async () => {
    const profile = await RegisterService.getProfile()
    console.log(profile)

    this.setState({
      registerDetail: profile.data
    })
    await this.props.setWipId(
      this.state.registerDetail.wip_id,
      this.state.registerDetail.nickname
    )
  }
  getSchool = async schoolname => {
    let newSelectOptions = []
    for (let index = 0; index < schoolname.length; index++) {
      newSelectOptions.push({
        id: index,
        value: schoolname[index].school_name,
        label: schoolname[index].school_name
      })
    }
    await this.setState({
      schoolOptions: newSelectOptions
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

  handleNextButton = e => {
    e.preventDefault();
    this.handlesendRegister()
  }
  handlesendRegister = async () => {
    if (this.handleValidation()) {
      await this.props.setWipId(
        this.state.registerDetail.wip_id,
        this.state.registerDetail.nickname
      )
      this.props.setPageIndex(1)
      // await RegisterService.sendRegister(this.state.registerDetail)
    } else {
    }
  }
  handleValidation = () => {
    let registerDetail = this.state.registerDetail
    for (let index in registerDetail) {
      if (registerDetail.hasOwnProperty(index)) {
        if (registerDetail[index] === '') {
          window.alert('โปรดกรอกข้อมูลให้ครบ')
          return false
        } else {
          return true
        }
      }
    }
  }
  handleChangeTempChangetoQuestion= async()=>{
    await this.props.setWipId(
      this.state.registerDetail.wip_id,
      this.state.registerDetail.nickname
    )
    this.props.setPageIndex(1)
  }
  render() {
    const schoolGradeOptions = (
      <Menu onClick={this.handleschoolGrade}>
        <Menu.Item key="ม.4">4</Menu.Item>
        <Menu.Item key="ม.5">5</Menu.Item>
        <Menu.Item key="ม.6">6</Menu.Item>
      </Menu>
    )
    const major = (
      <Menu onClick={this.handlemajor}>
        <Menu.Item key="วิทย์-คณิต">วิทย์-คณิต</Menu.Item>
        <Menu.Item key="ศิลป์คำนวน">ศิลป์คำนวน</Menu.Item>
      </Menu>
    )
    const religion = (
      <Menu onClick={this.handleReligion}>
        <Menu.Item key="พุทธ">พุทธ</Menu.Item>
        <Menu.Item key="อิสราม">อิสราม</Menu.Item>
        <Menu.Item key="คริสต์">คริสต์</Menu.Item>
      </Menu>
    )

    const prefixName = (
      <AntDesignSelect defaultValue="นาย">
        <Option value="male">นาย</Option>
        <Option value="female">นางสาว</Option>
      </AntDesignSelect>
    )
    return (
      <div className="container-fluid">
       <button onClick={this.handleChangeTempChangetoQuestion}>Temp</button>
        <div className="row justify-content-center">
          <div className="col-10">
            <Card className="mt-2 mb-5">
              <Form method="post" onSubmit={this.handleNextButton}>
                <h3 className="font-weight-bold mb-4 ml-5">ข้อมูลส่วนตัว</h3>
                <div className="row">
                  <div className="col-12 col-md-6">
                    <div className="row">
                      <div className="col-12 col-md-4 ">
                        <FormItem>ชื่อ(ไทย):</FormItem>
                      </div>
                      <div className="col-12 col-md-8">
                        <FormItem>
                          <InputText
                            addonBefore={prefixName}
                            onChange={({ target: { name, value } }) =>
                              this.handleFields(name, value)
                            }
                            name="fistname_th"
                            value={this.state.registerDetail.fistname_th}
                            required
                            
                          />
                        </FormItem>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <div className="row">
                      <div className="col-12 col-md-4 ">
                        <FormItem>นามสกุล(ไทย):</FormItem>
                      </div>
                      <div className="col-12 col-md-8">
                        <FormItem>
                          <InputText
                            onChange={({ target: { name, value } }) =>
                              this.handleFields(name, value)
                            }
                            name="lastname_th"
                            value={this.state.registerDetail.lastname_th}
                            required

                          />
                        </FormItem>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 col-md-6">
                    <div className="row">
                      <div className="col-12 col-md-4 ">
                        <FormItem>ชื่อ(อังกฤษ):</FormItem>
                      </div>
                      <div className="col-12 col-md-8">
                        <FormItem>
                          <InputText
                          required
                            onChange={({ target: { name, value } }) =>
                              this.handleFields(name, value)
                            }
                            name="fistname_en"
                            value={this.state.registerDetail.fistname_en}
                          />
                        </FormItem>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <div className="row">
                      <div className="col-12 col-md-4 ">
                        <FormItem>นามสกุล(อังกฤษ):</FormItem>
                      </div>
                      <div className="col-12 col-md-8">
                        <FormItem>
                          <InputText
                          required
                            onChange={({ target: { name, value } }) =>
                              this.handleFields(name, value)
                            }
                            name="lastname_en"
                            value={this.state.registerDetail.lastname_en}
                          />
                        </FormItem>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 col-md-6">
                    <div className="row">
                      <div className="col-12 col-md-4 ">
                        <FormItem>ชื่อเล่น:</FormItem>
                      </div>
                      <div className="col-12 col-md-8">
                        <FormItem>
                          <InputText
                          required
                            onChange={({ target: { name, value } }) =>
                              this.handleFields(name, value)
                            }
                            name="nickname"
                            value={this.state.registerDetail.nickname}
                          />
                        </FormItem>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <div className="row">
                      <div className="col-12 col-md-4 ">
                        <FormItem>เพศ:</FormItem>
                      </div>
                      <div className="col-12 col-md-8">
                        <FormItem>
                          <Radio.Group
                            defaultValue={this.state.registerDetail.gender}
                            value={this.state.registerDetail.gender}
                          >
                            <Radio.Button
                              size="large"
                              className="px-5"
                              value="male"
                              name="Male"
                              onClick={this.handleGender}
                              checked
                            >
                              ชาย
                            </Radio.Button>
                            <Radio.Button
                              size="large"
                              className="px-5"
                              value="female"
                              name="Female"
                              onClick={this.handleGender}
                            >
                              หญิง
                            </Radio.Button>
                          </Radio.Group>
                        </FormItem>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 col-md-6">
                    <div className="row">
                      <div className="col-12 col-md-4 ">
                        <FormItem>วันเกิด:</FormItem>
                      </div>
                      <div className="col-12 col-md-8">
                        <FormItem>
                          <LocaleProvider locale={th_TH}>
                            <DatePicker
                              placeholder={
                                this.state.registerDetail.dob != ''
                                  ? this.state.registerDetail.dob
                                  : 'เลือกวันเกิด'
                              }
                              format={DateFormat}
                              defaultValue={moment('01/01/2002', DateFormat)}
                              onChange={this.handleDate}
                              locale={th_TH}
                            />
                          </LocaleProvider>
                        </FormItem>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <div className="row">
                      <div className="col-12 col-md-4 ">
                        <FormItem>ศาสนา:</FormItem>
                      </div>
                      <div className="col-12 col-md-8">
                        <FormItem>
                          <Dropdown overlay={religion}>
                            <InputText
                            required
                              className="col-6"
                              type=""
                              value={
                                this.state.registerDetail.religion != ''
                                  ? this.state.registerDetail.religion
                                  : ''
                              }
                              disabled
                              name=""
                              placeholder="เลือก"
                              value={this.state.registerDetail.religion}
                            />
                          </Dropdown>
                        </FormItem>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 col-md-6">
                    <div className="row">
                      <div className="col-12 col-md-4 ">
                        <FormItem>เลขบัตรประชาชน:</FormItem>
                      </div>
                      <div className="col-12 col-md-8">
                        <FormItem>
                          <InputText
                          required
                            onChange={({ target: { name, value } }) =>
                              this.handleFields(name, value)
                            }
                            name="citizen_no"
                            value={this.state.registerDetail.citizen_no}
                          />
                        </FormItem>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-4">
                    <div className="row">
                      <div className="col-6 ">
                        <FormItem>โรคประจำตัว:</FormItem>
                      </div>
                      <div className="col-6">
                        <FormItem>
                          <InputText
                          required
                            name="cangenital_disease"
                            onChange={({ target: { name, value } }) =>
                              this.handleFields(name, value)
                            }
                            placeholder="หากไม่มีให้ใส่ -"
                            value={this.state.registerDetail.cangenital_disease}
                          />
                        </FormItem>
                      </div>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="row">
                      <div className="col-6 ">
                        <FormItem>อาหารที่แพ้:</FormItem>
                      </div>
                      <div className="col-6">
                        <FormItem>
                          <InputText
                          required
                            placeholder="หากไม่มีให้ใส่ -"
                            onChange={({ target: { name, value } }) =>
                              this.handleFields(name, value)
                            }
                            name="allergic_food"
                            value={this.state.registerDetail.allergic_food}
                          />
                        </FormItem>
                      </div>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="row">
                      <div className="col-6 ">
                        <FormItem>ยาที่แพ้:</FormItem>
                      </div>
                      <div className="col-6">
                        <FormItem>
                          <InputText
                          required
                            placeholder="หากไม่มีให้ใส่ -"
                            onChange={({ target: { name, value } }) =>
                              this.handleFields(name, value)
                            }
                            name="allergic_drug"
                            value={this.state.registerDetail.allergic_drug}
                          />
                        </FormItem>
                      </div>
                    </div>
                  </div>
                </div>
                <h3 className="font-weight-bold mb-4 ml-5">ข้อมูลการติดต่อ</h3>
                <div className="row">
                  <div className="col-12 col-md-6">
                    <div className="row">
                      <div className="col-12 col-md-4 ">
                        <FormItem>เบอร์โทรศัพท์:</FormItem>
                      </div>
                      <div className="col-12 col-md-8">
                        <FormItem>
                          <InputText
                          required
                            onChange={({ target: { name, value } }) =>
                              this.handleFields(name, value)
                            }
                            name="telno"
                            value={this.state.registerDetail.telno}
                          />
                        </FormItem>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <div className="row">
                      <div className="col-12 col-md-4 ">
                        <FormItem>อีเมลล์:</FormItem>
                      </div>
                      <div className="col-12 col-md-8">
                        <FormItem>
                          <InputText
                          required
                            onChange={({ target: { name, value } }) =>
                              this.handleFields(name, value)
                            }
                            name="email"
                            value={
                              this.state.registerDetail.email != ''
                                ? this.state.registerDetail.email
                                : ''
                            }
                          />
                        </FormItem>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 col-md-6">
                    <div className="row">
                      <div className="col-12 col-md-4 ">
                        <FormItem>เบอร์โทรผู้ปกครอง:</FormItem>
                      </div>
                      <div className="col-12 col-md-8">
                        <FormItem>
                          <InputText
                          required
                            onChange={({ target: { name, value } }) =>
                              this.handleFields(name, value)
                            }
                            name="guardian_telno"
                            value={this.state.registerDetail.guardian_telno}
                          />
                        </FormItem>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <div className="row">
                      <div className="col-12 col-md-4 ">
                        <FormItem>ผู้ปกครองเกี่ยวข้องเป็น:</FormItem>
                      </div>
                      <div className="col-12 col-md-8">
                        <FormItem>
                          <InputText
                          required
                            onChange={({ target: { name, value } }) =>
                              this.handleFields(name, value)
                            }
                            name="guardian_relative"
                            value={this.state.registerDetail.guardian_relative}
                          />
                        </FormItem>
                      </div>
                    </div>
                  </div>
                </div>
                <h3 className="font-weight-bold mb-4 ml-5">ข้อมูลการศึกษา</h3>
                <div className="row">
                  <div className="col-12 col-md-6">
                    <div className="row">
                      <div className="col-12 col-md-4 ">
                        <FormItem>ชื่อโรงเรียน:</FormItem>
                      </div>
                      <div className="col-12 col-md-8">
                        <FormItem>
                          <Select
                            defaultValue={
                              this.state.registerDetail.school_name != ''
                                ? this.state.registerDetail.school_name
                                : ''
                            }
                            onChange={this.handleChange}
                            options={this.state.schoolOptions}
                            placeholder={
                              this.state.registerDetail.school_name != ''
                                ? this.state.registerDetail.school_name
                                : 'เลือก'
                            }
                          />
                        </FormItem>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <div className="row">
                      <div className="col-12 col-md-4 ">
                        <FormItem>ระดับชั้น:</FormItem>
                      </div>
                      <div className="col-12 col-md-8">
                        <FormItem>
                          <Dropdown overlay={schoolGradeOptions}>
                            <InputText
                            required
                              className="col-6"
                              type="text"
                              name="school_level"
                              value={
                                this.state.registerDetail.school_level != ''
                                  ? this.state.registerDetail.school_level
                                  : ''
                              }
                              placeholder="เลือก"
                            />
                          </Dropdown>
                        </FormItem>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 col-md-6">
                    <div className="row">
                      <div className="col-12 col-md-4 ">
                        <FormItem>สายการเรียน:</FormItem>
                      </div>
                      <div className="col-12 col-md-8">
                        <FormItem>
                          <Dropdown overlay={major}>
                            <InputText
                            required
                              className="col-6"
                              type="text"
                              value={
                                this.state.registerDetail.school_major != ''
                                  ? this.state.registerDetail.school_major
                                  : ''
                              }
                              placeholder="เลือก"
                            />
                          </Dropdown>
                        </FormItem>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <div className="row">
                      <div className="col-12 col-md-4 ">
                        <FormItem>เกรด:</FormItem>
                      </div>
                      <div className="col-12 col-md-8">
                        <FormItem>
                          <InputText
                          required
                            name="gpax"
                            onChange={({ target: { name, value } }) =>
                              this.handleFields(name, value)
                            }
                            value={this.state.registerDetail.gpax}
                          />
                        </FormItem>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col text-right">
                    <ButtonPrimary
                      htmlType="submit"
                      className="mr-0"
                    >
                      ถัดไป
                    </ButtonPrimary>
                  </div>
                </div>
              </Form>
            </Card>
          </div>
        </div>
      </div>
    )
  }
}

export default RegistrationForm
