import React, { FC, useContext, useEffect, useRef, useState } from 'react'
import { StudentHeader } from '../../components/Header'
import { Link, useParams } from 'react-router-dom'
import { RequestContext } from '../../store/RequestContext'
import { AuthContext } from '../../store/AuthContext'
import $api from '../../http'

export const StudentRequestListPage: FC = () => {
  const params = useParams()
  const { requests, nominations, fetchRequests, addRequest } =
    useContext(RequestContext)
  const qs = requests.filter(r => r.company.id === Number(params.id))
  const { id } = useContext(AuthContext)
  const nominationRef = useRef(null)
  const createModalRef = useRef(null)

  useEffect(() => {
    if (!requests.length) fetchRequests()
    // if (
    //   requests
    //     .filter(r => r.company.id === Number(params.id))
    //     .filter(r => r.student.id === id).length === 0
    // )
    //   navigate('/companies/')
  }, [])
  useEffect(() => {
    M.FormSelect.init(nominationRef.current!)

    M.Modal.init(createModalRef.current!)
  }, [requests])

  if (!requests.length) {
    return (
      <>
        <StudentHeader />
        <div className='my-center'>
          <div className='preloader-wrapper big active'>
            <div className='spinner-layer spinner-blue-only'>
              <div className='circle-clipper left'>
                <div className='circle'></div>
              </div>
              <div className='gap-patch'>
                <div className='circle'></div>
              </div>
              <div className='circle-clipper right'>
                <div className='circle'></div>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <StudentHeader />
      <div className='container'>
        <table className='mt-4 striped'>
          <thead>
            <tr>
              <th>Номинация</th>
              <th>Статус</th>
              <th>Институт</th>
              <th>Направление</th>
              <th>Курс</th>
            </tr>
          </thead>
          <tbody>
            {qs?.map(r => {
              return (
                <tr key={r.id}>
                  <td>{r.nomination.name}</td>
                  <td>{r.status}</td>
                  <td>{r.student.institute}</td>
                  <td>{r.student.direction}</td>
                  <td>{r.student.course}</td>
                  <td>
                    <Link
                      className='btn-floating waves-effect waves-light light-blue darken-1'
                      to={`/requests/${r.id}/`}
                    >
                      <i className='material-icons'>edit</i>
                    </Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <div
          style={{
            float: 'right',
            marginTop: 36,
          }}
        >
          <button
            className='btn light-blue darken-2 waves-effect waves-light'
            onClick={() => {
              const i = M.Modal.getInstance(createModalRef.current!)
              i.open()
            }}
          >
            <i className='material-icons left'>add</i>
            Добавить заявку
          </button>
        </div>
      </div>

      {/* create modal */}
      <div ref={createModalRef} className='modal'>
        <div className='modal-content'>
          <h4>Создать заявку</h4>
          <div className='input-field col s12'>
            <select ref={nominationRef}>
              {nominations
                .filter(
                  n => !(qs.map(r => r.nomination.name).indexOf(n.name) + 1)
                )
                .map(n => (
                  <option value={n.name} key={n.name}>
                    {n.name}
                  </option>
                ))}
            </select>
            <label>Номинация</label>
          </div>
        </div>
        <div className='modal-footer'>
          <button
            className='btn light-blue darken-2 waves-effect waves-light'
            onClick={() => {
              // @ts-ignore
              const nom = nominationRef.current!.value

              addRequest(Number(params.id), id, nom)
            }}
          >
            <i className='material-icons left'>save</i>
            Создать заявку
          </button>
        </div>
      </div>
    </>
  )
}
