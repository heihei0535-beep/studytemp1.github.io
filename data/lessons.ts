import { Lesson } from '../types';

export const lessons: Lesson[] = [
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
  }
];