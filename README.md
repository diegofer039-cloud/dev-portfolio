# dev-portfolio

Portafolio personal de Diego (desarrollador frontend) con estética terminal/retro:
code rain, glitch, terminal animada, cubo 3D y scroll suave con Lenis + GSAP.

Proyecto de tema libre que demuestra el flujo profesional completo:
**Git → GitHub → rama → Pull Request → agente OpenCode → despliegue en Render.**

## Estructura

```
dev-portfolio/
├── index.html                          # Página única (SPA estática)
├── css/style.css                       # Estilos globales
├── js/script.js                        # Animaciones e interacciones
├── .opencode/
│   └── agent/portfolio-agent.md        # Primer agente de OpenCode del proyecto
├── render.yaml                         # Blueprint de despliegue en Render
└── screenshots/                        # Capturas de versiones anteriores
```

## Flujo de trabajo aplicado

### 1. Uso de Git

Control de versiones local: `git init` (ya existente), staging con `git add`,
commits atómicos con convención `<tipo>(<scope>): <descripcion>` e historial
inspeccionado con `git log --oneline`.

### 2. Uso de GitHub

Repositorio remoto https://github.com/diegofer039-cloud/dev-portfolio sincronizado
con `git push`. La colaboración y revisión de cambios se hace vía Pull Requests.

### 3. Creación de una rama

```bash
git checkout -b feature/opencode-render
```

Rama aislada donde se desarrolló la sección "Workflow", el agente OpenCode,
el blueprint de Render y este README, sin tocar la versión estable de `main`.

### 4. Unión de la rama contra main

```bash
git push -u origin feature/opencode-render
gh pr create --base main --head feature/opencode-render
gh pr merge --merge
```

El merge se ejecutó desde un Pull Request revisado en GitHub, no localmente.

### 5. Primer agente en OpenCode

Definido en `.opencode/agent/portfolio-agent.md` (formato markdown + frontmatter).
Es un agente primario llamado **portfolio-agent** que actúa como asistente DevOps:
obliga a trabajar con ramas feature, commits convencionales, PRs hacia main y
verificación del deploy en Render tras cada merge.

Para usarlo: abrir `opencode` dentro del proyecto y cambiar de agente con `Tab`.

### 6. Publicación en Render

- Blueprint declarativo en `render.yaml`: Static Site, publish path `.`, sin build.
- En Render: **New + → Blueprint** → seleccionar este repo → Apply.
- Render detecta `render.yaml` y publica en una URL `https://dev-portfolio-*.onrender.com`.
- Cada merge a `main` dispara un despliegue automático (CD).

## Ejecución local

```bash
# Abrir index.html directamente o servir la carpeta:
python -m http.server 8000
```

## Stack

HTML5 · CSS3 · JavaScript (ES6) · Lenis · GSAP ScrollTrigger · Git · GitHub · OpenCode · Render
