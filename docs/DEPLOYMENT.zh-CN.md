# 部署与域名指南 / Deployment & Domains

这份文档回答两件事：**怎么把网站发到公网**，以及**怎么绑定自己的域名**。

前提：代码已经推到 GitHub 仓库 `fang520huang-lgtm/Fadeworn-UI`。

---

## 先理解一件事：这个项目可以「纯静态」运行

页面里所有交互都发生在浏览器端，没有数据库、没有后端接口、没有服务端渲染的实时数据。所以构建出来的产物就是一堆 HTML / CSS / JS 文件，可以直接放到任何静态托管上。

这意味着三件事：

- 部署成本为零，免费套餐足够。
- 国内外的静态托管都能用，不挑平台。
- 用户访问任意一页都是静态文件，速度快、不会因为服务端报错而挂掉。

---

## 方案 A：GitHub Pages（完全免费，和仓库绑定）

**适合：** 只想尽快有个能访问的网址，不想注册新账号。

仓库里已经准备好了自动化流程 `.github/workflows/deploy-pages.yml`。你只要做一次设置：

1. 打开仓库 → **Settings** → 左侧 **Pages**。
2. **Build and deployment** → **Source** 选择 **GitHub Actions**。
3. 回到 **Actions** 标签，等 “Deploy to GitHub Pages” 跑完（约 1–2 分钟）。

完成后网址是：

```text
https://fang520huang-lgtm.github.io/Fadeworn-UI/
```

### 绑定自己的域名（GitHub Pages）

1. 在仓库 **Settings → Pages → Custom domain** 里填你的域名，例如 `fadeworn.com`，保存。
2. 去你的域名注册商后台，添加 DNS 记录：

   根域名（`fadeworn.com`）添加 4 条 A 记录：

   ```text
   A   @   185.199.108.153
   A   @   185.199.109.153
   A   @   185.199.110.153
   A   @   185.199.111.153
   ```

   子域名（`www.fadeworn.com`）添加 1 条 CNAME：

   ```text
   CNAME   www   fang520huang-lgtm.github.io
   ```

3. 等 DNS 生效（通常 10 分钟到 1 小时，最长 24 小时）。
4. 回到 **Settings → Pages**，勾选 **Enforce HTTPS**。

GitHub 会自动签发并续期 HTTPS 证书，不用自己买证书。

> 注意：GitHub Pages 的免费 HTTPS 证书不支持部分老域名后缀（例如 `.cn` 根域名可能无法签发）。如果遇到这种情况，用方案 B。

---

## 方案 B：Vercel 或 Cloudflare Pages（推荐的长期方案）

**适合：** 想要更快的访问速度、更短的部署时间、随时预览每次提交，以及无痛绑定域名。

两家的操作几乎一样：

1. 打开 [vercel.com](https://vercel.com) 或 [pages.cloudflare.com](https://pages.cloudflare.com)，用 **GitHub 账号登录**。
2. 选择 **Import Git Repository**（或 **Create application → Pages → Connect to Git**）。
3. 选中 `Fadeworn-UI` 仓库。构建配置填：

   | 配置项 | 值 |
   | --- | --- |
   | Framework | Next.js |
   | Build command | `npm run build` |
   | Output directory | Vercel 留空；Cloudflare 填 `out` |
   | Node version | `22` |

4. 点 **Deploy**。完成后你会拿到一个免费的二级域名，例如 `fadeworn-ui.vercel.app` 或 `fadeworn-ui.pages.dev`。

之后每次 `git push`，平台都会自动重新构建并发布，不需要手动做任何事。每次提交还会生成一个独立的预览链接，方便分享未完成的改动。

### 绑定自己的域名（Vercel / Cloudflare）

1. 先在**域名注册商**处购买域名（见下一节）。
2. 在平台的 **Domains / Custom domains** 里添加你的域名。
3. 平台会给出需要配置的 DNS 记录。通常只需要一条 CNAME，例如：

   ```text
   CNAME   @     cname.vercel-dns.com
   ```

   或者按照 Cloudflare Pages 的提示，把域名的 NS 记录改成 Cloudflare 的域名服务器。
4. 保存后等待生效，平台自动签发 HTTPS 证书并自动续期。

> Cloudflare 的优势是：如果域名直接在 Cloudflare 注册并托管 DNS，绑定过程基本是点两下，且自带 CDN 加速。Vercel 的优势是 Next.js 支持最完善、界面最直观。

---

## 去哪买域名？

| 注册商 | 特点 |
| --- | --- |
| [Cloudflare Registrar](https://www.cloudflare.com/products/registrar/) | 按成本价续费，不加价，DNS 和 CDN 免费，最省心。 |
| [Namecheap](https://www.namecheap.com/) | 界面友好，常有优惠，支持支付宝/信用卡。 |
| [阿里云](https://wanwang.aliyun.com/) · [腾讯云](https://dnspod.cloud.tencent.com/) | 国内备案方便，付款方式最省事。 |

价格参考：`.com` 约 60–80 元/年，`.dev` / `.app` 约 90–110 元/年。

### 两个容易踩的坑

1. **根域名不能配 CNAME。** DNS 规范禁止根域名使用 CNAME。GitHub Pages 用 A 记录解决（上面给了 IP），Vercel / Cloudflare 会用 ANAME / ALIAS 或直接托管 DNS 解决。
2. **中国内地访问需要备案。** 如果你的域名要指向托管在中国内地的服务器（例如阿里云 ECS、腾讯云服务器），必须先完成 ICP 备案，否则会被拦截。**GitHub Pages、Vercel、Cloudflare Pages 都属于境外托管，不需要备案**，但内地访问速度会受网络状况影响。

---

## 给自己的域名换个更好记的名字？

如果你希望网址是 `fadeworn.com` 而不是 `fang520huang-lgtm.github.io/Fadeworn-UI/`，最短路径是：

1. 在 Cloudflare 或 Namecheap 买下域名。
2. 用方案 B 部署到 Cloudflare Pages 或 Vercel。
3. 在平台的 Domains 里填域名、按提示加 DNS 记录。
4. 等 HTTPS 证书签发完成（通常几分钟）。

整个过程不需要改一行代码，也不需要自己申请 SSL 证书。

---

## 本地验证部署产物

在推送之前，可以先在本地确认静态产物是否正确生成：

```powershell
# 本地预览（不带子路径）
npm run build:static
npx serve out          # 或 python -m http.server 8099 --directory out

# 模拟 GitHub Pages 的项目子路径
$env:PAGES_BASE_PATH="/Fadeworn-UI"; npm run build:static
```

打开提示的地址，确认首页与 `/directory` 都能正常访问、跳转和搜索。

> `PAGES_BASE_PATH` 只在「部署到 `https://<用户名>.github.io/<仓库名>/` 这种项目子路径」时才需要设置。如果用自定义域名或 Vercel / Cloudflare Pages 部署到根目录，**不要**设置它，否则资源路径会多出一层。
