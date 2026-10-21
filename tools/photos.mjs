// 全站照片的唯一数据源。
//
// 画廊、首页「最近的活动」、首页与关于页的合影——所有图片的标题、拍摄地、
// 时间、alt、取景位置都从这里取。改这一处，全站跟着变。
//
// 每张照片的字段：
//   key    资源文件名前缀（assets/img/<key>-900.jpg 等），同时是取用的标识
//   title  作品标题（图说与灯箱共用）
//   year   拍摄年份（数字），画廊按它分组；不知道的留空
//   place  拍摄地（行政区 + 地名）；深空／月食这类没有地点的不填
//   note   时间或类别，如 "2024 年 5 月 3 日"、"深空天体摄影"
//   alt    给读屏软件的画面描述，必须写清楚画面内容
//   focus  裁切时保留的部位，对应 CSS 的 object-position
//   widths 已生成的宽度档位，必须与 tools/optimize_images.py 的 PHOTO_WIDTHS 一致
//
// 数组顺序只影响「同一年、同一地点」内部的先后；画廊会按 year 分组、
// 组内把同地点的照片排在一起。

const XIANGHAI = "吉林省白城市通榆县向海自然保护区";
const HALAHAI = "吉林省长春市农安县哈拉海镇";
const SHUIKU = "吉林省吉林市永吉县岔路河镇星星哨水库";
const LIANHUASHAN = "吉林省吉林市磐石市烟筒山镇官马莲花山";

const W = [900, 1400, 2000];

export const SHOTS = [
  // ---------- 向海自然保护区 · 银河与极光 ----------
  // 注：键名 aurora-N 只是资源标识，不代表每张都有极光 ——
  // aurora-3（aac9）拍到的只有银河。标题以画面实际内容为准。
  {
    key: "aurora-1",
    title: "极光染紫",
    place: XIANGHAI,
    focus: "center 52%",
    alt: "向海自然保护区的夜空，粉紫色的极光辉光笼罩地平线，上方横着银河，右侧一棵树的黑影",
    widths: W,
  },
  {
    key: "aurora-2",
    title: "银河横贯",
    place: XIANGHAI,
    focus: "center 45%",
    alt: "向海自然保护区的银河横贯夜空，左下方是树冠剪影",
    widths: W,
  },
  {
    key: "aurora-3",
    title: "银河与远处的灯火",
    place: XIANGHAI,
    focus: "center 50%",
    alt: "向海自然保护区的银河自地平线升起，远处有零星的灯光，低空泛着淡淡的光晕",
    widths: W,
  },

  // ---------- 哈拉海镇 · 银河 ----------
  {
    key: "hala-1",
    title: "银河升起",
    year: 2024,
    place: HALAHAI,
    note: "2024 年 10 月 11 日",
    focus: "center 48%",
    alt: "哈拉海镇的夜空，银河自地平线斜升，低空有一抹淡淡的光晕",
    widths: W,
  },
  {
    key: "hala-2",
    title: "树影与星河",
    year: 2024,
    place: HALAHAI,
    note: "2024 年 10 月 11 日",
    focus: "center 45%",
    alt: "哈拉海镇的银河横贯夜空，右侧是树的剪影",
    widths: W,
  },
  {
    key: "hala-aurora",
    title: "原野尽头的极光",
    year: 2024,
    place: HALAHAI,
    note: "2024 年 10 月 11 日",
    focus: "center 55%",
    alt: "哈拉海的原野上空，粉红色的极光贴着地平线漫开，银河斜贯其上，前景是草丛与树的剪影",
    widths: W,
  },

  // ---------- 星星哨水库 · 2025 年野外观测 ----------
  {
    key: "outdoor-1",
    title: "水库上空的银河",
    year: 2025,
    place: SHUIKU,
    note: "2025 年 5 月 2 日",
    focus: "center 50%",
    alt: "星星哨水库的夜空，银河横跨天际，水面倒映着岸边的蓝色灯光",
    widths: W,
  },
  {
    key: "outdoor-2",
    title: "水面上的星光",
    year: 2025,
    place: SHUIKU,
    note: "2025 年 5 月 2 日",
    focus: "center 50%",
    alt: "星星哨水库的水面与银河，岸边有蓝色灯光照射",
    widths: W,
  },
  {
    key: "group-outdoor",
    title: "野外观测合影",
    year: 2025,
    place: SHUIKU,
    note: "2025 年 5 月 2 日",
    focus: "center 32%",
    alt: "十几位社团成员在星星哨水库边与一台望远镜合影，头顶是银河",
    widths: W,
    // 这张会用在相框里（下方内容是文绕图），补上尺寸避免图片加载时页面跳动
    size: [2000, 1531],
  },

  // ---------- 官马莲花山 · 2024 银河 ----------
  {
    key: "milkyway-horizon",
    title: "山脊上的银河",
    year: 2024,
    place: LIANHUASHAN,
    note: "2024 年 5 月 3 日",
    focus: "center 50%",
    alt: "官马莲花山，银河自山脊上方升起，下方是山林剪影与低空的暖色光晕",
    widths: W,
  },
  {
    key: "milkyway-wide",
    title: "莲花山的银河",
    year: 2024,
    place: LIANHUASHAN,
    note: "2024 年 5 月 3 日",
    focus: "center 45%",
    alt: "官马莲花山的银河横贯夜空，密集星场与云气清晰可见",
    widths: W,
  },
  {
    key: "milkyway-camp",
    title: "营地上的星空",
    year: 2024,
    place: LIANHUASHAN,
    note: "2024 年 5 月 3 日",
    focus: "center 46%",
    alt: "官马莲花山营地，银河斜贯天空，下方是亮着灯的观测房",
    widths: W,
  },

  // ---------- 其他作品 ----------
  {
    key: "eclipse",
    title: "月影流辉",
    year: 2025,
    note: "2025 年 9 月 8 日",
    focus: "center 50%",
    alt: "月全食特写，月面呈暗红色，边缘带一圈较亮的光",
    widths: W,
  },
  {
    key: "ngc6888",
    title: "NGC 6888 新月星云",
    note: "深空天体摄影",
    focus: "center 50%",
    alt: "NGC 6888 新月星云，红色的丝状气壳嵌在密集星场中",
    widths: W,
  },
  {
    key: "moon-full",
    title: "满月",
    year: 2024,
    note: "2024 年 11 月 16 日",
    focus: "center 50%",
    alt: "满月特写，月面几乎全部被照亮，环形山的辐射纹与深色月海清晰可见",
    widths: W,
  },
];

const BY_KEY = new Map(SHOTS.map((s) => [s.key, s]));

/** 按 key 取一张照片；写错 key 时立刻报错，而不是生成一张空图。 */
export function getShot(key) {
  const shot = BY_KEY.get(key);
  if (!shot) {
    throw new Error(
      `photos.mjs: 没有 key 为 "${key}" 的照片，可用的是：${[...BY_KEY.keys()].join(", ")}`
    );
  }
  return shot;
}

/** 图说里地点 + 时间那一行，缺哪项就省哪项。 */
export function photoMeta(shot) {
  return [shot.place, shot.note].filter(Boolean).join(" · ");
}

function fileFor(shot, width) {
  const widest = Math.max(...shot.widths);
  return `assets/img/${width === widest ? shot.key : `${shot.key}-${width}`}.jpg`;
}

/** 响应式 srcset，形如 "assets/img/x-900.jpg 900w, …" */
export function photoSrcset(shot) {
  return shot.widths.map((w) => `${fileFor(shot, w)} ${w}w`).join(", ");
}

/** 灯箱用的大图与缩略图路径。 */
export function photoFiles(shot) {
  const smallest = Math.min(...shot.widths);
  return {
    full: fileFor(shot, Math.max(...shot.widths)),
    fullSrcset: photoSrcset(shot),
    thumb: fileFor(shot, smallest),
  };
}
