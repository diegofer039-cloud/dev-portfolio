(function () {

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
        setTimeout(() => loader.classList.add('hidden'), 600)
      }
    }, 80)

    setTimeout(() => {
      if (cmdIdx < cmdText.length) {
        // fallback - if interval didn't start typing
        loaderCmd.textContent = cmdText
        clearInterval(cmdInterval)
        setTimeout(() => loader.classList.add('hidden'), 600)
      }
    }, maxDelay + 5000)
  }

  // ===== CODE RAIN =====
  const rainCanvas = document.getElementById('code-rain')
  if (rainCanvas) {
    const ctx = rainCanvas.getContext('2d')
    let rw, rh
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
    const columnCount = Math.floor(window.innerWidth / (fontSize * 1.5))

    for (let i = 0; i < columnCount; i++) {
      columns[i] = Math.random() * -100
    }

    function resizeRain() {
      rw = window.innerWidth
      rh = window.innerHeight
      rainCanvas.width = rw
      rainCanvas.height = rh
    }

    function drawRain() {
      ctx.fillStyle = 'rgba(10, 10, 15, 0.05)'
      ctx.fillRect(0, 0, rw, rh)

      ctx.font = `${fontSize}px "JetBrains Mono", monospace`

      for (let i = 0; i < columns.length; i++) {
        const text = codeSnippets[Math.floor(Math.random() * codeSnippets.length)]
        const x = i * fontSize * 1.5
        const y = columns[i] * fontSize

        const alpha = Math.min(1, (columns[i] * fontSize) / rh * 1.5)
        const gradient = ctx.createLinearGradient(x, y - fontSize, x, y)
        gradient.addColorStop(0, 'transparent')
        gradient.addColorStop(1, `rgba(88, 166, 255, ${alpha * 0.7})`)
        ctx.fillStyle = gradient
        ctx.fillText(text, x, y)

        if (y > rh && Math.random() > 0.975) {
          columns[i] = 0
        }

        columns[i] += 0.4 + Math.random() * 0.3
      }

      requestAnimationFrame(drawRain)
    }

    window.addEventListener('resize', resizeRain)
    resizeRain()
    drawRain()
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

  // ===== SECTION REVEAL =====
  const sections = document.querySelectorAll('section')
  if (sections.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
        } else {
          entry.target.classList.remove('visible')
        }
      })
    }, { threshold: 0.15 })
    sections.forEach(s => observer.observe(s))
  }

  // ===== NAV ACTIVE TRACKING =====
  const navLinks = document.querySelectorAll('.nav-link')
  const navIndicator = document.querySelector('.nav-indicator')
  const allSections = document.querySelectorAll('section[id]')

  function updateNav() {
    let currentId = ''
    allSections.forEach(section => {
      const top = section.offsetTop - 200
      if (window.scrollY >= top) {
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
          const topOffset = rect.top - navRect.top
          const height = rect.height
          navIndicator.style.height = height + 'px'
          navIndicator.style.transform = `translateY(${topOffset}px)`
        }
      }
    })
  }

  window.addEventListener('scroll', updateNav)
  setTimeout(updateNav, 100)

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
    const lnSpan = vscodeTyping.querySelector('.ln')

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
          // clear line
          while (vscodeTyping.childNodes.length > 2) {
            vscodeTyping.removeChild(vscodeTyping.childNodes[1])
          }
          setTimeout(typeVSCode, 500)
        }, 2000)
      }
    }

    // wait for loader to finish
    setTimeout(typeVSCode, 4000)
  }

})()
