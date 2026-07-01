(function () {

  // ===== LENIS SMOOTH SCROLL =====
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    smoothWheel: true,
    touchMultiplier: 2,
    infinite: false,
  })

  function raf(time) {
    lenis.raf(time)
    requestAnimationFrame(raf)
  }
  requestAnimationFrame(raf)

  // ===== GSAP + LENIS INTEGRATION =====
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000)
  })
  gsap.ticker.lagSmoothing(0)

  function onScroll(cb) {
    lenis.on('scroll', cb)
    cb()
  }

  // ===== LOADER =====
  const loader = document.getElementById('loader')
  if (loader) {
    const lines = document.querySelectorAll('.loader-line')
    let maxDelay = 0

    lines.forEach(line => {
      const delay = parseInt(line.dataset.delay) || 0
      if (delay > maxDelay) maxDelay = delay
      setTimeout(() => line.classList.add('show'), delay)
    })

    const loaderCmd = document.getElementById('loader-cmd')
    const cmdText = './enter --portfolio'
    let cmdIdx = 0

    const cmdInterval = setInterval(() => {
      if (cmdIdx < cmdText.length) {
        loaderCmd.textContent = cmdText.substring(0, cmdIdx + 1)
        cmdIdx++
      } else {
        clearInterval(cmdInterval)
        setTimeout(() => {
          loader.classList.add('hidden')
          openCurtain()
        }, 600)
      }
    }, 80)

    setTimeout(() => {
      if (cmdIdx < cmdText.length) {
        loaderCmd.textContent = cmdText
        clearInterval(cmdInterval)
        setTimeout(() => {
          loader.classList.add('hidden')
          openCurtain()
        }, 600)
      }
    }, maxDelay + 5000)
  }

  // ===== PAGE TRANSITION CURTAIN =====
  const curtainTop = document.querySelector('.curtain-top')
  const curtainBottom = document.querySelector('.curtain-bottom')
  let curtainOpened = false

  function openCurtain() {
    if (curtainOpened) return
    curtainOpened = true
    if (curtainTop && curtainBottom) {
      curtainTop.style.transition = 'transform 0.8s cubic-bezier(0.65, 0, 0.35, 1)'
      curtainBottom.style.transition = 'transform 0.8s cubic-bezier(0.65, 0, 0.35, 1)'
      requestAnimationFrame(() => {
        curtainTop.style.transform = 'translateY(-100%)'
        curtainBottom.style.transform = 'translateY(100%)'
      })
      setTimeout(() => {
        curtainTop.style.display = 'none'
        curtainBottom.style.display = 'none'
        scrambleHeroTitle()
        animateSections()
      }, 900)
    }
  }

  // ===== TEXT SCRAMBLE ON HERO TITLE =====
  const heroTitle = document.querySelector('.glitch')
  let scrambled = false

  function scrambleHeroTitle() {
    if (scrambled || !heroTitle) return
    scrambled = true
    const originalText = heroTitle.dataset.text || heroTitle.textContent
    const chars = '!<>-_\\/[]{}—=+*^?#________0123456789'
    let frame = 0
    const totalFrames = 25

    function step() {
      const result = originalText.split('').map((char, i) => {
        if (char === ' ') return ' '
        const progress = frame / totalFrames
        const charProgress = i / originalText.length
        if (progress > charProgress) return originalText[i]
        return chars[Math.floor(Math.random() * chars.length)]
      }).join('')

      heroTitle.textContent = result
      heroTitle.dataset.text = originalText
      frame++

      if (frame <= totalFrames) {
        requestAnimationFrame(step)
      } else {
        heroTitle.textContent = originalText
        heroTitle.dataset.text = originalText
      }
    }

    step()
  }

  // ===== SPLIT TEXT ON SECTION HEADINGS =====
  const splitHeadings = document.querySelectorAll('[data-split]')
  splitHeadings.forEach(heading => {
    const text = heading.textContent
    heading.textContent = ''
    ;[...text].forEach((char) => {
      const span = document.createElement('span')
      span.className = 'char'
      span.textContent = char === ' ' ? '\u00A0' : char
      heading.appendChild(span)
    })

    gsap.fromTo(heading.querySelectorAll('.char'),
      { opacity: 0, y: 30, rotateX: -40 },
      {
        opacity: 1, y: 0, rotateX: 0,
        duration: 0.5,
        stagger: 0.025,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: heading,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        }
      }
    )
  })

  // ===== GSAP SECTION REVEALS =====
  function animateSections() {
    const sections = document.querySelectorAll('section')
    sections.forEach(section => {
      gsap.to(section, {
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        }
      })
    })
  }

  // ===== SCROLL PROGRESS BAR =====
  const scrollBar = document.getElementById('scroll-bar')
  if (scrollBar) {
    onScroll(() => {
      const total = document.documentElement.scrollHeight - window.innerHeight
      const progress = total > 0 ? (lenis.scroll / total) * 100 : 0
      scrollBar.style.height = progress + '%'
    })
  }

  // ===== CUSTOM CURSOR =====
  const cursor = document.getElementById('custom-cursor')
  let cursorX = -100, cursorY = -100

  if (cursor) {
    document.addEventListener('mousemove', (e) => {
      cursorX = e.clientX
      cursorY = e.clientY
      cursor.style.left = cursorX + 'px'
      cursor.style.top = cursorY + 'px'
    })

    document.addEventListener('mouseleave', () => {
      cursor.style.opacity = '0'
    })

    document.addEventListener('mouseenter', () => {
      cursor.style.opacity = '0.6'
    })

    document.querySelectorAll('a, button, .btn, .skill-card, .project-card, .stat-card').forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hover'))
      el.addEventListener('mouseleave', () => cursor.classList.remove('hover'))
    })
  }

  // ===== CODE RAIN WITH MOUSE INTERACTION =====
  const rainCanvas = document.getElementById('code-rain')
  if (rainCanvas) {
    const ctx = rainCanvas.getContext('2d')
    let rw, rh
    let rainMouseX = -500, rainMouseY = -500

    const codeSnippets = [
      'const', 'let', 'var', 'function', 'return', 'import', 'export',
      'from', 'class', 'extends', 'async', 'await', 'fetch', 'then',
      'catch', 'map', 'filter', 'reduce', 'forEach', 'console.log',
      'def', 'if', 'else', 'for', 'while', 'try', 'except',
      'import React', 'useState', 'useEffect', 'props', 'state',
      '<div>', '</div>', '<html>', '<body>', '<head>',
      'npm install', 'git push', 'git commit', 'yarn add',
      '{}', '() =>', '=>', '===', '!=', '&&', '||',
      'true', 'false', 'null', 'undefined', 'NaN',
      'localhost', '3000', '5173', '8080',
      '{"key": "value"}', '[1, 2, 3]', '...spread',
      'Python', 'JavaScript', 'TypeScript', 'React',
      'HTML', 'CSS', 'Node.js', 'Git', 'API',
      '# Comment', '// TODO', '/* TODO */',
      '$ npm start', '$ git clone', '>>> print()'
    ]

    const fontSize = 14
    const columns = []
    const maxOffset = 60
    const columnCount = Math.floor(window.innerWidth / (fontSize * 1.5))

    for (let i = 0; i < columnCount; i++) {
      columns[i] = {
        y: Math.random() * -100,
        speed: 0.4 + Math.random() * 0.3,
        offset: 0,
        targetOffset: 0,
        snippet: codeSnippets[Math.floor(Math.random() * codeSnippets.length)]
      }
    }

    function resizeRain() {
      rw = window.innerWidth
      rh = window.innerHeight
      rainCanvas.width = rw
      rainCanvas.height = rh
    }

    document.addEventListener('mousemove', (e) => {
      rainMouseX = e.clientX
      rainMouseY = e.clientY
    })

    function drawRain() {
      ctx.fillStyle = 'rgba(10, 10, 15, 0.05)'
      ctx.fillRect(0, 0, rw, rh)
      ctx.font = `${fontSize}px "JetBrains Mono", monospace`

      for (let i = 0; i < columns.length; i++) {
        const col = columns[i]
        const x = i * fontSize * 1.5
        const y = col.y * fontSize
        const text = col.snippet

        const dx = x - rainMouseX
        const dy = y - rainMouseY
        const dist = Math.sqrt(dx * dx + dy * dy)
        const pushRadius = 180

        if (dist < pushRadius && dist > 0) {
          const force = (pushRadius - dist) / pushRadius
          col.targetOffset = (dx / dist) * force * maxOffset
        } else {
          col.targetOffset = 0
        }

        col.offset += (col.targetOffset - col.offset) * 0.08
        const drawX = x + col.offset

        const alpha = Math.min(1, (col.y * fontSize) / rh * 1.5)
        const gradient = ctx.createLinearGradient(drawX, y - fontSize, drawX, y)
        gradient.addColorStop(0, 'transparent')
        gradient.addColorStop(1, `rgba(88, 166, 255, ${alpha * 0.7})`)
        ctx.fillStyle = gradient
        ctx.fillText(text, drawX, y)

        if (y > rh + Math.abs(col.offset)) {
          col.y = 0
          col.snippet = codeSnippets[Math.floor(Math.random() * codeSnippets.length)]
        }

        col.y += col.speed
      }

      requestAnimationFrame(drawRain)
    }

    window.addEventListener('resize', resizeRain)
    resizeRain()
    drawRain()
  }

  // ===== MOUSE PARALLAX (VS CODE + HERO) =====
  const vscodeWindow = document.querySelector('.vscode-window')
  const heroContent = document.querySelector('.hero-content')
  let parallaxX = 0, parallaxY = 0

  if (vscodeWindow || heroContent) {
    document.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2
      const y = (e.clientY / window.innerHeight - 0.5) * 2

      parallaxX += (x - parallaxX) * 0.05
      parallaxY += (y - parallaxY) * 0.05

      if (vscodeWindow) {
        const rotateX = -parallaxY * 3
        const rotateZ = -parallaxX * 3
        const translateX = parallaxX * 15
        const translateY = parallaxY * 10
        vscodeWindow.style.transform =
          `rotate(-3deg) translate(${translateX}px, ${translateY}px) rotateX(${rotateX}deg) rotateZ(${rotateZ}deg)`
      }

      if (heroContent) {
        heroContent.style.transform = `translate(${parallaxX * 8}px, ${parallaxY * 5}px)`
      }
    })
  }

  // ===== TYPING EFFECT =====
  const typingEl = document.querySelector('.typing-text')
  if (typingEl) {
    const words = ['Desarrollador Frontend', 'Creador de Experiencias Web', 'Apasionado por el Código']
    let wordIndex = 0
    let charIndex = 0
    let isDeleting = false
    let isPaused = false

    function typeEffect() {
      if (!typingEl) return
      const currentWord = words[wordIndex]

      if (isPaused) {
        isPaused = false
        isDeleting = true
        setTimeout(typeEffect, 2000)
        return
      }

      if (!isDeleting) {
        typingEl.textContent = currentWord.substring(0, charIndex + 1)
        charIndex++
        if (charIndex === currentWord.length) {
          isPaused = true
          setTimeout(typeEffect, 2500)
          return
        }
        setTimeout(typeEffect, 50 + Math.random() * 30)
      } else {
        typingEl.textContent = currentWord.substring(0, charIndex - 1)
        charIndex--
        if (charIndex === 0) {
          isDeleting = false
          wordIndex = (wordIndex + 1) % words.length
          setTimeout(typeEffect, 300)
          return
        }
        setTimeout(typeEffect, 20 + Math.random() * 20)
      }
    }

    setTimeout(typeEffect, 3500)
  }

  // ===== NAV ACTIVE TRACKING =====
  const navLinks = document.querySelectorAll('.nav-link')
  const navIndicator = document.querySelector('.nav-indicator')
  const allSections = document.querySelectorAll('section[id]')

  function updateNav() {
    let currentId = ''
    allSections.forEach(section => {
      const top = section.offsetTop - 200
      if (lenis.scroll >= top) {
        currentId = section.getAttribute('id')
      }
    })

    navLinks.forEach(link => {
      link.classList.remove('active')
      const href = link.getAttribute('href')
      if (href === '#' + currentId) {
        link.classList.add('active')

        if (navIndicator) {
          const rect = link.getBoundingClientRect()
          const navRect = link.closest('.nav-list').getBoundingClientRect()
          navIndicator.style.height = rect.height + 'px'
          navIndicator.style.transform = `translateY(${rect.top - navRect.top}px)`
        }
      }
    })
  }

  onScroll(updateNav)
  setTimeout(updateNav, 200)

  // ===== NAV SMOOTH SCROLL =====
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault()
      const target = document.querySelector(link.getAttribute('href'))
      if (target) {
        lenis.scrollTo(target, { offset: 0, duration: 1.2 })
      }
    })
  })

  // ===== VS CODE TYPING ANIMATION =====
  const vscodeTyping = document.querySelector('.vscode-typing')
  if (vscodeTyping) {
    const codeLines = [
      'developer.learn();',
      'developer.build();',
      'developer.create();',
      '// Always learning...',
    ]
    let lineIdx = 0
    let charPos = 0
    const vscodeCursor = vscodeTyping.querySelector('.vscode-cursor-line')

    function typeVSCode() {
      if (!vscodeTyping) return
      const line = codeLines[lineIdx]
      if (charPos < line.length) {
        const textNode = document.createTextNode(line[charPos])
        vscodeTyping.insertBefore(textNode, vscodeCursor)
        charPos++
        setTimeout(typeVSCode, 40 + Math.random() * 30)
      } else {
        charPos = 0
        lineIdx = (lineIdx + 1) % codeLines.length
        setTimeout(() => {
          while (vscodeTyping.childNodes.length > 2) {
            vscodeTyping.removeChild(vscodeTyping.childNodes[1])
          }
          setTimeout(typeVSCode, 500)
        }, 2000)
      }
    }

    setTimeout(typeVSCode, 4000)
  }

  // ===== STATS COUNTER =====
  const statNumbers = document.querySelectorAll('.stat-number')
  if (statNumbers.length) {
    const statObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target
          const target = parseInt(el.dataset.target)
          let current = 0
          const duration = 1500
          const step = Math.max(1, Math.floor(target / 60))
          const timer = setInterval(() => {
            current += step
            if (current >= target) {
              el.textContent = target + '+'
              clearInterval(timer)
            } else {
              el.textContent = current
            }
          }, duration / (target / step))
          statObserver.unobserve(el)
        }
      })
    }, { threshold: 0.5 })

    statNumbers.forEach(el => statObserver.observe(el))
  }

  // ===== SOUND KEYBOARD =====
  const soundBtn = document.getElementById('sound-toggle')
  let audioCtx = null
  let soundEnabled = false
  let lastSoundTime = 0

  function initAudio() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    }
  }

  function playKeyClick() {
    if (!soundEnabled || !audioCtx) return
    const now = Date.now()
    if (now - lastSoundTime < 80) return
    lastSoundTime = now

    try {
      const osc = audioCtx.createOscillator()
      const gain = audioCtx.createGain()
      osc.connect(gain)
      gain.connect(audioCtx.destination)
      osc.type = 'square'
      osc.frequency.value = 600 + Math.random() * 400
      gain.gain.value = 0.03
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.04)
      osc.start(audioCtx.currentTime)
      osc.stop(audioCtx.currentTime + 0.04)
    } catch (e) {
      // ignore audio errors
    }
  }

  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      initAudio()
      soundEnabled = !soundEnabled
      soundBtn.classList.toggle('active', soundEnabled)
      soundBtn.textContent = soundEnabled ? '🔊' : '🔇'
    })

    onScroll(playKeyClick)
  }

  // ===== ABOUT TERMINAL TYPING =====
  const terminalText = document.getElementById('terminal-text')
  if (terminalText) {
    const aboutText = 'Soy Diego, desarrollador frontend apasionado por crear experiencias web interactivas y funcionales. Trabajo con HTML, CSS, JavaScript, React y Python. Me encanta el código limpio, las animaciones y todo lo relacionado con el diseño digital.'
    let ti = 0

    function typeTerminal() {
      if (ti < aboutText.length) {
        terminalText.textContent += aboutText[ti]
        ti++
        setTimeout(typeTerminal, 15 + Math.random() * 20)
      }
    }

    const termObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(typeTerminal, 800)
          termObserver.unobserve(entry.target)
        }
      })
    }, { threshold: 0.3 })

    const termBody = document.getElementById('terminal-body')
    if (termBody) termObserver.observe(termBody)
  }

})()
