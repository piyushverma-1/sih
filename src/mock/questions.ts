import type { AssessmentQuestion } from "@/types/student";

const tech: AssessmentQuestion[] = [
  // === Full-stack / Web (12)
  { id: "fs-1", type: "mcq", section: "tech", difficulty: 1, questionText: "Which HTML tag represents a self-contained piece of content like a blog post?", options: ["<div>", "<section>", "<article>", "<span>"], answerKey: 2, skillTag: "html" },
  { id: "fs-2", type: "mcq", section: "tech", difficulty: 2, questionText: "In React, what does the `key` prop help with?", options: ["Styling components", "Identifying list items across renders", "Passing data to children", "Triggering effects"], answerKey: 1, skillTag: "react" },
  { id: "fs-3", type: "mcq", section: "tech", difficulty: 2, questionText: "Which is NOT a built-in React hook?", options: ["useEffect", "useMemo", "useFetch", "useReducer"], answerKey: 2, skillTag: "react" },
  { id: "fs-4", type: "code_output", section: "tech", difficulty: 2, questionText: "What does the following print?\n`[1,2,3].map(n => n*2)`", options: ["[1,2,3]", "[2,4,6]", "6", "Error"], answerKey: 1, skillTag: "js" },
  { id: "fs-5", type: "mcq", section: "tech", difficulty: 2, questionText: "Which HTTP status code means 'Created'?", options: ["200", "201", "204", "301"], answerKey: 1, skillTag: "rest" },
  { id: "fs-6", type: "mcq", section: "tech", difficulty: 2, questionText: "Which SQL clause filters groups AFTER aggregation?", options: ["WHERE", "GROUP BY", "HAVING", "ORDER BY"], answerKey: 2, skillTag: "sql" },
  { id: "fs-7", type: "mcq", section: "tech", difficulty: 3, questionText: "What does `position: sticky` do in CSS?", options: ["Fixes an element to the viewport", "Hides an element", "Toggles between relative and fixed based on scroll", "Floats an element"], answerKey: 2, skillTag: "css" },
  { id: "fs-8", type: "debugging", section: "tech", difficulty: 2, questionText: "Find the bug:\n`const sum = (a,b) => { return a + b }`", options: ["Missing semicolon", "Arrow body is fine, no bug", "Should use var", "Wrong operator"], answerKey: 1, skillTag: "js" },
  { id: "fs-9", type: "mcq", section: "tech", difficulty: 1, questionText: "What does CSS stand for?", options: ["Cascading Style Sheets", "Computer Style System", "Creative Styling Syntax", "Coded Style Sheet"], answerKey: 0, skillTag: "css" },
  { id: "fs-10", type: "mcq", section: "tech", difficulty: 3, questionText: "Which of the following is a primitive type in TypeScript?", options: ["object", "tuple", "any", "interface"], answerKey: 2, skillTag: "ts" },
  { id: "fs-11", type: "mcq", section: "tech", difficulty: 2, questionText: "Which Next.js function runs at build time for static generation?", options: ["useEffect", "getServerSideProps", "getStaticProps", "getInitialProps"], answerKey: 2, skillTag: "next" },
  { id: "fs-12", type: "mcq", section: "tech", difficulty: 2, questionText: "Which method adds a new document to a MongoDB collection?", options: ["insert()", "insertOne()", "add()", "push()"], answerKey: 1, skillTag: "node" },

  // === Java Backend (10)
  { id: "jv-1", type: "mcq", section: "tech", difficulty: 1, questionText: "Which keyword prevents a class from being subclassed in Java?", options: ["static", "final", "abstract", "sealed"], answerKey: 1, skillTag: "java" },
  { id: "jv-2", type: "mcq", section: "tech", difficulty: 2, questionText: "Which annotation exposes a method as a REST endpoint in Spring?", options: ["@Service", "@Repository", "@GetMapping", "@Component"], answerKey: 2, skillTag: "spring" },
  { id: "jv-3", type: "mcq", section: "tech", difficulty: 3, questionText: "Since Java 8, interfaces can contain:", options: ["Only abstract methods", "Default and static methods", "Constructors", "Final fields only"], answerKey: 1, skillTag: "java" },
  { id: "jv-4", type: "mcq", section: "tech", difficulty: 2, questionText: "Which collection gives O(1) average insertion and lookup by key?", options: ["ArrayList", "HashMap", "TreeMap", "LinkedList"], answerKey: 1, skillTag: "java" },
  { id: "jv-5", type: "code_output", section: "tech", difficulty: 2, questionText: "What does `Integer x = 128; Integer y = 128; System.out.println(x==y);` print?", options: ["true", "false", "Compilation error", "NullPointerException"], answerKey: 1, skillTag: "java" },
  { id: "jv-6", type: "mcq", section: "tech", difficulty: 2, questionText: "Which OOP principle is achieved by method overloading?", options: ["Inheritance", "Polymorphism", "Encapsulation", "Abstraction"], answerKey: 1, skillTag: "oop" },
  { id: "jv-7", type: "mcq", section: "tech", difficulty: 1, questionText: "Which file extension is used for compiled Java classes?", options: [".java", ".class", ".jar", ".exe"], answerKey: 1, skillTag: "java" },
  { id: "jv-8", type: "mcq", section: "tech", difficulty: 2, questionText: "Which JUnit annotation marks a test method?", options: ["@Test", "@Run", "@Check", "@Assert"], answerKey: 0, skillTag: "junit" },
  { id: "jv-9", type: "debugging", section: "tech", difficulty: 3, questionText: "What's wrong? `List<String> list = new ArrayList<>(); list.add(1);`", options: ["Should use LinkedList", "Generics prevent adding int", "Should use addAll", "Nothing"], answerKey: 1, skillTag: "java" },
  { id: "jv-10", type: "mcq", section: "tech", difficulty: 2, questionText: "Which Spring stereotype is used for the data access layer?", options: ["@Component", "@Service", "@Repository", "@Controller"], answerKey: 2, skillTag: "spring" },

  // === Python / Data (12)
  { id: "py-1", type: "mcq", section: "tech", difficulty: 1, questionText: "Which library is primarily used for dataframes in Python?", options: ["numpy", "pandas", "scipy", "matplotlib"], answerKey: 1, skillTag: "pandas" },
  { id: "py-2", type: "mcq", section: "tech", difficulty: 2, questionText: "Which metric is appropriate for a class-imbalanced binary classifier?", options: ["Accuracy", "F1-score", "MSE", "R²"], answerKey: 1, skillTag: "ml" },
  { id: "py-3", type: "mcq", section: "tech", difficulty: 2, questionText: "Overfitting is best described as:", options: ["High bias, low variance", "Model fits training too well, generalizes poorly", "Model underfits the data", "Data leakage"], answerKey: 1, skillTag: "ml" },
  { id: "py-4", type: "code_output", section: "tech", difficulty: 2, questionText: "What does `len([1,2,3,4])` return?", options: ["3", "4", "5", "Error"], answerKey: 1, skillTag: "python" },
  { id: "py-5", type: "mcq", section: "tech", difficulty: 2, questionText: "Which method returns summary stats for numeric columns in pandas?", options: ["info()", "describe()", "summary()", "stats()"], answerKey: 1, skillTag: "pandas" },
  { id: "py-6", type: "mcq", section: "tech", difficulty: 1, questionText: "What does NumPy stand for?", options: ["Numerical Python", "Number Python", "Numeric Plus Python", "None"], answerKey: 0, skillTag: "numpy" },
  { id: "py-7", type: "mcq", section: "tech", difficulty: 2, questionText: "Which scikit-learn class is used to split data?", options: ["train_test_split", "split_data", "cross_val", "k_fold"], answerKey: 0, skillTag: "sklearn" },
  { id: "py-8", type: "mcq", section: "tech", difficulty: 2, questionText: "Which distribution is symmetric with mean 0 and std 1?", options: ["Uniform", "Standard Normal", "Poisson", "Binomial"], answerKey: 1, skillTag: "stats" },
  { id: "py-9", type: "debugging", section: "tech", difficulty: 2, questionText: "Find the bug: `def f(x): return x + 1`", options: ["Missing colon", "Wrong operator", "No return type", "No bug"], answerKey: 3, skillTag: "python" },
  { id: "py-10", type: "mcq", section: "tech", difficulty: 3, questionText: "Which Pandas function merges two DataFrames?", options: ["join()", "merge()", "concat()", "All of these"], answerKey: 3, skillTag: "pandas" },
  { id: "py-11", type: "mcq", section: "tech", difficulty: 2, questionText: "Which is a supervised learning algorithm?", options: ["K-Means", "Linear Regression", "DBSCAN", "PCA"], answerKey: 1, skillTag: "ml" },
  { id: "py-12", type: "mcq", section: "tech", difficulty: 2, questionText: "Which tool is most used for business dashboards?", options: ["Tableau", "Blender", "Figma", "Premiere"], answerKey: 0, skillTag: "tableau" },

  // === App (Mobile) (6)
  { id: "ap-1", type: "mcq", section: "tech", difficulty: 2, questionText: "In Android, which component is best for a long-running background task?", options: ["Activity", "Service", "Fragment", "ContentProvider"], answerKey: 1, skillTag: "android" },
  { id: "ap-2", type: "mcq", section: "tech", difficulty: 2, questionText: "Which Flutter widget rebuilds when its State changes?", options: ["StatelessWidget", "StatefulWidget", "InheritedWidget", "Container"], answerKey: 1, skillTag: "flutter" },
  { id: "ap-3", type: "mcq", section: "tech", difficulty: 1, questionText: "Kotlin's `data class` mainly helps with:", options: ["Threading", "Auto-generated equals/hashCode/toString", "Network calls", "UI rendering"], answerKey: 1, skillTag: "kotlin" },
  { id: "ap-4", type: "mcq", section: "tech", difficulty: 1, questionText: "Which language is used to build Flutter apps?", options: ["Swift", "Kotlin", "Dart", "Java"], answerKey: 2, skillTag: "dart" },
  { id: "ap-5", type: "mcq", section: "tech", difficulty: 2, questionText: "Which iOS language is developed by Apple?", options: ["Objective-C", "Swift", "Go", "Rust"], answerKey: 1, skillTag: "swift" },
  { id: "ap-6", type: "mcq", section: "tech", difficulty: 2, questionText: "Which architecture component survives configuration changes?", options: ["Activity", "ViewModel", "Fragment", "Intent"], answerKey: 1, skillTag: "android" },

  // === UI/UX (4)
  { id: "ux-1", type: "mcq", section: "tech", difficulty: 1, questionText: "Which artifact communicates screen-level layout and content priority?", options: ["User persona", "Wireframe", "Mood board", "Style guide"], answerKey: 1, skillTag: "wireframe" },
  { id: "ux-2", type: "mcq", section: "tech", difficulty: 2, questionText: "Heuristic evaluation is:", options: ["A/B testing", "Expert review against usability heuristics", "User interview", "Survey analysis"], answerKey: 1, skillTag: "ux-research" },
  { id: "ux-3", type: "mcq", section: "tech", difficulty: 2, questionText: "Design tokens are primarily used to:", options: ["Generate marketing copy", "Store design decisions as reusable values", "Track user behavior", "Optimize images"], answerKey: 1, skillTag: "design-systems" },
  { id: "ux-4", type: "mcq", section: "tech", difficulty: 1, questionText: "Which tool is most common for UI design in 2026?", options: ["Photoshop", "Figma", "MS Paint", "GIMP"], answerKey: 1, skillTag: "figma" },

  // === DSA (6)
  { id: "dsa-1", type: "mcq", section: "dsa", difficulty: 1, questionText: "What is the time complexity of binary search?", options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"], answerKey: 1, skillTag: "dsa" },
  { id: "dsa-2", type: "mcq", section: "dsa", difficulty: 1, questionText: "Which data structure uses LIFO ordering?", options: ["Queue", "Stack", "Heap", "Tree"], answerKey: 1, skillTag: "dsa" },
  { id: "dsa-3", type: "mcq", section: "dsa", difficulty: 2, questionText: "Which traversal visits root, left, right?", options: ["Inorder", "Preorder", "Postorder", "Level order"], answerKey: 1, skillTag: "dsa" },
  { id: "dsa-4", type: "mcq", section: "dsa", difficulty: 2, questionText: "What is the worst-case time complexity of quicksort?", options: ["O(n log n)", "O(n²)", "O(log n)", "O(n)"], answerKey: 1, skillTag: "dsa" },
  { id: "dsa-5", type: "code_output", section: "dsa", difficulty: 2, questionText: "What does `[3,1,4,1,5,9,2,6].sort()` produce?", options: ["[3,1,4,1,5,9,2,6]", "[1,1,2,3,4,5,6,9]", "[9,6,5,4,3,2,1,1]", "Error"], answerKey: 1, skillTag: "dsa" },
  { id: "dsa-6", type: "mcq", section: "dsa", difficulty: 3, questionText: "Dijkstra's algorithm works for:", options: ["All graphs", "Graphs with non-negative weights", "Only DAGs", "Only trees"], answerKey: 1, skillTag: "dsa" },
];

const verbal: AssessmentQuestion[] = [
  { id: "v-1", type: "mcq", section: "verbal", difficulty: 1, questionText: "Choose the synonym of ABUNDANT:", options: ["Scarce", "Plentiful", "Tiny", "Weak"], answerKey: 1 },
  { id: "v-2", type: "mcq", section: "verbal", difficulty: 1, questionText: "Choose the antonym of OPTIMISTIC:", options: ["Hopeful", "Pessimistic", "Cheerful", "Calm"], answerKey: 1 },
  { id: "v-3", type: "mcq", section: "verbal", difficulty: 2, questionText: "Identify the odd one out:", options: ["Lion", "Tiger", "Leopard", "Elephant"], answerKey: 3 },
  { id: "v-4", type: "mcq", section: "verbal", difficulty: 2, questionText: "If 'AEP' means 'CAT', what does 'BFQ' mean?", options: ["DOG", "COW", "BIRD", "FISH"], answerKey: 0 },
  { id: "v-5", type: "mcq", section: "verbal", difficulty: 1, questionText: "Fill the blank: She is good ___ mathematics.", options: ["in", "on", "at", "with"], answerKey: 2 },
  { id: "v-6", type: "mcq", section: "verbal", difficulty: 2, questionText: "Choose the correctly spelt word:", options: ["Recieve", "Receive", "Receeve", "Receevee"], answerKey: 1 },
  { id: "v-7", type: "mcq", section: "verbal", difficulty: 1, questionText: "The plural of 'child' is:", options: ["childs", "childes", "children", "childer"], answerKey: 2 },
  { id: "v-8", type: "mcq", section: "verbal", difficulty: 2, questionText: "Complete the analogy: BOOK : LIBRARY :: PAINTING : ?", options: ["Canvas", "Gallery", "Brush", "Artist"], answerKey: 1 },
  { id: "v-9", type: "mcq", section: "verbal", difficulty: 3, questionText: "Find the next term: 2, 6, 12, 20, 30, ?", options: ["36", "40", "42", "44"], answerKey: 2 },
  { id: "v-10", type: "mcq", section: "verbal", difficulty: 1, questionText: "Choose the word that is a NOUN:", options: ["Run", "Quickly", "Happiness", "Beautiful"], answerKey: 2 },
  { id: "v-11", type: "mcq", section: "verbal", difficulty: 2, questionText: "If FRAME is coded as GSBNF, what is SOLVE?", options: ["TPMWF", "TPMVE", "TPNWF", "TOLVE"], answerKey: 0 },
  { id: "v-12", type: "mcq", section: "verbal", difficulty: 1, questionText: "Choose the correct article: ___ honest man is respected.", options: ["A", "An", "The", "No article"], answerKey: 1 },
  { id: "v-13", type: "mcq", section: "verbal", difficulty: 2, questionText: "Pick the word closest in meaning to MITIGATE:", options: ["Aggravate", "Lessen", "Ignore", "Start"], answerKey: 1 },
  { id: "v-14", type: "mcq", section: "verbal", difficulty: 3, questionText: "Statement: 'All cats are dogs. All dogs are pets.' Conclusion: 'All cats are pets.'", options: ["Definitely true", "Definitely false", "Can't say", "None"], answerKey: 0 },
  { id: "v-15", type: "mcq", section: "verbal", difficulty: 2, questionText: "Choose the passive form of 'The cat chased the mouse':", options: ["The mouse chased the cat", "The mouse was chased by the cat", "The mouse is chased", "Chase the mouse"], answerKey: 1 },
  { id: "v-16", type: "mcq", section: "verbal", difficulty: 1, questionText: "Opposite of ANCIENT:", options: ["Old", "Modern", "Aged", "Elderly"], answerKey: 1 },
  { id: "v-17", type: "mcq", section: "verbal", difficulty: 2, questionText: "Idiom: 'A blessing in disguise' means:", options: ["Hidden blessing", "Bad luck", "Hidden curse", "Good fortune"], answerKey: 0 },
  { id: "v-18", type: "mcq", section: "verbal", difficulty: 2, questionText: "Find the error: 'He don't know the answer.'", options: ["He doesn't know", "He not know", "He don't knows", "No error"], answerKey: 0 },
  { id: "v-19", type: "mcq", section: "verbal", difficulty: 1, questionText: "Synonym of INTELLIGENT:", options: ["Dull", "Smart", "Slow", "Loud"], answerKey: 1 },
  { id: "v-20", type: "mcq", section: "verbal", difficulty: 2, questionText: "Statement: 'Ravi is taller than Sita. Sita is taller than Raj.' Who is shortest?", options: ["Ravi", "Sita", "Raj", "Can't say"], answerKey: 2 },
  { id: "v-21", type: "mcq", section: "verbal", difficulty: 1, questionText: "Choose the correct form: 'I ___ a book yesterday.'", options: ["read", "reads", "reading", "have read"], answerKey: 0 },
  { id: "v-22", type: "mcq", section: "verbal", difficulty: 2, questionText: "What is the plural of 'criterion'?", options: ["criterions", "criteria", "criterias", "criterium"], answerKey: 1 },
  { id: "v-23", type: "mcq", section: "verbal", difficulty: 2, questionText: "Pick the best word: 'She gave a ___ speech.'", options: ["long", "lengthy", "protracted", "All work"], answerKey: 3 },
  { id: "v-24", type: "mcq", section: "verbal", difficulty: 1, questionText: "Choose the correct preposition: 'He is fond ___ music.'", options: ["of", "in", "at", "on"], answerKey: 0 },
  { id: "v-25", type: "mcq", section: "verbal", difficulty: 2, questionText: "If today is Monday, what day is 61 days from now?", options: ["Saturday", "Sunday", "Monday", "Friday"], answerKey: 0 },
];

const quant: AssessmentQuestion[] = [
  { id: "q-1", type: "mcq", section: "quant", difficulty: 1, questionText: "If 5x + 3 = 28, what is x?", options: ["3", "5", "6", "7"], answerKey: 1 },
  { id: "q-2", type: "mcq", section: "quant", difficulty: 1, questionText: "15% of 200 is:", options: ["20", "25", "30", "35"], answerKey: 2 },
  { id: "q-3", type: "mcq", section: "quant", difficulty: 2, questionText: "Simple interest on ₹10,000 at 5% p.a. for 2 years:", options: ["₹500", "₹1,000", "₹1,500", "₹2,000"], answerKey: 1 },
  { id: "q-4", type: "mcq", section: "quant", difficulty: 2, questionText: "A train at 60 km/h crosses a pole in 12s. Length?", options: ["100 m", "150 m", "200 m", "240 m"], answerKey: 2 },
  { id: "q-5", type: "mcq", section: "quant", difficulty: 1, questionText: "Next term: 2, 4, 8, 16, ?", options: ["20", "24", "32", "64"], answerKey: 2 },
  { id: "q-6", type: "mcq", section: "quant", difficulty: 2, questionText: "Probability of getting a head on a fair coin:", options: ["0", "1/2", "1", "1/4"], answerKey: 1 },
  { id: "q-7", type: "mcq", section: "quant", difficulty: 2, questionText: "Average of 10, 20, 30, 40, 50:", options: ["25", "30", "35", "40"], answerKey: 1 },
  { id: "q-8", type: "mcq", section: "quant", difficulty: 2, questionText: "If a:b = 2:3 and b:c = 4:5, then a:c = ?", options: ["8:15", "2:5", "4:15", "8:5"], answerKey: 0 },
  { id: "q-9", type: "mcq", section: "quant", difficulty: 3, questionText: "Compound interest on ₹1000 at 10% p.a. for 2 years (compounded annually):", options: ["₹200", "₹210", "₹220", "₹100"], answerKey: 1 },
  { id: "q-10", type: "mcq", section: "quant", difficulty: 1, questionText: "How many degrees in a right angle?", options: ["45", "60", "90", "180"], answerKey: 2 },
  { id: "q-11", type: "mcq", section: "quant", difficulty: 2, questionText: "HCF of 24 and 36 is:", options: ["6", "8", "12", "18"], answerKey: 2 },
  { id: "q-12", type: "mcq", section: "quant", difficulty: 2, questionText: "A bag has 4 red and 6 blue balls. P(both red without replacement)?", options: ["1/3", "2/15", "4/25", "2/9"], answerKey: 1 },
  { id: "q-13", type: "mcq", section: "quant", difficulty: 1, questionText: "Square root of 144 is:", options: ["10", "11", "12", "14"], answerKey: 2 },
  { id: "q-14", type: "mcq", section: "quant", difficulty: 2, questionText: "Perimeter of a square with side 5 cm:", options: ["10", "20", "25", "50"], answerKey: 1 },
  { id: "q-15", type: "mcq", section: "quant", difficulty: 2, questionText: "If 3x = 81, x = ?", options: ["3", "4", "5", "6"], answerKey: 1 },
  { id: "q-16", type: "mcq", section: "quant", difficulty: 3, questionText: "Area of circle with radius 7 (π=22/7):", options: ["154", "144", "49", "100"], answerKey: 0 },
  { id: "q-17", type: "mcq", section: "quant", difficulty: 2, questionText: "Profit % if CP=100, SP=120:", options: ["10%", "20%", "25%", "30%"], answerKey: 1 },
  { id: "q-18", type: "mcq", section: "quant", difficulty: 1, questionText: "LCM of 4 and 6 is:", options: ["2", "8", "12", "24"], answerKey: 2 },
  { id: "q-19", type: "mcq", section: "quant", difficulty: 2, questionText: "Pipe A fills in 6h, B in 3h. Together?", options: ["1.5h", "2h", "3h", "4.5h"], answerKey: 1 },
  { id: "q-20", type: "mcq", section: "quant", difficulty: 2, questionText: "Speed of 90 km/h in m/s:", options: ["15", "20", "25", "30"], answerKey: 2 },
  { id: "q-21", type: "mcq", section: "quant", difficulty: 2, questionText: "sin(30°) = ?", options: ["0", "0.5", "1", "√3/2"], answerKey: 1 },
  { id: "q-22", type: "mcq", section: "quant", difficulty: 3, questionText: "Sum of first 10 natural numbers:", options: ["45", "55", "65", "100"], answerKey: 1 },
  { id: "q-23", type: "mcq", section: "quant", difficulty: 2, questionText: "P(rolling 6 on fair die):", options: ["1/2", "1/3", "1/6", "1/4"], answerKey: 2 },
  { id: "q-24", type: "mcq", section: "quant", difficulty: 2, questionText: "A 100 m train crosses a 200 m platform at 20 m/s. Time?", options: ["10s", "15s", "20s", "25s"], answerKey: 1 },
  { id: "q-25", type: "mcq", section: "quant", difficulty: 3, questionText: "If log₁₀(2) = 0.301, log₁₀(8) = ?", options: ["0.301", "0.602", "0.903", "1.204"], answerKey: 2 },
];

export const QUESTION_BANK: AssessmentQuestion[] = [...tech, ...verbal, ...quant];

export const SKILL_TO_QUESTION: Record<string, string[]> = QUESTION_BANK.reduce(
  (acc, q) => {
    if (q.skillTag) {
      acc[q.skillTag] = acc[q.skillTag] ?? [];
      acc[q.skillTag].push(q.id);
    }
    return acc;
  },
  {} as Record<string, string[]>
);