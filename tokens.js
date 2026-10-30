/* Generated from tokens.json. */
window.DESIGN_TOKENS = {
  "color": {
    "primary": "#20A0E0",
    "primary-deep": "#0060A0",
    "surface-blue": "#EAF4FB",
    "mist-pink": "#F0D9DC",
    "milk-coffee": "#C9A98C",
    "white": "#FFFFFF",
    "paper": "#FDFCFA",
    "april-gray": "#E0E0E0",
    "muted": "#7A8A9A",
    "ink": "#2A3A4A",
    "success": "#4A8B3B",
    "warning": "#7E5E07",
    "warning-surface": "#F5C542",
    "error": "#C21F26",
    "error-surface": "#F0D9DC",
    "info": "#1879AA",
    "accent": "#E4555B"
  },
  "semantic": {
    "bg": "var(--color-paper)",
    "surface": "var(--color-white)",
    "subtle": "var(--color-surface-blue)",
    "text": "var(--color-ink)",
    "muted": "var(--color-muted)",
    "action": "var(--color-primary)",
    "action-hover": "var(--color-primary-deep)",
    "action-pressed": "var(--color-primary-deep)",
    "link": "var(--color-primary-deep)",
    "brand": "var(--color-primary)",
    "accent": "var(--color-accent)",
    "danger": "var(--color-error)",
    "success": "var(--color-success)",
    "warning": "var(--color-warning)",
    "info": "var(--color-info)",
    "line": "var(--color-april-gray)",
    "control-border": "var(--color-muted)",
    "focus": "var(--color-primary-deep)",
    "disabled-bg": "var(--color-april-gray)",
    "disabled-text": "var(--color-muted)"
  },
  "font": {
    "body": "-apple-system,\"PingFang SC\",\"Noto Sans SC\",\"Microsoft YaHei\",sans-serif",
    "display": "\"鸿雷板书简体\",\"鸿雷小纸条青春体\",\"LXGW WenKai\",\"Yuanti SC\",\"Hiragino Sans GB\",sans-serif",
    "quote": "\"鸿雷小纸条青春体\",\"LXGW WenKai\",\"Kaiti SC\",\"Xingkai SC\",cursive",
    "num": "\"SF Mono\",\"JetBrains Mono\",ui-monospace,Menlo,Consolas,monospace",
    "mono": "var(--font-num)"
  },
  "font-size": {
    "hero": "var(--text-hero-size)",
    "title": "var(--text-title-size)",
    "body": "var(--text-body-size)",
    "caption": "var(--text-caption-size)",
    "quote": "var(--text-quote-size)",
    "control": "14px",
    "display": "var(--text-hero-size)",
    "h1": "var(--text-hero-size)",
    "h2": "var(--text-title-size)",
    "h3": "var(--text-title-size)",
    "lead": "var(--text-body-size)",
    "small": "var(--text-caption-size)",
    "number": "40px"
  },
  "space": {
    "0": "0px",
    "1": "4px",
    "2": "8px",
    "3": "12px",
    "4": "16px",
    "6": "24px",
    "8": "32px",
    "12": "48px",
    "16": "64px"
  },
  "radius": {
    "none": "0px",
    "xs": "4px",
    "sm": "var(--radius-image)",
    "control": "10px",
    "image": "12px",
    "card": "16px",
    "hero": "var(--radius-card)",
    "pill": "999px",
    "full": "var(--radius-pill)"
  },
  "shadow": {
    "none": "none",
    "soft": "0 4px 16px rgba(32,160,224,.10)",
    "lift": "0 8px 24px rgba(32,160,224,.14)",
    "xs": "var(--shadow-soft)",
    "sm": "var(--shadow-soft)",
    "md": "var(--shadow-lift)",
    "lg": "var(--shadow-lift)"
  },
  "motion": {
    "fast": "160ms",
    "base": "240ms",
    "slow": "320ms",
    "ease": "cubic-bezier(.16,1,.3,1)"
  },
  "grid": {
    "mobile": {
      "min": 0,
      "max": 767,
      "columns": 4,
      "margin": 16,
      "gap": 16
    },
    "tablet": {
      "min": 768,
      "max": 1439,
      "columns": 8,
      "margin": 24,
      "gap": 16
    },
    "desktop": {
      "min": 1440,
      "columns": 12,
      "margin": 32,
      "gap": 16,
      "maxWidth": null
    }
  },
  "layer": {
    "base": 0,
    "sticky": 30,
    "popover": 50,
    "overlay": 80,
    "toast": 100
  },
  "component": {
    "button-height-sm": "32px",
    "button-height-md": "44px",
    "button-height-lg": "52px",
    "input-height": "44px",
    "icon-sm": "16px",
    "icon-md": "20px",
    "icon-lg": "24px",
    "icon-stroke": "1.75",
    "reading-width": "70ch",
    "border-width": "1px",
    "focus-width": "3px",
    "focus-offset": "3px",
    "button-padding-x": "22px",
    "button-padding-y": "10px"
  },
  "color-labels": {
    "primary": "主色 · 澄海蓝",
    "primary-deep": "主色深阶 · 深空蓝",
    "surface-blue": "辅助 · 极浅蓝面",
    "mist-pink": "辅助 · 雾粉",
    "milk-coffee": "辅助 · 奶茶咖",
    "white": "中性 · 云白",
    "paper": "中性 · 米白纸感",
    "april-gray": "中性 · 四月灰",
    "muted": "中性 · 辅助文字",
    "ink": "中性 · 正文墨色",
    "success": "功能 · 成功",
    "warning": "功能 · 警示（推导）",
    "warning-surface": "警示面 · 汗黄",
    "error": "功能 · 错误（推导）",
    "error-surface": "错误面 · 雾粉",
    "info": "功能 · 信息（推导）",
    "accent": "强调 · 心动红"
  },
  "typography": {
    "hero": {
      "size": "48px",
      "leading": 1.2,
      "weight": 500,
      "font": "display"
    },
    "title": {
      "size": "24px",
      "leading": 1.4,
      "weight": 500,
      "font": "display"
    },
    "body": {
      "size": "16px",
      "leading": 1.8,
      "weight": 400,
      "font": "body"
    },
    "caption": {
      "size": "13px",
      "leading": 1.6,
      "weight": 400,
      "font": "body"
    },
    "quote": {
      "size": "24px",
      "leading": 1.6,
      "weight": 400,
      "font": "quote"
    }
  },
  "reference": {
    "title": "设计系统基础变量.html",
    "sections": [
      "字体参数表",
      "间距参数表",
      "圆角与阴影参数表"
    ],
    "status": "按用户提供的基础变量修订，待用户复核",
    "spacing": "8px 基准；4/8/12/16/24/32/48/64 档位在参考中标为推导",
    "grid": "栅格和断点为项目实现选择，不作为原文已确认规范",
    "pageWidth": "原文未定义最大宽度；保留现有页面实现",
    "compatibility": "font-size 的 display/h1/h2/h3/lead/small 和 shadow 的 xs/sm/md/lg 为兼容名称，不是新增设计层级"
  },
  "implementation": {
    "contentMaxWidth": "1280px",
    "readingWidth": "70ch",
    "description": "页面最大宽度与组件交互尺寸属于项目实现，不是参考文件已确认的参数。"
  }
};
