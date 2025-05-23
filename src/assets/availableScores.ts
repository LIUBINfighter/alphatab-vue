import { ref } from 'vue';

export const availableScores = ref([
  { name: '吉他与孤独与蓝色星球', path: `${import.meta.env.BASE_URL}scores/吉他与孤独与蓝色星球.gpx` },
  { name: '春日影', path: `${import.meta.env.BASE_URL}scores/春日影.gp` },
  { name: 'Canon Rock', path: 'https://www.alphatab.net/files/canon.gp' },
  // Canon Rock 是目前用来进行全面测试的（多音轨，metadata完整）
  // { name: '[东方アレンジ]碎月 指弹', path: `${import.meta.env.BASE_URL}score/碎月-指弹(东方アレンジ).gpx`},
  // 不知道为何不支持这个gpx文件
  // { name: '妖怪の山',path: `${import.meta.env.BASE_URL}score/妖怪の山.gpx`},
  // 这个文件也不支持
  { name: '东方妖妖梦 - 幽雅に咲かせ、墨染の桜 ～ Border of Life (Drop D)', path: `${import.meta.env.BASE_URL}scores/东方妖妖梦 - 幽雅に咲かせ、墨染の桜　～ Border of Life(Drop D).gp5` },
  // { name: '[因幡輝哉]廃獄ララバイ',path: `${import.meta.env.BASE_URL}score/[因幡輝哉]廃獄ララバイ.mid`},
  // 目前暂时不支持midi文件
  { name: 'Lycoris Recoil 花の塔', path: `${import.meta.env.BASE_URL}scores/Lycoris Recoil 花の塔.gp` },
  { name: 'U.N. Owen Was Her', path: `${import.meta.env.BASE_URL}scores/U.N. Owen Was Her.gp5` },
  { name: '东方永夜抄 恋色マスタースパーク 指弹', path: `${import.meta.env.BASE_URL}scores/[东方永夜抄]恋色マスタースパーク 指弹.gp5` },
  { name: '东方风神绿 ネイティブフェイス 指弹', path: `${import.meta.env.BASE_URL}scores/[东方风神绿]ネイティブフェイス 指弹.gp5` },
  { name: '柔和碎月', path: `${import.meta.env.BASE_URL}scores/【东方】-柔和碎月.gp5` },
  { name: '东方永夜抄 - 懐かしき東方の血', path: `${import.meta.env.BASE_URL}scores/东方永夜抄 - 懐かしき東方の血.gpx` },
  { name: '废狱', path: `${import.meta.env.BASE_URL}scores/废狱.gpx` },
  { name: '改·色は匂へど散りぬるを', path: `${import.meta.env.BASE_URL}scores/改·色は匂へど散りぬるを.gpx` },
  { name: '进击的巨人op 紅蓮の弓矢 english notation', path: `${import.meta.env.BASE_URL}scores/进击的巨人op 紅蓮の弓矢 english notation.gp5` },
  { name: '上海红茶馆', path: `${import.meta.env.BASE_URL}scores/上海红茶馆.gp5` },
  { name: '碎月-指弹(东方アレンジ)', path: `${import.meta.env.BASE_URL}scores/碎月-指弹(东方アレンジ).gpx` },
  { name: 'おてんば恋娘', path: `${import.meta.env.BASE_URL}scores/おてんば恋娘.gp5` },
  { name: 'ギターと孤独と蒼い惑星', path: `${import.meta.env.BASE_URL}scores/ギターと孤独と蒼い惑星.gp` },
  { name: 'ギターと孤独と蒼い惑星', path: `${import.meta.env.BASE_URL}scores/ギターと孤独と蒼い惑星.gp5` },
]);

/*
  { name: '',path: `${import.meta.env.BASE_URL}score/`},
*/