import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Services from './pages/Services'
import Solutions from './pages/Solutions'
import Pricing from './pages/Pricing'
import Customers from './pages/Customers'
import Contact from './pages/Contact'
import About from './pages/About'
import ResourcePage from './pages/resources/ResourcePage'
import { RESOURCE_PAGES } from './data/resources'
import ServiceDetailPage from './pages/services/ServiceDetailPage'
import { SERVICE_PAGES } from './data/servicePages'

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/solutions" element={<Solutions />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/resources/tools" element={<ResourcePage page={RESOURCE_PAGES.tools} />} />
            <Route path="/resources/glossary" element={<ResourcePage page={RESOURCE_PAGES.glossary} />} />
            <Route path="/resources/faqs" element={<ResourcePage page={RESOURCE_PAGES.faqs} />} />
            <Route path="/resources/ebooks" element={<ResourcePage page={RESOURCE_PAGES.ebooks} />} />
            <Route path="/resources/podcasts" element={<ResourcePage page={RESOURCE_PAGES.podcasts} />} />
            <Route path="/resources/webinars" element={<ResourcePage page={RESOURCE_PAGES.webinars} />} />
            <Route path="/blog" element={<ResourcePage page={RESOURCE_PAGES.blog} />} />
            <Route path="/careers" element={<ResourcePage page={RESOURCE_PAGES.careers} />} />
            <Route path="/solutions/corporate-tax-filing" element={<ServiceDetailPage page={SERVICE_PAGES['corporate-tax-filing']} />} />
            <Route path="/solutions/bookkeeping" element={<ServiceDetailPage page={SERVICE_PAGES.bookkeeping} />} />
            <Route path="/solutions/tax-consultancy" element={<ServiceDetailPage page={SERVICE_PAGES['tax-consultancy']} />} />
            <Route path="/solutions/fractional-cfo" element={<ServiceDetailPage page={SERVICE_PAGES['fractional-cfo']} />} />
            <Route path="/solutions/compliance-services" element={<ServiceDetailPage page={SERVICE_PAGES['compliance-services']} />} />
            <Route path="/solutions/vat-registration" element={<ServiceDetailPage page={SERVICE_PAGES['vat-registration']} />} />
            <Route path="/solutions/corporate-tax-registration" element={<ServiceDetailPage page={SERVICE_PAGES['corporate-tax-registration']} />} />
            <Route path="/solutions/liquidation-services" element={<ServiceDetailPage page={SERVICE_PAGES['liquidation-services']} />} />
            <Route path="/solutions/hire-an-expert" element={<ServiceDetailPage page={SERVICE_PAGES['hire-an-expert']} />} />
            <Route path="/solutions/vat-filing" element={<ServiceDetailPage page={SERVICE_PAGES['vat-filing']} />} />
            <Route path="/solutions/restaurants" element={<ServiceDetailPage page={SERVICE_PAGES.restaurants} />} />
            <Route path="/solutions/startups" element={<ServiceDetailPage page={SERVICE_PAGES.startups} />} />
            <Route path="/solutions/ecommerce" element={<ServiceDetailPage page={SERVICE_PAGES.ecommerce} />} />
            <Route path="/solutions/smes" element={<ServiceDetailPage page={SERVICE_PAGES.smes} />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
