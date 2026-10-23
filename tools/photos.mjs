// 全站照片的唯一数据源。
//
// 画廊、首页「最近的活动」、首页与关于页的合影——所有图片的标题、拍摄地、
// 时间、alt、取景位置都从这里取。改这一处，全站跟着变。
//
// 每张照片的字段：
//   key    资源文件名前缀（assets/img/<key>-900.jpg 等），同时是取用的标识
//   title  作品标题（图说与灯箱共用）
//   year   拍摄年份（数字），画廊按它分组；不知道的留空
//   group  专属分组名（如 "星空毕业典礼"）。填了就不再并入年份分组
//   groupNote 专属分组标题右侧的补充说明（如 "2022 级"）
//   credit 作者署名（如 "22 级 黄华凯"）；拍摄者需要被写出来时才填
//   place  拍摄地（行政区 + 地名）；深空／月食这类没有地点的不填
//   note   时间或类别，如 "2024 年 5 月 3 日"、"深空天体摄影"
//   alt    给读屏软件的画面描述，必须写清楚画面内容
//   focus  裁切时保留的部位，对应 CSS 的 object-position
//   widths 已生成的宽度档位，必须与 tools/optimize_images.py 的 PHOTO_WIDTHS 一致
//
// 数组顺序不影响展示顺序：画廊按 year 分组，组内把同地点的照片排在一起，
// 地点之间、以及地点内部都按 note 里的日期从早到晚排。
//
// 拍摄时间统一取**素材所在文件夹名**的日期（如 20240330吉林省… → 2024-03-30）。
// 不用文件名里的时间戳 —— 修图软件导出（MTXX_ 前缀）、相机时钟偏差、
// 后期另存都可能把它覆盖掉，逐张判断反而容易错。
// 没有文件夹的素材（早期的 aac*.jpg、2025野外观测*.jpg 等）日期由人工确认后填写。

const XIANGHAI = "吉林省白城市通榆县向海自然保护区";
const HALAHAI = "吉林省长春市农安县哈拉海镇";
const SHUIKU = "吉林省吉林市永吉县岔路河镇星星哨水库";
const LIANHUASHAN = "吉林省吉林市磐石市烟筒山镇官马莲花山";
const XINSHAN = "吉林省四平市伊通县新山水库";
const CHAERSHEN = "内蒙古兴安盟科尔沁右翼前旗察尔森水库";
const MENGSHUIHE = "内蒙古兴安盟阿尔山市明水河镇";
const DIJIAOZI = "内蒙古兴安盟阿尔山市明水河镇下地窖子";
const DAJIANGGANG = "吉林省四平市伊通县河源镇大酱缸村";
const ERDAO = "吉林省延边州安图县二道白河镇";
const YITONGHE = "吉林省长春市南关区伊通河";
const SHUANGSHAN = "吉林省四平市双辽市双山镇北傅街";
const YILAN = "黑龙江省哈尔滨市依兰县松花江公园";
const TAHE = "黑龙江省大兴安岭地区塔河县盘古镇";
const BAILANG = "内蒙古兴安盟阿尔山市白狼镇";

const W = [900, 1400, 2000];

export const SHOTS = [
  // ---------- 向海自然保护区 · 银河与极光 ----------
  // 注：键名 aurora-N 只是资源标识，不代表每张都有极光 ——
  // aurora-3（aac9）拍到的只有银河。标题以画面实际内容为准。
  {
    key: "aurora-1",
    title: "极光染紫",
    year: 2024,
    place: XIANGHAI,
    note: "2024 年 5 月 12 日",
    focus: "center 52%",
    alt: "向海自然保护区的夜空，粉紫色的极光辉光笼罩地平线，上方横着银河，右侧一棵树的黑影",
    widths: W,
  },
  {
    key: "aurora-2",
    title: "银河横贯",
    year: 2024,
    place: XIANGHAI,
    note: "2024 年 5 月 12 日",
    focus: "center 45%",
    alt: "向海自然保护区的银河横贯夜空，左下方是树冠剪影",
    widths: W,
  },
  {
    key: "aurora-3",
    title: "银河与远处的灯火",
    year: 2024,
    place: XIANGHAI,
    note: "2024 年 5 月 12 日",
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

  // ---------- 2023 年 · 伊通新山水库 ----------
  {
    key: "xinshan-1",
    title: "树梢上的初星",
    year: 2023,
    place: XINSHAN,
    note: "2023 年 3 月 26 日",
    focus: "center 45%",
    alt: "新山水库边的暮色里，树木成了剪影，天顶亮起几颗早出的星，地平线还留着一层暖光",
    widths: W,
  },
  {
    key: "xinshan-2",
    title: "水库边的夜路",
    year: 2023,
    place: XINSHAN,
    note: "2023 年 3 月 26 日",
    focus: "center 55%",
    alt: "新山水库边的道路，尽头是地平线上城市的灯光，头顶已经能看见星星",
    widths: W,
  },
  {
    key: "xinshan-3",
    title: "把背影留给银河",
    year: 2023,
    place: XINSHAN,
    note: "2023 年 3 月 26 日",
    focus: "center 50%",
    alt: "新山水库的星空下，四五个人背对镜头站着，中间一盏强光把人与前景照得发白、边缘晕开，天上的星点虚成柔光，右侧地平线留着一层橙色的光",
    widths: W,
  },
  {
    key: "xinshan-4",
    title: "湖岸的暮色",
    year: 2023,
    place: XINSHAN,
    note: "2023 年 3 月 26 日",
    focus: "center 50%",
    alt: "新山水库的湖岸，树影与远处的灯光，天空还留着从蓝到暖的暮色渐变",
    widths: W,
  },

  // ---------- 2023 年 · 察尔森水库 ----------
  {
    key: "chaershen-1",
    title: "田埂与星夜",
    year: 2023,
    place: CHAERSHEN,
    note: "2023 年 4 月 29 日",
    focus: "center 50%",
    alt: "察尔森水库旁的田埂，一道车灯从左下斜着打向夜空，天上稀疏地亮着几颗星",
    widths: W,
  },

  // ---------- 2023 年 · 阿尔山明水河镇 ----------
  {
    key: "mingshuihe-1",
    title: "明水河的银河",
    year: 2023,
    place: MENGSHUIHE,
    note: "2023 年 5 月 21 日",
    focus: "center 50%",
    alt: "明水河镇上空，银河的核心区横贯画面，暗尘带与明亮的部分层次分明",
    widths: W,
  },

  // ---------- 2023 年 · 明水河镇下地窖子 ----------
  {
    key: "dijiaozi-1",
    title: "营地外的银河",
    year: 2023,
    place: DIJIAOZI,
    note: "2023 年 6 月 23 日",
    focus: "center 50%",
    alt: "下地窖子的山脊上方，银河斜贯夜空，远处地平线有一小片暖色的光",
    widths: W,
  },
  {
    key: "dijiaozi-2",
    title: "帐篷里的暖光",
    year: 2023,
    place: DIJIAOZI,
    note: "2023 年 6 月 23 日",
    focus: "center 50%",
    alt: "夜色里的营地，一顶帐篷透出暖黄的灯光，旁边还搭着两顶帐篷，天空是深蓝的星夜",
    widths: W,
  },
  {
    key: "dijiaozi-3",
    title: "雷雨中的营地",
    year: 2023,
    place: DIJIAOZI,
    note: "2023 年 6 月 23 日",
    focus: "center 45%",
    alt: "营地上方的夜空被闪电照亮，几道枝状闪电横过云层，帐篷在暗处只留下轮廓",
    widths: W,
  },
  {
    key: "dijiaozi-4",
    title: "头顶的银河",
    year: 2023,
    place: DIJIAOZI,
    note: "2023 年 6 月 23 日",
    focus: "center 50%",
    alt: "下地窖子营地的正上方，银河从头顶铺开，画面里满是密集的星点",
    widths: W,
  },
  {
    key: "dijiaozi-5",
    title: "山脊与星空",
    year: 2023,
    place: DIJIAOZI,
    note: "2023 年 6 月 23 日",
    focus: "center 50%",
    alt: "山脊的剪影之上是满天的星，低空浮着一层淡淡的光晕",
    widths: W,
  },
  {
    key: "dijiaozi-6",
    title: "扎营的夜晚",
    year: 2023,
    place: DIJIAOZI,
    note: "2023 年 6 月 23 日",
    focus: "center 50%",
    alt: "两顶帐篷扎在星空下，一个人戴着照明头灯站在中间，天空是深蓝的星夜",
    widths: W,
  },

  // ---------- 2024 年 · 伊通大酱缸村 ----------
  {
    key: "dajianggang-1",
    title: "地平线上的亮星",
    year: 2024,
    place: DAJIANGGANG,
    note: "2024 年 3 月 30 日",
    focus: "center 55%",
    alt: "大酱缸村外的夜空，一颗很亮的星悬在地平线的光晕上方，左侧是树的剪影",
    widths: W,
  },
  {
    key: "dajianggang-2",
    title: "屋檐上的星轨",
    year: 2024,
    place: DAJIANGGANG,
    note: "2024 年 3 月 30 日",
    focus: "center 50%",
    alt: "大酱缸村的屋舍上方，星轨在长曝光里拉成弧线，屋里透出暖黄色的灯光",
    widths: W,
  },
  {
    key: "dajianggang-3",
    title: "村口的星空",
    year: 2024,
    place: DAJIANGGANG,
    note: "2024 年 3 月 30 日",
    focus: "center 45%",
    alt: "大酱缸村口，树影映在星空下，地面只剩微弱的轮廓",
    widths: W,
  },

  // ---------- 2024 年 · 安图二道白河镇 ----------
  {
    key: "erdao-1",
    title: "镇外的夜空",
    year: 2024,
    place: ERDAO,
    note: "2024 年 11 月 10 日",
    focus: "center 50%",
    alt: "二道白河镇外，地平线泛着微光，树木在星空下成为剪影，地面被微弱的光照亮",
    widths: W,
  },
  {
    key: "erdao-2",
    title: "村里升起的银河",
    year: 2024,
    place: ERDAO,
    note: "2024 年 11 月 10 日",
    focus: "center 50%",
    alt: "二道白河镇的夜空，银河从屋舍与路灯上方升起，云层被灯光照出轮廓",
    widths: W,
  },

  // ---------- 2025 年 · 黑龙江省哈尔滨市依兰县松花江公园 ----------
  {
    key: "yilan-1",
    title: "江岸上的粉紫",
    year: 2025,
    place: YILAN,
    note: "2025 年 6 月 2 日",
    focus: "center 55%",
    alt: "松花江公园的江岸，粉紫色的光辉贴着水面铺开，水里映着对岸的灯，近处是绿色的岸草",
    widths: W,
  },
  {
    key: "yilan-2",
    title: "江面的倒影",
    year: 2025,
    place: YILAN,
    note: "2025 年 6 月 2 日",
    focus: "center 55%",
    alt: "松花江的江面倒映着粉紫色的天光，两岸的灯在水里拉出细长的光带",
    widths: W,
  },
  {
    key: "yilan-3",
    title: "星轨落在水上",
    year: 2025,
    place: YILAN,
    note: "2025 年 6 月 2 日",
    focus: "center 45%",
    alt: "竖幅画面里，星轨绕着天极在水面上方划出弧线，江心有一盏灯",
    widths: W,
  },
  {
    key: "yilan-4",
    title: "一夜星轨",
    year: 2025,
    place: YILAN,
    note: "2025 年 6 月 2 日",
    focus: "center 50%",
    alt: "星轨在江面上方绕成半圈，左下是岸边温暖的灯光，水面映出天空的颜色",
    widths: W,
  },
  {
    key: "yilan-5",
    title: "松花江的夜",
    year: 2025,
    place: YILAN,
    note: "2025 年 6 月 2 日",
    focus: "center 55%",
    alt: "松花江的夜色，江面浮着紫红的光，对岸的灯火在水里成为倒影",
    widths: W,
  },

  // ---------- 2025 年 · 黑龙江省大兴安岭地区塔河县盘古镇 ----------
  {
    key: "tahe-1",
    title: "盘古镇的银河",
    year: 2025,
    place: TAHE,
    note: "2025 年 9 月 28 日",
    focus: "center 50%",
    alt: "盘古镇的一处屋舍上方，银河斜贯而过，低空压着一层云，屋前亮着暖色的灯",
    widths: W,
  },
  {
    key: "tahe-2",
    title: "银河下的云",
    year: 2025,
    place: TAHE,
    note: "2025 年 9 月 28 日",
    focus: "center 50%",
    alt: "银河从云层上方穿过，低空泛着黄绿色的光，云被照亮了边缘",
    widths: W,
  },
  {
    key: "tahe-3",
    title: "云带与星河",
    year: 2025,
    place: TAHE,
    note: "2025 年 9 月 28 日",
    focus: "center 50%",
    alt: "一条深色的云带横在银河下方，云带之下是天边黄绿色的光晕",
    widths: W,
  },
  {
    key: "tahe-4",
    title: "营地的灯与银河",
    year: 2025,
    place: TAHE,
    note: "2025 年 9 月 28 日",
    focus: "center 50%",
    alt: "银河横贯夜空，下方亮着两盏灯，地面与树影被照出轮廓，低空有一片绿光",
    widths: W,
  },
  {
    key: "tahe-5",
    title: "横贯的银河",
    year: 2025,
    place: TAHE,
    note: "2025 年 9 月 28 日",
    focus: "center 50%",
    alt: "银河横贯整幅画面，星点密集，低空渐隐在地平线的微光里",
    widths: W,
  },
  {
    key: "tahe-6",
    title: "抬头的人",
    year: 2025,
    place: TAHE,
    note: "2025 年 9 月 28 日",
    focus: "center 50%",
    alt: "竖幅画面里，一个戴着头灯的人站在树下抬头看银河，银河自树梢上方直上",
    widths: W,
  },

  // ---------- 2026 年 · 内蒙古兴安盟阿尔山市白狼镇 ----------
  {
    key: "bailang-1",
    title: "月晕",
    year: 2026,
    place: BAILANG,
    note: "2026 年 4 月 26 日",
    focus: "center 50%",
    alt: "月亮被一圈明亮的晕环围住，晕内是深蓝色的夜空，边缘泛着淡淡的光",
    widths: W,
  },
  {
    key: "bailang-2",
    title: "白狼镇的银河",
    year: 2026,
    place: BAILANG,
    note: "2026 年 4 月 26 日",
    focus: "center 50%",
    alt: "白狼镇外的山野上空，银河斜着升起，地面只有极弱的光，近处站着一个人影",
    widths: W,
  },
  {
    key: "bailang-3",
    title: "深夜的星河",
    year: 2026,
    place: BAILANG,
    note: "2026 年 4 月 26 日",
    focus: "center 50%",
    alt: "深夜的星空，银河密而暗，画面以深蓝与黑色为主",
    widths: W,
  },
  {
    key: "bailang-4",
    title: "镇上的灯",
    year: 2026,
    place: BAILANG,
    note: "2026 年 4 月 26 日",
    focus: "center 55%",
    alt: "白狼镇的一条街，路灯与电线杆在夜里排开，红色与暖黄的光映在路上，头顶是星空",
    widths: W,
  },
  {
    key: "bailang-5",
    title: "回程的路上",
    year: 2026,
    place: BAILANG,
    note: "2026 年 4 月 26 日",
    focus: "center 55%",
    alt: "回程的公路，路边的车灯把路面照亮，银河在右上方升起，两侧是树的剪影",
    widths: W,
  },

  // ---------- 星空毕业典礼 · 2022 级（专属分组，不并入年份）----------
  {
    key: "grad-1",
    title: "学士服与星河",
    year: 2026,
    group: "星空毕业典礼",
    groupNote: "2022 级",
    place: SHUANGSHAN,
    note: "2026 年 6 月 18 日",
    focus: "center 50%",
    alt: "一位穿学士服的毕业生背对镜头站在银河下，左侧是电杆与电线，天际泛着淡淡的紫光",
    widths: W,
  },
  {
    key: "grad-2",
    title: "一束绿光",
    year: 2026,
    group: "星空毕业典礼",
    groupNote: "2022 级",
    place: SHUANGSHAN,
    note: "2026 年 6 月 18 日",
    focus: "center 50%",
    alt: "毕业生举着绿色激光笔，光柱笔直射向银河，人在画面中央成剪影",
    widths: W,
  },
  {
    key: "grad-3",
    title: "抬头的瞬间",
    year: 2026,
    group: "星空毕业典礼",
    groupNote: "2022 级",
    place: SHUANGSHAN,
    note: "2026 年 6 月 18 日",
    focus: "center 45%",
    alt: "穿学士服的毕业生仰头望向银河，银河从头顶斜贯而过，背景是夜空与远处的屋脊",
    widths: W,
  },
  {
    key: "grad-4",
    title: "指向星空",
    year: 2026,
    group: "星空毕业典礼",
    groupNote: "2022 级",
    place: SHUANGSHAN,
    note: "2026 年 6 月 18 日",
    focus: "center 50%",
    alt: "毕业生侧身举起绿色激光笔，光柱斜指银河，右侧是电杆与树的剪影",
    widths: W,
  },
  {
    key: "grad-5",
    title: "银河之下",
    year: 2026,
    group: "星空毕业典礼",
    groupNote: "2022 级",
    place: SHUANGSHAN,
    note: "2026 年 6 月 18 日",
    focus: "center 50%",
    alt: "毕业生站在画面中央，身后是横贯天空的银河，人物被夜色压成剪影",
    widths: W,
  },
  {
    key: "grad-6",
    title: "学位帽的影子",
    year: 2026,
    group: "星空毕业典礼",
    groupNote: "2022 级",
    place: SHUANGSHAN,
    note: "2026 年 6 月 18 日",
    focus: "center 48%",
    alt: "毕业生的学位帽与披肩在星空前显出轮廓，右侧是屋脊与电杆的剪影",
    widths: W,
  },
  {
    key: "grad-7",
    title: "夜色里的毕业生",
    year: 2026,
    group: "星空毕业典礼",
    groupNote: "2022 级",
    place: SHUANGSHAN,
    note: "2026 年 6 月 18 日",
    focus: "center 50%",
    alt: "一位毕业生侧身立在银河下，长袍的轮廓清晰，四周是小镇屋顶的剪影",
    widths: W,
  },
  {
    key: "grad-8",
    title: "横幅展开",
    year: 2026,
    group: "星空毕业典礼",
    groupNote: "2022 级",
    place: SHUANGSHAN,
    note: "2026 年 6 月 18 日",
    focus: "center 50%",
    alt: "两个人一起举起一条蓝色横幅，头顶是斜贯夜空的银河",
    widths: W,
  },
  {
    key: "grad-9",
    title: "我们毕业了",
    year: 2026,
    group: "星空毕业典礼",
    groupNote: "2022 级",
    place: SHUANGSHAN,
    note: "2026 年 6 月 18 日",
    focus: "center 50%",
    alt: "五六位同学并肩站成一排，共同举着蓝色横幅，银河从他们头顶斜过",
    widths: W,
  },
  {
    key: "grad-10",
    title: "光束越过小镇",
    year: 2026,
    group: "星空毕业典礼",
    groupNote: "2022 级",
    place: SHUANGSHAN,
    note: "2026 年 6 月 18 日",
    focus: "center 50%",
    alt: "毕业生举着绿色激光笔站在电杆旁，光柱越过屋顶指向夜空，银河在右上方",
    widths: W,
  },
  {
    key: "grad-11",
    title: "绿光与星野",
    year: 2026,
    group: "星空毕业典礼",
    groupNote: "2022 级",
    place: SHUANGSHAN,
    note: "2026 年 6 月 18 日",
    focus: "center 50%",
    alt: "绿色光柱斜着划过星空，一位毕业生低头站在画面中间，旁边还有人蹲着",
    widths: W,
  },
  {
    key: "grad-12",
    title: "星空毕业合影",
    year: 2026,
    group: "星空毕业典礼",
    groupNote: "2022 级",
    place: SHUANGSHAN,
    note: "2026 年 6 月 18 日",
    focus: "center 45%",
    alt: "一群毕业生在轿车旁合影，手里举着蓝色横幅，头顶是横贯夜空的银河",
    widths: W,
  },

  // ---------- 2026 年 · 25 级 魏史成 拍摄的银河 ----------
  {
    key: "wsc-1",
    title: "银河 1",
    year: 2026,
    credit: "25 级 魏史成",
    note: "2026 年 10 月 3 日",
    focus: "center 50%",
    alt: "银河纵贯画面，暗尘带清晰，星场密集",
    widths: W,
  },
  {
    key: "wsc-2",
    title: "银河 2",
    year: 2026,
    credit: "25 级 魏史成",
    note: "2026 年 10 月 4 日",
    focus: "center 50%",
    alt: "银河纵贯画面，暗尘带与明亮的星云区并存",
    widths: W,
  },
  {
    key: "wsc-3",
    title: "银河 3",
    year: 2026,
    credit: "25 级 魏史成",
    note: "2026 年 10 月 3 日",
    focus: "center 50%",
    alt: "银河纵贯画面，星点细密，暗尘带呈条带状铺开",
    widths: W,
  },

  // ---------- 其他作品 ----------
  {
    key: "eclipse",
    title: "月影流辉",
    year: 2025,
    place: YITONGHE,
    note: "2025 年 9 月 8 日",
    focus: "center 50%",
    alt: "月全食特写，月面呈暗红色，边缘带一圈较亮的光",
    widths: W,
  },
  {
    key: "eclipse-river",
    title: "夜空里的红月",
    year: 2025,
    place: YITONGHE,
    note: "2025 年 9 月 8 日",
    focus: "center 50%",
    alt: "伊通河畔的夜空，一枚暗红的月亮悬在画面中间，四周散着稀疏的星点，月面下缘留着一道明亮的边缘",
    widths: W,
  },
  // ---------- 深空天体（专属分组）----------
  {
    key: "m31",
    title: "M31 仙女座星系",
    group: "深空天体",
    credit: "22 级 黄华凯",
    focus: "center 50%",
    alt: "单色处理的仙女座星系，明亮的核球与盘面斜跨画面，外围散布着星点",
    widths: W,
  },
  {
    key: "m42",
    title: "M42 猎户座大星云",
    group: "深空天体",
    credit: "22 级 黄华凯",
    focus: "center 50%",
    alt: "猎户座大星云，粉紫色的气体与暗尘带交织在一起，中心区域最亮",
    widths: [900, 1400],
  },
  {
    key: "m57",
    title: "M57 环状星云",
    year: 2024,
    group: "深空天体",
    credit: "22 级 黄华凯",
    note: "2024 年 11 月 6 日",
    focus: "center 50%",
    alt: "星野中的环状星云，一个小而清晰的圆环悬在星点之间",
    widths: [900, 1400],
  },
  {
    key: "ngc6888",
    title: "NGC 6888 新月星云",
    group: "深空天体",
    credit: "20 级 夏天宏",
    focus: "center 50%",
    alt: "NGC 6888 新月星云，红色的丝状气壳嵌在密集星场中",
    widths: W,
  },

  // ---------- 深空天体 · 25 级 魏史成 ----------
  {
    key: "c63",
    title: "C63 上帝之眼",
    group: "深空天体",
    credit: "25 级 魏史成",
    focus: "center 50%",
    alt: "C63 上帝之眼：一圈红色的环状星云包着蓝绿色的内部，中心有一颗亮星，四周散布星点",
    widths: W,
  },
  {
    key: "hcg92",
    title: "HCG-92 史蒂夫五重奏",
    group: "深空天体",
    credit: "25 级 魏史成",
    focus: "center 50%",
    alt: "HCG-92 史蒂夫五重奏：几个星系聚在一处，形态各异，右上方有一颗很亮的星",
    widths: [600, 800],
  },
  {
    key: "lc1805",
    title: "LC-1805",
    group: "深空天体",
    credit: "25 级 魏史成",
    focus: "center 50%",
    alt: "LC-1805：大片红色的云气横贯画面，内部有明暗交错的丝状结构",
    widths: W,
  },
  {
    key: "m33",
    title: "M33",
    group: "深空天体",
    credit: "25 级 魏史成",
    focus: "center 50%",
    alt: "M33 三角座星系：正面朝向的旋涡星系，旋臂松散，散布着亮斑",
    widths: W,
  },
  {
    key: "m45",
    title: "M45 昴星团",
    group: "深空天体",
    credit: "25 级 魏史成",
    focus: "center 50%",
    alt: "M45 昴星团：几颗亮星被蓝色的星云包裹，周围是细密的星点",
    widths: W,
  },
  {
    key: "ngc7331",
    title: "NGC-7331",
    group: "深空天体",
    credit: "25 级 魏史成",
    focus: "center 50%",
    alt: "NGC-7331：侧向的旋涡星系，盘面细长，旁边还有几个更小的星系",
    widths: [600, 1000],
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
