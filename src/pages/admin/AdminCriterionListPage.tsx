import React, { FC, useContext, useEffect, useRef, useState } from 'react'
import { AdminHeader } from '../../components/Header'
import { RequestContext } from '../../store/RequestContext'

export const AdminCriterionListPage: FC = () => {
  const { nominations, fetchRequests, addNomination, removeNomination } =
    useContext(RequestContext)
  const createModalRef = useRef(null)
  const [formData, setFormData] = useState({
    name: '',
    docs: '',
    paymentVPO: '',
    paymentSPO: '',
  })
  const [loading, setLoading] = useState(true)
  const [renderCount, setRenderCount] = useState(0)

  useEffect(() => {
    if (!nominations.length) fetchRequests()
  }, [])

  useEffect(() => {
    setRenderCount(c => ++c)

    if (renderCount === 1 || nominations.length) {
      setLoading(false)
    }
  }, [nominations])

  useEffect(() => {
    M.Modal.init(createModalRef.current!)
  }, [loading])

  if (loading) {
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
        <h1>Критерии</h1>

        <table className='mt-4 striped'>
          <thead>
            <tr>
              <th>Название</th>
              <th>Документы</th>
              <th>Оплата ВПО</th>
              <th>Оплата СПО</th>
            </tr>
          </thead>
          <tbody>
            {nominations.map(n => (
              <tr key={n.name}>
                <td>{n.name}</td>
                <td>{n.docs}</td>
                <td>{n.paymentVPO}</td>
                <td>{n.paymentSPO}</td>
                <td>
                  <a
                    className='btn-floating btn-large waves-effect waves-light red darken-3 btn-small'
                    onClick={() => removeNomination(n.name)}
                  >
                    <i className='material-icons'>delete</i>
                  </a>
                </td>
              </tr>
            ))}
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
            Добавить критерий
          </button>
        </div>
      </div>

      {/* create modal */}
      <div ref={createModalRef} className='modal'>
        <div className='modal-content'>
          <h4>Добавить критерий</h4>
          <div className='input-field col s6'>
            <input
              id='name'
              type='text'
              value={formData.name}
              onChange={e =>
                setFormData(prev => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
            />
            <label htmlFor='name'>Название</label>
          </div>
          <div className='input-field col s6'>
            <textarea
              id='docs'
              className='materialize-textarea'
              value={formData.docs}
              onChange={e =>
                setFormData(prev => ({
                  ...prev,
                  docs: e.target.value,
                }))
              }
            />
            <label htmlFor='docs'>Необходимые документы</label>
          </div>
          <div className='input-field col s6'>
            <input
              id='vpo'
              type='number'
              value={formData.paymentVPO}
              onChange={e =>
                setFormData(prev => ({
                  ...prev,
                  paymentVPO: e.target.value,
                }))
              }
            />
            <label htmlFor='vpo'>Выплата за ВПО</label>
          </div>
          <div className='input-field col s6'>
            <input
              id='spo'
              type='number'
              value={formData.paymentSPO}
              onChange={e =>
                setFormData(prev => ({
                  ...prev,
                  paymentSPO: e.target.value,
                }))
              }
            />
            <label htmlFor='spo'>Выплата за СПО</label>
          </div>
        </div>
        <div className='modal-footer'>
          <button
            className='btn light-blue darken-2 waves-effect waves-light'
            onClick={() =>
              addNomination(
                formData.name,
                formData.docs,
                Number(formData.paymentSPO),
                Number(formData.paymentVPO)
              )
            }
          >
            <i className='material-icons left'>save</i>
            Добавить критерий
          </button>
        </div>
      </div>
    </>
  )
}
