import React, { useState, useEffect, useRef } from 'react';
import './App.css';

// Import Video Asset
import landingVideo from './assets/landing_page.mp4';
import flowerInCar from './assets/flower-in-car.png';
import flowerBouquet from './assets/flower_bouqet.png';
import redFlower from './assets/red-flower.png';
import vowsVelvet from './assets/vows-of-velvet.png';

function App() {
  const [scrollY, setScrollY] = useState(0);
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [orderForm, setOrderForm] = useState({
    name: '',
    email: '',
    vibe: 'tulip',
    size: 'classic',
    note: ''
  });

  const heroRef = useRef(null);

  // Scroll and Observer handlers
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      
      // Refined Navbar Scroll Logic
      const nav = document.querySelector('nav');
      if (nav) {
        if (window.scrollY > 100) {
          nav.classList.add('is-scrolled');
        } else {
          nav.classList.remove('is-scrolled');
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Trigger once on mount
    handleScroll();

    // Intersection Observer for ethereal reveals (.reveal-up)
    const observerOptions = {
      threshold: 0.05,
      rootMargin: "0px 0px -100px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.reveal-up').forEach(el => observer.observe(el));

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  // Custom cursor movement
  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Add hover effect listeners to interactive items
  useEffect(() => {
    const addHoverListeners = () => {
      const interactives = document.querySelectorAll('button, a, .interactive-hover, input, select, textarea');
      interactives.forEach((el) => {
        el.addEventListener('mouseenter', () => setIsHovered(true));
        el.addEventListener('mouseleave', () => setIsHovered(false));
      });
    };

    // Delay slightly to ensure DOM is fully rendered
    const timer = setTimeout(addHoverListeners, 500);
    return () => clearTimeout(timer);
  }, [isModalOpen]);

  // Calculations for Hero-to-Section2 Video Transition
  const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
  const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1280;
  const isMobileViewport = viewportWidth < 768;
  
  // Transition occurs quickly so the sticky hero does not leave a blank scroll page.
  const rawRatio = scrollY / (viewportHeight * 0.32 || 1);
  const scrollRatio = Math.max(0, Math.min(rawRatio, 1)); // Clamped 0 to 1

  // Dynamic Video Container Styles based on Scroll (Centered -> Left)
  const videoScale = 1 - scrollRatio * 0.52; 
  const videoStartX = isMobileViewport ? 0 : 18;
  const videoEndX = isMobileViewport ? 0 : -25;
  const videoTranslateX = videoStartX + scrollRatio * (videoEndX - videoStartX);
  const videoTranslateY = scrollRatio * 2; 
  const videoBorderRadius = 180 - scrollRatio * 140; // Starts arched, becomes softer rounded box
  const videoOpacity = 1;

  // Text opacities based on scroll
  const heroTextOpacity = Math.max(0, 1 - scrollRatio * 2.2);
  const section2TextOpacity = scrollRatio < 0.3 ? 0 : Math.min((scrollRatio - 0.3) / 0.6, 1);
  const section2TextTranslateY = (1 - section2TextOpacity) * 50;

  const handleOrderChange = (e) => {
    setOrderForm({
      ...orderForm,
      [e.target.name]: e.target.value
    });
  };

  const handleOrderSubmit = (e) => {
    e.preventDefault();
    setOrderSubmitted(true);
    setTimeout(() => {
      setIsModalOpen(false);
      setOrderSubmitted(false);
      setOrderForm({ name: '', email: '', vibe: 'tulip', size: 'classic', note: '' });
    }, 2500);
  };

  return (
    <>
      {/* Luxury Custom Cursor (Desktop only) */}
      <div 
        className={`custom-cursor-dot ${isHovered ? 'hovered' : ''}`}
        style={{ left: `${cursorPos.x}px`, top: `${cursorPos.y}px` }}
      />
      <div 
        className={`custom-cursor-aura ${isHovered ? 'hovered' : ''}`}
        style={{ left: `${cursorPos.x}px`, top: `${cursorPos.y}px` }}
      />

      {/* TopNavBar */}
      <nav className="site-nav">
        <a className="site-logo" href="#top">coil bloom.</a>
        <div className="site-nav-links">
          <a className="site-nav-link" href="#philosophy">essentials</a>
          <a className="site-nav-link" href="#showcase">bespoke</a>
          <a className="site-nav-link" href="#values">poetry</a>
          <a className="site-nav-link" href="#story">origins</a>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="site-nav-action"
        >
          Dialogue
        </button>
      </nav>

      {/* Hero & Bloom Experience Scroll Track (Video Centered -> Left scroll transition) */}
      <div className="hero-scroll-track" ref={heroRef}>
        <div className="sticky-viewport">
          
          {/* Background Gradient Blob layers */}
          <div className="ambient-blob blob-1" style={{ transform: `translate(${scrollY * 0.15}px, ${scrollY * 0.05}px)` }} />
          <div className="ambient-blob blob-2" style={{ transform: `translate(${scrollY * -0.1}px, ${scrollY * 0.12}px)` }} />
          
          {/* Main Transiting Video Showcase */}
          <div 
            className="video-showcase-container"
            style={{
              transform: `scale(${videoScale}) translate(${videoTranslateX}vw, ${videoTranslateY}vh)`,
              borderRadius: `${videoBorderRadius}px`,
              opacity: videoOpacity
            }}
          >
            <div className="video-inner-frame">
              <video 
                src={landingVideo} 
                autoPlay 
                loop 
                muted 
                playsInline
                className="centerpiece-video"
              />
              <div className="video-overlay-glow" />
              
              {/* Organic leaf shapes floating inside frame for depth */}
              <div className="leaf-depth-layer leaf-1" />
              <div className="leaf-depth-layer leaf-2" />
            </div>
            
            {/* Elegant outer arch outline */}
            <div className="video-frame-border" style={{ borderRadius: `${videoBorderRadius}px` }} />
          </div>

          {/* Section 1: Hero Intro Content */}
          <div className="hero-content-layer" style={{ opacity: heroTextOpacity, pointerEvents: heroTextOpacity < 0.1 ? 'none' : 'auto' }}>
            <div className="hero-left-copy">
              <span className="hero-kicker">handcrafted forever blooms</span>
              <h1 className="hero-clean-title font-editorial">
                soft bouquets<br />stitched to stay
              </h1>
              <p className="hero-clean-copy">
                Crochet flowers made for memories, celebrations, and quiet corners that deserve a little tenderness.
              </p>
            </div>
          </div>

          {/* Section 2: The Bloom Experience Content */}
          <div 
            className="section2-content-layer"
            style={{ 
              opacity: section2TextOpacity, 
              transform: `translateY(${section2TextTranslateY}px)`,
              pointerEvents: section2TextOpacity < 0.1 ? 'none' : 'auto' 
            }}
          >
            <div className="bloom-experience-layout">
              <div className="bloom-experience-text">
                <span className="section-label">The Bloom Experience</span>
                <h2 className="section-heading font-editorial">
                  More Than<br />Just Flowers
                </h2>
                <div className="divider-line gold" />
                <p className="bloom-paragraph">
                  Thoughtfully handcrafted crochet bouquets designed to preserve emotions forever. Each stitch represents moments frozen in time, blending the warmth of yarn with the classic romance of floristry.
                </p>
                <div className="poetic-quote">
                  "A bouquet that lives as long as your memories."
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* The Bloom Philosophy */}
      <section id="philosophy" className="py-32 md:py-40 relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="max-w-4xl mx-auto text-center reveal-up active">
            <span className="font-label-sm text-primary/60 font-semibold uppercase mb-8 block tracking-[0.4em]">The Quiet Thread</span>
            <h2 className="font-headline-lg lowercase mb-12 italic letter-drift">poetry in every stitch</h2>
            <p className="font-body-lg text-secondary leading-loose italic text-on-surface">
              "We believe the most beautiful things in life are those that feel as though they might drift away. Our mission is to anchor that beauty, creating blooms that hold the memory of a sunset, a whisper, or a look, forever in their soft, woven hearts."
            </p>
          </div>
        </div>
        {/* Decorative drifting elements */}
        <div className="absolute top-1/4 -left-20 w-64 h-64 bg-sky-blue/30 rounded-full blur-[100px] floating"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-peach/20 rounded-full blur-[120px] floating" style={{ animationDelay: '-7s' }}></div>
      </section>

      {/* Fluid Grid Showcase */}
      <section id="showcase" className="py-32 md:py-40 px-6 md:px-20 bg-[#fcf9f8]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
          <div className="md:col-span-7 reveal-up active">
            <div className="group relative aspect-[16/10] overflow-hidden rounded-[4rem] dreamy-glow mb-12">
              <img className="w-full h-full object-cover airy-image group-hover:scale-105 transition-transform duration-[4s]" alt="Luxury horizontal composition of large handmade crochet bouquets." src={flowerInCar} />
              <div className="absolute inset-0 from-sky-blue/20 to-transparent"></div>
              <div className="absolute bottom-12 left-12 text-on-surface">
                <h3 className="font-headline-md lowercase italic opacity-80">stanzas of silk</h3>
              </div>
            </div>
          </div>
          <div className="md:col-span-5 md:pt-32 reveal-up active" style={{ transitionDelay: '200ms' }}>
            <div className="group relative aspect-[4/5] overflow-hidden rounded-[5rem] dreamy-glow floating" style={{ animationDelay: '-3s' }}>
              <img className="w-full h-full object-cover airy-image group-hover:scale-110 transition-transform duration-[4s]" alt="Artisanal custom gift hampers." src={flowerBouquet} />
              <div className="absolute inset-0 bg-peach/10"></div>
              <div className="absolute bottom-12 left-12 text-on-surface">
                <h3 className="font-headline-md lowercase italic opacity-80">treasured echoes</h3>
              </div>
            </div>
          </div>
          <div className="md:col-span-5 reveal-up -mt-20 active">
            <div className="group relative aspect-square overflow-hidden rounded-full dreamy-glow border-[12px] border-white/40">
              <img className="w-full h-full object-cover airy-image group-hover:rotate-12 transition-all duration-[4s]" alt="Close up of artisan hands." src={redFlower} />
              <div className="absolute inset-0 bg-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                <span className="font-label-sm uppercase text-on-surface tracking-[0.5em]">Soul in Stitch</span>
              </div>
            </div>
          </div>
          <div className="md:col-span-7 reveal-up active" style={{ transitionDelay: '300ms' }}>
            <div className="group relative aspect-[16/9] overflow-hidden rounded-[4rem] dreamy-glow floating" style={{ animationDelay: '-5s' }}>
              <img className="w-full h-full object-cover airy-image group-hover:scale-105 transition-transform duration-[4s]" alt="Wedding setting." src={vowsVelvet} />
              <div className="absolute bottom-12 left-12 text-on-surface">
                <h3 className="font-headline-md lowercase italic opacity-80">vows of velvet</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section id="values" className="py-32 md:py-40 relative overflow-hidden bg-[#FAF6F4]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-20 relative z-10">
          <div className="text-center mb-32">
            <h2 className="font-display-lg text-4xl lowercase reveal-up letter-drift active">woven from dreams</h2>
            <div className="w-24 h-[1px] bg-primary/20 mx-auto mt-8 reveal-up active"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="ethereal-blur p-16 rounded-[4rem] hover:-translate-y-6 transition-all duration-1000 reveal-up border border-white/60 shadow-lg group active">
              <span className="material-symbols-outlined text-primary/30 text-4xl mb-12 group-hover:rotate-45 transition-transform duration-700">filter_vintage</span>
              <h4 className="font-headline-md text-2xl lowercase italic mb-8">infinite spring</h4>
              <p className="font-body-md text-secondary">A beauty that refuses to wilt, preserving the soft light of your most cherished days in every fiber.</p>
            </div>
            <div className="ethereal-blur p-16 rounded-[4rem] hover:-translate-y-6 transition-all duration-1000 reveal-up border border-white/60 shadow-lg group active" style={{ transitionDelay: '150ms' }}>
              <span className="material-symbols-outlined text-primary/30 text-4xl mb-12 group-hover:scale-125 transition-transform duration-700">auto_awesome</span>
              <h4 className="font-headline-md text-2xl lowercase italic mb-8">thread whispers</h4>
              <p className="font-body-md text-secondary">Our creations are tactile poems, translating your unsaid feelings into a language of color and texture.</p>
            </div>
            <div className="ethereal-blur p-16 rounded-[4rem] hover:-translate-y-6 transition-all duration-1000 reveal-up border border-white/60 shadow-lg group active" style={{ transitionDelay: '300ms' }}>
              <span className="material-symbols-outlined text-primary/30 text-4xl mb-12 group-hover:-translate-y-2 transition-transform duration-700">cloud</span>
              <h4 className="font-headline-md text-2xl lowercase italic mb-8">gentle impact</h4>
              <p className="font-body-md text-secondary">Grown from the heart, not the earth. Sustainable fibers that bloom without a footprint on our shared world.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Scrapbook Gallery */}
      <section id="gallery" className="py-32 md:py-40 bg-white relative">
        <div className="max-w-[1440px] mx-auto px-6 md:px-20 relative z-10">
          <div className="text-center mb-32">
            <h2 className="font-display-lg text-4xl lowercase reveal-up italic letter-drift active">fleeting sightings</h2>
            <p className="font-label-sm uppercase tracking-[0.5em] mt-6 reveal-up active text-primary/60">captured moments of forever</p>
          </div>
          <div className="columns-1 md:columns-3 gap-16 space-y-20">
            <div className="break-inside-avoid reveal-up scale-90 hover:scale-100 transition-all duration-1000 rotate-2 active">
              <div className="bg-white p-8 dreamy-glow rounded-[2rem] border border-lavender-mist/30">
                <img className="w-full airy-image rounded-xl mb-8" alt="Sunflower crochet." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBvUMhWcjKfV77N-QAu7v1TfyZtkV9-LL_NFHEHLl7lO0vJzFA8u34EpbGGKHeUP-90XHbrg8YClo_fXinFFV97JnJPmrb-DG_0urPVjlmI95aGX1D6_yKbUwKdvhuq4HvEpkJp9-dtlzpyoLe36mFN5UOAK10r9Uh5RXshclOA8nLtgZfqWEBrymwvgYAfLUqN1rARKiaUr8-AftgtV-HA_Yq8xarkyKLqtQLXitfAR1X9h33B0_ARtDsNgQokQg3uUlH8RKHIm0Y" />
                <p className="font-body-md text-center text-secondary/40 italic">the sun's ghost, 2024</p>
              </div>
            </div>
            <div className="break-inside-avoid reveal-up scale-95 hover:scale-100 transition-all duration-1000 -rotate-3 active" style={{ transitionDelay: '200ms' }}>
              <div className="bg-white p-8 dreamy-glow rounded-[2rem] border border-peach/30">
                <img className="w-full airy-image rounded-xl mb-8" alt="Rose bouquet." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDyOOTntrgT3roQXcZB28D_NdZ9mf0Lst_4JB5GJrvIiyy85WlE7E6LAE_y7Rihjev9ZzjVF33pyrIfKWzuHqEGv7w6Cj442asRGmk95ZZjOQvFgU-iVZ4QOGiW2P9ShmOVT9lEF_mQAYYMm2ufiTyAMTNGcQ_Hq4RjmqmPtJXJIYIaB_Qs1SjoZrUzPi8_HFNRhAjVCAkROq99-YeT2ybxORqFJkYDyvbKrfnqno6RzXgPIOjb78LezLlMFjljNREj31f6URfr6jE" />
                <p className="font-body-md text-center text-secondary/40 italic">blush resonance</p>
              </div>
            </div>
            <div className="break-inside-avoid reveal-up scale-90 hover:scale-100 transition-all duration-1000 rotate-1 active" style={{ transitionDelay: '400ms' }}>
              <div className="bg-white p-8 dreamy-glow rounded-[2rem] border border-sky-blue/30">
                <img className="w-full airy-image rounded-xl mb-8" alt="Happy bride." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCc8arAmU56FsQUpxSYG_JUcJanKriTA5QGw_-01frP3LsTLz52NrR5rkuoy5eYKJlQyU0M-Cd7gRbFgdhMiLF7PkKcJax7sBgNPJq1ZI_I-vFIc6mbyTvm6tyH_z3Vx3WaHvXEA5JwRN3PtaWx3tdlsDbrtJXwKMTp5emjnqr95XW8tXpNk6IiqgUG2VB15cxIHmD2dkkLjprBZfFutd9mia2Yyl30Z5bvnuB9csTO9gnvhUid88k7K3HyBbKU5ngZqEO_VCAyDvI" />
                <p className="font-body-md text-center text-secondary/40 italic">eternal echoes</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Story */}
      <section id="story" className="py-32 md:py-40 overflow-hidden sky-gradient/30 relative">
        <div className="max-w-[1440px] mx-auto px-6 md:px-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-24">
            <div className="lg:col-span-6 relative reveal-up">
              <div className="relative z-10 rounded-full overflow-hidden dreamy-glow border-[16px] border-white/50 floating">
                <img className="w-full aspect-square object-cover airy-image" alt="Artisan portrait." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJeM3_OC2p6FxUDqHPJmQR-Nxcqu0Msq9dA7L5uZEyvtf9GS7v8xyhy4m5j4SMNequQ2BkiF9FbHS8WvhOO1wmXGkocg5RkKftJMNIjgu6MD6UyhVdjFriJzOZ4MWTagNftjO9zF0RuBiRvDrU3w1lMhZEXRhaIDb2-eAgbxoM834uvKWWX8hhqF9knukH7gU00HATr9ei2PG_kRNzUS7P_BcKPfWEkhJym0LBR2nRPcY6ySiuId2OqysrZOP-GkvfaaObtWrJjPE" />
              </div>
              <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/60 rounded-full blur-2xl -z-10"></div>
            </div>
            <div className="lg:col-span-6 reveal-up" style={{ transitionDelay: '200ms' }}>
              <span className="font-label-sm text-primary/40 uppercase mb-10 block tracking-[0.6em]">The Origin</span>
              <h2 className="font-display-lg text-display-lg-mobile lowercase mb-12 italic leading-tight">every bloom is a <span className="iridescent-text">reverie</span></h2>
              <div className="space-y-10 font-body-lg text-secondary">
                <p>Coil Bloom emerged from the space between heartbeats—a desire to pause the inevitable decay of beauty and find permanence in the softest of materials.</p>
                <p>In our studio, time is a fluid concept. We work with the rhythm of the tides, hand-dyeing our threads to mirror the shifting colors of the dawn sky.</p>
                <p>We craft for those who cherish the delicate, those who see the soul in the stitch, and those who wish to carry a piece of a dream into their waking lives.</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="mt-16 group flex items-center gap-8 font-label-sm uppercase tracking-[0.4em] text-primary/60 bg-transparent border-none cursor-pointer"
              >
                Trace the Poem
                <span className="w-16 h-[1px] bg-primary/20 group-hover:w-32 transition-all duration-1000"></span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Custom CTA */}
      <section className="relative py-32 md:py-40 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img className="w-full h-full object-cover opacity-30 airy-image" alt="Blurred bokeh background." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAXChYiSUWRCa0N_RFjSsAq-w3adEeBpFS4Omryky-RycMhoUIZ6U6blG7Hz9V_0x2nA7jlvNRzTPyEn-vgHSv2sD8fY40ahZf3bR0NmW4yaz-orJCtBJE0eaXV6_qGj50U9AjujskMg89p3_6Kjf1mQM0AgJzXsHpNRi8130aXPsPHEcmdbbH-_KBIzPujVAX7Yh0bkuxlKN6eGJUOH4RCBJhzd3PNG1387ufi3EHdff0IaUv49yYPjyvHBHvClgJvcRGdY_A9wTc" />
          <div className="absolute inset-0 sky-gradient/80 backdrop-blur-2xl"></div>
        </div>
        <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-20 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display-lg text-display-lg-mobile md:text-display-lg lowercase mb-16 reveal-up letter-drift leading-tight">imagine the infinite. <br /><span className="italic iridescent-text">we'll weave the dream.</span></h2>
            <p className="font-body-lg mb-20 reveal-up max-w-2xl mx-auto text-on-surface">Invite us into your quietest vision. From the pastel haze of a first memory to the vibrant echoes of a soulmate's smile.</p>
            <div className="reveal-up">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="px-20 py-7 bg-white text-on-background rounded-full font-label-sm uppercase tracking-[0.4em] hover:shadow-2xl hover:scale-105 transition-all duration-1000 border border-lavender-mist/50 cursor-pointer"
              >
                Begin the Dialogue
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-top">
            <div className="footer-brand">
              <span className="footer-logo">coil bloom.</span>
              <p className="footer-tagline">
                Handmade crochet blooms for keepsakes, gifts, and quiet everyday beauty.
              </p>
            </div>

            <div className="footer-links-grid">
              <div className="footer-group">
                <h5 className="footer-heading">Explore</h5>
                <a className="footer-link" href="#philosophy">Essentials</a>
                <a className="footer-link" href="#showcase">Sets</a>
                <a className="footer-link" href="#gallery">Gallery</a>
              </div>
              <div className="footer-group">
                <h5 className="footer-heading">Bespoke</h5>
                <a className="footer-link" href="#showcase">Process</a>
                <a className="footer-link" href="#values">Custom blooms</a>
                <a className="footer-link" href="#story">Journal</a>
              </div>
              <div className="footer-group">
                <h5 className="footer-heading">Care</h5>
                <a className="footer-link" href="#story">Shipping</a>
                <a className="footer-link" href="#story">Care guide</a>
                <a className="footer-link" href="#story">Inquiry</a>
              </div>
              <div className="footer-group">
                <h5 className="footer-heading">Connect</h5>
                <a className="footer-link" href="https://instagram.com">Instagram</a>
                <a className="footer-link" href="https://pinterest.com">Pinterest</a>
                <a className="footer-link" href="#">Email</a>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p className="footer-copyright">© 2024 coil bloom. Stanzas of eternal thread.</p>
            <div className="footer-legal">
              <a className="footer-link" href="#">Privacy</a>
              <a className="footer-link" href="#">Terms</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Glassmorphism Interactive Modal for Custom Orders */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content glass-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
            
            {orderSubmitted ? (
              <div className="modal-success-state">
                <div className="success-icon-wrapper">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="checkmark-svg">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
                <h3 className="font-editorial">Weaving Your Vision...</h3>
                <p>Thank you! Our artisan designer will email you within 24 hours to begin mapping out your personalized crochet creation.</p>
              </div>
            ) : (
              <>
                <div className="modal-header">
                  <span className="section-label">Bespoke Inquiry</span>
                  <h3 className="font-editorial">Describe Your Custom Bloom</h3>
                  <p>Let us turn your memories and sentiments into a handcrafted bouquet that never fades.</p>
                </div>
                <form className="modal-form" onSubmit={handleOrderSubmit}>
                  <div className="form-group">
                    <label>Your Name</label>
                    <input 
                      type="text" 
                      name="name" 
                      required 
                      value={orderForm.name} 
                      onChange={handleOrderChange}
                      placeholder="Eleanor Vance" 
                    />
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input 
                      type="email" 
                      name="email" 
                      required 
                      value={orderForm.email} 
                      onChange={handleOrderChange}
                      placeholder="eleanor@example.com" 
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group flex-1">
                      <label>Flower Vibe</label>
                      <select name="vibe" value={orderForm.vibe} onChange={handleOrderChange}>
                        <option value="tulip">🌷 Classic Tulip Bouquet</option>
                        <option value="daisy">🌼 Warm Sunny Daisy Vibe</option>
                        <option value="lavender">🌾 Soothing Lavender Fields</option>
                        <option value="roses">🌹 Timeless Romance Rose</option>
                        <option value="mixed">💐 Artistic Mixed arrangement</option>
                      </select>
                    </div>
                    <div className="form-group flex-1">
                      <label>Size Structure</label>
                      <select name="size" value={orderForm.size} onChange={handleOrderChange}>
                        <option value="petite">Petite (3-5 stems)</option>
                        <option value="classic">Classic (7-9 stems)</option>
                        <option value="grand">Grand (12-15 stems)</option>
                        <option value="installation">Art Piece (Custom size)</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Describe your vision (Colors, sentiments, or notes)</label>
                    <textarea 
                      name="note" 
                      value={orderForm.note} 
                      onChange={handleOrderChange}
                      rows="3" 
                      placeholder="A warm peach and cream palette for an anniversary gift..."
                    />
                  </div>
                  <button type="submit" className="btn-primary modal-submit-btn cursor-pointer">
                    Submit Order Inquiry
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default App;
