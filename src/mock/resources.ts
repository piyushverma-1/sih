export interface LearningResource {
  skillId: string;
  title: string;
  source: "freeCodeCamp" | "MDN" | "NPTEL" | "GeeksforGeeks" | "LeetCode" | "Official" | "YouTube";
  url: string;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
}

export const LEARNING_RESOURCES: LearningResource[] = [
  { skillId: "react", title: "React — official tutorial", source: "Official", url: "https://react.dev/learn", duration: "6h", difficulty: "Beginner" },
  { skillId: "next", title: "Learn Next.js", source: "Official", url: "https://nextjs.org/learn", duration: "4h", difficulty: "Intermediate" },
  { skillId: "ts", title: "TypeScript handbook", source: "Official", url: "https://www.typescriptlang.org/docs/handbook/", duration: "5h", difficulty: "Beginner" },
  { skillId: "node", title: "Node.js getting started", source: "Official", url: "https://nodejs.org/en/learn", duration: "3h", difficulty: "Beginner" },
  { skillId: "sql", title: "SQL Murder Mystery", source: "Official", url: "https://mystery.knightlab.com/", duration: "2h", difficulty: "Beginner" },
  { skillId: "java", title: "Java Programming — NPTEL", source: "NPTEL", url: "https://nptel.ac.in/courses/106105191", duration: "40h", difficulty: "Beginner" },
  { skillId: "spring", title: "Spring Boot in 100 minutes", source: "YouTube", url: "https://www.youtube.com/results?search_query=spring+boot+tutorial", duration: "1.5h", difficulty: "Intermediate" },
  { skillId: "oop", title: "OOP concepts — GeeksforGeeks", source: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/object-oriented-programming-oops-concept-in-java/", duration: "3h", difficulty: "Beginner" },
  { skillId: "python", title: "Python for Everybody", source: "freeCodeCamp", url: "https://www.freecodecamp.org/learn/scientific-computing-with-python/", duration: "10h", difficulty: "Beginner" },
  { skillId: "pandas", title: "Pandas in 10 minutes", source: "Official", url: "https://pandas.pydata.org/docs/user_guide/10min.html", duration: "1h", difficulty: "Beginner" },
  { skillId: "ml", title: "Machine Learning with Python", source: "freeCodeCamp", url: "https://www.freecodecamp.org/learn/machine-learning-with-python/", duration: "20h", difficulty: "Intermediate" },
  { skillId: "sklearn", title: "scikit-learn tutorial", source: "Official", url: "https://scikit-learn.org/stable/tutorial/index.html", duration: "4h", difficulty: "Intermediate" },
  { skillId: "stats", title: "Statistics — Khan Academy", source: "YouTube", url: "https://www.youtube.com/results?search_query=statistics+for+data+science", duration: "8h", difficulty: "Beginner" },
  { skillId: "flutter", title: "Flutter codelabs", source: "Official", url: "https://docs.flutter.dev/codelabs", duration: "6h", difficulty: "Beginner" },
  { skillId: "kotlin", title: "Kotlin docs", source: "Official", url: "https://kotlinlang.org/docs/home.html", duration: "5h", difficulty: "Beginner" },
  { skillId: "android", title: "Android fundamentals", source: "Official", url: "https://developer.android.com/courses/fundamentals-training/overview-v2", duration: "20h", difficulty: "Beginner" },
  { skillId: "figma", title: "Figma basics", source: "Official", url: "https://help.figma.com/hc/en-us/categories/360002051613", duration: "3h", difficulty: "Beginner" },
  { skillId: "ux-research", title: "UX research methods", source: "YouTube", url: "https://www.youtube.com/results?search_query=ux+research+methods", duration: "4h", difficulty: "Beginner" },
  { skillId: "wireframe", title: "Wireframing in Figma", source: "YouTube", url: "https://www.youtube.com/results?search_query=wireframing+figma", duration: "1h", difficulty: "Beginner" },
  { skillId: "dsa", title: "LeetCode 150", source: "LeetCode", url: "https://leetcode.com/studyplan/top-interview-150/", duration: "30h", difficulty: "Intermediate" },
];
