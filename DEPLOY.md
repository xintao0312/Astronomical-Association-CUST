# 部署到 Linux 服务器

本站是**纯静态站点**：五个 HTML 文件 + 一个 `assets/` 目录。
服务器上**不需要** Node.js、Python、PHP、数据库或任何构建步骤 ——
把文件放进 Web 根目录即可，任何 Web 服务器（Nginx / Apache / Caddy / Lighttpd…）都能直接服务。

> 本文只讲**网站文件本身**的准备工作，不涉及服务器、域名、证书的配置。

## 一、需要上传什么

```
index.html
about.html
activities.html
gallery.html
404.html
assets/            ← 整个目录，缺一不可
```

共 **406 个文件，约 78.69 MB**。

### 不需要上传（重要）

| 目录 | 体积 | 为什么不用传 |
|---|---|---|
| `image/` | **49.6 MB** | 原始素材（含单张 16MB 的原图）。`assets/img/` 里已经是处理好的 web 版本，服务器上不需要原图。**尤其注意别把 4000px 的原图传上去**，既浪费空间带宽，也会被别人直接下载走高清原图。 |
| `tools/` | 70 KB | 构建与校验脚本，只在本地开发时用。 |
| `.idea/` | — | IDE 配置。 |
| `README.md` / `DEPLOY.md` | — | 文档。传上去会被公开访问到（不是漏洞，但通常没必要）。 |
| `package.json` / `.gitignore` | — | 本地开发用。 |

### 上传命令示例

```bash
# 方式一：直接传需要的部分（推荐）
rsync -avz --delete \
  index.html about.html activities.html gallery.html 404.html assets \
  user@server:/var/www/cust-astro/

# 方式二：先打包再传，体积小很多
tar czf site.tar.gz index.html about.html activities.html gallery.html 404.html assets
scp site.tar.gz user@server:/tmp/ && ssh user@server 'tar xzf /tmp/site.tar.gz -C /var/www/cust-astro/'

# 方式三：只做备份/归档，不要包含原图
zip -r site.zip index.html about.html activities.html gallery.html 404.html assets
```

## 二、目录与权限

```bash
# 目录 755、文件 644 —— 让 Web 服务器能读、别人不能写
find /var/www/cust-astro -type d -exec chmod 755 {} \;
find /var/www/cust-astro -type f -exec chmod 644 {} \;

# 属主交给 Web 服务器用户（Debian/Ubuntu 是 www-data，RHEL 系是 nginx 或 apache）
chown -R www-data:www-data /var/www/cust-astro
```

如果服务器开了 SELinux（CentOS / RHEL / Fedora），放在非标准目录时还要打标签：

```bash
chcon -R -t httpd_sys_content_t /var/www/cust-astro
```

## 三、建议开启压缩

文本资源占大头，开启 gzip 后传输量从 **160 KB 降到 39 KB（省 76%）**：

| 文件 | 原始 | gzip 后 |
|---|---|---|
| index.html | 27.3 KB | 6.7 KB |
| activities.html | 25.1 KB | 5.4 KB |
| gallery.html | 22.3 KB | 5.1 KB |
| 404.html | 13.8 KB | 3.7 KB |
| base.css + main.css | 50.4 KB | 12.3 KB |
| main.js | 13.8 KB | 4.0 KB |
| icons.svg | 7.0 KB | 1.4 KB |

Nginx 在 `http` 或 `server` 块里加一行即可（属于服务器配置，仅供参考）：

```nginx
gzip on;
gzip_comp_level 6;
gzip_min_length 1k;
gzip_types text/html text/css application/javascript image/svg+xml;
```

## 四、缓存策略（对回头客影响最大）

本站的图片是**只增不改**的：新增作品就是新文件名，老文件永远不动。
所以图片可以放心地标成"永久缓存"，回头客几乎不再为图片产生流量。

### 配置文件在哪

| 环境 | 位置 |
|---|---|
| 宝塔面板 | 网站 → 站点 → 设置 → **配置文件**（或 `/www/server/panel/vhost/nginx/站点.conf`） |
| Ubuntu / Debian | `/etc/nginx/sites-available/站点` |
| CentOS / Rocky | `/etc/nginx/conf.d/站点.conf` |
| LNMP 一键包 | `/usr/local/nginx/conf/vhost/站点.conf` |

**改之前先备份**，出问题能立刻回滚：

```bash
cp /etc/nginx/conf.d/站点.conf /etc/nginx/conf.d/站点.conf.bak
```

### 完整的 server 块

`location` 必须写在 `server { }` **内部**（`gzip` 可以放 `http`）。

```nginx
server {
    listen 80;
    server_name astra.xintao.fun;

    # 站点根目录 —— 改成实际路径
    root /var/www/cust-astro;
    index index.html;

    error_page 404 /404.html;

    # ---------- 缓存 ----------

    # 1) 图片：文件名不变，永久缓存
    location ^~ /assets/img/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # 2) CSS / JS / 图标 / 字体：30 天
    location ~* \.(css|js|svg|ico|woff2?)$ {
        expires 30d;
        add_header Cache-Control "public";
    }

    # 3) HTML：回源校验，内容没变就回 304
    location ~* \.html$ {
        add_header Cache-Control "no-cache";
    }

    # ---------- 压缩 ----------
    gzip on;
    gzip_comp_level 6;
    gzip_min_length 1k;
    gzip_types text/html text/css application/javascript image/svg+xml;
}
```

### `^~` 不能省

`location ^~ /assets/img/` 里的 `^~` 表示：前缀匹配成功后**不再检查正则规则**。

如果写成 `location /assets/img/`，`/assets/img/aac-badge-96.svg` 这类文件会先命中前缀，
随后又被下面的正则 `.svg` 规则覆盖 —— 图片的"永久缓存"就失效了。

### HTML 为什么用 `no-cache`

`no-cache` 名字有误导性，它**不是不缓存**，而是"每次先用缓存、但必须向服务器确认一次"。
服务器发现文件没变，只回一个几十字节的 `304 Not Modified`，**不重传内容**。

对比两种写法：

| 写法 | 更新后访客看到新内容 | 流量 |
|---|---|---|
| `expires 5m` | 最多要等 5 分钟 | 少 |
| **`no-cache`** | **立即** | **几乎为零（304）** |

所以 HTML 用 `no-cache` 更省也更及时。

### 生效与验证

```bash
# 1. 先检查语法，报错就不要 reload
nginx -t
# 期望：configuration file /etc/nginx/nginx.conf test is successful

# 2. 平滑重载，不断连接
systemctl reload nginx
# 宝塔：面板点「重载配置」，或 nginx -s reload
```

验证响应头：

```bash
curl -I https://astra.xintao.fun/assets/img/aurora-1-900.jpg
# 期望看到：Cache-Control: public, immutable

curl -I https://astra.xintao.fun/gallery.html
# 期望看到：Cache-Control: no-cache
```

### Nginx 配置的常见坑

| 现象 | 原因 |
|---|---|
| 改完还是老页面 | 浏览器强缓存。用无痕窗口或 `Ctrl+Shift+R` 验证 |
| `nginx -t` 报 `duplicate location` | 同一规则写了两遍，原配置里可能已有 `location /` |
| 图片 404 | `root` 路径写错，或 `assets/` 没传上去 |
| 宝塔改了没反应 | 保存后还要点「重载配置」 |
| 套了 CDN 仍被缓存 | CDN 有自己的缓存层，要在 CDN 后台单独设「静态资源缓存 1 年」 |

### 回滚

```bash
cp /etc/nginx/conf.d/站点.conf.bak /etc/nginx/conf.d/站点.conf
nginx -t && systemctl reload nginx
```

因为只是 `reload` 不是重启，**回滚也不会中断访问**。

## 五、可选：地址跳转

本站内所有链接都是**相对路径**，因此：

* 放在**域名根目录**（`https://example.com/`）→ 直接可用
* 放在**子目录**（`https://example.com/astro/`）→ 也能直接用，不需要改任何代码

如果希望访问 `/astro`（不带结尾斜杠）时自动跳到 `/astro/`，需要在 Nginx 里配一条
`try_files` 或 rewrite —— 这属于服务器配置，不在这里展开。

## 六、上线后自查清单

上传完成后，逐项确认：

- [ ] 首页能打开，**样式正常**（如果页面完全没样式，多半是 `assets/` 没传全）
- [ ] 直接刷新 `about.html`、`activities.html`、`gallery.html` 都能打开
- [ ] 随便输一个不存在的地址，能看到自定义 404 页面（需要在服务器上把 404 指向 `404.html`）
- [ ] **图片能显示** —— 首页 hero 的社徽水印、三张活动照片、画廊各分组里的作品
- [ ] 点开画廊任意一张，**灯箱能弹出**，左右方向键能切换
- [ ] 右上角**切换按钮能切换亮暗**，刷新后保持上次选择
- [ ] 首次访问默认是**暗色**
- [ ] 手机浏览器上宽度正常，没有横向滚动条
- [ ] 浏览器控制台**无报错**（尤其注意 404、MIME 类型错误）
- [ ] `curl -I` 看图片返回 `Cache-Control: public, immutable`，HTML 返回 `no-cache`（见第四节）
- [ ] 页面响应头里有 `Content-Encoding: gzip`（见第三节）

## 七、常见坑

**1. 文件大小写。** Linux 区分大小写，Windows 不区分。本站所有文件名已确认为纯小写
（`index.html`、`base.css`、`aac-badge-96.png`…），引用也完全一致，**这项已排除**。
但如果你之后自己加文件，注意别写成 `Image.jpg` 却引用 `image.jpg`。

**2. 中文文件名。** 站内只有 `image/` 里有一个中文名文件（`250908月食.png`），
而 `image/` 本来就不上传，所以**没有这个问题**。日后新增资源请用英文小写命名。

**3. 不要在这个目录里放备份文件。** 常见的 `.git/`、`site.tar.gz`、`index.html.bak`、
编辑器临时文件（`*.swp`、`*~`）如果留在 Web 根目录，会被直接下载到 —— 可能泄露源码或历史版本。

**4. MIME 类型。** 本站用到 `.html / .css / .js / .svg / .jpg / .webp / .png`，
现代 Web 服务器的默认配置都已包含。如果发现 CSS 不生效，检查 `.css` 是否返回
`text/css`（用浏览器开发者工具的 Network 面板看响应头）。

**5. 图片格式与体积。** `assets/img/` 里同时提供 WebP 和 JPEG，优先加载 WebP。
现在有 64 张作品、每张 900/1400/2000 三档各出 JPEG 与 WebP，`assets/img/` 共 397 个文件约 78.41 MB。
如果服务器带宽紧张，可以只保留到 1400px 版本（`*-900` 和 `*-1400`），删掉 2000px 的，
并相应修改 `tools/pages/gallery.mjs` 里的 `WIDTHS` —— 那是本地构建时才需要的操作。

**6. 备案与站名。** 站名统一使用 **CUST 理工天文**。文字部分不含受限的学校全称 + 社团名号
（详见 `README.md` 的「站名的使用限制」）。换 logo 图时注意别把受限名号做进去。

## 八、再次确认：服务器不需要任何运行时

| 工具 | 用途 | 服务器是否需要 |
|---|---|---|
| Node.js | `tools/build.mjs` 生成 HTML、`verify.mjs` 校验链接、`audit-theme.mjs` 审计配色 | **不需要** |
| Python + Pillow | `tools/optimize_images.py` 从原图生成 web 图片资源 | **不需要** |

这些脚本只在**本地修改网站时**使用。生成出来的 HTML / CSS / JS / 图片就是最终产物，
可以脱离工具链独立运行 —— 把整个 `tools/` 目录删掉，网站照常工作。
