import { iso_1 } from './standards/iso_1';
import { iso_5_1_2 } from './standards/iso_5_1_2';
import { iso_4_1 } from './standards/iso_4_1';
import { iso_5_1_1 } from './standards/iso_5_1_1';
import { iso_3_1 } from './standards/iso_3_1';
import { iso_2_1 } from './standards/iso_2_1';

export const standardsData = [
  iso_1,
  iso_2_1,
  iso_3_1,
  iso_4_1,
  iso_5_1_1,
  iso_5_1_2
];

// Calcula tiempo estimado de lectura
export const calculateReadingTime = (text) => {
  const wordsPerMinute = 200;
  const wordCount = text.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

export const getRepositoryUrl = (standardId) => {
  const urls = {
    1: "https://cdn.standards.iteh.ai/samples/82669/53c2b3e0d89b4126aea1556f6bd3c522/ISO-IEC-29110-5-1-2-2025.pdf",
    2: "https://cdn.standards.iteh.ai/samples/67223/21df0b1144634f71a5b5492ea714ce01/ISO-IEC-29110-4-1-2018.pdf",
    3: "https://cdn.standards.iteh.ai/samples/85420/c654ca4e75e747c58171a581d2cc3928/ISO-IEC-29110-5-1-1-2025.pdf",
    4: "https://cdn.standards.iteh.ai/samples/71951/1baf19279080427e8cd5302147c82019/ISO-IEC-TR-29110-3-1-2020.pdf",
    5: "https://cdn.standards.iteh.ai/samples/62712/4aba361ac34140b28b599f07f2b87ebb/ISO-IEC-29110-2-1-2015.pdf",
    6: "https://www.iso.org/standard/62711.html"
  };
  return urls[standardId] || "#";
};

export default standardsData;
