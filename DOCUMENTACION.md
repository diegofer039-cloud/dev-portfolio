# Documentación del proyecto — Flujo Git → GitHub → Render

Proyecto de tema libre sobre el portafolio `dev-portfolio` de Diego
(diegofer039-cloud). Este documento registra todo el proceso ejecutado y las
pruebas de verificación realizadas.

- **Repositorio:** https://github.com/diegofer039-cloud/dev-portfolio
- **Sitio publicado:** https://dev-portfolio-tile.onrender.com/
- **Pull Request:** https://github.com/diegofer039-cloud/dev-portfolio/pull/1
- **Fecha de ejecución:** 2026-08-20

---

## 1. Objetivo

Demostrar de forma práctica los siguientes temas sobre un proyecto real:

1. Uso de Git
2. Uso de GitHub
3. Creación de una rama
4. Unión de la rama contra `main`
5. Creación del primer agente en OpenCode
6. Publicación en Render

## 2. Entorno y herramientas

| Herramienta | Versión / detalle |
|---|---|
| SO | Windows (PowerShell 5.1) |
| Git | 2.54.0.windows.1 |
| Usuario Git | diegofer039-cloud \<diegofer039@gmail.com\> |
| Python | 3.12.10 (servidor local de pruebas) |
| Node.js | v24.18.0 |
| Editor/IA | opencode (agente principal + agente propio) |
| Hosting | Render — Static Site (plan gratuito) |

## 3. Proceso paso a paso

### Fase 0 — Preparación

1. Clonación del repositorio remoto:
   ```bash
   git clone https://github.com/diegofer039-cloud/dev-portfolio.git
   ```
2. El working tree tenía 7 screenshots marcados como eliminados. Se restauró
   el estado limpio antes de empezar:
   ```bash
   git restore .
   git status --short   # sin salida = árbol limpio
   ```

### Fase 1 — Creación de la rama y desarrollo (Tema: uso de Git)

Creación de la rama feature desde `main`:

```bash
git checkout -b feature/opencode-render
```

Archivos creados/modificados en la rama:

| Archivo | Descripción |
|---|---|
| `.opencode/agent/portfolio-agent.md` | Primer agente de OpenCode del proyecto: agente primario DevOps que guía ramas, commits convencionales, PRs y despliegue en Render. |
| `render.yaml` | Blueprint declarativo de Render: Static Site, publish path `.`, previews de PR activadas. |
| `index.html` | Nueva sección `#workflow` con timeline de los 6 temas + ítem `[~]` en el nav. |
| `css/style.css` | Estilos de la sección workflow (tarjetas con hover verde, código resaltado) + responsive móvil. |
| `README.md` | Resumen del proyecto y del flujo aplicado. |

Commits atómicos con convención `<tipo>(<scope>): <descripcion>`:

```
7705f12 feat(workflow): add workflow section documenting git-github-render flow
2f9ae7c feat(agent): add first opencode agent portfolio-agent
c9df4e3 chore(deploy): add render blueprint and project readme
```

### Fase 2 — GitHub y unión contra main (Temas: uso de GitHub, merge)

```bash
git push -u origin feature/opencode-render
```

1. Se creó el **Pull Request #1** (`feature/opencode-render` → `main`) con
   descripción de los cambios y los temas demostrados.
2. El PR se revisó y se fusionó desde GitHub (**merge commit**):
   ```
   59600f0 merge: feature/opencode-render (#1)
   ```
3. Sincronización local y limpieza de la rama:
   ```bash
   git checkout main
   git pull origin main          # fast-forward f99b618..59600f0
   git branch -d feature/opencode-render
   git push origin --delete feature/opencode-render
   ```

Resultado: `main` quedó con 5 archivos nuevos/modificados (+261 líneas).

### Fase 3 — Primer agente en OpenCode

Archivo `.opencode/agent/portfolio-agent.md` con formato markdown + frontmatter:

- `description`: cuándo usarlo (flujo Git/GitHub/Render del portafolio).
- `mode: primary`: agente seleccionable como principal.
- Cuerpo: prompt de sistema que obliga a trabajar con ramas feature, commits
  convencionales en inglés, PRs hacia `main`, sin force-push ni secrets.

Uso: abrir `opencode` dentro de la carpeta del proyecto y cambiar de agente
con la tecla `Tab`.

### Fase 4 — Publicación en Render

1. Login en https://dashboard.render.com con la cuenta de GitHub.
2. **New + → Blueprint** → selección del repo `dev-portfolio`.
3. Render detectó automáticamente `render.yaml` (runtime static, publish `.`).
4. **Apply** → despliegue exitoso en:
   **https://dev-portfolio-tile.onrender.com/**
5. Desde ese momento cada merge a `main` dispara un despliegue automático (CD).

## 4. Pruebas y verificaciones

### 4.1 Verificación de Git

| Prueba | Comando | Resultado esperado | Resultado |
|---|---|---|---|
| Árbol limpio antes de ramificar | `git status --short` | Sin salida | OK |
| Rama creada correctamente | `git checkout -b feature/opencode-render` | Switched to a new branch | OK |
| Commits atómicos | `git log --oneline -4` | 3 commits nuevos sobre `f99b618` | OK |
| Push de la rama | `git push -u origin ...` | new branch + tracking | OK |
| Merge del PR | API de GitHub | merged=true, sha=59600f0 | OK |
| Sincronización local | `git pull origin main` | Fast-forward f99b618..59600f0 | OK |
| Limpieza de rama | `git branch -d` + `git push --delete` | Deleted (local y remota) | OK |

### 4.2 Prueba local del sitio (pre-despliegue)

Servidor local: `python -m http.server 8000` (proceso oculto, detenido después).

| Prueba | Método | Resultado |
|---|---|---|
| La sección workflow existe | DOM: `document.querySelector('#workflow')` | OK |
| Los 6 pasos del flujo se renderizan | DOM: `.workflow-step` count | 6 elementos — OK |
| Título correcto de la sección | DOM: `h2.textContent` | "Git → GitHub → Render" — OK |
| Nav actualizado | DOM: hrefs de `.nav-link` | incluye `#workflow` entre projects y contact — OK |
| Errores JavaScript | Consola del navegador | Solo 404 de `favicon.ico` (inofensivo, preexistente) — OK |

### 4.3 Prueba en producción (post-despliegue)

URL probada: `https://dev-portfolio-tile.onrender.com/#workflow`

| Prueba | Método | Resultado |
|---|---|---|
| El sitio carga | Navegación + `document.title` | "Diego — Desarrollador Frontend" — OK |
| Sección workflow publicada | DOM: `#workflow` + pasos | Existe, 6 pasos — OK |
| Agente servido por el sitio | `GET /.opencode/agent/portfolio-agent.md` | HTTP 200 — OK |
| Blueprint servido | `GET /render.yaml` | HTTP 200 — OK |
| Errores JS en producción | Consola del navegador | Solo 404 de `favicon.ico` — OK |

## 5. Estructura final del proyecto

```
dev-portfolio/
├── index.html                          # SPA estática (+ sección #workflow)
├── css/style.css                       # Estilos (+ estilos workflow)
├── js/script.js                        # Animaciones (Lenis, GSAP)
├── .opencode/
│   └── agent/portfolio-agent.md        # Primer agente OpenCode
├── render.yaml                         # Blueprint de Render
├── README.md                           # Resumen del proyecto
├── DOCUMENTACION.md                    # Este documento
└── screenshots/                        # Capturas de versiones anteriores
```

## 6. Historial final de commits (main)

```
59600f0 merge: feature/opencode-render (#1)
c9df4e3 chore(deploy): add render blueprint and project readme
2f9ae7c feat(agent): add first opencode agent portfolio-agent
7705f12 feat(workflow): add workflow section documenting git-github-render flow
f99b618 feat: nudot-level polish (estado previo del portafolio)
```

## 7. Conclusión

El proyecto demuestra un flujo profesional completo de control de versiones,
colaboración y despliegue continuo: trabajo aislado en rama, integración
revisada vía Pull Request, automatización con un agente de IA propio en
OpenCode y publicación automática en Render tras cada cambio en `main`.
