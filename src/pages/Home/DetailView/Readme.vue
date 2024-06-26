<style lang="scss">
.c-readme-render {
  font-size: 16px;
  flex: 1;
  padding: 0 15px;
  width: 100%;
  overflow-y: auto;
  line-height: 1.5;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial,
    sans-serif, Apple Color Emoji, Segoe UI Emoji;
  pre {
    background: var(--ReadMe-Pre-Background);
    color: var(--ReadMe-Pre-Color);
    border-radius: 3px;
    padding: 10px;
    overflow: auto;
  }
  code {
    font-family: SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace;
  }

  table {
    display: block;
    width: 100%;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
  }

  table th {
    font-weight: 600;
  }

  table td,
  table th {
    padding: 6px 13px;
  }

  blockquote {
    color: var(--ReadMe-Blockquote-Color);
    overflow: auto;
  }
  img {
    max-width: 100%;
  }
  ol > li,
  ul > li {
    li {
      font-size: 0.9em;
    }
  }
  hr {
    border-color: var(--ReadMe-Hr-BorderColor);
  }
  a {
    color: var(--ReadMe-AHref-Color);
    word-break: break-all;
  }
}
.c-readme__description {
  margin-bottom: 1em;
}
</style>

<template>
  <div class="c-readme-render">
    <div class="c-readme__description">
      {{repo.description}}
      <a
        v-if="repo.homepage"
        target="_blank"
        :href="repo.homepage"
      >{{repo.homepage}}</a>
    </div>
    <div v-html="htmlStr"></div>
  </div>
</template>

<script>
import dompurify from 'dompurify'
import marked from 'marked'
import highlight from 'highlight.js'
import urljoin from 'url-join'
export default {
  props: {
    markdown: {},
    repo: {}
  },
  data() {
    return {
      htmlStr: ''
    }
  },
  watch: {
    markdown() {
      this.update()
    }
  },
  created() {
    this.update()
  },
  methods: {
    update() {
      if (this.markdown) {
        this.htmlStr = this.markdownToHtml(this.markdown)
      } else {
        this.htmlStr = ''
      }
    },
    markdownToHtml(markdownStr) {
      const repo = this.repo
      const div = document.createElement('div')
      div.innerHTML = marked(markdownStr, {
        highlight: (code, lang) => {
          return highlight.highlightAuto(code).value
        }
      })

      Array.from(div.querySelectorAll('img')).forEach(img => {
        const url = img.getAttribute('src')
        if (!url) return
        if (!url.startsWith('http')) {
          img.src = urljoin(repo.html_url, 'raw', repo.default_branch, url)
        }
      })

      Array.from(div.querySelectorAll('a')).forEach(aTag => {
        aTag.target = '_blank'

        const url = aTag.getAttribute('href')
        if (!url) return
        if (url.startsWith('http')) return
        if (url.startsWith('#')) {
          aTag.href = urljoin(repo.html_url, url)
        } else {
          console.log(url)
          aTag.href = urljoin(repo.html_url, 'blob', repo.default_branch, url)
        }
      })
      return dompurify.sanitize(div.innerHTML, { ADD_ATTR: ['target'] })
    }
  }
}
</script>

