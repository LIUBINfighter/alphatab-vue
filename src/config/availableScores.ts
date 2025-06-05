import { ref } from 'vue';

export interface ScoreInfo {
  name: string;
  path: string;
  alias: string;
  artist?: string;
  description?: string;
}

export const availableScores = ref<ScoreInfo[]>([
  { name: '吉他与孤独与蓝色星球', path: `${import.meta.env.BASE_URL}scores/吉他与孤独与蓝色星球.gpx`, alias: 'classic-guitar-loneliness-and-blue-planet' },
  { name: '春日影', path: `${import.meta.env.BASE_URL}scores/春日影.gp`, alias: 'spring-shadow' },
  { name: 'Canon Rock', path: 'https://www.alphatab.net/files/canon.gp', alias: 'canon-rock' },
  { name: '花之舞', path:`${import.meta.env.BASE_URL}scores/花舞.gp5`, alias:'flower-dance' ,}
  // Canon Rock 是目前用来进行全面测试的（多音轨，metadata完整）
  // { name: '[东方アレンジ]碎月 指弹', path: `${import.meta.env.BASE_URL}score/碎月-指弹(东方アレンジ).gpx`},
  // 不知道为何不支持这个gpx文件
  // { name: '妖怪の山',path: `${import.meta.env.BASE_URL}score/妖怪の山.gpx`},
  // 这个文件也不支持
  { name: '东方妖妖梦 - 幽雅に咲かせ、墨染の桜 ～ Border of Life (Drop D)', path: `${import.meta.env.BASE_URL}scores/东方妖妖梦 - 幽雅に咲かせ、墨染の桜　～ Border of Life(Drop D).gp5`, alias: 'border-of-life-drop-d' },
  // { name: '[因幡輝哉]廃獄ララバイ',path: `${import.meta.env.BASE_URL}score/[因幡輝哉]廃獄ララバイ.mid`},
  // 目前暂时不支持midi文件
  { name: 'Lycoris Recoil 花の塔', path: `${import.meta.env.BASE_URL}scores/Lycoris Recoil 花の塔.gp`, alias: 'lycoris-recoil-flower-tower' },
  { name: 'U.N. Owen Was Her', path: `${import.meta.env.BASE_URL}scores/U.N. Owen Was Her.gp5`, alias: 'un-owen-was-her' },
  { name: '东方永夜抄 恋色マスタースパーク 指弹', path: `${import.meta.env.BASE_URL}scores/[东方永夜抄]恋色マスタースパーク 指弹.gp5`, alias: 'master-spark-fingerstyle' },
  { name: '东方风神绿 ネイティブフェイス 指弹', path: `${import.meta.env.BASE_URL}scores/[东方风神绿]ネイティブフェイス 指弹.gp5`, alias: 'native-face-fingerstyle' },
  { name: '柔和碎月', path: `${import.meta.env.BASE_URL}scores/【东方】-柔和碎月.gp5`, alias: 'gentle-fragmented-moon' },
  { name: '东方永夜抄 - 懐かしき東方の血', path: `${import.meta.env.BASE_URL}scores/东方永夜抄 - 懐かしき東方の血.gpx`, alias: 'nostalgic-blood' },
  { name: '废狱', path: `${import.meta.env.BASE_URL}scores/废狱.gpx`, alias: 'abandoned-prison' },
  { name: '改·色は匂へど散りぬるを', path: `${import.meta.env.BASE_URL}scores/改·色は匂へど散りぬるを.gpx`, alias: 'improved-color-fragrance' },
  { name: '进击的巨人op 紅蓮の弓矢 english notation', path: `${import.meta.env.BASE_URL}scores/进击的巨人op 紅蓮の弓矢 english notation.gp5`, alias: 'attack-on-titan-op' },
  { name: '上海红茶馆', path: `${import.meta.env.BASE_URL}scores/上海红茶馆.gp5`, alias: 'shanghai-red-tea-house' },
  { name: '碎月-指弹(东方アレンジ)', path: `${import.meta.env.BASE_URL}scores/碎月-指弹(东方アレンジ).gpx`, alias: 'shattered-moon-fingerstyle' },
  { name: 'おてんば恋娘', path: `${import.meta.env.BASE_URL}scores/おてんば恋娘.gp5`, alias: 'mischievous-girl' },
  { name: 'ギターと孤独と蒼い惑星', path: `${import.meta.env.BASE_URL}scores/ギターと孤独と蒼い惑星.gp`, alias: 'guitar-solitude-blue-planet' },
  { name: 'ギターと孤独と蒼い惑星', path: `${import.meta.env.BASE_URL}scores/ギターと孤独と蒼い惑星.gp5`, alias: 'guitar-solitude-blue-planet-gp5' },
  { 
    name: 'Like A Star (Piano)', 
    path: `${import.meta.env.BASE_URL}scores/archive/11.Like A Star(Piano) 金永所 Utopia.gp`,
    alias: 'like-a-star-piano',
    artist: '金永所'
  },
  { 
    name: 'Blossom (.gp)', 
    path: `${import.meta.env.BASE_URL}scores/archive/blossom.gp`,
    alias: 'blossom-gp'
  },
  { 
    name: 'Blossom (.gpx)', 
    path: `${import.meta.env.BASE_URL}scores/archive/blossom.gpx`,
    alias: 'blossom-gpx'
  },
  { 
    name: 'Cherry Blossom Time', 
    path: `${import.meta.env.BASE_URL}scores/archive/Cherry Blossom Time(樱花盛开的时候十周年版).gpx`,
    alias: 'cherry-blossom-time',
    description: '樱花盛开的时候十周年版'
  },
  { 
    name: 'DEPAPEPE - START', 
    path: `${import.meta.env.BASE_URL}scores/archive/DEPAPEPE - START.gp5`,
    alias: 'depapepe-start',
    artist: 'DEPAPEPE'
  },
  { 
    name: 'DEPAPEPE - 風向儀', 
    path: `${import.meta.env.BASE_URL}scores/archive/DEPAPEPE - 風向儀.gp4`,
    alias: 'depapepe-fuukougi',
    artist: 'DEPAPEPE'
  },
  { 
    name: 'DEPAPEPE - HI-D!', 
    path: `${import.meta.env.BASE_URL}scores/archive/DEPAPEPE-HI-D!.gp4`,
    alias: 'depapepe-hi-d',
    artist: 'DEPAPEPE'
  },
  { 
    name: 'DEPAPEPE - over the sea', 
    path: `${import.meta.env.BASE_URL}scores/archive/DEPAPEPE-over the sea.gpx`,
    alias: 'depapepe-over-the-sea',
    artist: 'DEPAPEPE'
  },
  { 
    name: 'DEPAPEPE - Swingin Happy Xmas', 
    path: `${import.meta.env.BASE_URL}scores/archive/DEPAPEPE-SwinginHappy_Xmas.gp4`,
    alias: 'depapepe-swingin-happy-xmas',
    artist: 'DEPAPEPE'
  },
  { 
    name: 'DEPAPEPE - Wedding Bell', 
    path: `${import.meta.env.BASE_URL}scores/archive/DEPAPEPE-Wedding_Bell.gp4`,
    alias: 'depapepe-wedding-bell',
    artist: 'DEPAPEPE'
  },
  { 
    name: 'DEPAPEPE - いい日だったね', 
    path: `${import.meta.env.BASE_URL}scores/archive/DEPAPEPE-いい日だったね.gp4`,
    alias: 'depapepe-ii-hi-dattane',
    artist: 'DEPAPEPE'
  },
  { 
    name: 'DEPAPEPE - 午后柠檬树下的阳光', 
    path: `${import.meta.env.BASE_URL}scores/archive/DEPAPEPE-午后柠檬树下的阳光.gp5`,
    alias: 'depapepe-lemon-tree-sunshine',
    artist: 'DEPAPEPE'
  },
  { 
    name: 'HI-D', 
    path: `${import.meta.env.BASE_URL}scores/archive/HI-D.gp`,
    alias: 'hi-d'
  },
  { 
    name: 'Lemon', 
    path: `${import.meta.env.BASE_URL}scores/archive/Lemon.gpx`,
    alias: 'lemon'
  }
  // ...existing code...
]);

/*
  { name: '',path: `${import.meta.env.BASE_URL}score/`},
*/