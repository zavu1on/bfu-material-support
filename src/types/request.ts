import { Role } from './auth'

const setPoints = (
  id: number,
  subRId: number,
  rowIdx: number,
  points: number
) => {}
const setStatus = (id: number, status: string) => {}
const fetchRequests = () => {}
const addComment = (
  id: number,
  name: string,
  imageUrl: string,
  text: string,
  role: Role,
  userId: number
) => {}
const addRequest = (
  companyId: number,
  studentId: number,
  nomination: string
) => {}
const addNomination = (
  name: string,
  docs: string,
  paymentVPO: number,
  paymentSPO: number
) => {}
const removeNomination = (name: string) => {}

interface INomination {
  name: string
  docs: string
  paymentVPO: number
  paymentSPO: number
}

export interface IComment {
  name: string
  sendedDate: Date
  imageUrl: string
  text: string
}

export interface IRequest {
  id: number
  company: {
    name: string
    id: number
  }
  student: {
    id: number
    fio: string
    institute: string
    direction: string
    educationForm: string
    phone: string
    financingSource: string
    level: string
    course: number
    INN: string
    SNILS: string
    address: string
    fatcaddress: string
    citizenship: string

    passport_seria: string
    passport_number: string
    passport_IssueDate: string
    passport_IssueBy: string
    passport_DepartmentCode: string
  }
  status: string
  nomination: INomination
  createdDate: Date
  changedDate: Date
  comments: IComment[]
}

export interface IRequestState {
  requests: IRequest[]
  nominations: INomination[]
  statuses: string[]

  fetchRequests: typeof fetchRequests
  setPoints: typeof setPoints
  addComment: typeof addComment
  addRequest: typeof addRequest
  setStatus: typeof setStatus
  addNomination: typeof addNomination
  removeNomination: typeof removeNomination
}
