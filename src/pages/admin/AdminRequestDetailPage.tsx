import React, { FC, useContext, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AdminHeader } from '../../components/Header'
import { RequestContext } from '../../store/RequestContext'
import M from 'materialize-css'
import { AuthContext } from '../../store/AuthContext'
import { useFormater } from '../../hooks/useFormater'
import $api from '../../http'

export const AdminRequestDetailPage: FC = () => {
  const { id1 } = useParams()
  const messageRef = useRef(null)
  const btnRef = useRef(null)
  const { requests, fetchRequests, addComment, setStatus } =
    useContext(RequestContext)
  const { fio, avatarUrl, role, id } = useContext(AuthContext)
  const request = requests.find(r => r.id === Number(id1))
  const [message, setMessage] = useState('')
  const _ = useFormater()
  const modalRef = useRef(null)
  const navigate = useNavigate()
  const [files, setFiles] = useState<{ id: number; linkDocs: string }[]>([])
  const [isFilesLoaded, setIsFilesLoaded] = useState(false)

  const loadFiles = async () => {
    const resp = await $api.get('/api/requests-files/get/?pk=' + request?.id)

    setFiles(resp.data)
  }

  useEffect(() => {
    if (!requests.length) fetchRequests()
  }, [])
  useEffect(() => {
    if (modalRef.current) {
      M.Modal.init(modalRef.current!)
    }

    M.FloatingActionButton.init(btnRef.current!, {
      toolbarEnabled: true,
    })

    if (request && !isFilesLoaded) {
      loadFiles().then(() => setIsFilesLoaded(true))
    }
  }, [request, isFilesLoaded])
  useEffect(() => {
    document.querySelectorAll('.tooltipped').forEach(el => {
      const url = el.getAttribute('data-tooltip-img')
      M.Tooltip.init(el, {
        html: `<img src="${url}" class="tooltip-img" />`,
      })
    })
  })

  const saveHandler = async () => {
    try {
      M.toast({
        html: 'Данные были успешно сохранены!',
        classes: 'light-blue darken-1',
      })
    } catch (e) {
      // M.toast({
      //   html: `<span>Что-то пошло не так: <b>${e}</b></span>`,
      //   classes: 'red darken-4',
      // })
    }
  }
  const sendHandler = () => {
    try {
      if (message.trim().length === 0)
        return M.toast({
          html: `<span>Что-то пошло не так: <b>Комментрий не должен быть пустым!</b></span>`,
          classes: 'red darken-4',
        })

      addComment(request?.id!, fio, avatarUrl, message, role, id)
      setMessage('')
      M.toast({
        html: 'Вы успешно оставили комментарий!',
        classes: 'light-blue darken-1',
      })
    } catch (e) {
      // M.toast({
      //   html: `<span>Что-то пошло не так: <b>${e}</b></span>`,
      //   classes: 'red darken-4',
      // })
    }
  }

  if (!requests.length && isFilesLoaded) {
    return (
      <>
        <AdminHeader />
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
      <AdminHeader />
      <div className='container'>
        <h3 className='mt-4'>Информация о заявлении</h3>
        <table>
          <thead className='striped'>
            <tr>
              <th>Кампания</th>
              <th>Номинация</th>
              <th>Статус</th>
              <th>Дата создания</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{request?.company.name}</td>
              <td>{request?.nomination.name}</td>

              <td>{request?.status}</td>
              <td>{_(request?.createdDate)}</td>
            </tr>
          </tbody>
        </table>
        <h3 className='mt-4'>Информация о студенте</h3>
        <table>
          <thead>
            <tr>
              <th>ФИО</th>
              <th>Телефон</th>
              <th>Институт</th>
              <th>Направление</th>
              <th>Форма обучения</th>
              <th>Источник финансирования</th>
              <th>Уровень</th>
              <th>Курс</th>
              <th>Дата последнего изменения</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{request?.student.fio}</td>
              <td>{request?.student.phone}</td>
              <td>{request?.student.institute}</td>
              <td>{request?.student.direction}</td>
              <td>{request?.student.educationForm}</td>
              <td>{request?.student.financingSource}</td>
              <td>{request?.student.level}</td>
              <td>{request?.student.course}</td>
              <td>{_(request?.changedDate)}</td>
            </tr>
          </tbody>
        </table>

        <h3 className='mt-4'>Критерии</h3>
        <table className='responsive-table'>
          <thead>
            <tr>
              <th>Название</th>
              <th>Файлы</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{request?.nomination.name}</td>
              <td>
                <div className='row'>
                  {files.map(f => (
                    <div className='col s2'>
                      <a
                        key={f.id}
                        className='waves-effect waves-light btn light-blue darken-1 tooltipped'
                        href={f.linkDocs}
                        data-position='top'
                        data-tooltip-img={f.linkDocs}
                      >
                        <i className='material-icons'>insert_drive_file</i>
                      </a>
                    </div>
                  ))}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <button
          className='btn light-blue darken-2 waves-effect waves-light'
          style={{ marginTop: 36, float: 'right' }}
          onClick={saveHandler}
        >
          <i className='material-icons left'>save</i>
          Сохранить изменения
        </button>
        <h3 className='mt-4'>Комментарии</h3>
        <div>
          {request?.comments.map((c, idx) => {
            return (
              <div key={idx} className='comment'>
                <div className='avatar'>
                  <img src={c.imageUrl} alt='avatar' />
                  <span>{c.name}</span>
                </div>
                <p>{c.text}</p>
                <small>{c.sendedDate.toLocaleString()}</small>
              </div>
            )
          })}
        </div>
        <div className='input-field'>
          <textarea
            id='message'
            className='materialize-textarea mt-4'
            data-length='1000'
            value={message}
            onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
              if (message.length <= 1000) setMessage(event.target.value)
            }}
            ref={messageRef}
          ></textarea>
          <label className='message'>Сообщение</label>
        </div>
        <button
          className='btn light-blue darken-2 waves-effect waves-light'
          style={{ float: 'right' }}
          onClick={sendHandler}
        >
          <i className='material-icons left'>send</i>
          Отправить комментарий
        </button>
      </div>
      {!(
        // subRequest?.status === 'Победитель' ||
        // subRequest?.status === 'Принято' ||
        (request?.status === 'Удалено')
      ) ? (
        <div className='fixed-action-btn toolbar' ref={btnRef}>
          <a className='btn-floating btn-large light-blue darken-4 pulse'>
            <i className='large material-icons'>mode_edit</i>
          </a>
          <ul>
            <li>
              <a>
                <button
                  className='waves-effect waves-light yellow darken-2 btn'
                  onClick={() => {
                    try {
                      setStatus(request?.id!, 'Отправлено на доработку')
                      addComment(
                        request?.id!,
                        fio,
                        avatarUrl,
                        'Статус изменён на "Отправлено на доработку"',
                        role,
                        id
                      )

                      const i = M.Modal.getInstance(modalRef.current!)
                      i.open()

                      M.toast({
                        html: '<span>Вы успешно выставили статус <strong>Отправлено на доработку</strong> !</span>',
                        classes: 'light-blue darken-1',
                      })
                    } catch (e) {
                      M.toast({
                        html: `<span>Что-то пошло не так: <b>${e}</b></span>`,
                        classes: 'red darken-4',
                      })
                    }
                  }}
                >
                  Отправлено на доработку
                </button>
              </a>
            </li>
            <li>
              <a>
                <button
                  className='waves-effect waves-light light-blue darken-3 btn'
                  onClick={() => {
                    try {
                      setStatus(request?.id!, 'Принято')
                      addComment(
                        request?.id!,
                        fio,
                        avatarUrl,
                        'Статус изменён на "Принято"',
                        role,
                        id
                      )
                      M.toast({
                        html: '<span>Вы успешно выставили статус <strong>Принято</strong> !</span>',
                        classes: 'light-blue darken-1',
                      })
                    } catch (e) {
                      M.toast({
                        html: `<span>Что-то пошло не так: <b>${e}</b></span>`,
                        classes: 'red darken-4',
                      })
                    }
                  }}
                >
                  Принято
                </button>
              </a>
            </li>
            <li>
              <a>
                <button
                  className='waves-effect waves-light teal darken-1 btn'
                  onClick={() => {
                    try {
                      setStatus(request?.id!, 'Получение выплаты')
                      addComment(
                        request?.id!,
                        fio,
                        avatarUrl,
                        'Статус изменён на "Получение выплаты"',
                        role,
                        id
                      )
                      M.toast({
                        html: '<span>Вы успешно выставили статус <strong>Получение выплаты</strong> !</span>',
                        classes: 'light-blue darken-1',
                      })
                    } catch (e) {
                      M.toast({
                        html: `<span>Что-то пошло не так: <b>${e}</b></span>`,
                        classes: 'red darken-4',
                      })
                    }
                  }}
                >
                  Получение выплаты
                </button>
              </a>
            </li>
            <li>
              <a>
                <button
                  className='waves-effect waves-light red darken-1 btn'
                  onClick={() => {
                    try {
                      setStatus(
                        request?.id!,
                        'Отказать по решению Стипендиальной Комиссии'
                      )
                      addComment(
                        request?.id!,
                        fio,
                        avatarUrl,
                        'Статус изменён на "Отказать по решению Стипендиальной Комиссии"',
                        role,
                        id
                      )
                      M.toast({
                        html: '<span>Вы успешно выставили статус <strong>Отказать по решению Стипендиальной Комиссии</strong> !</span>',
                        classes: 'light-blue darken-1',
                      })
                    } catch (e) {
                      M.toast({
                        html: `<span>Что-то пошло не так: <b>${e}</b></span>`,
                        classes: 'red darken-4',
                      })
                    }
                  }}
                >
                  Отказать по решению Стипендиальной Комиссии
                </button>
              </a>
            </li>
          </ul>
        </div>
      ) : null}
      <div style={{ height: 100 }}></div>

      {/* modal */}
      <div ref={modalRef} className='modal'>
        <div className='modal-content'>
          <h4>Оставьте комментарии</h4>
          <div style={{ height: 20 }} />
          <div className='input-field'>
            <textarea
              id='message'
              className='materialize-textarea mt-4'
              data-length='1000'
              value={message}
              onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
                if (message.length <= 1000) setMessage(event.target.value)
              }}
              ref={messageRef}
            ></textarea>
            <label className='message'>Сообщение</label>
          </div>
          <button
            className='btn light-blue darken-2 waves-effect waves-light'
            style={{ float: 'right' }}
            onClick={() => {
              sendHandler()
              navigate('/admin/requests/')
            }}
          >
            <i className='material-icons left'>send</i>
            Отправить комментарий
          </button>
          <div style={{ height: 20 }} />
        </div>
      </div>
    </>
  )
}
