---
name: "Sosuke Suzuki"
nameEn: "Sosuke Suzuki"
image: "https://avatars.githubusercontent.com/u/14838850?v=4"
sessionTitle: "なぜJavaScriptは異常なほど速いのか？"
sessionCategory: "ECMAScript/Web API"
language: "ja"
track: "N/A"
startTime: "00:00"
endTime: "00:00"
bio: |
  WebKit Reviewer
twitter: "__sosukesuzuki"
github: "sosukesuzuki"
website: "https://sosukesuzuki.dev"
locale: "en"
year: 2026
draft: false
---

「JavaScriptは異常なほど速い」
こんな言説をよく耳にします。実際のところV8やJavaScriptCoreといった最先端のJavaScriptエンジンはJavaScriptの言語仕様から考えると異常なほど速いのですが、なぜそんなに速いのか知ってますか？

「GoogleやAppleが異常なほど資金を突っ込んだから」
はい、まあそうなんじゃないかと思いますが、ご存知のとおりコンピュータの前に札束をおいておくだけでソフトウェアが速くなることはありません。技術的になぜ速いのか知っていますか？

「JITコンパイラがあるから」
うん、これもそうだとは思いますが、JITコンパイラがあると必ず速くなるんでしょうか？また、JITコンパイラだけのおかげで速いんでしょうか？

この発表では、異常なほど速いと言われている現代のJavaScriptエンジンがどのようにして異常なほどの速さを実現しそれを維持しているのかについて、言語処理系の実装の観点から外観をお話します。
