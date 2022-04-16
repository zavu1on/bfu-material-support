import React, { createContext, ReactElement, useReducer } from 'react'
import $api from '../http'
import { Role } from '../types/auth'
import { IAction } from '../types/companies'
import { IRequestState, IRequest } from '../types/request'

const initialState: IRequestState = {
  requests: [],
  nominations: [],
  statuses: [],

  fetchRequests: () => {},
  setPoints: () => {},
  addComment: () => {},
  addRequest: () => {},
  setStatus: () => {},
  addNomination: () => {},
  removeNomination: () => {},
}

interface IProps {
  children?: ReactElement
}

const reducer = (
  state = initialState,
  { payload, type }: IAction
): IRequestState => {
  switch (type) {
    case 'SET_REQUESTS':
      return {
        ...state,
        ...payload,
      }
    case 'SET_POINTS':
      return {
        ...state,
      }
    case 'ADD_COMMENT':
      return {
        ...state,
        requests: state.requests.map(r => {
          if (r.id === payload.id) {
            r.comments.push({
              name: payload.name,
              imageUrl: payload.imageUrl,
              text: payload.text,
              sendedDate: new Date(),
            })
          }

          return r
        }),
      }
    case 'ADD_REQUEST':
      return {
        ...state,
      }
    case 'SET_STATUS':
      return {
        ...state,
        requests: state.requests.map(r => {
          if (r.id === payload.id) {
            r.status = payload.status
          }

          return r
        }),
      }
    case 'ADD_NOMINATION':
      return {
        ...state,
        nominations: [...state.nominations, payload],
      }
    case 'REMOVE_NOMINATION':
      return {
        ...state,
        nominations: state.nominations.filter(n => n.name !== payload.name),
      }
    default:
      return state
  }
}

export const RequestContext = createContext(initialState)

export const RequestProvider = ({ children }: IProps) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const fetchRequests = async () => {
    try {
      // fetch

      let resp = await $api.get('/api/requests/get/')
      const requests: IRequest[] = resp.data

      resp = await $api.get('/api/criterion/get/')
      const nominations = resp.data

      const statuses = [
        'Получение выплаты',
        'Черновик',
        'Принято',
        'Удалено',
        'Отправлено на доработку',
        'На рассмотрении',
        'Отказать по решению Стипендиальной Комиссии',
      ]

      dispatch({
        type: 'SET_REQUESTS',
        payload: {
          requests: requests.map((r: any) => ({
            id: r.id,
            company: {
              id: r.compaing.id,
              name: r.compaing.name,
            },
            student: {
              id: r.student.id,
              institute: r.student.institut,
              direction: r.student.profile,
              educationForm: r.student.form,
              fio: `${r.student.firstname} ${r.student.lastname} ${r.student.patronymic}`,
              phone: r.student.phone,
              financingSource: r.student.source_finance,
              level: r.student.level,
              course: r.student.course,
            },
            status: r.last_status,
            nomination: {
              name: r.criterion.name,
              paymentVPO: r.criterion.paymentVPO,
              paymentSPO: r.criterion.paymentSPO,
            },
            createdDate: new Date(r.CreatedOn),
            changedDate: new Date(r.LastUpdate),
            comments: r.comments.map((c: any) => ({
              name: c.student
                ? `${c.student.firstname} ${c.student.lastname} ${c.student.patronymic}`
                : `${c.admin.firstname} ${c.admin.lastname} ${c.admin.patronymic}`,
              imageUrl: c.student ? c.student.avatar : c.admin.avatar,
              sendedDate: new Date(c.created_at),
              text: c.text,
            })),
          })),
          statuses,
          nominations,
        },
      })
    } catch (e) {}
  }
  const setPoints = (
    id: number,
    subRId: number,
    rowIdx: number,
    points: number
  ) =>
    dispatch({
      type: 'SET_POINTS',
      payload: {
        id,
        rowIdx,
        points,
        subRId,
      },
    })
  const addComment = async (
    id: number,
    name: string,
    imageUrl: string,
    text: string,
    role: Role,
    userId: number
  ) => {
    // fetch

    await $api.post('/api/comments/create/', {
      role,
      text,
      id,
      user_id: userId,
    })

    dispatch({
      type: 'ADD_COMMENT',
      payload: {
        id,
        name,
        imageUrl,
        text,
      },
    })
  }
  const addRequest = async (
    companyId: number,
    studentId: number,
    nomination: string
  ) => {
    // fetch
    // get id and subRequests from fetch

    const resp = await $api.post('/api/requests/get/', {
      student_id: studentId,
      company_id: companyId,
      nomination,
      last_status: 'Черновик',
    })
    console.log(resp.data)

    const payload = {}

    dispatch({
      type: 'ADD_REQUEST',
      payload,
    })
  }
  const setStatus = async (id: number, status: string) => {
    // fetch

    await $api.put(`/api/requests/${id}/`, {
      status: status,
    })

    dispatch({
      type: 'SET_STATUS',
      payload: {
        id,
        status,
      },
    })
  }
  const addNomination = async (
    name: string,
    docs: string,
    paymentVPO: number,
    paymentSPO: number
  ) => {
    await $api.post('/api/criterion/get/', {
      name,
      docs,
      paymentSPO,
      paymentVPO,
    })

    dispatch({
      type: 'ADD_NOMINATION',
      payload: {
        name,
        docs,
        paymentVPO,
        paymentSPO,
      },
    })
  }
  const removeNomination = async (name: string) => {
    await $api.delete(`/api/criterion/${name}/`)

    dispatch({
      type: 'REMOVE_NOMINATION',
      payload: {
        name,
      },
    })
  }

  return (
    <RequestContext.Provider
      value={{
        ...state,
        fetchRequests,
        setPoints,
        addComment,
        addRequest,
        setStatus,
        addNomination,
        removeNomination,
      }}
    >
      {children}
    </RequestContext.Provider>
  )
}

function _(date?: Date) {
  if (date === undefined) return ''

  const m = date.getMonth() + 1
  const d = date.getDate()

  return `${date.getFullYear()}-${m >= 10 ? m : '0' + m}-${
    d >= 10 ? d : '0' + d
  }`
}
