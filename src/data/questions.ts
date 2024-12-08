export type Question = {
  id: number;
  question: string;
  options: {
    value: number;
    text: string;
  }[];
  category: '性格' | '价值观' | '生活习惯';
  coupleOnly?: boolean;
};

export const questions: Question[] = [
  {
    id: 1,
    question: "你在感情中最看重什么？",
    category: "价值观",
    options: [
      { value: 1, text: "稳定与安全感" },
      { value: 2, text: "激情与浪漫" },
      { value: 3, text: "理解与支持" },
      { value: 4, text: "成长与共同进步" }
    ]
  },
  {
    id: 2,
    question: "遇到矛盾时，你通常会怎么处理？",
    category: "性格",
    options: [
      { value: 1, text: "保持沉默，等待对方主动" },
      { value: 2, text: "直接表达不满，寻求解决" },
      { value: 3, text: "寻找合适时机温和沟通" },
      { value: 4, text: "分析问题根源，共同商讨" }
    ]
  },
  {
    id: 3,
    question: "对于未来的规划，你的态度是？",
    category: "价值观",
    options: [
      { value: 1, text: "随遇而安，顺其自然" },
      { value: 2, text: "有大致方向，保持灵活" },
      { value: 3, text: "制定详细计划，稳步执行" },
      { value: 4, text: "共同规划，相互配合" }
    ]
  },
  {
    id: 4,
    question: "在日常生活中，你更倾向于？",
    category: "生活习惯",
    options: [
      { value: 1, text: "享受独处时光" },
      { value: 2, text: "经常社交活动" },
      { value: 3, text: "平衡独处和社交" },
      { value: 4, text: "与伴侣共处为主" }
    ]
  },
  {
    id: 5,
    question: "对于金钱的态度，你更认同？",
    category: "价值观",
    options: [
      { value: 1, text: "量入为出，注重储蓄" },
      { value: 2, text: "适度消费，享受生活" },
      { value: 3, text: "投资理财，规划未来" },
      { value: 4, text: "共同管理，透明公开" }
    ]
  },
  {
    id: 6,
    question: "在压力和困难面前，你会？",
    category: "性格",
    options: [
      { value: 1, text: "独自承担，不愿麻烦他人" },
      { value: 2, text: "寻求身边人帮助" },
      { value: 3, text: "理性分析，积极应对" },
      { value: 4, text: "与伴侣共同面对" }
    ]
  },
  {
    id: 7,
    question: "你们平时主要通过什么方式沟通？",
    category: "生活习惯",
    coupleOnly: true,
    options: [
      { value: 1, text: "主要通过线上聊天" },
      { value: 2, text: "经常见面交流" },
      { value: 3, text: "电话和视频通话为主" },
      { value: 4, text: "多种方式结合" }
    ]
  },
  {
    id: 8,
    question: "你们一起度过的时间主要用来做什么？",
    category: "生活习惯",
    coupleOnly: true,
    options: [
      { value: 1, text: "看电影、追剧" },
      { value: 2, text: "外出游玩、运动" },
      { value: 3, text: "一起学习、工作" },
      { value: 4, text: "分享生活、聊天" }
    ]
  },
  {
    id: 9,
    question: "遇到分歧时，你们通常如何解决？",
    category: "性格",
    coupleOnly: true,
    options: [
      { value: 1, text: "各自冷静后再谈" },
      { value: 2, text: "及时沟通解决" },
      { value: 3, text: "寻求他人建议" },
      { value: 4, text: "互相妥协让步" }
    ]
  }
]; 