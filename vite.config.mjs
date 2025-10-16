// 파일: vite.config.mjs
import glob from 'fast-glob'
import fs from 'fs'
import Hbs from 'handlebars'
import path from 'path'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'
import handlebars from 'vite-plugin-handlebars'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let pageData = {}
const pageDataPath = path.resolve(__dirname, 'src/pageData.json')
if (fs.existsSync(pageDataPath)) {
  pageData = JSON.parse(fs.readFileSync(pageDataPath, 'utf-8'))
}

const hbsHelpers = {
  eq: (a, b) => String(a) === String(b),
  ne: (a, b) => String(a) !== String(b),
  gt: (a, b) => Number(a) > Number(b),
  lt: (a, b) => Number(a) < Number(b),
  and() { return [...arguments].slice(0, -1).every(Boolean) },
  or()  { return [...arguments].slice(0, -1).some(Boolean) },
  add: (a, b) => Number(a) + Number(b),
  sub: (a, b) => Number(a) - Number(b)
}

function collectPages() {
  const pagesPath = path.resolve(__dirname, 'src')
  const pageFiles = fs.readdirSync(pagesPath).filter(f => f.endsWith('.html'))

  return pageFiles.map(file => {
    const fullPath = path.join(pagesPath, file)
    const html = fs.readFileSync(fullPath, 'utf-8')

    // 주석 메타 추출
    const getMeta = (key) => {
      const regex = new RegExp(`@${key}\\s+([^\\-]*)`, 'i')
      const match = html.match(regex)
      return match ? match[1].trim() : ''
    }

    const meta = {
      title: getMeta('pageTitle') || path.basename(file, '.html'),
      created: getMeta('pageCreated') || '-',
      updated: getMeta('pageUpdated') || '-',
      note: getMeta('pageNote') || '-'
    }
    

    const base = {
      name: file,
      ...meta
    }

    // pageData.json 병합 우선순위 (json > html)
    return Object.assign(base, pageData[file] || {})
  })
}

const allPages = collectPages()
const forcePortalPlugin = {
  name: 'force-portal',
  apply: 'build',
  buildStart() {
    const portalPath = path.resolve(__dirname, 'src/js/page/portal.js')
    if (fs.existsSync(portalPath)) {
      console.log('📦 강제 포함: portal.js')
      this.emitFile({
        type: 'chunk',
        id: portalPath,
        name: 'portal'
      })
    } else {
      console.warn('⚠️ portal.js를 찾을 수 없습니다:', portalPath)
    }
  }
}

const applyLayoutPlugin = {
  name: 'apply-layout',
  enforce: 'pre',
  transformIndexHtml(html, ctx) {
    const match = html.match(/@layout\s+([^\s]+)\s*-->/)
    if (!match) return html

    const layoutRel = match[1]
    const layoutPath = path.resolve(__dirname, 'src', layoutRel)
    if (!fs.existsSync(layoutPath)) return html

    const layout = fs.readFileSync(layoutPath, 'utf-8')
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i)
    const bodyContent = bodyMatch ? bodyMatch[1] : html

    const partialsDir = path.resolve(__dirname, 'src/partials')
    if (fs.existsSync(partialsDir)) {
      fs.readdirSync(partialsDir).forEach(f => {
        const name = path.basename(f, '.html')
        const content = fs.readFileSync(path.join(partialsDir, f), 'utf-8')
        Hbs.registerPartial(name, content)
      })
    }

    const name = path.basename(ctx.filename)
    const context = {
      body: bodyContent,
      ...(pageData[name] || {})
    }

    const template = Hbs.compile(layout)
    return { html: template(context), tags: [] }
  }
}

export default defineConfig(() => {
  return {
    root: 'src',
    base: './',
    publicDir: '../public',
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    },
    build: {
      outDir: '../dist',
      emptyOutDir: true,
      minify: false,   // JS/CSS 압축 비활성화
      rollupOptions: {
        input: Object.fromEntries(
          glob.sync('src/*.html').map(file => {
            const name = path.basename(file, '.html')
            return [name, path.resolve(__dirname, file)]
          })
        ),
        output: {
          entryFileNames: 'assets/js/[name].js',
          chunkFileNames: 'assets/js/[name].js',
          assetFileNames: ({ name }) => {
            if (/\.(css)$/.test(name ?? '')) {
              return 'assets/css/[name][extname]'
            }
            if (/\.(png|jpe?g|gif|svg|webp)$/.test(name ?? '')) {
              return 'assets/images/[name][extname]'
            }
            return 'assets/[name][extname]'
          }
        }
      }
    },
    esbuild: {
      minify: false  // esbuild 단계에서도 비압축
    },
    plugins: [
      forcePortalPlugin,
      handlebars({
        partialDirectory: path.resolve(__dirname, 'src/components'),
        helpers: hbsHelpers,
        context: (filename) => {
          const name = path.basename(filename)
          const pageInfo = pageData[name] || {}  // ← 여기가 핵심 (이전에 thisPage였음)
        
          // index.html이면 전체 페이지 목록 전달
          if (name === 'index.html') {
            return { pages: allPages }
          }
        
          // 일반 페이지용 context
          return {
            name,
            title: pageInfo.title || path.basename(name, '.html'),
            note: pageInfo.note || '',
            created: pageInfo.created || '',
            updated: pageInfo.updated || ''
          }
        }
      }),
      applyLayoutPlugin,
      {
        name: 'no-css-minify',
        generateBundle(_, bundle) {
          for (const fileName in bundle) {
            if (fileName.endsWith('.css')) {
              const chunk = bundle[fileName]
              if ('code' in chunk) {
                chunk.code = chunk.code.replace(/}/g, '}\n')
              }
            }
          }
        }
      },
      {
        name: 'cleanup-html',
        closeBundle() {
          const distPath = path.resolve(__dirname, 'dist')
          const htmlFiles = fs.readdirSync(distPath).filter(f => f.endsWith('.html'))

          htmlFiles.forEach(file => {
            const filePath = path.join(distPath, file)
            let content = fs.readFileSync(filePath, 'utf-8')
            content = content.replace(/ crossorigin/g, '')
            content = content.replace(/<link rel="modulepreload" [^>]+?>/g, '')
            content = content.replace(/ type="module"/g, '') // 📌 module 제거
            fs.writeFileSync(filePath, content)
          })

          console.log('빌드 후 modulepreload, crossorigin, type="module" 제거 완료')
        }
      },
      {
        name: 'inject-portal-script',
        closeBundle() {
          const distPath = path.resolve(__dirname, 'dist')
          const htmlFiles = fs.readdirSync(distPath).filter(f => f.endsWith('.html'))
      
          htmlFiles.forEach(file => {
            const filePath = path.join(distPath, file)
            let html = fs.readFileSync(filePath, 'utf-8')
      
            // ① /js/main.js 제거
            html = html.replace(/<script[^>]*src=["']\/js\/main\.js["'][^>]*><\/script>\s*/g, '')
      
            // ② ./js/page/portal.js 제거 (원본 경로 버전 제거)
            html = html.replace(/<script[^>]*src=["']\.\/js\/page\/portal\.js["'][^>]*><\/script>\s*/g, '')
      
            // ③ ./assets/js/page/portal.js가 없을 때만 삽입
            if (!html.includes('./assets/js/page/portal.js')) {
              html = html.replace(
                /<\/body>/i,
                '  <script src="./assets/js/portal.js"></script>\n</body>'
              )
            }
      
            fs.writeFileSync(filePath, html, 'utf-8')
            console.log(`✅ ${file} : main.js / 구버전 portal.js 제거 → assets/js/page/portal.js 삽입 완료`)
          })
        }
      }
    ]
  }
})
