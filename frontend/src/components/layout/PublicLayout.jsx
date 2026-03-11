import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

const PublicLayout = () => (
  <>
    <Navbar />
    <main>
      <Outlet />
    </main>
    <Footer />
  </>
)

export default PublicLayout
