import './App.css'
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom'
import Header from "./components/Header.jsx"
import Footer from "./components/Footer.jsx"
import toast, { Toaster } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { setUserDetails } from './store/userSlice.js'
import fetchUserDetails from './utils/fetchUserDetails.js';
import Axios from './utils/Axios.js';
import SummaryApi from './common/SummaryApi.js';
import { setAllCategory, setAllSubCategory, setLoadingCategory } from './store/productSlice.js';
import GlobalProvider from './provider/GlobalProvider.jsx';
import CartMobileLink from './components/CartMobile.jsx'
import ChatWidget from './components/ChatWidget.jsx'
import { useLocation } from 'react-router-dom';


function App() {
  const dispatch = useDispatch()
  const location = useLocation()

  const fetchUser = async () => {
    const userData = await fetchUserDetails()
    dispatch(setUserDetails(userData?.data))
  }

  const fetchCategory = async () => {
    try {
      dispatch(setLoadingCategory(true))
      const response = await Axios({
        ...SummaryApi.getCategory
      })
      const { data: responseData } = response

      if (responseData.success) {
        dispatch(setAllCategory(responseData.data))
      }

    } catch (error) {
      toast.error(error)
    } finally {
      dispatch(setLoadingCategory(false))
    }
  }


  const fetchSubCategory = async () => {
    try {

      const response = await Axios({
        ...SummaryApi.getSubCategory
      })
      const { data: responseData } = response

      if (responseData.success) {
        dispatch(setAllSubCategory(responseData.data))
      }

    } catch (error) {
      toast.error(error)
    }
  }




  useEffect(() => {
    fetchUser()
    fetchCategory()
    fetchSubCategory()
  }, [])

  return (
    <GlobalProvider>
      <div className="flex min-h-screen flex-col bg-ground">
        <Header />
        <main className="flex-grow">
          <Outlet />
        </main>
        <Footer />
      </div>

      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          className: 'font-sans',
          style: {
            background: 'rgb(var(--k-surface))',
            color: 'rgb(var(--k-fg))',
            border: '1px solid rgb(var(--k-line))',
            borderRadius: '14px',
            boxShadow: '0 18px 40px -18px rgb(var(--k-shadow) / 0.45)',
            fontSize: '14px',
            padding: '10px 14px',
          },
          success: { iconTheme: { primary: 'rgb(var(--k-positive))', secondary: 'rgb(var(--k-surface))' } },
          error: { iconTheme: { primary: 'rgb(var(--k-critical))', secondary: 'rgb(var(--k-surface))' } },
        }}
      />

      {
        location.pathname !== '/checkout' &&
        (
          <CartMobileLink />
        )
      }

      <ChatWidget />
    </GlobalProvider>
  )
}

export default App
