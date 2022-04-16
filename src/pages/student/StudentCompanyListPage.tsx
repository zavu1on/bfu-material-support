import React, { FC, useContext, useEffect, useRef, useState } from 'react'
import { StudentHeader } from '../../components/Header'
import { CompanyContext } from '../../store/CompanyContext'
import { RequestContext } from '../../store/RequestContext'
import M from 'materialize-css'
import { Link } from 'react-router-dom'
import { useFormater } from '../../hooks/useFormater'
import { NotificationContext } from '../../store/NotificationContext'

export const StudentCompanyListPage: FC = () => {
  const { companies, fetchCompanies } = useContext(CompanyContext)
  const { requests, fetchRequests } = useContext(RequestContext)
  const { notifications, fetchNotifications, clearNotifications } =
    useContext(NotificationContext)
  const createModalRef = useRef(null)
  const nominationRef = useRef(null)
  const [loading, setLoading] = useState(true)
  const _ = useFormater()

  useEffect(() => {
    if (!companies.length) fetchCompanies()
    if (!requests.length) fetchRequests()
    if (!notifications.length) fetchNotifications()
  }, [])

  useEffect(() => {
    M.Modal.init(createModalRef.current!)
    M.FormSelect.init(nominationRef.current!)
  }, [companies, requests])

  useEffect(() => {
    if (notifications.length) {
      if (notifications[0].id === -1) {
        clearNotifications()
      }
      setLoading(false)
    }
  }, [notifications])

  if (loading) {
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
        {notifications.map(n => (
          <div className='toast light-blue darken-1' key={n.id}>
            {n.text}
          </div>
        ))}
        <br />
        <h1>Кампании</h1>
        <table className='mt-4 striped'>
          <thead>
            <tr>
              <th>Название</th>
              <th>Дата начала</th>
              <th>Дата окончания</th>
            </tr>
          </thead>
          <tbody>
            {companies.map(c => {
              return (
                <tr key={c.id}>
                  <td>
                    <Link to={`/companies/${c.id}`}>{c.name}</Link>
                  </td>
                  <td>{_(c.startDate)}</td>
                  <td>{_(c.endDate)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}

function getSelectValues(select: HTMLSelectElement) {
  var result = []
  var options = select && select.options
  var opt

  for (var i = 0, iLen = options.length; i < iLen; i++) {
    opt = options[i]

    if (opt.selected) {
      result.push(opt.value || opt.text)
    }
  }
  return result
}
