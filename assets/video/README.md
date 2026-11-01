# 首页项目视频

- 来源：用户在本轮指定的 `Video Project 4.mp4`。
- `opening-project.mp4`：使用 macOS AVFoundation 的 `PresetPassthrough` 重新封装，保留原 H.264 / AAC 编码及 1920 × 1080 画面，把播放索引移至文件开头以便网页开始播放。未剪辑内容。
- `opening-project-poster.jpg`：从同一视频的起始画面提取的封面。
- 网页使用原生播放器，提供播放、暂停、进度、声音和全屏控制；按需加载，不自动播放。

首页信件字体为 `../fonts/opening-banshu.woff2`，从用户本机的鸿雷板书简体转换为本页字形子集，保留原字体名称、版权和嵌入标记。原字体版权为 `Copyright © 2020 by 林鸿雷. All rights reserved.`。原字体不含中文弯引号所用的两个码位，这两处标点由系统字体显示；未替换信件原文中的字符。修改信件时需要重新生成字形子集。
