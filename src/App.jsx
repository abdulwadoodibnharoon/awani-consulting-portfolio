import { useEffect, useState, useRef, useCallback } from 'react'
import './App.css'

function App() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const touchStartX = useRef(0)
  const touchStartY = useRef(0)
  const touchCurrentX = useRef(0)
  const touchCurrentY = useRef(0)
  const drawerRef = useRef(null)

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    element?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleDrawerNav = useCallback((sectionId) => {
    setDrawerOpen(false)
    setTimeout(() => scrollToSection(sectionId), 300)
  }, [])

  const openChat = () => {
    if (window.tidioChatApi) {
      window.tidioChatApi.open()
    } else {
      window.location.href = 'mailto:consulting@awani.ai?subject=Consulting%20Inquiry'
    }
  }

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [drawerOpen])

  // Edge swipe detection
  useEffect(() => {
    const EDGE_ZONE = 40
    const SWIPE_THRESHOLD = 50

    const onTouchStart = (e) => {
      const touch = e.touches[0]
      touchStartX.current = touch.clientX
      touchStartY.current = touch.clientY
      touchCurrentX.current = touch.clientX
      touchCurrentY.current = touch.clientY
    }

    const onTouchMove = (e) => {
      const touch = e.touches[0]
      touchCurrentX.current = touch.clientX
      touchCurrentY.current = touch.clientY
    }

    const onTouchEnd = () => {
      const deltaX = touchCurrentX.current - touchStartX.current
      const deltaY = Math.abs(touchCurrentY.current - touchStartY.current)

      // Open: swipe right from left edge (horizontal swipe must dominate vertical)
      if (!drawerOpen && touchStartX.current < EDGE_ZONE && deltaX > SWIPE_THRESHOLD && deltaX > deltaY) {
        setDrawerOpen(true)
      }
      // Close: swipe left while drawer is open
      if (drawerOpen && deltaX < -SWIPE_THRESHOLD) {
        setDrawerOpen(false)
      }
    }

    document.addEventListener('touchstart', onTouchStart, { passive: true })
    document.addEventListener('touchmove', onTouchMove, { passive: true })
    document.addEventListener('touchend', onTouchEnd, { passive: true })

    return () => {
      document.removeEventListener('touchstart', onTouchStart)
      document.removeEventListener('touchmove', onTouchMove)
      document.removeEventListener('touchend', onTouchEnd)
    }
  }, [drawerOpen])

  // Optimize scroll performance by reducing animations during scroll
  useEffect(() => {
    let scrollTimeout
    const handleScroll = () => {
      document.body.classList.add('is-scrolling')
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => {
        document.body.classList.remove('is-scrolling')
      }, 150)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(scrollTimeout)
    }
  }, [])

  return (
    <div className="app">
      {/* Navigation */}
      <nav className="nav">
        <div className="nav-content">
          <button className="mobile-menu-toggle" onClick={() => setDrawerOpen(true)} aria-label="Open navigation menu">
            <i className="fa-solid fa-bars"></i>
          </button>
          <div className="logo-container" onClick={() => scrollToSection('home')}>
            <img src="/awani-icon.png" alt="Awāni" className="logo-image" />
            <span className="logo-text gradient-text">Awāni</span>
          </div>
          <div className="nav-links">
            <a href="#home" onClick={() => scrollToSection('home')}>Home</a>
            <a href="#services" onClick={() => scrollToSection('services')}>Solutions</a>
            <a href="#case-study" onClick={() => scrollToSection('case-study')}>Case Study</a>
            <a href="#pricing" onClick={() => scrollToSection('pricing')}>Pricing</a>
            <a href="#contact" onClick={() => scrollToSection('contact')}>Contact</a>
          </div>
          <button className="cta-button" onClick={openChat}>Book Call</button>
        </div>
      </nav>

      {/* Mobile Navigation Drawer */}
      <div className={`drawer-backdrop ${drawerOpen ? 'open' : ''}`} onClick={() => setDrawerOpen(false)} />
      <div className={`drawer ${drawerOpen ? 'open' : ''}`} ref={drawerRef}>
        <div className="drawer-header">
          <div className="drawer-brand" onClick={() => handleDrawerNav('home')}>
            <img src="/awani-icon.png" alt="Awāni" className="drawer-logo" />
            <span className="gradient-text">Awāni</span>
          </div>
          <button className="drawer-close" onClick={() => setDrawerOpen(false)} aria-label="Close navigation menu">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div className="drawer-links">
          <a onClick={() => handleDrawerNav('home')}><i className="fa-solid fa-house"></i> Home</a>
          <a onClick={() => handleDrawerNav('services')}><i className="fa-solid fa-lightbulb"></i> Solutions</a>
          <a onClick={() => handleDrawerNav('experts')}><i className="fa-solid fa-users"></i> Expert Consultants</a>
          <a onClick={() => handleDrawerNav('case-study')}><i className="fa-solid fa-briefcase"></i> Case Studies</a>
          <a onClick={() => handleDrawerNav('pricing')}><i className="fa-solid fa-tags"></i> Pricing</a>
          <a onClick={() => handleDrawerNav('technology')}><i className="fa-solid fa-microchip"></i> Technology Expertise</a>
          <a onClick={() => handleDrawerNav('contact')}><i className="fa-solid fa-envelope"></i> Contact</a>
        </div>
        <div className="drawer-footer">
          <button className="drawer-cta" onClick={() => { setDrawerOpen(false); openChat() }}>
            <i className="fa-solid fa-phone"></i> Book a Call
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="animated-bg">
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
          <div className="orb orb-3"></div>
        </div>
        <div className="hero-content">
          <div className="fade-in">
            <div className="subtitle">26+ Years Building Enterprise-Scale Systems | 360 degree Mobility Platform ~$360M+ Exit</div>
            <h1 className="hero-title">
              Helping businesses build <br />
              <span className="gradient-text">better software, faster</span>
            </h1>
            <p className="hero-description">
              Carrier & Utility-Grade IoT • Voice AI • Enterprise Architecture • Fractional CTO
            </p>
            <div className="hero-buttons">
              <button className="primary-button glow-button" onClick={() => scrollToSection('services')}>View Solutions</button>
              <button className="secondary-button" onClick={() => scrollToSection('experts')}>View Experts</button>
              <button className="secondary-button" onClick={() => scrollToSection('case-study')}>See Case Studies</button>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Consulting Section */}
      <section id="services" className="section">
        <div className="container">
          <h2 className="section-title">Solution Consulting</h2>
          <p className="section-subtitle">Enterprise-grade solutions across AI, IoT, and software architecture</p>

          <div className="services-grid">
            <div className="service-card glass-card">
              <div className="service-icon-wrapper">
                <div className="service-icon gradient-icon">AI</div>
              </div>
              <h3>AI/ML Solutions</h3>
              <p>Enterprise AI implementation and integration</p>
              <ul className="service-features">
                <li>Voice AI & conversational agents</li>
                <li>LLM integration (Frontier & open-weight via HuggingFace)</li>
                <li>Private cloud AI deployment</li>
                <li>Computer vision & OCR</li>
              </ul>
              <div className="service-price">$15K - $100K</div>
            </div>

            <div className="service-card glass-card">
              <div className="service-icon-wrapper">
                <div className="service-icon gradient-icon">AIoT</div>
              </div>
              <h3>AIoT Platforms</h3>
              <p>AI-powered IoT systems at enterprise scale</p>
              <ul className="service-features">
                <li>Smart Grid & utilities IoT</li>
                <li>Fleet tracking & telematics</li>
                <li>Carrier-grade deployments</li>
                <li>Edge computing & sensors</li>
              </ul>
              <div className="service-price">$50K - $300K</div>
            </div>

            <div className="service-card glass-card">
              <div className="service-icon-wrapper">
                <div className="service-icon gradient-icon">CTO</div>
              </div>
              <h3>Fractional CTO</h3>
              <p>Strategic technical leadership without full-time cost</p>
              <ul className="service-features">
                <li>Technology strategy & roadmap</li>
                <li>Enterprise architecture (TOGAF)</li>
                <li>Team building & mentoring</li>
                <li>Technical due diligence</li>
              </ul>
              <div className="service-price">$3K - $10K/month</div>
            </div>

            <div className="service-card glass-card">
              <div className="service-icon-wrapper">
                <div className="service-icon gradient-icon">API</div>
              </div>
              <h3>API & Integration</h3>
              <p>Connect systems and automate workflows</p>
              <ul className="service-features">
                <li>Third-party API integrations</li>
                <li>Workflow automation</li>
                <li>Data pipeline & ETL</li>
                <li>Custom middleware & microservices</li>
              </ul>
              <div className="service-price">$3K - $30K</div>
            </div>

            <div className="service-card glass-card">
              <div className="service-icon-wrapper">
                <div className="service-icon gradient-icon">DEV</div>
              </div>
              <h3>Software Development</h3>
              <p>Custom enterprise applications built for scale</p>
              <ul className="service-features">
                <li>Web & mobile applications</li>
                <li>SaaS platform development</li>
                <li>Enterprise dashboards</li>
                <li>Legacy system modernization</li>
              </ul>
              <div className="service-price">$10K - $150K</div>
            </div>

            <div className="service-card glass-card">
              <div className="service-icon-wrapper">
                <div className="service-icon gradient-icon">XR</div>
              </div>
              <h3>3D/AR/VR/XR</h3>
              <p>Immersive experiences and digital twins</p>
              <ul className="service-features">
                <li>3D digital twin platforms</li>
                <li>AR/VR applications</li>
                <li>3D visualization & CAD</li>
                <li>Mixed reality solutions</li>
              </ul>
              <div className="service-price">$20K - $150K</div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section dark-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-value gradient-text">26+</div>
              <div className="stat-label">Years Experience</div>
            </div>
            <div className="stat-item">
              <div className="stat-value gradient-text">$360M</div>
              <div className="stat-label">Platform Exit</div>
            </div>
            <div className="stat-item">
              <div className="stat-value gradient-text">7</div>
              <div className="stat-label">Global Carrier Deployments</div>
            </div>
            <div className="stat-item">
              <div className="stat-value gradient-text">100%</div>
              <div className="stat-label">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Expert Consultants Section */}
      <section id="experts" className="section">
        <div className="container">
          <h2 className="section-title">Expert Consultants</h2>
          <p className="section-subtitle">World-class expertise across every discipline</p>

          <div className="experts-grid">
            {/* HIGH PRIORITY - Matching Solutions & Case Studies */}

            <div className="expert-card glass-card">
              <div className="expert-icon"><i className="fa-solid fa-brain"></i></div>
              <h4>Local AI/ML Specialist</h4>
              <p className="expert-experience">10+ years experience</p>
              <p className="expert-description">On-device AI, edge computing, model optimization, offline-first ML systems</p>
            </div>

            <div className="expert-card glass-card">
              <div className="expert-icon"><i className="fa-solid fa-network-wired"></i></div>
              <h4>IoT Architecture Expert</h4>
              <p className="expert-experience">12+ years experience</p>
              <p className="expert-description">Smart cities, industrial IoT, sensor networks, real-time data processing</p>
            </div>

            <div className="expert-card glass-card">
              <div className="expert-icon"><i className="fa-solid fa-globe"></i></div>
              <h4>Telecommunications IoT Specialist</h4>
              <p className="expert-experience">15+ years experience</p>
              <p className="expert-description">Carrier-grade IoT deployments for Sprint, Verizon, AT&T, Telstra, STC, Ooredoo, Saudi NIC</p>
            </div>

            <div className="expert-card glass-card">
              <div className="expert-icon"><i className="fa-solid fa-bolt"></i></div>
              <h4>Utilities & Smart Grid Expert</h4>
              <p className="expert-experience">12+ years experience</p>
              <p className="expert-description">Smart Grid, Smart Meter, Water Network Monitoring for National Utilities (Saudi Arabia, UAE, Qatar)</p>
            </div>

            <div className="expert-card glass-card">
              <div className="expert-icon"><i className="fa-solid fa-map-location-dot"></i></div>
              <h4>Fleet Management Specialist</h4>
              <p className="expert-experience">15+ years experience</p>
              <p className="expert-description">GPS tracking, telematics, mobile workforce solutions, logistics optimization</p>
            </div>

            <div className="expert-card glass-card">
              <div className="expert-icon"><i className="fa-solid fa-building-columns"></i></div>
              <h4>Enterprise Architect</h4>
              <p className="expert-experience">20+ years experience</p>
              <p className="expert-description">TOGAF certified, system integration, digital transformation, legacy modernization</p>
            </div>

            <div className="expert-card glass-card">
              <div className="expert-icon"><i className="fa-solid fa-chart-line"></i></div>
              <h4>Data Engineering Specialist</h4>
              <p className="expert-experience">12+ years experience</p>
              <p className="expert-description">ETL pipelines, data warehousing, analytics platforms, real-time data sync</p>
            </div>

            <div className="expert-card glass-card">
              <div className="expert-icon"><i className="fa-solid fa-gears"></i></div>
              <h4>SaaS Architecture Expert</h4>
              <p className="expert-experience">16+ years experience</p>
              <p className="expert-description">Multi-tenancy, subscription billing, horizontal scaling, SaaS metrics optimization</p>
            </div>

            <div className="expert-card glass-card">
              <div className="expert-icon"><i className="fa-solid fa-gem"></i></div>
              <h4>Product Development Expert</h4>
              <p className="expert-experience">15+ years experience</p>
              <p className="expert-description">0-to-1 product building, MVP development, product-market fit, launch strategy</p>
            </div>

            {/* MEDIUM PRIORITY - Supporting Skills */}

            <div className="expert-card glass-card">
              <div className="expert-icon"><i className="fa-solid fa-bullseye"></i></div>
              <h4>Performance & Scalability Specialist</h4>
              <p className="expert-experience">15+ years experience</p>
              <p className="expert-description">Robustness engineering, horizontal scaling, load optimization, sub-second response times</p>
            </div>

            <div className="expert-card glass-card">
              <div className="expert-icon"><i className="fa-solid fa-cloud"></i></div>
              <h4>Multi-Cloud Architect</h4>
              <p className="expert-experience">14+ years experience</p>
              <p className="expert-description">AWS, Azure, GCP, hybrid cloud, cost optimization, cloud migration strategies</p>
            </div>

            <div className="expert-card glass-card">
              <div className="expert-icon"><i className="fa-solid fa-shield-halved"></i></div>
              <h4>Security Architect</h4>
              <p className="expert-experience">12+ years experience</p>
              <p className="expert-description">Application security, penetration testing, OWASP standards, zero-trust architecture</p>
            </div>

            <div className="expert-card glass-card">
              <div className="expert-icon"><i className="fa-solid fa-city"></i></div>
              <h4>Smart City Consultant</h4>
              <p className="expert-experience">10+ years experience</p>
              <p className="expert-description">Smart utilities, smart ports, smart energy, connected infrastructure</p>
            </div>

            <div className="expert-card glass-card">
              <div className="expert-icon"><i className="fa-solid fa-car"></i></div>
              <h4>Automotive Systems Expert</h4>
              <p className="expert-experience">12+ years experience</p>
              <p className="expert-description">Infotainment systems, navigation, telematics, embedded automotive electronics</p>
            </div>

            <div className="expert-card glass-card">
              <div className="expert-icon"><i className="fa-solid fa-credit-card"></i></div>
              <h4>Banking Automation Specialist</h4>
              <p className="expert-experience">10+ years experience</p>
              <p className="expert-description">Fully automated bank branch (zero staff), remote monitoring & auto-repair for ATMs, cash management systems</p>
            </div>

            <div className="expert-card glass-card">
              <div className="expert-icon"><i className="fa-solid fa-graduation-cap"></i></div>
              <h4>EdTech Consultant</h4>
              <p className="expert-experience">10+ years experience</p>
              <p className="expert-description">Learning management systems, educational platforms, SaaS for education</p>
            </div>

            <div className="expert-card glass-card">
              <div className="expert-icon"><i className="fa-solid fa-flask"></i></div>
              <h4>QA Automation Specialist</h4>
              <p className="expert-experience">12+ years experience</p>
              <p className="expert-description">Test automation, CI/CD pipelines, regression testing, quality assurance frameworks</p>
            </div>

            <div className="expert-card glass-card">
              <div className="expert-icon"><i className="fa-solid fa-triangle-exclamation"></i></div>
              <h4>Chaos Engineering Expert</h4>
              <p className="expert-experience">10+ years experience</p>
              <p className="expert-description">Resilience testing, fault injection, disaster recovery, high-availability systems</p>
            </div>

            <div className="expert-card glass-card">
              <div className="expert-icon"><i className="fa-solid fa-wand-magic-sparkles"></i></div>
              <h4>UI/UX Design Expert</h4>
              <p className="expert-experience">10+ years experience</p>
              <p className="expert-description">User-centered design, design systems, responsive interfaces, accessibility standards</p>
            </div>

            <div className="expert-card glass-card">
              <div className="expert-icon"><i className="fa-solid fa-scale-balanced"></i></div>
              <h4>Islamic FinTech Specialist</h4>
              <p className="expert-experience">14+ years experience</p>
              <p className="expert-description">Shariah-compliant payment systems, Islamic banking automation, Takaful platforms, halal e-commerce</p>
            </div>

            <div className="expert-card glass-card">
              <div className="expert-icon"><i className="fa-solid fa-cart-shopping"></i></div>
              <h4>Halal Retail & E-Commerce Expert</h4>
              <p className="expert-experience">12+ years experience</p>
              <p className="expert-description">Shariah-compliant retail systems, halal product verification, ethical supply chains, Islamic e-commerce</p>
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies Section */}
      <section id="case-study" className="section">
        <div className="container">
          <h2 className="section-title">Case Studies</h2>
          <p className="section-subtitle">Real projects, real results</p>

          <div className="case-studies-grid">
          <div className="case-study-card glass-card">
            <div className="case-study-header">
              <h3>Awāni Voice Assistant</h3>
              <div className="case-study-tags">
                <span className="tag">Voice AI</span>
                <span className="tag">Full-Stack</span>
                <span className="tag">Production</span>
              </div>
            </div>

            <div className="case-study-content">
              <div className="case-study-section">
                <h4>Challenge</h4>
                <p>Built an AI-powered voice assistant for the trucking industry from scratch, requiring real-time voice processing, natural language understanding, and integration with logistics systems.</p>
              </div>

              <div className="case-study-section">
                <h4>Solution</h4>
                <ul>
                  <li>Designed and developed full-stack Voice AI platform</li>
                  <li>Implemented proprietary API for natural language processing</li>
                  <li>Built Flutter mobile app + React dashboard</li>
                  <li>Deployed scalable backend on Multi-Cloud</li>
                </ul>
              </div>

              <div className="case-study-section">
                <h4>Results</h4>
                <div className="results-grid">
                  <div className="result-item">
                    <div className="result-value gradient-text">Trucking</div>
                    <div className="result-label">Industry-specific Voice AI SaaS</div>
                  </div>
                  <div className="result-item">
                    <div className="result-value gradient-text">90%</div>
                    <div className="result-label">Voice accuracy</div>
                  </div>
                </div>
              </div>

              <div className="case-study-tech">
                <strong>Technologies:</strong> React, TypeScript, Node.js, Flutter, Multi-Cloud, Proprietary Multi-AI Models, WebSockets, High-Performance RDBMS, Distributed In-Memory Cache, IaC, Containers
              </div>
            </div>
          </div>

          <div className="case-study-card glass-card">
            <div className="case-study-header">
              <h3>Mobility Platform</h3>
              <div className="case-study-tags">
                <span className="tag">IoT</span>
                <span className="tag">Enterprise Scale</span>
                <span className="tag">Acquisition</span>
              </div>
            </div>

            <div className="case-study-content">
              <div className="case-study-section">
                <h4>Challenge</h4>
                <p>Lead tech consultants for a startup building GPS tracking and video telematics platform from ground zero for commercial fleets, insurance companies, and government agencies.</p>
              </div>

              <div className="case-study-section">
                <h4>Solution</h4>
                <ul>
                  <li>Architected enterprise-grade mobility platform from scratch</li>
                  <li>Built GPS tracking, video telematics, and mobile workforce solutions</li>
                  <li>Scaled infrastructure to support millions of concurrent messages</li>
                  <li>Implemented carrier-grade reliability and real-time data processing</li>
                </ul>
              </div>

              <div className="case-study-section">
                <h4>Results</h4>
                <div className="results-grid">
                  <div className="result-item">
                    <div className="result-value gradient-text">$360M</div>
                    <div className="result-label">Platform later acquired by Global Mobility Leader</div>
                  </div>
                  <div className="result-item">
                    <div className="result-value gradient-text">Ground Zero</div>
                    <div className="result-label">Built from scratch as founding tech team</div>
                  </div>
                  <div className="result-item">
                    <div className="result-value gradient-text">Enterprise</div>
                    <div className="result-label">Thousands of mobility customers across North America</div>
                  </div>
                </div>
              </div>

              <div className="case-study-tech">
                <strong>Technologies:</strong> Java Spring Boot, High-Performance RDBMS, Distributed In-Memory Cache, Multi-Cloud, GPS/Telematics APIs, Video Streaming, Mobile Development, Enterprise Architecture, IaC, Containers
              </div>
            </div>
          </div>

          <div className="case-study-card glass-card">
            <div className="case-study-header">
              <h3>Smart Grid & Smart Meter IoT</h3>
              <div className="case-study-tags">
                <span className="tag">IoT</span>
                <span className="tag">Utilities</span>
                <span className="tag">Enterprise</span>
              </div>
            </div>

            <div className="case-study-content">
              <div className="case-study-section">
                <h4>Challenge</h4>
                <p>Deployed Smart Grid and Smart Meter IoT software optimization for Global Energy Infrastructure Provider working with National Utility Authority, requiring utility-grade reliability and real-time monitoring.</p>
              </div>

              <div className="case-study-section">
                <h4>Solution</h4>
                <ul>
                  <li>Optimized large-scale utility IoT platform deployment</li>
                  <li>Implemented real-time grid monitoring and analytics systems</li>
                  <li>Built smart meter data management and optimization layer</li>
                  <li>Deployed mission-critical infrastructure at national utility scale</li>
                </ul>
              </div>

              <div className="case-study-section">
                <h4>Results</h4>
                <div className="results-grid">
                  <div className="result-item">
                    <div className="result-value gradient-text">National</div>
                    <div className="result-label">Utility Authority deployment</div>
                  </div>
                  <div className="result-item">
                    <div className="result-value gradient-text">Utility-Grade</div>
                    <div className="result-label">Mission-critical reliability</div>
                  </div>
                  <div className="result-item">
                    <div className="result-value gradient-text">Real-Time</div>
                    <div className="result-label">Grid monitoring & analytics</div>
                  </div>
                </div>
              </div>

              <div className="case-study-tech">
                <strong>Technologies:</strong> IoT Platform Architecture, SCADA Systems, Real-Time Analytics, High-Performance RDBMS, Time-Series Databases, MQTT, Microservices, High Availability Systems
              </div>
            </div>
          </div>

          <div className="case-study-card glass-card">
            <div className="case-study-header">
              <h3>Water Network Monitoring IoT</h3>
              <div className="case-study-tags">
                <span className="tag">IoT</span>
                <span className="tag">Utilities</span>
                <span className="tag">MENA</span>
              </div>
            </div>

            <div className="case-study-content">
              <div className="case-study-section">
                <h4>Challenge</h4>
                <p>Deployed Water Network Monitoring Systems for Gulf Region Utility Authorities requiring real-time leak detection, pressure monitoring, and network-wide analytics for critical water infrastructure.</p>
              </div>

              <div className="case-study-section">
                <h4>Solution</h4>
                <ul>
                  <li>Deployed water network IoT monitoring infrastructure</li>
                  <li>Implemented real-time leak detection and pressure management systems</li>
                  <li>Built network-wide analytics and reporting dashboards</li>
                  <li>Integrated with existing SCADA and utility management systems</li>
                </ul>
              </div>

              <div className="case-study-section">
                <h4>Results</h4>
                <div className="results-grid">
                  <div className="result-item">
                    <div className="result-value gradient-text">2 Countries</div>
                    <div className="result-label">Deployed in Gulf Region utilities</div>
                  </div>
                  <div className="result-item">
                    <div className="result-value gradient-text">Real-Time</div>
                    <div className="result-label">Network monitoring & leak detection</div>
                  </div>
                  <div className="result-item">
                    <div className="result-value gradient-text">Critical</div>
                    <div className="result-label">Water infrastructure operations</div>
                  </div>
                </div>
              </div>

              <div className="case-study-tech">
                <strong>Technologies:</strong> IoT Sensors, SCADA Integration, Real-Time Monitoring, Time-Series Databases, GIS Systems, MQTT, High-Performance RDBMS, Analytics Dashboards
              </div>
            </div>
          </div>

          <div className="case-study-card glass-card">
            <div className="case-study-header">
              <h3>EdTech SaaS Platform</h3>
              <div className="case-study-tags">
                <span className="tag">SaaS</span>
                <span className="tag">Education</span>
                <span className="tag">Enterprise</span>
              </div>
            </div>

            <div className="case-study-content">
              <div className="case-study-section">
                <h4>Challenge</h4>
                <p>Built enterprise SaaS platform for educational institutions requiring multi-tenant architecture, role-based access control, and scalable content delivery for thousands of concurrent users.</p>
              </div>

              <div className="case-study-section">
                <h4>Solution</h4>
                <ul>
                  <li>Architected multi-tenant SaaS platform with isolated data models</li>
                  <li>Implemented scalable backend infrastructure on cloud</li>
                  <li>Built comprehensive admin dashboard and student portal</li>
                  <li>Deployed enterprise security and RBAC systems</li>
                </ul>
              </div>

              <div className="case-study-section">
                <h4>Results</h4>
                <div className="results-grid">
                  <div className="result-item">
                    <div className="result-value gradient-text">8 Years</div>
                    <div className="result-label">Leading the platform</div>
                  </div>
                  <div className="result-item">
                    <div className="result-value gradient-text">Enterprise</div>
                    <div className="result-label">Multiple educational institutions served</div>
                  </div>
                </div>
              </div>

              <div className="case-study-tech">
                <strong>Technologies:</strong> Java Spring Boot, High-Performance RDBMS, Distributed In-Memory Cache, Multi-Cloud, Multi-tenant Architecture, RBAC, RESTful APIs, Microservices, IaC, Containers, K8s
              </div>
            </div>
          </div>

          <div className="case-study-card glass-card">
            <div className="case-study-header">
              <h3>Private Cloud Enterprise AI Platform</h3>
              <div className="case-study-tags">
                <span className="tag">AI/ML</span>
                <span className="tag">Enterprise</span>
                <span className="tag">Government</span>
                <span className="tag">Security</span>
              </div>
            </div>

            <div className="case-study-content">
              <div className="case-study-section">
                <h4>Challenge</h4>
                <p>Enterprises and government organizations requiring AI capabilities while maintaining complete data sovereignty and IP privacy. Built secure, on-premises LLM deployment with enterprise chat platform to replace security-compromised commercial messaging apps.</p>
              </div>

              <div className="case-study-section">
                <h4>Solution</h4>
                <ul>
                  <li>Deployed open-source LLM models in private data centers (on-premises)</li>
                  <li>Built enterprise chat application with AI bot integration</li>
                  <li>Implemented end-to-end encryption and air-gapped deployment options</li>
                  <li>Created secure alternative to commercial messaging apps for government & enterprise use</li>
                </ul>
              </div>

              <div className="case-study-section">
                <h4>Results</h4>
                <div className="results-grid">
                  <div className="result-item">
                    <div className="result-value gradient-text">100%</div>
                    <div className="result-label">Data sovereignty & IP privacy</div>
                  </div>
                  <div className="result-item">
                    <div className="result-value gradient-text">On-Prem</div>
                    <div className="result-label">Private cloud/DC deployment</div>
                  </div>
                  <div className="result-item">
                    <div className="result-value gradient-text">Gov/Enterprise</div>
                    <div className="result-label">Secure messaging for sensitive orgs</div>
                  </div>
                </div>
              </div>

              <div className="case-study-tech">
                <strong>Technologies:</strong> Open-Source LLMs, Private Cloud Infrastructure, K8s, IaC, Containers, End-to-End Encryption, Air-Gapped Networks, Enterprise Chat, Python, High-Performance RDBMS, Distributed In-Memory Cache
              </div>
            </div>
          </div>

          <div className="case-study-card glass-card">
            <div className="case-study-header">
              <h3>Enterprise Analytics Platform</h3>
              <div className="case-study-tags">
                <span className="tag">Full-Stack</span>
                <span className="tag">API Integration</span>
                <span className="tag">B2B</span>
              </div>
            </div>

            <div className="case-study-content">
              <div className="case-study-section">
                <h4>Challenge</h4>
                <p>A logistics company needed a unified dashboard to aggregate data from 5+ different systems (TMS, ERP, GPS tracking, fuel cards, maintenance) with real-time synchronization and custom reporting.</p>
              </div>

              <div className="case-study-section">
                <h4>Solution</h4>
                <ul>
                  <li>Built REST API middleware to normalize data from disparate systems</li>
                  <li>Implemented automated data sync pipelines with distributed caching</li>
                  <li>Created React dashboard with role-based access control</li>
                  <li>Designed database schema optimized for reporting queries</li>
                </ul>
              </div>

              <div className="case-study-section">
                <h4>Results</h4>
                <div className="results-grid">
                  <div className="result-item">
                    <div className="result-value gradient-text">80%</div>
                    <div className="result-label">Reduction in manual data entry</div>
                  </div>
                  <div className="result-item">
                    <div className="result-value gradient-text">5min</div>
                    <div className="result-label">Real-time data sync</div>
                  </div>
                  <div className="result-item">
                    <div className="result-value gradient-text">15+</div>
                    <div className="result-label">Custom reports generated</div>
                  </div>
                </div>
              </div>

              <div className="case-study-tech">
                <strong>Technologies:</strong> React, Node.js, Express, High-Performance RDBMS, Distributed In-Memory Cache, REST APIs, JWT Auth, Containers, Multi-Cloud
              </div>
            </div>
          </div>

          <div className="case-study-card glass-card">
            <div className="case-study-header">
              <h3>Self-Powered IoT Gateway</h3>
              <div className="case-study-tags">
                <span className="tag">IoT</span>
                <span className="tag">Hardware</span>
                <span className="tag">Innovation</span>
              </div>
            </div>

            <div className="case-study-content">
              <div className="case-study-section">
                <h4>Challenge</h4>
                <p>Designed ultra-compact, self-powered IoT gateway (size of a debit card) for remote sensor deployments requiring energy harvesting, low-power operation, and reliable connectivity in challenging environments.</p>
              </div>

              <div className="case-study-section">
                <h4>Solution</h4>
                <ul>
                  <li>Architected debit card-sized form factor with integrated energy harvesting</li>
                  <li>Implemented ultra-low-power sensor aggregation and edge processing</li>
                  <li>Built multi-protocol connectivity (5G/6G eSIM, NB-IoT, WiFi)</li>
                  <li>Designed for solar/kinetic/thermal energy harvesting capabilities</li>
                </ul>
              </div>

              <div className="case-study-section">
                <h4>Results</h4>
                <div className="results-grid">
                  <div className="result-item">
                    <div className="result-value gradient-text">Card Size</div>
                    <div className="result-label">Debit card dimensions (length & width)</div>
                  </div>
                  <div className="result-item">
                    <div className="result-value gradient-text">Self-Powered</div>
                    <div className="result-label">Energy harvesting capabilities</div>
                  </div>
                  <div className="result-item">
                    <div className="result-value gradient-text">Edge</div>
                    <div className="result-label">On-device processing & aggregation</div>
                  </div>
                </div>
              </div>

              <div className="case-study-tech">
                <strong>Technologies:</strong> Embedded Systems, ARM Cortex, 5G/6G eSIM, NB-IoT, Energy Harvesting, Ultra-Low-Power Design, Edge Computing, C/C++, MQTT
              </div>
            </div>
          </div>







          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="section">
        <div className="container">
          <h2 className="section-title">Pricing Tiers</h2>
          <p className="section-subtitle">Flexible pricing to match your needs</p>

          <div className="pricing-grid">
            <div className="pricing-card glass-card">
              <div className="pricing-header">
                <h3>Rapid</h3>
                <div className="pricing-amount gradient-text">$500 - $2K</div>
                <div className="pricing-timeline">1-3 days</div>
              </div>
              <ul className="pricing-features">
                <li>✓ Bug fixes</li>
                <li>✓ Simple feature additions</li>
                <li>✓ Code reviews</li>
                <li>✓ Performance audits</li>
              </ul>
              <div className="pricing-badge">Quick Wins</div>
            </div>

            <div className="pricing-card glass-card featured">
              <div className="featured-badge">Most Popular</div>
              <div className="pricing-header">
                <h3>Standard</h3>
                <div className="pricing-amount gradient-text">$3K - $15K</div>
                <div className="pricing-timeline">1-4 weeks</div>
              </div>
              <ul className="pricing-features">
                <li>✓ API integrations</li>
                <li>✓ Small custom applications</li>
                <li>✓ Database optimization</li>
                <li>✓ Technical audits</li>
              </ul>
              <div className="pricing-badge">Defined Scope</div>
            </div>

            <div className="pricing-card glass-card">
              <div className="pricing-header">
                <h3>Premium</h3>
                <div className="pricing-amount gradient-text">$20K - $100K+</div>
                <div className="pricing-timeline">4-16 weeks</div>
              </div>
              <ul className="pricing-features">
                <li>✓ AI/ML integration</li>
                <li>✓ Full application development</li>
                <li>✓ Legacy system modernization</li>
                <li>✓ Technical transformation</li>
              </ul>
              <div className="pricing-badge">Major Initiatives</div>
            </div>

            <div className="pricing-card glass-card">
              <div className="pricing-header">
                <h3>Retainer</h3>
                <div className="pricing-amount gradient-text">$3K - $10K/mo</div>
                <div className="pricing-timeline">Ongoing</div>
              </div>
              <ul className="pricing-features">
                <li>✓ Fractional CTO (10-20hr/mo)</li>
                <li>✓ Technical advisory</li>
                <li>✓ Development support</li>
                <li>✓ Priority access</li>
              </ul>
              <div className="pricing-badge">Long-Term</div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section id="technology" className="section dark-section">
        <div className="container">
          <h2 className="section-title">Technology Expertise</h2>
          <div className="tech-categories">
            <div className="tech-category">
              <h4>Frontend & Mobile</h4>
              <div className="tech-tags">
                <span className="tech-tag">React</span>
                <span className="tech-tag">TypeScript</span>
                <span className="tech-tag">Next.js</span>
                <span className="tech-tag">Flutter</span>
                <span className="tech-tag">React Native</span>
                <span className="tech-tag">Swift/SwiftUI</span>
                <span className="tech-tag">Kotlin/Jetpack Compose</span>
                <span className="tech-tag">Vite</span>
                <span className="tech-tag">Tailwind CSS</span>
                <span className="tech-tag">Vue.js</span>
              </div>
            </div>
            <div className="tech-category">
              <h4>Backend & APIs</h4>
              <div className="tech-tags">
                <span className="tech-tag">Node.js</span>
                <span className="tech-tag">Express</span>
                <span className="tech-tag">Java Spring Boot</span>
                <span className="tech-tag">Python</span>
                <span className="tech-tag">WebSocket</span>
                <span className="tech-tag">REST APIs</span>
                <span className="tech-tag">GraphQL</span>
                <span className="tech-tag">Microservices</span>
              </div>
            </div>
            <div className="tech-category">
              <h4>AI & Voice</h4>
              <div className="tech-tags">
                <span className="tech-tag">Multi-Model AI Integration</span>
                <span className="tech-tag">Voice AI</span>
                <span className="tech-tag">Speech-to-Text</span>
                <span className="tech-tag">LLM Fine-Tuning</span>
                <span className="tech-tag">Computer Vision</span>
                <span className="tech-tag">LangChain</span>
              </div>
            </div>
            <div className="tech-category">
              <h4>Data & Cloud</h4>
              <div className="tech-tags">
                <span className="tech-tag">High-Performance RDBMS</span>
                <span className="tech-tag">In-Memory Caching</span>
                <span className="tech-tag">MongoDB</span>
                <span className="tech-tag">Time-Series DBs</span>
                <span className="tech-tag">Multi-Cloud</span>
                <span className="tech-tag">Edge Computing</span>
              </div>
            </div>
            <div className="tech-category">
              <h4>DevOps & Infrastructure</h4>
              <div className="tech-tags">
                <span className="tech-tag">Containers</span>
                <span className="tech-tag">K8s</span>
                <span className="tech-tag">IaC</span>
                <span className="tech-tag">CI/CD</span>
                <span className="tech-tag">Nginx</span>
                <span className="tech-tag">Monitoring & Observability</span>
                <span className="tech-tag">Playwright</span>
              </div>
            </div>
            <div className="tech-category">
              <h4>IoT & Embedded</h4>
              <div className="tech-tags">
                <span className="tech-tag">SCADA</span>
                <span className="tech-tag">MQTT</span>
                <span className="tech-tag">Sensor Networks</span>
                <span className="tech-tag">ARM Cortex</span>
                <span className="tech-tag">Energy Harvesting</span>
                <span className="tech-tag">5G/NB-IoT</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section">
        <div className="container">
          <div className="contact-card glass-card">
            <h2 className="gradient-text">Let's Work Together</h2>
            <p>Ready to transform your business with better software?</p>
            <div className="contact-info">
              <div className="contact-item">
                <div className="contact-icon-box"><i className="fa-solid fa-envelope"></i></div>
                <a href="mailto:consulting@awani.ai">consulting@awani.ai</a>
              </div>
              <div className="contact-item">
                <div className="contact-icon-box"><i className="fa-solid fa-location-dot"></i></div>
                <span>Ohio, USA (Serving clients globally)</span>
              </div>
              <div className="contact-item">
                <div className="contact-icon-box"><i className="fa-solid fa-clock"></i></div>
                <span>Available across all time zones</span>
              </div>
            </div>
            <button className="primary-button glow-button" onClick={openChat}>Schedule Discovery Call</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-left">
              <div className="footer-brand" onClick={() => scrollToSection('home')} style={{ cursor: 'pointer' }}>
                <img src="/awani-icon.png" alt="Awāni" className="footer-logo" />
                <span className="logo gradient-text">Awāni Product Consulting</span>
              </div>
              <p>Scaling to cover the globe...</p>
            </div>
            <div className="footer-links">
              <a href="#services">Solutions</a>
              <a href="#case-study">Case Studies</a>
              <a href="#pricing">Pricing</a>
              <a href="#contact">Contact</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p className="shariah-notice">Committed to ethical business practices</p>
            <p>© 2026 Awāni Product Consulting. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
