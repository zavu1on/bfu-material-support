import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import { CompanyProvider } from './store/CompanyContext'
import { RequestProvider } from './store/RequestContext'
import { AuthProvider } from './store/AuthContext'
import App from './App'
import { NotificationProvider } from './store/NotificationContext'

ReactDOM.render(
  <NotificationProvider>
    <CompanyProvider>
      <RequestProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </RequestProvider>
    </CompanyProvider>
  </NotificationProvider>,
  document.getElementById('root')
)
