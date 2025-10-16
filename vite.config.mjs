// 파일: vite.config.mjs
import glob from 'fast-glob'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'
import handlebars from 'vite-plugin-handlebars'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// ────────────────────────────────────────────────
// 📄 pageData.json 읽기
// ────────────────────────────────────────────────
let pageData = {}
const pageDataPath = path.resolve(__dirname, 'src/pageData.json')
if (fs.existsSync(pageDataPath)) {
  pageData = JSON.parse(fs.readFileSync(pageDataPath, 'utf-8'))
}

// ────────────────────────────────────────────────
// 🧮 헬퍼 정의
// ────────────────────────────────────────────────
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

// ────────────────────────────────────────────────
// 🗂 전체 페이지 메타 수집 (index에서 목록에 사용 가능)
// ────────────────────────────────────────────────
function collectPages() {
  const pagesPath = path.resolve(__dirname, 'src')
  const pageFiles = fs.readdirSync(pagesPath).filter(f => f.endsWith('.html'))

  return pageFiles.map(file => {
    const fullPath = path.join(pagesPath, file)
    const html = fs.readFileSync(fullPath, 'utf-8')

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

    return Object.assign({ name: file, ...meta }, pageData[file] || {})
  })
}

const allPages = collectPages()

// ────────────────────────────────────────────────
// 📦 portal.js 강제 포함 플러그인 (유지, 개선 버전)
// ────────────────────────────────────────────────
const forcePortalPlugin = {
  name: 'force-portal',
  apply: 'build',
  buildStart() {
    const portalPath = path.resolve(__dirname, 'src/js/page/portal.js')
    if (fs.existsSync(portalPath)) {
      console.log('📦 portal.js 강제 포함')
      this.emitFile({ type: 'chunk', id: portalPath, name: 'portal' })
    } else {
      console.warn('⚠️ portal.js가 없습니다:', portalPath)
    }
  }
}

// ────────────────────────────────────────────────
// 🧹 CSS/HTML 후처리
// ────────────────────────────────────────────────
const cleanupHtmlPlugin = {
  name: 'cleanup-html',
  closeBundle() {
    const distPath = path.resolve(__dirname, 'dist')
    if (!fs.existsSync(distPath)) return

    const htmlFiles = fs.readdirSync(distPath).filter(f => f.endsWith('.html'))
    htmlFiles.forEach(file => {
      const filePath = path.join(distPath, file)
      let content = fs.readFileSync(filePath, 'utf-8')
      content = content
        .replace(/ crossorigin/g, '')
        .replace(/<link rel="modulepreload" [^>]+?>/g, '')
        .replace(/ type="module"/g, '')
      fs.writeFileSync(filePath, content)
    })

    console.log('🧹 HTML 정리 완료 (modulepreload, crossorigin 제거)')
  }
}

// ────────────────────────────────────────────────
// ⚡ portal.js 자동 삽입 (빌드 후 HTML 보정)
// ────────────────────────────────────────────────
const injectPortalPlugin = {
  name: 'inject-portal-script',
  closeBundle() {
    const distPath = path.resolve(__dirname, 'dist')
    if (!fs.existsSync(distPath)) return

    const htmlFiles = fs.readdirSync(distPath).filter(f => f.endsWith('.html'))
    htmlFiles.forEach(file => {
      const filePath = path.join(distPath, file)
      let html = fs.readFileSync(filePath, 'utf-8')

      // /js/main.js 제거
      html = html.replace(/<script[^>]*src=["']\/js\/main\.js["'][^>]*><\/script>\s*/g, '')
      // 구버전 portal 제거
      html = html.replace(/<script[^>]*src=["']\.?\/js\/page\/portal\.js["'][^>]*><\/script>\s*/g, '')

      // portal.js가 없으면 삽입
      if (!html.includes('./assets/js/portal.js')) {
        html = html.replace(/<\/body>/i, '  <script src="./assets/js/portal.js"></script>\n</body>')
      }

      fs.writeFileSync(filePath, html, 'utf-8')
      console.log(`✅ ${file}: portal.js 삽입 완료`)
    })
  }
}

// ────────────────────────────────────────────────
// 🚀 Vite 설정 본문
// ────────────────────────────────────────────────
export default defineConfig({
  root: 'src',
  base: './',
  publicDir: '../public',
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') }
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    minify: false,
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
          if (/\.(css)$/.test(name ?? '')) return 'assets/css/[name][extname]'
          if (/\.(png|jpe?g|gif|svg|webp)$/.test(name ?? '')) return 'assets/images/[name][extname]'
          return 'assets/[name][extname]'
        }
      }
    }
  },
  esbuild: { minify: false },
  plugins: [
    forcePortalPlugin,
    handlebars({
      partialDirectory: [
        path.resolve(__dirname, 'src/partials'),
        path.resolve(__dirname, 'src/components'),
        path.resolve(__dirname, 'src/layouts')
      ],
      helpers: hbsHelpers,
      context: (filename) => {
        const name = path.basename(filename)
        const pageInfo = pageData[name] || {}
        

        if (name === 'index.html') return { pages: allPages }

        return {
          name,
          title: pageInfo.title || path.basename(name, '.html'),
          note: pageInfo.note || '',
          subBanner: pageInfo.subBanner || '',
          created: pageInfo.created || '',
          updated: pageInfo.updated || ''
        }
      }
    }),
    cleanupHtmlPlugin,
    injectPortalPlugin
  ]
})
