import AppLayout from './components/Layout'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './components/Home'
import './App.css'
import BookPage from './components/BookPage'
import MyBooksPage from './components/MyBooksPage'
import RentalHistoryPage from './components/RentalHistoryPage'
import Register from './components/Register'
import Login from './components/Login'


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<AppLayout />}>
            <Route index element={<Home /> } />
            <Route path='book/:id' element={<BookPage /> } />
            <Route path='my_books' element={<MyBooksPage />} />
            <Route path='my_books/book/:id' element={<BookPage /> } />
            <Route path='rental_history' element={<RentalHistoryPage />} />
            <Route path='register' element={ <Register /> } />
            <Route path='login' element={<Login /> } />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App