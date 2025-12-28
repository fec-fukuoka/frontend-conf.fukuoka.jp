---
name: 'Loem ipsum'
nameEn: 'Loem ipsum'
image: 'https://http.cat/200'
sessionTitle: 'Loem ipsum'
sessionCategory: 'CSS'
language: 'ja'
track: 'N/A'
startTime: '00:00'
endTime: '00:00'
bio: 'Loem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
twitter: 'hogefuga'
github: 'hogefuga'
locale: 'ja'
year: 2026
draft: false
---

## 見出し2

### 見出し3

#### 見出し4

##### 見出し5

###### 見出し6

## テキスト装飾

**太字テキスト**
_斜体テキスト_
**_太字かつ斜体_**
~~取り消し線~~
<mark>ハイライト</mark>
<sub>下付き文字</sub>
<sup>上付き文字</sup>

## 引用

> 引用ブロック
>
> 複数行の引用
> ネストした引用
>
> > 二重引用
> >
> > > 三重引用

## リスト

### 順序なしリスト

- 順序なしリスト1
- 順序なしリスト2
  - ネストしたリスト
  - ネストしたリスト2
    - 更にネスト
- 順序なしリスト3

### 順序付きリスト

1. 順序付きリスト1
2. 順序付きリスト2
   1. ネストした順序付きリスト
   2. ネストした順序付きリスト2
      1. 更にネスト
3. 順序付きリスト3

### タスクリスト

- [ ] 未完了のタスク
- [x] 完了したタスク
- [ ] 別の未完了タスク
  - [ ] サブタスク
  - [x] 完了したサブタスク

## リンク

[リンクテキスト](https://example.com)
[タイトル付きリンク](https://example.com 'リンクのタイトル')
<https://example.com>
[参照リンク][1]
[別の参照リンク][link-label]

[1]: https://example.com '参照リンク1'
[link-label]: https://example.com '参照リンク2'

## コード

### インラインコード

`インラインコード`の例です。

### コードブロック

```javascript
// JavaScript のコード
const greeting = 'Hello, World!';
console.log(greeting);

function add(a, b) {
  return a + b;
}
```

```typescript
// TypeScript のコード
interface User {
  name: string;
  age: number;
}

const user: User = {
  name: 'John',
  age: 30,
};
```

```python
# Python のコード
def hello_world():
    print("Hello, World!")

if __name__ == "__main__":
    hello_world()
```

```bash
# Bash のコード
echo "Hello, World!"
ls -la
cd /home/user
```

```css
/* CSS のコード */
.container {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

```html
<!-- HTML のコード -->
<!DOCTYPE html>
<html>
  <head>
    <title>サンプル</title>
  </head>
  <body>
    <h1>Hello, World!</h1>
  </body>
</html>
```

```json
{
  "name": "example",
  "version": "1.0.0",
  "description": "JSONの例"
}
```

```yaml
# YAML の例
name: example
version: 1.0.0
description: YAMLの例
```

```diff
- 削除された行
+ 追加された行
! 重要な変更
# コメント
```

## テーブル

| ヘッダー1 | ヘッダー2 | ヘッダー3 |
| --------- | --------- | --------- |
| セル1     | セル2     | セル3     |
| セル4     | セル5     | セル6     |

### 配置指定付きテーブル

| 左寄せ   | 中央寄せ |   右寄せ |
| :------- | :------: | -------: |
| 左       |   中央   |       右 |
| テキスト | テキスト | テキスト |

## 水平線

---

---

---

## 改行とスペース

通常の改行は
スペースになります。

強制改行は行末に半角スペース2つ  
またはバックスラッシュ\
で実現できます。

## エスケープ

\*アスタリスク\*
\_アンダースコア\_
\# シャープ
\+ プラス
\- マイナス
\. ピリオド
\[ 角括弧 \]
\( 丸括弧 \)
\{ 波括弧 \}
\\ バックスラッシュ。

## 脚注

これは脚注の例です[^1]。
別の脚注もあります[^2]。
長い脚注も可能です[^longnote]。

[^1]: 脚注1の内容

[^2]: 脚注2の内容

[^longnote]:
    長い脚注の内容。\
    複数の段落も含めることができます。\
    `コード`や**太字**なども使えます。

## 定義リスト

用語1
: 用語1の定義。

用語2
: 用語2の定義。

## 略語

HTML は HyperText Markup Language の略です。

\*[HTML]: HyperText Markup Language

## 詳細と要約

<details>
<summary>クリックして詳細を表示</summary>

ここに詳細な内容が入ります。

- リスト項目1
- リスト項目2

```javascript
// コードも含められます
console.log('詳細内のコード');
```

</details>

## HTML要素

<kbd>Ctrl</kbd> + <kbd>C</kbd> でコピー
<kbd>Ctrl</kbd> + <kbd>V</kbd> で貼り付け。

<samp>サンプル出力</samp>

<var>変数</var>

<abbr title="World Wide Web">WWW</abbr>

## コメント

```md
<!-- これはHTMLコメントで、表示されません -->

[//]: # 'これもコメントの別の書き方です'
```

<!-- これはHTMLコメントで、表示されません -->

[//]: # 'これもコメントの別の書き方です'

## 特殊文字

&copy; 著作権記号\
&reg; 登録商標\
&trade; 商標\
&nbsp; ノンブレーキングスペース\
&lt; 小なり記号\
&gt; 大なり記号\
&amp; アンパサンド。
