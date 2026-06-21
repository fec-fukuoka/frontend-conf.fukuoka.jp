---
name: "菅原 孝則"
nameEn: "takanori sugawara"
image: "https://avatars.githubusercontent.com/u/728384?v=4"
sessionTitle: "速さを追い求めたらHTMLになった  - Studioレンダリングエンジン刷新の2年半 -"
sessionCategory: "Web Standards"
language: "ja"
track: "N/A"
startTime: "00:00"
endTime: "00:00"
bio: |
  Studioでエンジニアとして開発に従事。
  直近2年半は、Studioのレンダリングエンジン刷新プロジェクト「HRC（Healthy Rendering Composer）」を担当。
  HTML/CSS生成基盤の設計・実装や、Web標準への対応、パフォーマンス改善に取り組んでいる。
twitter: "oligin020"
github: "ts020"
website: "https://sugawara.ninja/"
locale: "ja"
year: 2026
draft: false
---

近年のWebサイトは高機能化と引き換えに、JavaScriptやランタイムへの依存を強め続けています。

Studioでも長年Vue/Nuxtを利用したレンダリングを採用していましたが、ホスティングしているサイトは数十万、大規模なサイトも増加し、高速化や保守性に課題を感じるようになりました。

私たちは「より速いWebサイト」を目指し、JavaScriptを減らし、ランタイム依存を無くし、より簡素なHTMLを出力する方向へ舵を切りました。

その結果として生まれたのが、JSONからHTML/CSSを生成する新しいレンダリングエンジン（HRC: Healthy Rendering Composer）です。

開発を進める中で、WebアーカイブやAIによる利用、通信環境の厳しい僻地でのアクセスなど、Webサイトに求められる役割について改めて考えました。そして、高速化を追求した先には、ポータブルで寿命の長いHTMLというWeb標準がありました。

本セッションでは、Studioのレンダリングエンジン刷新を題材に、HTML生成基盤の設計、DomをASTとして扱うアプローチ、
SSRからISR、表示の互換性、そして「ヘルシーなインターネット」という考え方に至るまでの試行錯誤を紹介します。
