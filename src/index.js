import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from 'react-query' 
import App from './App'
import { NotificationContextProvider } from './context/notificationContext'
import { UserContextProvider } from './context/userContext'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <NotificationContextProvider>
    <UserContextProvider>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </UserContextProvider>
  </NotificationContextProvider>
)
