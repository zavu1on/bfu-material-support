import React, { FC, useContext, useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { StudentHeader } from '../../components/Header'
import { RequestContext } from '../../store/RequestContext'
import { AuthContext } from '../../store/AuthContext'
import M from 'materialize-css'
import { useFormater } from '../../hooks/useFormater'
import $api from '../../http'

export const StudentRequestDetailPage: FC = () => {
  const { id1 } = useParams()
  const pointRef = useRef(null)
  const messageRef = useRef(null)
  const { requests, fetchRequests, addComment } = useContext(RequestContext)
  const { fio, avatarUrl, role, id } = useContext(AuthContext)
  const request = requests.find(r => r.id === Number(id1))
  const [message, setMessage] = useState('')
  const [files, setFiles] = useState<{ id: number; linkDocs: string }[]>([])
  const [isFilesLoaded, setIsFilesLoaded] = useState(false)
  const _ = useFormater()
  const navigate = useNavigate()

  const loadFiles = async () => {
    const resp = await $api.get('/api/requests-files/get/?pk=' + request?.id)
    setFiles(resp.data)
  }

  useEffect(() => {
    if (!requests.length) fetchRequests()
    if (request?.student.id !== id) navigate('/companies/')
  }, [])
  useEffect(() => {
    // @ts-ignore
    if (pointRef.current) pointRef.current.focus()
    M.CharacterCounter.init(messageRef.current!)

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

  if (!request && isFilesLoaded) {
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
        <h3 className='mt-4'>Информация о заявлении</h3>
        <table className='responsive-table'>
          <thead>
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
        <table className='striped responsive-table'>
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
                    <>
                      <div className='col s2' style={{ position: 'relative' }}>
                        <a
                          key={f.id}
                          className='waves-effect waves-light btn light-blue darken-1 tooltipped '
                          href={f.linkDocs}
                          data-position='top'
                          data-tooltip-img={f.linkDocs}
                        >
                          <i className='material-icons'>insert_drive_file</i>
                        </a>
                        <a
                          className='btn-floating btn-large waves-effect waves-light red darken-1 btn-small'
                          style={{
                            position: 'absolute',
                            bottom: -16.2,
                            left: 0,
                          }}
                          onClick={async event => {
                            event.preventDefault()

                            $api.delete('/api/set-image/', {
                              data: {
                                id: request!.id,
                                fileId: f.id,
                              },
                            })

                            setFiles(prev =>
                              prev.filter(prevFile => prevFile.id !== f.id)
                            )
                          }}
                        >
                          <i className='material-icons'>close</i>
                        </a>
                      </div>
                    </>
                  ))}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        {request?.status === 'Черновик' ||
        request?.status === 'Отправлено на доработку' ? (
          <div
            style={{
              float: 'right',
            }}
          >
            <div className='file-field input-field'>
              <div className='btn light-blue darken-2'>
                <span>добавить файл</span>
                <input
                  type='file'
                  onChange={async (
                    event: React.ChangeEvent<HTMLInputElement>
                  ) => {
                    try {
                      const fd = new FormData()
                      const file = event.target.files![0]

                      fd.append('image', file, file.name)
                      fd.append('request', request.id.toString())

                      const resp = await $api.post('/api/set-image/', fd)

                      document.querySelectorAll('.tooltipped').forEach(el => {
                        const url = el.getAttribute('data-tooltip-img')
                        M.Tooltip.init(el, {
                          html: `<img src="${url}" class="tooltip-img" />`,
                        })
                      })

                      setFiles(prev => [...prev, resp.data])
                    } catch (e) {
                      // M.toast({
                      //   html: `<span>Что-то пошло не так: <b>${e}</b></span>`,
                      //   classes: 'red darken-4',
                      // })
                    }
                  }}
                />
              </div>
              <div className='file-path-wrapper'>
                <input className='file-path validate' type='text' />
              </div>
            </div>
          </div>
        ) : null}
        <br />
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
      <div style={{ height: 100 }}></div>
    </>
  )
}
