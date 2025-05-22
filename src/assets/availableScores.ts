import { ref } from 'vue';

export const availableScores = ref([
  { name: '吉他与孤独与蓝色星球', path: `${import.meta.env.BASE_URL}scores/吉他与孤独与蓝色星球.gpx` },
  { name: '东方妖妖梦 - 幽雅に咲かせ、墨染の桜 ～ Border of Life (Drop D)', path: `${import.meta.env.BASE_URL}scores/东方妖妖梦 - 幽雅に咲かせ、墨染の桜　～ Border of Life(Drop D).gp5` },
  // { name: '[因幡輝哉]廃獄ララバイ',path: `${import.meta.env.BASE_URL}score/[因幡輝哉]廃獄ララバイ.mid`},
  { name: 'Canon Rock', path: 'https://www.alphatab.net/files/canon.gp' },
]);
