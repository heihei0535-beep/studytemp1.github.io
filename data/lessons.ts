import { Lesson } from '../types';

export const lessons: Lesson[] = [
  // --- New Concept English Book 1 ---
  {
    id: '1-1',
    book: 1,
    unit: 1,
    title: "Excuse me!",
    content: "Excuse me! \nYes? \nIs this your handbag? \nPardon? \nIs this your handbag? \nYes, it is. \nThank you very much.",
    translation: "对不起！\n什么事？\n这是您的手提包吗？\n对不起，请再说一遍。\n这是您的手提包吗？\n是的，是我的。\n非常感谢！",
    grammarPoints: ["Simple Present Tense (Is this...?)", "Pronouns (my, your, it)", "Polite requests"],
    vocabulary: [
      { word: "excuse", definition: "v. 原谅" },
      { word: "me", definition: "pron. 我(宾格)" },
      { word: "handbag", definition: "n. (女用)手提包" },
      { word: "pardon", definition: "int. 原谅，请再说一遍" }
    ]
  },
  // --- New Concept English Book 2 ---
  {
    id: '2-1',
    book: 2,
    unit: 1,
    title: "A Private Conversation",
    content: "Last week I went to the theatre. I had a very good seat. The play was very interesting. I did not enjoy it. A young man and a young woman were sitting behind me. They were talking loudly. I got very angry. I could not hear the actors. I turned round. I looked at the man and the woman angrily. They did not pay any attention. In the end, I could not bear it. I turned round again. 'I can't hear a word!' I said angrily. 'It's none of your business,' the young man said rudely. 'This is a private conversation!'",
    translation: "上星期我去看了场戏。我的座位很好，戏也很有意思，但我却没享受到。一男一女坐在我身后，大声说着话。我非常生气，因为我听不见演员在说什么。我回过头去怒视着那一男一女，他们却毫不理会。最后，我忍不住了，又回过头去，生气地说：“我一个字也听不见了！” “不关你的事，”那男的毫不客气地说，“这是私人间的谈话！”",
    grammarPoints: ["Simple Past Tense", "Word Order in Simple Sentences", "Adverbs (angry vs angrily)"],
    vocabulary: [
      { word: "private", definition: "adj. 私人的" },
      { word: "conversation", definition: "n. 谈话" },
      { word: "theatre", definition: "n. 剧院" },
      { word: "seat", definition: "n. 座位" },
      { word: "loudly", definition: "adv. 大声地" }
    ]
  },
  // --- New Concept English Book 3 ---
  {
    id: '3-1',
    book: 3,
    unit: 1,
    title: "A Puma at Large",
    content: "Pumas are large, cat-like animals which are found in America. When reports came into London Zoo that a wild puma had been spotted forty-five miles south of London, they were not taken seriously. However, as the evidence began to accumulate, experts from the Zoo felt obliged to investigate, for the descriptions given by people who claimed to have seen the puma were extraordinarily similar.",
    translation: "美洲狮是一种体形似猫的大动物，产于美洲。当伦敦动物园接到报告说，在伦敦以南45英里处发现一只美洲狮时，这些报告并没有受到重视。可是，随着证据越来越确凿，动物园的专家们感到有必要进行一番调查，因为凡是声称见到过美洲狮的人们所描述的情况竟是出奇地相似。",
    grammarPoints: ["Complex Sentences", "Passive Voice", "Relative Clauses"],
    vocabulary: [
      { word: "puma", definition: "n. 美洲狮" },
      { word: "spot", definition: "v. 看出，发现" },
      { word: "evidence", definition: "n. 证据" },
      { word: "accumulate", definition: "v. 积累，积聚" }
    ]
  },
  // --- IELTS Speaking & Listening (Book 5) ---
  {
    id: 'ielts-s1',
    book: 5,
    unit: 1,
    title: "Speaking Part 1: Work & Studies",
    content: "Examiner: Do you work or are you a student?\n\nCandidate: I am currently a student. I study Computer Science at university.\n\nExaminer: Why did you choose this subject?\n\nCandidate: Well, I've always been fascinated by technology since I was a child. I believe programming is a creative way to solve real-world problems, and the career prospects in this field are excellent.",
    translation: "考官：你在工作还是在读书？\n\n考生：我现在是学生。我在大学主修计算机科学。\n\n考官：你为什么选择这个专业？\n\n考生：嗯，我从小就对科技很着迷。我认为编程是一种解决现实问题的创造性方式，而且这个领域的职业前景非常好。",
    grammarPoints: ["Present Simple for facts", "Present Perfect for past-to-present interests", "Linking words (Well, since, and)"],
    vocabulary: [
      { word: "fascinated", definition: "adj. 入迷的，极感兴趣的" },
      { word: "career prospects", definition: "n. 职业前景" },
      { word: "creative", definition: "adj. 创造性的" }
    ]
  },
  {
    id: 'ielts-s2',
    book: 5,
    unit: 2,
    title: "Speaking Part 2: Describe a trip",
    content: "Topic: Describe a memorable trip you took.\nYou should say:\n- Where you went\n- Who you went with\n- What you did there\nAnd explain why it was memorable.\n\nSample Answer: I'd like to talk about a trip I took to Kyoto, Japan, last year. I went with my best friend. We visited many ancient temples and the famous Fushimi Inari Shrine. It was memorable because the autumn leaves were breathtakingly beautiful, and it was the first time I traveled abroad without my parents.",
    translation: "话题：描述一次难忘的旅行。\n你应该说：\n- 你去了哪里\n- 和谁一起去的\n- 在那里做了什么\n并解释为什么它令人难忘。\n\n参考回答：我想谈谈去年我去日本京都的一次旅行。我和我最好的朋友一起去的。我们参观了许多古老的寺庙和著名的伏见稻荷大社。这次旅行之所以难忘，是因为那里的红叶美得惊人，而且这是我第一次没有父母陪伴出国旅行。",
    grammarPoints: ["Past Simple for narrative", "Adjectives for description", "Structuring a monologue"],
    vocabulary: [
      { word: "memorable", definition: "adj. 难忘的" },
      { word: "breathtakingly", definition: "adv. 惊人地" },
      { word: "shrine", definition: "n. 神社" },
      { word: "abroad", definition: "adv. 在国外" }
    ]
  },
  {
    id: 'ielts-l1',
    book: 5,
    unit: 3,
    title: "Listening Section 1: Hotel Reservation",
    content: "Receptionist: Good morning, Grand Hotel. How may I help you?\nGuest: Hello, I'd like to book a room for two nights, please.\nReceptionist: Certainly. What dates are you looking for?\nGuest: The 15th and 16th of next month.\nReceptionist: Okay. We have a double room with a sea view available. It's $120 per night including breakfast.\nGuest: That sounds perfect. Does the room have Wi-Fi?\nReceptionist: Yes, all our rooms have high-speed Wi-Fi.",
    translation: "接待员：早上好，格兰德酒店。有什么可以帮您的吗？\n客人：您好，我想预订两晚的房间。\n接待员：当然。您想预订哪几天的？\n客人：下个月的15号和16号。\n接待员：好的。我们有一间海景双人房，每晚120美元，含早餐。\n客人：听起来很完美。房间有无线网络吗？\n接待员：是的，我们所有房间都有高速无线网络。",
    grammarPoints: ["Inquiries (I'd like to...)", "Prepositions of time", "Confirming details"],
    vocabulary: [
      { word: "reservation", definition: "n. 预订" },
      { word: "available", definition: "adj. 可用的，有空的" },
      { word: "include", definition: "v. 包含" }
    ]
  }
];