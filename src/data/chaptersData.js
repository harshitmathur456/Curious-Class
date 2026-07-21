export const CHAPTERS_DATA = {
  mathematics_class10: {
    title: "Mathematics",
    chapters: [
      {
        id: "real-numbers",
        name: "Real Numbers",
        objective: "Understand prime factorizations, HCF/LCM, and proofs of irrationality.",
        progress: [
          { id: 1, label: "Fundamental Theorem of Arithmetic", status: "completed" },
          { id: 2, label: "Irrationality Proofs", status: "active" },
          { id: 3, label: "Decimal Expansions", status: "upcoming" }
        ],
        chips: ["Why is √2 irrational?", "Fundamental Theorem of Arithmetic", "Decimal patterns"],
        initialQuestion: "Welcome! Today we are exploring **Real Numbers**. Let's start with a puzzle: if you divide any number by another, you usually get a decimal that either stops (like 0.5) or repeats (like 0.333...). But what about numbers like $\\pi$ or $\\sqrt{2}$? Why do their decimals go on forever without ever repeating a pattern?",
        quizzes: [
          {
            question: "Which of the following is an irrational number?",
            options: ["2.333...", "3.14159... (non-repeating)", "22/7", "sqrt(4)"],
            answerIndex: 1,
            explanation: "Irrational numbers have non-terminating, non-repeating decimal expansions. Fractions and terminating/repeating decimals are rational."
          },
          {
            question: "If two positive integers a and b are written as a = x³y² and b = xy³, where x, y are prime numbers, then HCF(a, b) is:",
            options: ["xy", "xy²", "x³y³", "x²y²"],
            answerIndex: 1,
            explanation: "To find the HCF, we take the lowest power of each common prime factor. For x it is x¹, and for y it is y². Thus HCF is xy²."
          },
          {
            question: "The product of a non-zero rational and an irrational number is always:",
            options: ["Rational", "Irrational", "Whole number", "Zero"],
            answerIndex: 1,
            explanation: "Multiplying any non-zero rational number by an irrational number always yields an irrational number."
          },
          {
            question: "According to the Fundamental Theorem of Arithmetic, every composite number can be uniquely expressed as a product of:",
            options: ["Primes", "Composites", "Even numbers", "Odd numbers"],
            answerIndex: 0,
            explanation: "The theorem states that every composite number can be factored uniquely into prime numbers, except for the order of factors."
          },
          {
            question: "The decimal expansion of 13/125 will terminate after how many decimal places?",
            options: ["1", "2", "3", "4"],
            answerIndex: 2,
            explanation: "125 = 5³. Since the denominator can be expressed in the form 2^n * 5^m, the number of decimal places is max(n,m). Here it is 3."
          }
        ]
      },
      {
        id: "polynomials",
        name: "Polynomials",
        objective: "Understand polynomial graphs, zeroes, and quadratic coefficient relations.",
        progress: [
          { id: 1, label: "Geometrical Meaning of Zeroes", status: "completed" },
          { id: 2, label: "Relationship between Zeroes and Coefficients", status: "active" },
          { id: 3, label: "Division Algorithm", status: "upcoming" }
        ],
        chips: ["What is a parabola?", "Relationship of alpha and beta", "Sum and product of zeroes"],
        initialQuestion: "Welcome! Today we are exploring **Polynomials**. Think of a polynomial graph like a roller coaster track. The places where the track touches or crosses the ground are the 'zeroes' of the polynomial. Why do you think a quadratic polynomial (degree 2) can cross the ground at most two times?",
        quizzes: [
          {
            question: "The number of zeroes of a cubic polynomial is at most:",
            options: ["1", "2", "3", "4"],
            answerIndex: 2,
            explanation: "The maximum number of zeroes of any polynomial is equal to its degree. Since a cubic polynomial has degree 3, it has at most 3 zeroes."
          },
          {
            question: "If one zero of the quadratic polynomial x² + 3x + k is 2, then the value of k is:",
            options: ["10", "-10", "-7", "5"],
            answerIndex: 1,
            explanation: "Substitute x = 2 into the polynomial: (2)² + 3(2) + k = 0 => 4 + 6 + k = 0 => k = -10."
          },
          {
            question: "If alpha and beta are the zeroes of the polynomial 2x² - 5x + 7, then the value of alpha + beta is:",
            options: ["5/2", "-5/2", "7/2", "-7/2"],
            answerIndex: 0,
            explanation: "For ax² + bx + c, the sum of zeroes is -b/a. Here, a = 2 and b = -5, so sum = -(-5)/2 = 5/2."
          },
          {
            question: "The shape of the graph of a quadratic polynomial ax² + bx + c is a:",
            options: ["Straight line", "Circle", "Parabola", "Ellipse"],
            answerIndex: 2,
            explanation: "The graph of a quadratic polynomial is always a symmetrical U-shaped curve called a parabola."
          },
          {
            question: "A quadratic polynomial whose sum of zeroes is -5 and product is 6 is:",
            options: ["x² - 5x + 6", "x² + 5x + 6", "x² - 5x - 6", "x² + 5x - 6"],
            answerIndex: 1,
            explanation: "A quadratic polynomial is given by x² - (sum of zeroes)x + (product of zeroes). This gives x² - (-5)x + 6 = x² + 5x + 6."
          }
        ]
      },
      {
        id: "linear-equations",
        name: "Pair of Linear Equations in Two Variables",
        objective: "Understand consistency, intersection, and substitution/elimination methods.",
        progress: [
          { id: 1, label: "Graphical Representations", status: "completed" },
          { id: 2, label: "Algebraic Methods of Solving", status: "active" },
          { id: 3, label: "Equations Reducible to Linear Form", status: "upcoming" }
        ],
        chips: ["How to check consistency", "Substitution vs. Elimination", "What is cross multiplication?"],
        initialQuestion: "Welcome! Today we are exploring **Pairs of Linear Equations in Two Variables**. Imagine two straight roads being built in a city. If their equations are $x + y = 5$ and $2x + 2y = 10$, will these roads ever cross each other, or are they actually the same road? How can we tell without drawing them?",
        quizzes: [
          {
            question: "If the lines given by 3x + 2ky = 2 and 2x + 5y + 1 = 0 are parallel, then the value of k is:",
            options: ["15/4", "9/8", "15/2", "3/4"],
            answerIndex: 0,
            explanation: "For parallel lines, a1/a2 = b1/b2 != c1/c2. Here, 3/2 = 2k/5 => 4k = 15 => k = 15/4."
          },
          {
            question: "A pair of linear equations which has no solution is called:",
            options: ["Consistent", "Inconsistent", "Coincident", "Dependent"],
            answerIndex: 1,
            explanation: "If a pair of linear equations has no solution, it means the lines are parallel and never intersect, which makes them inconsistent."
          },
          {
            question: "If x = a, y = b is the solution of the equations x - y = 2 and x + y = 4, then the values of a and b are:",
            options: ["3 and 1", "1 and 3", "5 and 3", "2 and 2"],
            answerIndex: 0,
            explanation: "Adding the two equations: 2x = 6 => x = 3. Substituting x = 3 into x + y = 4 => y = 1. So a = 3, b = 1."
          },
          {
            question: "If the equations ax + by = c and lx + my = n represent coincident lines, then:",
            options: ["a/l = b/m != c/n", "a/l = b/m = c/n", "a/l != b/m", "a/l != c/n"],
            answerIndex: 1,
            explanation: "Coincident lines lay exactly on top of each other. This occurs when all coefficients and constants are proportional (a/l = b/m = c/n)."
          },
          {
            question: "The method of eliminating one variable by making coefficients equal is called:",
            options: ["Substitution method", "Elimination method", "Cross-multiplication", "Graphical method"],
            answerIndex: 1,
            explanation: "Making the coefficients of one variable equal and then adding or subtracting the equations to eliminate that variable is the Elimination method."
          }
        ]
      },
      {
        id: "quadratic-equations",
        name: "Quadratic Equations",
        objective: "Understand factorization, the quadratic formula, and the nature of roots.",
        progress: [
          { id: 1, label: "Formulation and Solution by Factorization", status: "completed" },
          { id: 2, label: "Solution by Quadratic Formula", status: "active" },
          { id: 3, label: "Nature of Roots", status: "upcoming" }
        ],
        chips: ["What is the discriminant?", "How does a ball follow a quadratic?", "Formula of nature of roots"],
        initialQuestion: "Welcome! Today we are exploring **Quadratic Equations**. When you throw a ball in the air, its height follows a quadratic equation. Sometimes the ball hits the ground, and sometimes it doesn't. How does the 'discriminant' ($b^2 - 4ac$) tell us whether the ball will hit the ground, and how many times?",
        quizzes: [
          {
            question: "The standard form of a quadratic equation is:",
            options: ["ax² + bx + c = 0 (a != 0)", "ax² + bx + c > 0", "ax³ + bx² + cx + d = 0", "ax + b = 0"],
            answerIndex: 0,
            explanation: "A quadratic equation has degree 2. Its standard form is ax² + bx + c = 0, where a, b, c are real numbers and a cannot be zero."
          },
          {
            question: "If the discriminant (b² - 4ac) of a quadratic equation is greater than zero, the roots are:",
            options: ["Real and equal", "Real and distinct", "No real roots", "Imaginary and equal"],
            answerIndex: 1,
            explanation: "When D > 0, the quadratic formula yields two distinct real numbers as roots."
          },
          {
            question: "The roots of the quadratic equation x² - 9 = 0 are:",
            options: ["3", "-3", "±3", "9"],
            answerIndex: 2,
            explanation: "x² - 9 = 0 => x² = 9 => x = ±3."
          },
          {
            question: "The discriminant of the equation 2x² - 4x + 3 = 0 is:",
            options: ["8", "-8", "16", "-16"],
            answerIndex: 1,
            explanation: "D = b² - 4ac. Here a = 2, b = -4, c = 3. D = (-4)² - 4(2)(3) = 16 - 24 = -8."
          },
          {
            question: "For a quadratic equation ax² + bx + c = 0, if the roots are equal, then:",
            options: ["b² - 4ac = 0", "b² - 4ac > 0", "b² - 4ac < 0", "b² - 4ac != 0"],
            answerIndex: 0,
            explanation: "If the roots are equal, the term under the square root in the quadratic formula must be zero, so the discriminant D = b² - 4ac = 0."
          }
        ]
      },
      {
        id: "arithmetic-progressions",
        name: "Arithmetic Progressions",
        objective: "Understand sequences, common difference, nth term, and sum of terms.",
        progress: [
          { id: 1, label: "Introduction and Common Difference", status: "completed" },
          { id: 2, label: "Finding the nth Term", status: "active" },
          { id: 3, label: "Sum of First n Terms", status: "upcoming" }
        ],
        chips: ["What is 'd'?", "Formula for nth term", "How to sum AP quickly"],
        initialQuestion: "Welcome! Today we are exploring **Arithmetic Progressions (AP)**. Imagine you start saving ₹100 in the first week, and increase your weekly savings by ₹20 every week. By week 50, how much will you save in that week, and how can we quickly calculate your total savings without adding 50 numbers one by one?",
        quizzes: [
          {
            question: "In an AP, if first term a = 3, common difference d = 2, then the 10th term is:",
            options: ["21", "23", "19", "17"],
            answerIndex: 0,
            explanation: "a_n = a + (n-1)d. a_10 = 3 + (10-1)2 = 3 + 9(2) = 3 + 18 = 21."
          },
          {
            question: "The common difference of the AP: 9, 5, 1, -3, ... is:",
            options: ["4", "-4", "3", "-3"],
            answerIndex: 1,
            explanation: "The common difference is any term minus the preceding term. For example, 5 - 9 = -4."
          },
          {
            question: "The sum of the first 10 terms of the AP: 2, 7, 12, ... is:",
            options: ["245", "250", "240", "255"],
            answerIndex: 0,
            explanation: "S_n = (n/2)[2a + (n-1)d]. S_10 = (10/2)[2(2) + (10-1)5] = 5[4 + 45] = 5[49] = 245."
          },
          {
            question: "If the nth term of an AP is 3n + 1, then its 5th term is:",
            options: ["15", "16", "17", "18"],
            answerIndex: 1,
            explanation: "Substitute n = 5 into 3n + 1: 3(5) + 1 = 15 + 1 = 16."
          },
          {
            question: "If first term of an AP is a and common difference is d, then the sum of n terms is:",
            options: ["(n/2)[2a + (n-1)d]", "(n/2)[a + (n-1)d]", "n[2a + (n-1)d]", "(n/2)[2a + nd]"],
            answerIndex: 0,
            explanation: "The standard formula for the sum of the first n terms of an arithmetic progression is S_n = (n/2)[2a + (n-1)d]."
          }
        ]
      },
      {
        id: "triangles",
        name: "Triangles",
        objective: "Understand similarity, Basic Proportionality Theorem, and similarity criteria.",
        progress: [
          { id: 1, label: "Basic Proportionality Theorem (BPT)", status: "completed" },
          { id: 2, label: "Criteria for Similarity of Triangles", status: "active" },
          { id: 3, label: "Pythagoras Theorem & Area Ratio", status: "upcoming" }
        ],
        chips: ["Basic Proportionality Theorem", "Congruent vs. Similar", "Pythagoras theorem proof"],
        initialQuestion: "Welcome! Today we are exploring **Triangles**. Imagine you want to measure the height of a tall school flagpole, but you only have a 1-meter ruler. How can the shadow of the flagpole and the shadow of your ruler help you find the exact height using similar triangles?",
        quizzes: [
          {
            question: "All circles are:",
            options: ["Congruent", "Similar", "Equal", "Symmetric"],
            answerIndex: 1,
            explanation: "All circles have the same shape but different sizes, which means they are similar. They are only congruent if their radii are equal."
          },
          {
            question: "In triangle ABC, DE || BC, intersecting AB at D and AC at E. If AD/DB = 3/5 and AC = 5.6 cm, then AE is:",
            options: ["2.1 cm", "3.1 cm", "1.5 cm", "1.8 cm"],
            answerIndex: 0,
            explanation: "By BPT, AD/DB = AE/EC => 3/5 = AE/(5.6 - AE) => 3(5.6 - AE) = 5AE => 16.8 - 3AE = 5AE => 8AE = 16.8 => AE = 2.1 cm."
          },
          {
            question: "If two triangles are similar, their corresponding sides are:",
            options: ["Equal", "In proportion", "Perpendicular", "Parallel"],
            answerIndex: 1,
            explanation: "By definition, two triangles are similar if their corresponding angles are equal and their corresponding sides are in the same ratio (in proportion)."
          },
          {
            question: "The ratio of the areas of two similar triangles is equal to the:",
            options: ["Ratio of their sides", "Square of the ratio of their sides", "Cube of the ratio of their sides", "Square root of the ratio of their sides"],
            answerIndex: 1,
            explanation: "The area ratio theorem states that for two similar triangles, the ratio of their areas is equal to the square of the ratio of their corresponding sides."
          },
          {
            question: "In a right triangle, the square of the hypotenuse is equal to the sum of the squares of the other two sides. This is:",
            options: ["Thales Theorem", "Pythagoras Theorem", "Euclid Theorem", "BPT"],
            answerIndex: 1,
            explanation: "This is the Pythagoras Theorem, which is a fundamental relation in Euclidean geometry among the three sides of a right triangle."
          }
        ]
      },
      {
        id: "coordinate-geometry",
        name: "Coordinate Geometry",
        objective: "Understand cartesian distance, section formula, and area of coordinate triangles.",
        progress: [
          { id: 1, label: "Distance Formula", status: "completed" },
          { id: 2, label: "Section Formula and Midpoints", status: "active" },
          { id: 3, label: "Area of Triangle using Coordinates", status: "upcoming" }
        ],
        chips: ["Distance formula origin", "How section formula works", "Finding midpoints"],
        initialQuestion: "Welcome! Today we are exploring **Coordinate Geometry**. Imagine you are designing a GPS app. If a delivery boy is at point A(2, 3) and a house is at point B(5, 7), how does the distance formula relate to the famous Pythagoras theorem to find the straight-line distance?",
        quizzes: [
          {
            question: "The distance of the point (3, 4) from the origin is:",
            options: ["3", "4", "5", "7"],
            answerIndex: 2,
            explanation: "Distance from origin is sqrt(x² + y²). sqrt(3² + 4²) = sqrt(9 + 16) = sqrt(25) = 5."
          },
          {
            question: "The distance between points A(1, 2) and B(4, 6) is:",
            options: ["3", "4", "5", "6"],
            answerIndex: 2,
            explanation: "Distance = sqrt((x2 - x1)² + (y2 - y1)²). sqrt((4-1)² + (6-2)²) = sqrt(3² + 4²) = sqrt(9+16) = 5."
          },
          {
            question: "The coordinates of the midpoint of a line segment joining A(2, 8) and B(4, 6) are:",
            options: ["(3, 7)", "(6, 14)", "(3, 14)", "(6, 7)"],
            answerIndex: 0,
            explanation: "Midpoint = ((x1+x2)/2, (y1+y2)/2) = ((2+4)/2, (8+6)/2) = (6/2, 14/2) = (3, 7)."
          },
          {
            question: "The coordinates of the point dividing the segment joining (x1, y1) and (x2, y2) in ratio m1:m2 is:",
            options: ["((m1x2+m2x1)/(m1+m2), (m1y2+m2y1)/(m1+m2))", "((m1x1+m2x2)/(m1+m2), (m1y1+m2y2)/(m1+m2))", "((m1x2-m2x1)/(m1-m2), (m1y2-m2y1)/(m1-m2))", "((m1+x2)/2, (m2+y2)/2)"],
            answerIndex: 0,
            explanation: "This is the section formula. The coordinates of the point dividing the segment joining points in ratio m1:m2 are given by ((m1x2+m2x1)/(m1+m2), (m1y2+m2y1)/(m1+m2))."
          },
          {
            question: "If points (1, 2), (0, 0), and (a, b) are collinear, then:",
            options: ["a = 2b", "b = 2a", "a = b", "a + b = 0"],
            answerIndex: 1,
            explanation: "If collinear, slope between (0,0) and (1,2) must equal slope between (0,0) and (a,b) => (2-0)/(1-0) = (b-0)/(a-0) => 2/1 = b/a => b = 2a."
          }
        ]
      },
      {
        id: "trigonometry-intro",
        name: "Introduction to Trigonometry",
        objective: "Understand trigonometric ratios, identities, and values for standard angles.",
        progress: [
          { id: 1, label: "Trigonometric Ratios", status: "completed" },
          { id: 2, label: "Ratios of Specific Angles", status: "active" },
          { id: 3, label: "Trigonometric Identities", status: "upcoming" }
        ],
        chips: ["Why is sin(x) <= 1?", "What is tan(theta)?", "Deriving identity sin²x + cos²x = 1"],
        initialQuestion: "Welcome! Today we are exploring **Trigonometry**. The word sounds fancy, but it is just about ratios in right-angled triangles. Why is the ratio of opposite side to hypotenuse (sine) always less than or equal to 1? What happens to this ratio as the angle gets closer to $90^\circ$?",
        quizzes: [
          {
            question: "The value of sin(30°) is:",
            options: ["1/2", "sqrt(3)/2", "1/sqrt(2)", "1"],
            answerIndex: 0,
            explanation: "The sine of 30 degrees is 1/2. You can verify this from the standard trigonometric ratio table."
          },
          {
            question: "If cos(theta) = 4/5, then tan(theta) is:",
            options: ["3/4", "4/3", "3/5", "5/3"],
            answerIndex: 0,
            explanation: "In a right triangle, cos = Adjacent/Hypotenuse = 4/5. Using Pythagoras, Opposite side = sqrt(5² - 4²) = 3. Thus tan = Opposite/Adjacent = 3/4."
          },
          {
            question: "The value of sin²(45°) + cos²(45°) is:",
            options: ["0", "1/2", "1", "2"],
            answerIndex: 2,
            explanation: "According to the fundamental identity sin²A + cos²A = 1, the value is always 1 for any angle A."
          },
          {
            question: "Which of the following is equal to sec²(theta) - tan²(theta)?",
            options: ["0", "1", "-1", "2"],
            answerIndex: 1,
            explanation: "From the trigonometric identity 1 + tan²theta = sec²theta, it follows that sec²theta - tan²theta = 1."
          },
          {
            question: "In a right triangle, tangent of an angle is defined as the ratio of:",
            options: ["Opposite/Adjacent", "Adjacent/Opposite", "Opposite/Hypotenuse", "Adjacent/Hypotenuse"],
            answerIndex: 0,
            explanation: "Tangent (tan) is defined as the length of the opposite side divided by the length of the adjacent side."
          }
        ]
      },
      {
        id: "trigonometry-apps",
        name: "Some Applications of Trigonometry",
        objective: "Understand and solve height and distance problems using elevation and depression.",
        progress: [
          { id: 1, label: "Angle of Elevation", status: "completed" },
          { id: 2, label: "Angle of Depression", status: "active" },
          { id: 3, label: "Heights and Distances Problems", status: "upcoming" }
        ],
        chips: ["What is line of sight?", "Angle of elevation vs depression", "How to draw double triangles"],
        initialQuestion: "Welcome! Today we are exploring **Applications of Trigonometry**. Imagine you are standing 20 meters away from a lighthouse and look up at its top at an angle of $45^\circ$. Why does this angle make the height of the lighthouse exactly equal to your distance from it?",
        quizzes: [
          {
            question: "The angle between the line of sight and the horizontal line when the object is above the horizontal line is called:",
            options: ["Angle of depression", "Angle of elevation", "Right angle", "Acute angle"],
            answerIndex: 1,
            explanation: "When we look up at an object, the angle between the horizontal line and our line of sight is called the angle of elevation."
          },
          {
            question: "A tower stands vertically on the ground. From a point 15m away from its foot, the angle of elevation of its top is 60°. The height of the tower is:",
            options: ["15*sqrt(3) m", "15/sqrt(3) m", "15 m", "30 m"],
            answerIndex: 0,
            explanation: "tan(60°) = height/distance => sqrt(3) = h/15 => h = 15*sqrt(3) m."
          },
          {
            question: "If a pole of height 6m casts a shadow of 2*sqrt(3) m long on the ground, then the angle of elevation of the sun is:",
            options: ["30°", "45°", "60°", "90°"],
            answerIndex: 2,
            explanation: "tan(theta) = height/shadow = 6 / (2*sqrt(3)) = 3 / sqrt(3) = sqrt(3). Since tan(60°) = sqrt(3), the angle is 60°."
          },
          {
            question: "When the length of the shadow of a vertical pole is equal to its height, the angle of elevation of the sun is:",
            options: ["30°", "45°", "60°", "90°"],
            answerIndex: 1,
            explanation: "tan(theta) = height/shadow = 1 (since they are equal). Since tan(45°) = 1, the angle of elevation is 45°."
          },
          {
            question: "A ladder 10m long reaches a window 5m above the ground. The angle made by the ladder with the horizontal is:",
            options: ["30°", "45°", "60°", "90°"],
            answerIndex: 0,
            explanation: "sin(theta) = opposite/hypotenuse = 5/10 = 1/2. Since sin(30°) = 1/2, the angle is 30°."
          }
        ]
      },
      {
        id: "circles",
        name: "Circles",
        objective: "Understand tangent properties and theorems on tangents from external points.",
        progress: [
          { id: 1, label: "Tangent to a Circle", status: "completed" },
          { id: 2, label: "Number of Tangents from a Point", status: "active" },
          { id: 3, label: "Tangents from External Points Theorem", status: "upcoming" }
        ],
        chips: ["Radius perpendicular to tangent", "Tangents from external points", "Secant vs. Tangent"],
        initialQuestion: "Welcome! Today we are exploring **Circles**. Imagine a bicycle wheel rolling on a flat road. The road touches the tire at exactly one point at any moment. Why does the spoke connecting this contact point to the center always make a perfect $90^\circ$ angle with the road?",
        quizzes: [
          {
            question: "How many tangents can a circle have at a single point on the circle?",
            options: ["Zero", "One", "Two", "Infinite"],
            answerIndex: 1,
            explanation: "A circle can have only one tangent at any given point on its boundary."
          },
          {
            question: "The lengths of two tangents drawn from an external point to a circle are:",
            options: ["Equal", "Unequal", "Parallel", "Perpendicular"],
            answerIndex: 0,
            explanation: "A fundamental theorem states that the lengths of tangents drawn from an external point to a circle are equal."
          },
          {
            question: "A line intersecting a circle in two points is called a:",
            options: ["Tangent", "Secant", "Chord", "Radius"],
            answerIndex: 1,
            explanation: "A secant is a line that intersects a circle at two distinct points, whereas a tangent intersects at exactly one point."
          },
          {
            question: "If a tangent PQ at a point P of a circle of radius 5 cm meets a line through the center O at a point Q so that OQ = 12 cm, then the length of PQ is:",
            options: ["12 cm", "13 cm", "8.5 cm", "sqrt(119) cm"],
            answerIndex: 3,
            explanation: "The radius is perpendicular to the tangent, forming a right triangle OPQ. PQ = sqrt(OQ² - OP²) = sqrt(12² - 5²) = sqrt(144 - 25) = sqrt(119) cm."
          },
          {
            question: "The angle between a tangent to a circle and the radius through the point of contact is:",
            options: ["45°", "60°", "90°", "180°"],
            answerIndex: 2,
            explanation: "Theorem states that the tangent at any point of a circle is perpendicular (90°) to the radius through the point of contact."
          }
        ]
      },
      {
        id: "circle-areas",
        name: "Areas Related to Circles",
        objective: "Understand sector area, segment area, and perimeter of circles.",
        progress: [
          { id: 1, label: "Perimeter and Area of a Circle", status: "completed" },
          { id: 2, label: "Area of Sector of a Circle", status: "active" },
          { id: 3, label: "Area of Segment of a Circle", status: "upcoming" }
        ],
        chips: ["What is a sector?", "Sector area formula", "Segment vs. Sector"],
        initialQuestion: "Welcome! Today we are exploring **Areas Related to Circles**. Imagine you have a circular pizza of radius 14 cm. If you cut a slice with an angle of $60^\circ$ at the center, how can we use fractions to find the exact area of that pizza slice (sector)?",
        quizzes: [
          {
            question: "The area of a sector of angle theta (in degrees) of a circle of radius r is:",
            options: ["(theta/360) * 2*pi*r", "(theta/360) * pi*r²", "(theta/180) * pi*r²", "(theta/360) * pi*r"],
            answerIndex: 1,
            explanation: "The area of a sector is a fraction of the total area of the circle, proportional to its angle theta: (theta/360) * pi*r²."
          },
          {
            question: "The area of a circle of radius 7 cm is:",
            options: ["154 cm²", "44 cm²", "22 cm²", "308 cm²"],
            answerIndex: 0,
            explanation: "Area = pi*r² = (22/7) * (7)² = 22 * 7 = 154 cm²."
          },
          {
            question: "The area of a quadrant of a circle of radius 2 cm is:",
            options: ["pi/2 cm²", "pi cm²", "2*pi cm²", "4*pi cm²"],
            answerIndex: 1,
            explanation: "A quadrant is a sector of angle 90° (1/4th of the circle). Area = (1/4) * pi * (2)² = pi cm²."
          },
          {
            question: "If the perimeter and the area of a circle are numerically equal, then the radius of the circle is:",
            options: ["2 units", "pi units", "4 units", "7 units"],
            answerIndex: 0,
            explanation: "2*pi*r = pi*r² => 2r = r² => r = 2 units."
          },
          {
            question: "The length of an arc of a sector of angle theta (in degrees) of a circle of radius r is:",
            options: ["(theta/360) * pi*r²", "(theta/360) * 2*pi*r", "(theta/180) * 2*pi*r", "(theta/360) * pi*r"],
            answerIndex: 1,
            explanation: "The length of an arc is a fraction of the total circumference of the circle, proportional to its angle theta: (theta/360) * 2*pi*r."
          }
        ]
      },
      {
        id: "surface-areas-volumes",
        name: "Surface Areas and Volumes",
        objective: "Understand surface areas and volumes of combination of solids.",
        progress: [
          { id: 1, label: "Surface Area of Combined Solids", status: "completed" },
          { id: 2, label: "Volume of Combined Solids", status: "active" },
          { id: 3, label: "Conversion of Solid shapes", status: "upcoming" }
        ],
        chips: ["Ice cream cylinder to cones", "Volume stays same", "TSA of combined solids"],
        initialQuestion: "Welcome! Today we are exploring **Surface Areas and Volumes**. Imagine you have a solid cylinder of ice cream and you melt it down to fill several conical ice cream cones. Does the total volume of ice cream change during this process? What about the total surface area?",
        quizzes: [
          {
            question: "The total surface area of a cube of side a is:",
            options: ["4a²", "6a²", "a³", "12a"],
            answerIndex: 1,
            explanation: "A cube has 6 square faces, each of area a². Thus the total surface area is 6a²."
          },
          {
            question: "If a solid sphere of radius r is melted and recast into a cylinder of radius r, then the height of the cylinder is:",
            options: ["r", "2r", "4/3 r", "3/4 r"],
            answerIndex: 2,
            explanation: "Volume of sphere = Volume of cylinder => (4/3)*pi*r³ = pi*r²*h => h = (4/3)*r."
          },
          {
            question: "The volume of a right circular cone of radius r and height h is:",
            options: ["pi*r²*h", "(1/3)*pi*r²*h", "2*pi*r*h", "(4/3)*pi*r³"],
            answerIndex: 1,
            explanation: "The volume of a cone is exactly one-third the volume of a cylinder with the same base radius and height: (1/3)*pi*r²*h."
          },
          {
            question: "When we convert a solid from one shape to another, its total volume will:",
            options: ["Increase", "Decrease", "Remain unaltered", "Double"],
            answerIndex: 2,
            explanation: "Re-shaping a solid does not add or remove material, so the total volume remains exactly the same (unaltered)."
          },
          {
            question: "The curved surface area of a right circular cylinder of radius r and height h is:",
            options: ["2*pi*r*h", "pi*r²*h", "2*pi*r*(r+h)", "pi*r*h"],
            answerIndex: 0,
            explanation: "The curved surface area of a cylinder is the circumference of the base multiplied by the height: 2*pi*r*h."
          }
        ]
      },
      {
        id: "statistics",
        name: "Statistics",
        objective: "Understand central tendency calculations: Mean, Median, and Mode of grouped data.",
        progress: [
          { id: 1, label: "Mean of Grouped Data", status: "completed" },
          { id: 2, label: "Median and Mode of Grouped Data", status: "active" },
          { id: 3, label: "Graphical Cumulative Frequency Representation", status: "upcoming" }
        ],
        chips: ["Mean vs. Median pocket money", "How outliers affect mean", "Empirical formula"],
        initialQuestion: "Welcome! Today we are exploring **Statistics**. Imagine you want to find the 'average' pocket money of your class. If most students get ₹50 but one student gets ₹5000, which average (Mean, Median, or Mode) will give the most honest representation of the class?",
        quizzes: [
          {
            question: "The class mark of the interval 10-25 is:",
            options: ["15", "17.5", "22.5", "35"],
            answerIndex: 1,
            explanation: "Class mark is the midpoint of the class interval: (Lower limit + Upper limit) / 2 = (10 + 25) / 2 = 35 / 2 = 17.5."
          },
          {
            question: "Which of the following is a measure of central tendency?",
            options: ["Mean", "Range", "Standard deviation", "Variance"],
            answerIndex: 0,
            explanation: "Mean, Median, and Mode are measures of central tendency. Range and standard deviation are measures of dispersion."
          },
          {
            question: "If Mean = 20 and Median = 21, then the Mode using empirical relation is:",
            options: ["22", "23", "24", "25"],
            answerIndex: 1,
            explanation: "Empirical formula: Mode = 3*Median - 2*Mean. Mode = 3(21) - 2(20) = 63 - 40 = 23."
          },
          {
            question: "The median of the data: 2, 4, 6, 8, 10 is:",
            options: ["4", "6", "8", "5"],
            answerIndex: 1,
            explanation: "Since the data is sorted and has 5 numbers, the median is the middle (3rd) value, which is 6."
          },
          {
            question: "The cumulative frequency table is useful in determining the:",
            options: ["Mean", "Median", "Mode", "Range"],
            answerIndex: 1,
            explanation: "Cumulative frequencies are plotted on an ogive curve to find the median value graphically."
          }
        ]
      },
      {
        id: "probability",
        name: "Probability",
        objective: "Understand classical probability, complementary events, and simple outcomes.",
        progress: [
          { id: 1, label: "Theoretical Probability of Events", status: "completed" },
          { id: 2, label: "Coin and Dice Probabilities", status: "active" },
          { id: 3, label: "Card deck probabilities", status: "upcoming" }
        ],
        chips: ["Probability of coin flips", "Complementary events", "Sure vs. Impossible events"],
        initialQuestion: "Welcome! Today we are exploring **Probability**. If you toss a fair coin twice, what is the probability of getting at least one Head? Why is this probability higher than getting exactly one Head?",
        quizzes: [
          {
            question: "The probability of a sure event is:",
            options: ["0", "0.5", "1", "2"],
            answerIndex: 2,
            explanation: "An event that is certain to occur (sure event) has a probability of 1. An impossible event has a probability of 0."
          },
          {
            question: "If the probability of an event E is 0.05, then the probability of 'not E' is:",
            options: ["0.95", "0.05", "0.5", "0.90"],
            answerIndex: 0,
            explanation: "P(E) + P(not E) = 1. Therefore, P(not E) = 1 - 0.05 = 0.95."
          },
          {
            question: "A card is drawn from a well-shuffled deck of 52 cards. The probability of getting a king of red color is:",
            options: ["1/26", "1/13", "3/26", "1/52"],
            answerIndex: 0,
            explanation: "There are 2 red kings in a deck (King of Hearts, King of Diamonds). P(Red King) = 2/52 = 1/26."
          },
          {
            question: "Which of the following cannot be the probability of an event?",
            options: ["2/3", "-1.5", "15%", "0.7"],
            answerIndex: 1,
            explanation: "Probability of any event must lie between 0 and 1 (inclusive). It can never be negative or greater than 1."
          },
          {
            question: "When a fair die is thrown, the probability of getting an odd prime number is:",
            options: ["1/2", "1/3", "1/6", "2/3"],
            answerIndex: 1,
            explanation: "Outcomes on a die are {1, 2, 3, 4, 5, 6}. The prime numbers are {2, 3, 5}. The odd primes are {3, 5}. P(Odd Prime) = 2/6 = 1/3."
          }
        ]
      }
    ]
  },
  science_class10: {
    title: "Science",
    chapters: [
      {
        id: "chemical-reactions",
        name: "Chemical Reactions and Equations",
        objective: "Understand chemical equations, balanced reactions, and types of reactions.",
        progress: [
          { id: 1, label: "Writing Chemical Equations", status: "completed" },
          { id: 2, label: "Balancing Equations", status: "active" },
          { id: 3, label: "Types of Chemical Reactions", status: "upcoming" }
        ],
        chips: ["Law of Conservation of Mass", "Why do we balance equations?", "Rusting of iron"],
        initialQuestion: "Welcome! Today we are exploring **Chemical Reactions and Equations**. When iron rusts or milk turns sour, a chemical change occurs. Why do we need to balance a chemical equation? What law of physics are we satisfying when we do so?",
        quizzes: [
          {
            question: "Which of the following is a physical change?",
            options: ["Melting of ice", "Rusting of iron", "Cooking of food", "Souring of milk"],
            answerIndex: 0,
            explanation: "Melting of ice is a physical change because water changes its state, but no new chemical substance is formed."
          },
          {
            question: "A balanced chemical equation is in accordance with the law of:",
            options: ["Conservation of mass", "Multiple proportion", "Constant proportion", "Gaseous volumes"],
            answerIndex: 0,
            explanation: "A chemical equation must be balanced to satisfy the Law of Conservation of Mass, which states mass cannot be created or destroyed."
          },
          {
            question: "The reaction in which heat is released along with products is called:",
            options: ["Endothermic reaction", "Exothermic reaction", "Photochemical reaction", "Electrolytic reaction"],
            answerIndex: 1,
            explanation: "Reactions that release heat energy into their surroundings are known as exothermic reactions."
          },
          {
            question: "What is the chemical formula of rust?",
            options: ["Fe2O3 . xH2O", "Fe3O4", "FeO", "Fe(OH)2"],
            answerIndex: 0,
            explanation: "Rust is hydrated iron(III) oxide, written chemically as Fe2O3 . xH2O."
          },
          {
            question: "When magnesium ribbon is burnt in air, the ash formed is:",
            options: ["Black", "White", "Yellow", "Blue"],
            answerIndex: 1,
            explanation: "Magnesium burns with a dazzling white flame to form a white powder, magnesium oxide (MgO)."
          }
        ]
      },
      {
        id: "acids-bases-salts",
        name: "Acids, Bases and Salts",
        objective: "Understand acid-base indicators, pH scale, chemical properties, and common salts.",
        progress: [
          { id: 1, label: "Indicators and Properties", status: "completed" },
          { id: 2, label: "pH Scale and Importance", status: "active" },
          { id: 3, label: "Salts and Their Uses", status: "upcoming" }
        ],
        chips: ["Litmus paper test", "What is the pH scale?", "Neutralization reaction"],
        initialQuestion: "Welcome! Today we are exploring **Acids, Bases and Salts**. Have you ever wondered why lemon juice tastes sour while baking soda feels soapy and tastes bitter? How do these substances interact with indicators like litmus, and what happens when they neutralize each other?",
        quizzes: [
          {
            question: "What is the pH of a neutral solution?",
            options: ["5", "7", "9", "14"],
            answerIndex: 1,
            explanation: "The pH scale ranges from 0 to 14. A neutral solution (like pure water) has a pH of 7."
          },
          {
            question: "Which acid is present in tomato?",
            options: ["Citric acid", "Oxalic acid", "Lactic acid", "Methanoic acid"],
            answerIndex: 1,
            explanation: "Tomato contains oxalic acid, while lemon contains citric acid and sour milk contains lactic acid."
          },
          {
            question: "What color does phenolphthalein turn in basic solutions?",
            options: ["Colorless", "Pink", "Blue", "Red"],
            answerIndex: 1,
            explanation: "Phenolphthalein is an indicator that is colorless in acidic or neutral solutions but turns deep pink in basic solutions."
          },
          {
            question: "Sodium hydrogencarbonate is commonly known as:",
            options: ["Washing soda", "Baking soda", "Bleaching powder", "Plaster of Paris"],
            answerIndex: 1,
            explanation: "Sodium hydrogencarbonate (NaHCO3) is baking soda. Sodium carbonate (Na2CO3) is washing soda."
          },
          {
            question: "Which gas is released when an acid reacts with a metal?",
            options: ["Oxygen", "Carbon dioxide", "Hydrogen", "Nitrogen"],
            answerIndex: 2,
            explanation: "Acids react with metals to produce a salt and release hydrogen gas (H2), which burns with a pop sound."
          }
        ]
      },
      {
        id: "metals-nonmetals",
        name: "Metals and Non-metals",
        objective: "Compare physical/chemical properties of metals and non-metals, ionic bonding, and metallurgy.",
        progress: [
          { id: 1, label: "Physical and Chemical Properties", status: "completed" },
          { id: 2, label: "Ionic Bonding", status: "active" },
          { id: 3, label: "Extraction of Metals", status: "upcoming" }
        ],
        chips: ["Ionic vs. Covalent", "Why metals conduct electricity", "Corrosion prevention"],
        initialQuestion: "Welcome! Today we are exploring **Metals and Non-metals**. Think about why copper is used for electrical wiring and gold for jewelry, but carbon isn't. What is the fundamental difference in how their atoms bond together?",
        quizzes: [
          {
            question: "Which metal exists in liquid state at room temperature?",
            options: ["Sodium", "Mercury", "Gallium", "Zinc"],
            answerIndex: 1,
            explanation: "Mercury (Hg) is the only metal that is a liquid at room temperature."
          },
          {
            question: "Non-metals generally conduct electricity poorly. Which carbon allotrope is an exception?",
            options: ["Diamond", "Graphite", "Fullerene", "Coal"],
            answerIndex: 1,
            explanation: "Graphite has free electrons in its layered structure, making it a good conductor of electricity."
          },
          {
            question: "What happens when metal oxides dissolve in water?",
            options: ["They form acidic solutions", "They form basic solutions", "They form neutral solutions", "They don't dissolve"],
            answerIndex: 1,
            explanation: "Most metal oxides are basic in nature and dissolve in water to form metal hydroxides (alkalis)."
          },
          {
            question: "The bond formed by transfer of electrons from metal to non-metal is called:",
            options: ["Covalent bond", "Hydrogen bond", "Ionic bond", "Metallic bond"],
            answerIndex: 2,
            explanation: "Bonds formed by complete transfer of electrons are ionic (electrovalent) bonds. Sharing forms covalent bonds."
          },
          {
            question: "An alloy of mercury with other metals is called:",
            options: ["Amalgam", "Brass", "Bronze", "Solder"],
            answerIndex: 0,
            explanation: "An amalgam is an alloy of mercury with other metals. Brass is copper and zinc."
          }
        ]
      },
      {
        id: "carbon-compounds",
        name: "Carbon and its Compounds",
        objective: "Explore covalent bonding in carbon, versatile nature, homologous series, and functional groups.",
        progress: [
          { id: 1, label: "Covalent Bonding and Carbon's Nature", status: "completed" },
          { id: 2, label: "Homologous Series", status: "active" },
          { id: 3, label: "Chemical Properties of Carbon", status: "upcoming" }
        ],
        chips: ["Tetravalency & Catenation", "Homologous series", "Saturated vs Unsaturated"],
        initialQuestion: "Welcome! Today we are exploring the fascinating world of **Carbon and its Compounds**. Carbon makes up less than 0.03% of Earth's crust, yet it forms the basis of all life and millions of compounds. What makes this single element so versatile?",
        quizzes: [
          {
            question: "How many single covalent bonds are present in pentane (C5H12)?",
            options: ["12", "14", "16", "18"],
            answerIndex: 2,
            explanation: "In pentane, there are 4 C-C bonds and 12 C-H bonds, totaling 16 single covalent bonds."
          },
          {
            question: "Which functional group is present in ethanol?",
            options: ["Aldehyde", "Ketone", "Alcohol", "Carboxylic acid"],
            answerIndex: 2,
            explanation: "Ethanol (C2H5OH) contains the hydroxyl (-OH) functional group which characterizes alcohols."
          },
          {
            question: "Buckminsterfullerene is an allotropic form of:",
            options: ["Phosphorus", "Sulphur", "Carbon", "Tin"],
            answerIndex: 2,
            explanation: "Buckminsterfullerene (C60) is an allotrope of carbon, shaped like a football."
          },
          {
            question: "Unsaturated hydrocarbons burn with a:",
            options: ["Blue flame", "Sooty yellow flame", "Green flame", "Colorless flame"],
            answerIndex: 1,
            explanation: "Unsaturated hydrocarbons have higher carbon content and undergo incomplete combustion, producing a yellow sooty flame."
          },
          {
            question: "The main constituent of biogas and CNG is:",
            options: ["Ethane", "Methane", "Propane", "Butane"],
            answerIndex: 1,
            explanation: "Methane (CH4) makes up over 75-90% of biogas and compressed natural gas (CNG)."
          }
        ]
      },
      {
        id: "life-processes",
        name: "Life Processes",
        objective: "Understand nutrition, respiration, transportation, and excretion in plants and animals.",
        progress: [
          { id: 1, label: "Nutrition and Photosynthesis", status: "completed" },
          { id: 2, label: "Respiration and Transportation", status: "active" },
          { id: 3, label: "Excretion", status: "upcoming" }
        ],
        chips: ["Autotrophic nutrition", "Aerobic vs Anaerobic", "Role of nephrons"],
        initialQuestion: "Welcome! Today we are exploring **Life Processes**. Every second, even while you sleep, your body is performing maintenance work to keep you alive. How do our cells convert the food we eat into usable energy, and how do we transport it?",
        quizzes: [
          {
            question: "Where does the light reaction of photosynthesis occur?",
            options: ["Stroma", "Grana", "Cytoplasm", "Mitochondria"],
            answerIndex: 1,
            explanation: "The light-dependent reaction occurs in the grana (thylakoids) containing chlorophyll. The dark reaction occurs in the stroma."
          },
          {
            question: "Which chamber of the human heart pumps oxygenated blood to the body?",
            options: ["Right atrium", "Right ventricle", "Left atrium", "Left ventricle"],
            answerIndex: 3,
            explanation: "The left ventricle pumps oxygenated blood to all body parts via the aorta. Right ventricle pumps deoxygenated blood to lungs."
          },
          {
            question: "The respiratory pigment in human beings is:",
            options: ["Chlorophyll", "Hemoglobin", "Carotene", "Xanthophyll"],
            answerIndex: 1,
            explanation: "Hemoglobin in red blood cells binds to oxygen and transports it from the lungs to body tissues."
          },
          {
            question: "Which organ secretes bile juice?",
            options: ["Stomach", "Pancreas", "Liver", "Small intestine"],
            answerIndex: 2,
            explanation: "The liver secretes bile juice, which is stored in the gall bladder and helps in emulsifying fats."
          },
          {
            question: "The structural and functional unit of excretion in human kidneys is:",
            options: ["Neuron", "Nephron", "Alveoli", "Trachea"],
            answerIndex: 1,
            explanation: "The nephron is the filtration unit of the kidney. Neurons belong to the nervous system."
          }
        ]
      },
      {
        id: "control-coordination",
        name: "Control and Coordination",
        objective: "Study nervous system, reflex action, brain structure, and plant/animal hormones.",
        progress: [
          { id: 1, label: "Nervous System and Reflex Action", status: "completed" },
          { id: 2, label: "Human Brain Structure", status: "active" },
          { id: 3, label: "Plant and Animal Hormones", status: "upcoming" }
        ],
        chips: ["How reflex arcs work", "Parts of the human brain", "Plant hormones (Auxins)"],
        initialQuestion: "Welcome! Today we are exploring **Control and Coordination**. If you touch a hot pan, your hand pulls back before you even feel the pain. How does this rapid communication happen between your sensory receptors and your muscles?",
        quizzes: [
          {
            question: "What is the gap between two neurons called?",
            options: ["Dendrite", "Axon", "Synapse", "Myelin sheath"],
            answerIndex: 2,
            explanation: "The synapse is the microscopic gap across which chemical neurotransmitters transmit signals from one neuron to the next."
          },
          {
            question: "Which part of the brain controls balance and posture?",
            options: ["Cerebrum", "Cerebellum", "Medulla", "Pons"],
            answerIndex: 1,
            explanation: "The cerebellum (part of hindbrain) regulates voluntary motor movements, posture, and body balance."
          },
          {
            question: "Which plant hormone is responsible for growth inhibition?",
            options: ["Auxin", "Gibberellin", "Cytokinin", "Abscisic acid"],
            answerIndex: 3,
            explanation: "Abscisic acid (ABA) inhibits growth and promotes wilting of leaves and seed dormancy."
          },
          {
            question: "The hormone secreted by the thyroid gland to regulate metabolism is:",
            options: ["Insulin", "Thyroxine", "Adrenaline", "Growth hormone"],
            answerIndex: 1,
            explanation: "Thyroxine regulates carbohydrate, protein, and fat metabolism for balanced growth."
          },
          {
            question: "Which hormone prepares our body for emergency situations (fight-or-flight)?",
            options: ["Insulin", "Estrogen", "Adrenaline", "Testosterone"],
            answerIndex: 2,
            explanation: "Adrenaline is secreted by the adrenal glands to increase heart rate, blood pressure, and breathing during stress."
          }
        ]
      },
      {
        id: "organisms-reproduce",
        name: "How Do Organisms Reproduce?",
        objective: "Examine asexual vs sexual reproduction, vegetative propagation, and human reproductive system.",
        progress: [
          { id: 1, label: "Asexual Reproduction Methods", status: "completed" },
          { id: 2, label: "Sexual Reproduction in Flowering Plants", status: "active" },
          { id: 3, label: "Human Reproductive System", status: "upcoming" }
        ],
        chips: ["Asexual vs Sexual", "Flower reproduction", "DNA copying variations"],
        initialQuestion: "Welcome! Today we are exploring **How Do Organisms Reproduce?** Reproduction is not essential to keep an individual alive, yet species spend massive amounts of energy on it. Why is reproduction so critical for the survival of a species over time?",
        quizzes: [
          {
            question: "Amoeba reproduces by which method of asexual reproduction?",
            options: ["Budding", "Fragmentation", "Binary fission", "Spore formation"],
            answerIndex: 2,
            explanation: "Amoeba undergoes binary fission, where the parent cell splits into two equal daughter cells."
          },
          {
            question: "The male reproductive part of a flower is called the:",
            options: ["Sepal", "Petal", "Carpel", "Stamen"],
            answerIndex: 3,
            explanation: "The stamen consists of the anther and filament and is the male part. The carpel/pistil is the female part."
          },
          {
            question: "The site of fertilization in human females is:",
            options: ["Ovary", "Uterus", "Fallopian tube", "Vagina"],
            answerIndex: 2,
            explanation: "Fertilization of the egg by a sperm occurs in the Fallopian tube (oviduct). Implantation occurs in the uterus."
          },
          {
            question: "Hydra reproduces asexually through:",
            options: ["Regeneration", "Budding", "Fission", "Spore formation"],
            answerIndex: 1,
            explanation: "Hydra reproduces via budding, where a small outgrowth develops and detaches as a new individual."
          },
          {
            question: "The structure that connects the embryo to the mother's uterine wall for nutrition is:",
            options: ["Placenta", "Ureter", "Fallopian tube", "Cervix"],
            answerIndex: 0,
            explanation: "The placenta provides oxygen and nutrients to the growing fetus and removes waste products."
          }
        ]
      },
      {
        id: "heredity-evolution",
        name: "Heredity and Evolution",
        objective: "Explore Mendel's experiments, sex determination, and basic evolutionary genetics.",
        progress: [
          { id: 1, label: "Mendelian Inheritance", status: "completed" },
          { id: 2, label: "Sex Determination", status: "active" },
          { id: 3, label: "Evolutionary Classifications", status: "upcoming" }
        ],
        chips: ["Mendel's pea plants", "Dominant vs. Recessive", "How sex is determined"],
        initialQuestion: "Welcome! Today we are exploring **Heredity**. Why do you look similar to your parents, but not exactly like them? How does DNA carry traits across generations, and how is biological sex determined?",
        quizzes: [
          {
            question: "Who is known as the Father of Genetics?",
            options: ["Charles Darwin", "Gregor Mendel", "Lamarck", "Watson"],
            answerIndex: 1,
            explanation: "Gregor Mendel discovered the fundamental laws of inheritance through his work on pea plants."
          },
          {
            question: "A cross between a tall pea plant (TT) and a short pea plant (tt) results in F1 plants that are:",
            options: ["All short", "All tall", "Medium height", "50% tall 50% short"],
            answerIndex: 1,
            explanation: "Since tallness (T) is dominant over shortness (t), all F1 offspring (Tt) will display the tall phenotype."
          },
          {
            question: "The sex of a child is determined by the sex chromosome inherited from:",
            options: ["Mother", "Father", "Both parents equally", "Grandparents"],
            answerIndex: 1,
            explanation: "The mother always contributes an X chromosome. The father contributes either an X (female) or Y (male)."
          },
          {
            question: "Homologous organs have:",
            options: ["Same structure different function", "Different structure same function", "Same structure same function", "No relation"],
            answerIndex: 0,
            explanation: "Homologous organs share a common structural origin (like human arm and bat wing) but perform different functions."
          },
          {
            question: "Which chromosome pair represents a biological male in humans?",
            options: ["XX", "XY", "YY", "XO"],
            answerIndex: 1,
            explanation: "Humans with XY sex chromosomes develop as biological males, while XX develops as females."
          }
        ]
      },
      {
        id: "light-reflection-refraction",
        name: "Light - Reflection and Refraction",
        objective: "Learn spherical mirrors, lens formula, magnification, and refractive index.",
        progress: [
          { id: 1, label: "Spherical Mirrors and Reflection", status: "completed" },
          { id: 2, label: "Refraction and Lenses", status: "active" },
          { id: 3, label: "Power of Lenses", status: "upcoming" }
        ],
        chips: ["Refractive index", "Concave vs. Convex lenses", "Real vs. Virtual images"],
        initialQuestion: "Welcome! Today we are exploring **Light - Reflection and Refraction**. Why does a straw look bent when placed in a glass of water? How do lenses focus light to correct our vision or zoom in on stars?",
        quizzes: [
          {
            question: "The focal length of a spherical mirror of radius of curvature 30 cm is:",
            options: ["15 cm", "30 cm", "45 cm", "60 cm"],
            answerIndex: 0,
            explanation: "Focal length (f) is half of the radius of curvature (R): f = R/2 = 30/2 = 15 cm."
          },
          {
            question: "Which lens is used to correct myopia (nearsightedness)?",
            options: ["Convex lens", "Concave lens", "Bifocal lens", "Cylindrical lens"],
            answerIndex: 1,
            explanation: "A concave (diverging) lens is used to correct myopia by diverging incoming light before it hits the eye lens."
          },
          {
            question: "The speed of light in water is slower than in air. This is because water has a higher:",
            options: ["Density", "Refractive index", "Volume", "Mass"],
            answerIndex: 1,
            explanation: "The refractive index is a measure of how much light slows down in a medium; water has a higher refractive index than air."
          },
          {
            question: "A virtual, erect, and magnified image is formed by a concave mirror when the object is placed:",
            options: ["At Focus", "Between Pole and Focus", "At Center of Curvature", "At Infinity"],
            answerIndex: 1,
            explanation: "When an object is placed between the pole and focus of a concave mirror, it forms a virtual, erect, and magnified image behind the mirror."
          },
          {
            question: "The SI unit of power of a lens is:",
            options: ["Meter", "Decibel", "Dioptre", "Watt"],
            answerIndex: 2,
            explanation: "The SI unit of lens power is the Dioptre (D), which is equal to 1 / focal length in meters."
          }
        ]
      },
      {
        id: "human-eye-colourful-world",
        name: "The Human Eye and the Colourful World",
        objective: "Explore eye structure, defects of vision, atmospheric refraction, and dispersion.",
        progress: [
          { id: 1, label: "Structure of Human Eye and Defects", status: "completed" },
          { id: 2, label: "Prisms and Dispersion of Light", status: "active" },
          { id: 3, label: "Scattering of Light in Nature", status: "upcoming" }
        ],
        chips: ["Dispersion of light", "Why stars twinkle", "Myopia and Hypermetropy"],
        initialQuestion: "Welcome! Today we are exploring **The Human Eye and the Colourful World**. Have you ever wondered why the sky is blue, but sunsets are deep orange? Or how water droplets act as prisms to create a rainbow in the sky?",
        quizzes: [
          {
            question: "The change in focal length of an eye lens to focus near/far objects is called:",
            options: ["Presbyopia", "Accommodation", "Astigmatism", "Refraction"],
            answerIndex: 1,
            explanation: "Accommodation is the eye's ability to adjust the curvature and focal length of its lens using ciliary muscles."
          },
          {
            question: "The screen on which the eye lens forms an image is called:",
            options: ["Cornea", "Iris", "Pupil", "Retina"],
            answerIndex: 3,
            explanation: "The retina is the light-sensitive inner lining at the back of the eye where images are focused."
          },
          {
            question: "The splitting of white light into its component colors by a prism is called:",
            options: ["Refraction", "Reflection", "Dispersion", "Scattering"],
            answerIndex: 2,
            explanation: "Dispersion is the splitting of white light into its constituent seven spectrum colors (VIBGYOR) when passing through a prism."
          },
          {
            question: "Stars twinkle due to which atmospheric phenomenon?",
            options: ["Atmospheric reflection", "Atmospheric refraction", "Scattering of light", "Dispersion of light"],
            answerIndex: 1,
            explanation: "Stars twinkle because light passes through fluctuating temperature and density layers in the atmosphere, undergoing continuous refraction."
          },
          {
            question: "The blue color of the sky is due to:",
            options: ["Scattering of light", "Reflection of light", "Refraction of light", "Dispersion of light"],
            answerIndex: 0,
            explanation: "Short wavelengths of light (blue) are scattered much more by fine atmospheric molecules than longer wavelengths (red)."
          }
        ]
      },
      {
        id: "electricity-chapter",
        name: "Electricity",
        objective: "Study electric current, Ohm's law, resistance, series/parallel combinations, and heating effects.",
        progress: [
          { id: 1, label: "Current, Potential, and Ohm's Law", status: "completed" },
          { id: 2, label: "Resistance and Combinations", status: "active" },
          { id: 3, label: "Joule's Heating and Power", status: "upcoming" }
        ],
        chips: ["Ohm's Law (V = IR)", "Series vs. Parallel circuits", "Joule's heating effect"],
        initialQuestion: "Welcome! Today we are exploring **Electricity**. When you flip a switch, a light bulb turns on instantly. What is moving inside the wires, and what resists its flow? How do we calculate the energy consumed by our appliances?",
        quizzes: [
          {
            question: "What is the SI unit of electric current?",
            options: ["Volt", "Ohm", "Ampere", "Watt"],
            answerIndex: 2,
            explanation: "The SI unit of electric current is the Ampere (A). Volt is potential, Ohm is resistance, and Watt is power."
          },
          {
            question: "Ohm's Law states that the current flowing through a conductor is directly proportional to:",
            options: ["Resistance", "Potential difference", "Temperature", "Length"],
            answerIndex: 1,
            explanation: "Ohm's Law states I is proportional to V (Current is directly proportional to Potential Difference) at constant temperature."
          },
          {
            question: "If two resistors of 3 ohms and 6 ohms are connected in parallel, their equivalent resistance is:",
            options: ["9 ohms", "2 ohms", "4.5 ohms", "18 ohms"],
            answerIndex: 1,
            explanation: "1/Rp = 1/3 + 1/6 = 2/6 + 1/6 = 3/6 = 1/2. Therefore Rp = 2 ohms."
          },
          {
            question: "The electrical resistivity of a metallic wire depends on its:",
            options: ["Length", "Thickness", "Shape", "Nature of material"],
            answerIndex: 3,
            explanation: "Resistivity is an intrinsic property of a substance depending solely on the material's nature and temperature, not dimensions."
          },
          {
            question: "The rate at which electric energy is dissipated in an electric circuit is:",
            options: ["Electric power", "Electric current", "Potential difference", "Resistance"],
            answerIndex: 0,
            explanation: "Electric power (P = VI) is the rate of electric energy consumption or dissipation."
          }
        ]
      },
      {
        id: "magnetic-effects",
        name: "Magnetic Effects of Electric Current",
        objective: "Explore magnetic fields, electromagnetic induction, electric motors, and domestic circuits.",
        progress: [
          { id: 1, label: "Magnetic Fields and Electromagnetism", status: "completed" },
          { id: 2, label: "Motors and Electromagnetic Induction", status: "active" },
          { id: 3, label: "Domestic Electric Circuits", status: "upcoming" }
        ],
        chips: ["Magnetic field lines", "Right-hand thumb rule", "Electromagnetic induction"],
        initialQuestion: "Welcome! Today we are exploring the **Magnetic Effects of Electric Current**. A wire carrying electric current behaves like a magnet. How does this connection between electricity and magnetism power electric motors and generators?",
        quizzes: [
          {
            question: "The direction of magnetic field lines outside a bar magnet is from:",
            options: ["South pole to North pole", "North pole to South pole", "Center to poles", "East to West"],
            answerIndex: 1,
            explanation: "By convention, magnetic field lines emerge from the North pole and enter at the South pole outside a magnet."
          },
          {
            question: "A device that converts electrical energy into mechanical energy is called:",
            options: ["Electric generator", "Galvanometer", "Electric motor", "Ammeter"],
            answerIndex: 2,
            explanation: "An electric motor uses electric current in a magnetic field to generate mechanical rotation."
          },
          {
            question: "Who discovered electromagnetic induction?",
            options: ["Oersted", "Faraday", "Ampere", "Maxwell"],
            answerIndex: 1,
            explanation: "Michael Faraday discovered that moving a magnet relative to a coil induces an electric current (electromagnetic induction)."
          },
          {
            question: "At the time of short circuit, the current in the circuit:",
            options: ["Reduces substantially", "Does not change", "Increases heavily", "Varies continuously"],
            answerIndex: 2,
            explanation: "A short circuit occurs when live and neutral wires touch directly, reducing resistance to near zero and causing current to spike."
          },
          {
            question: "What color insulation is generally used for the earth wire in domestic circuits?",
            options: ["Red", "Black", "Green", "Yellow"],
            answerIndex: 2,
            explanation: "Green (or green-yellow) insulation is used for the earth wire. Red is live, and black/blue is neutral."
          }
        ]
      },
      {
        id: "our-environment",
        name: "Our Environment",
        objective: "Understand ecosystems, food chains/webs, ozone depletion, and waste management.",
        progress: [
          { id: 1, label: "Ecosystems and Food Chains", status: "completed" },
          { id: 2, label: "Ozone Depletion and Biological Magnification", status: "active" },
          { id: 3, label: "Waste Disposal Management", status: "upcoming" }
        ],
        chips: ["10% Law of energy flow", "Biological magnification", "Ozone layer depletion"],
        initialQuestion: "Welcome! Today we are exploring **Our Environment**. Every living organism is part of a complex web of interactions. How does energy flow through an ecosystem, and why do harmful chemicals build up as we go higher in a food chain?",
        quizzes: [
          {
            question: "Which gas shields the Earth from harmful ultraviolet (UV) radiation?",
            options: ["Oxygen", "Ozone", "Nitrogen", "Carbon dioxide"],
            answerIndex: 1,
            explanation: "The ozone (O3) layer in the stratosphere absorbs harmful UV rays from the sun."
          },
          {
            question: "In a food chain, the secondary consumers are generally:",
            options: ["Herbivores", "Carnivores", "Producers", "Decomposers"],
            answerIndex: 1,
            explanation: "Producers are eaten by herbivores (primary consumers), which are eaten by carnivores (secondary consumers)."
          },
          {
            question: "According to Lindeman's law, how much energy is transferred to the next trophic level?",
            options: ["1%", "10%", "50%", "90%"],
            answerIndex: 1,
            explanation: "The 10% Law states that only about 10% of the organic matter energy is transferred to the next level; 90% is lost as heat/metabolism."
          },
          {
            question: "The accumulation of non-biodegradable chemicals in a food chain is called:",
            options: ["Eutrophication", "Biological magnification", "Pollution", "Siltation"],
            answerIndex: 1,
            explanation: "Biological magnification (or biomagnification) is the increasing concentration of toxic substances at higher trophic levels."
          },
          {
            question: "Which of the following is a biodegradable waste?",
            options: ["Plastic bag", "Glass bottle", "Vegetable peels", "Aluminium foil"],
            answerIndex: 2,
            explanation: "Vegetable peels are organic matter that can be broken down by bacteria and decomposers, making them biodegradable."
          }
        ]
      }
    ]
  },
  mathematics: {
    title: "Mathematics",
    chapters: [
      {
        id: "linear-equations",
        name: "Linear Equations",
        objective: "Learn to model real-world word problems using mathematical equations and solve for the unknown variable.",
        progress: [
          { id: 1, label: "Algebraic Expressions", status: "completed" },
          { id: 2, label: "Solving Basic Equations", status: "active" },
          { id: 3, label: "Word Problems & Applications", status: "upcoming" }
        ],
        chips: ["x + 5 = 2x - 3?", "Is x the number of mangoes?", "I need a hint..."],
        initialQuestion: "Welcome! Today we're exploring **Linear Equations**. Imagine you have a mystery box of mangoes. If you add 5 mangoes to it, you get double what you had minus 3 mangoes. How would you write this relationship as a mathematical equation? What does the variable represent?",
        quizzes: [
          {
            question: "What is the value of x in the equation: 2x + 5 = 15?",
            options: ["x = 5", "x = 10", "x = 15", "x = 20"],
            answerIndex: 0,
            explanation: "Subtract 5 from both sides: 2x = 10. Divide by 2: x = 5."
          },
          {
            question: "If 3x - 7 = x + 9, what is the value of x?",
            options: ["x = 4", "x = 8", "x = 10", "x = 16"],
            answerIndex: 1,
            explanation: "Subtract x from both sides: 2x - 7 = 9. Add 7: 2x = 16. Divide by 2: x = 8."
          },
          {
            question: "The equation y = mx + c represents a:",
            options: ["Quadratic curve", "Straight line", "Circle", "Parabola"],
            answerIndex: 1,
            explanation: "y = mx + c is the slope-intercept form representing a straight line (linear equation)."
          },
          {
            question: "In the expression 4x + 3, what is 'x' called?",
            options: ["Constant", "Coefficient", "Variable", "Exponent"],
            answerIndex: 2,
            explanation: "'x' is a variable because its value can change. '4' is the coefficient, and '3' is the constant."
          },
          {
            question: "If a number is multiplied by 3 and then increased by 7, the result is 22. What is the number?",
            options: ["x = 3", "x = 5", "x = 7", "x = 9"],
            answerIndex: 1,
            explanation: "Let the number be x. 3x + 7 = 22. Subtract 7: 3x = 15. Divide by 3: x = 5."
          }
        ]
      }
    ]
  },
  physics: {
    title: "Physics",
    chapters: [
      {
        id: "reflection-mirrors",
        name: "Reflection & Mirrors",
        objective: "Understand light behavior on flat/curved surfaces and image formation.",
        progress: [
          { id: 1, label: "Properties of Light", status: "completed" },
          { id: 2, label: "Reflection & Mirrors", status: "active" },
          { id: 3, label: "Refraction & Lenses", status: "upcoming" }
        ],
        chips: ["Parabolic mirrors", "Focal point plane mirror", "Lenses vs. Mirrors"],
        initialQuestion: "Welcome! Today we're exploring **Reflection and Mirrors**. Let's start with a puzzle: when you look in a mirror, your left hand looks like your right hand. But why doesn't your head look like your feet? Why does the mirror invert left-to-right but not top-to-bottom?",
        quizzes: [
          {
            question: "According to the Law of Reflection, the angle of incidence is:",
            options: ["Greater than angle of reflection", "Less than angle of reflection", "Equal to angle of reflection", "Double of angle of reflection"],
            answerIndex: 2,
            explanation: "The first law of reflection states that the angle of incidence equals the angle of reflection (i = r)."
          },
          {
            question: "Which type of mirror is commonly used as a rear-view mirror in vehicles?",
            options: ["Plane mirror", "Concave mirror", "Convex mirror", "Parabolic mirror"],
            answerIndex: 2,
            explanation: "Convex mirrors diverge light and provide a wider field of view, making them ideal for vehicles."
          },
          {
            question: "The focal length of a plane mirror is:",
            options: ["Zero", "Infinite", "10 cm", "Dependent on distance"],
            answerIndex: 1,
            explanation: "Since a plane mirror has no curvature, its focal point lies at infinity."
          },
          {
            question: "Dentists use which type of mirror to see larger images of teeth?",
            options: ["Plane mirror", "Concave mirror", "Convex mirror", "Double mirror"],
            answerIndex: 1,
            explanation: "Concave mirrors form a magnified, virtual, and erect image when objects are placed close to them."
          },
          {
            question: "What is the speed of light in a vacuum?",
            options: ["3,000 km/s", "300,000 km/s", "30,000 km/s", "3,000,000 km/s"],
            answerIndex: 1,
            explanation: "Light travels at approximately 300,000 km/s (or 3 x 10^8 m/s) in a vacuum."
          }
        ]
      }
    ]
  },
  history: {
    title: "History",
    chapters: [
      {
        id: "salt-march",
        name: "Salt March & Civil Disobedience",
        objective: "Understand why Gandhi chose salt as a symbol and connect historical protest to modern movements.",
        progress: [
          { id: 1, label: "Causes of Civil Disobedience", status: "completed" },
          { id: 2, label: "The Salt March", status: "active" },
          { id: 3, label: "Impact & Legacy", status: "upcoming" }
        ],
        chips: ["Maybe to show defiance?", "Petitions didn't work before...", "Taki sab log jud sakein?"],
        initialQuestion: "Welcome! Today we're exploring the **Salt March of 1930**. Let's start with a big question: Gandhi had many options to protest British rule — petitions, boycotts, armed rebellion. Why do you think he chose *salt* as the symbol for his protest?",
        quizzes: [
          {
            question: "In which year did the Salt March take place?",
            options: ["1920", "1930", "1942", "1947"],
            answerIndex: 1,
            explanation: "The Salt March (also known as the Dandi March) took place from March to April 1930."
          },
          {
            question: "Which Ashram did Gandhi start the Salt March from?",
            options: ["Sabarmati Ashram", "Sevagram Ashram", "Phoenix Settlement", "Tolstoy Farm"],
            answerIndex: 0,
            explanation: "Gandhi started the march from Sabarmati Ashram in Ahmedabad."
          },
          {
            question: "What was the length of the Salt March in miles?",
            options: ["120 miles", "240 miles", "360 miles", "400 miles"],
            answerIndex: 1,
            explanation: "The march spanned 240 miles (approx. 385 km) from Ahmedabad to Dandi."
          },
          {
            question: "Who was the British Viceroy during the Salt March?",
            options: ["Lord Curzon", "Lord Mountbatten", "Lord Irwin", "Lord Chelmsford"],
            answerIndex: 2,
            explanation: "Lord Irwin was the Viceroy of India from 1926 to 1931."
          },
          {
            question: "Which Act gave the British government a monopoly on salt?",
            options: ["The Salt Tax Act", "The Indian Salt Act of 1882", "The Rowlatt Act", "The Dandi Monopoly Act"],
            answerIndex: 1,
            explanation: "The Indian Salt Act of 1882 gave the British government a monopoly on manufacturing and selling salt."
          }
        ]
      }
    ]
  },
  science: {
    title: "Science",
    chapters: [
      {
        id: "chemical-reactions",
        name: "Chemical Reactions & Equations",
        objective: "Understand chemical equations, balanced reactions, and types of reactions.",
        progress: [
          { id: 1, label: "Writing Chemical Equations", status: "completed" },
          { id: 2, label: "Balancing Equations", status: "active" },
          { id: 3, label: "Types of Chemical Reactions", status: "upcoming" }
        ],
        chips: ["Law of Conservation of Mass", "Why do we balance equations?", "Rusting of iron"],
        initialQuestion: "Welcome! Today we are exploring **Chemical Reactions and Equations**. When iron rusts or milk turns sour, a chemical change occurs. Why do we need to balance a chemical equation? What law of physics are we satisfying when we do so?",
        quizzes: [
          {
            question: "Which of the following is a physical change?",
            options: ["Melting of ice", "Rusting of iron", "Cooking of food", "Souring of milk"],
            answerIndex: 0,
            explanation: "Melting of ice is a physical change because water changes its state, but no new chemical substance is formed."
          },
          {
            question: "A balanced chemical equation is in accordance with the law of:",
            options: ["Conservation of mass", "Multiple proportion", "Constant proportion", "Gaseous volumes"],
            answerIndex: 0,
            explanation: "A chemical equation must be balanced to satisfy the Law of Conservation of Mass, which states mass cannot be created or destroyed."
          },
          {
            question: "The reaction in which heat is released along with products is called:",
            options: ["Endothermic reaction", "Exothermic reaction", "Photochemical reaction", "Electrolytic reaction"],
            answerIndex: 1,
            explanation: "Reactions that release heat energy into their surroundings are known as exothermic reactions."
          },
          {
            question: "What is the chemical formula of rust?",
            options: ["Fe2O3 . xH2O", "Fe3O4", "FeO", "Fe(OH)2"],
            answerIndex: 0,
            explanation: "Rust is hydrated iron(III) oxide, written chemically as Fe2O3 . xH2O."
          },
          {
            question: "When magnesium ribbon is burnt in air, the ash formed is:",
            options: ["Black", "White", "Yellow", "Blue"],
            answerIndex: 1,
            explanation: "Magnesium burns with a dazzling white flame to form a white powder, magnesium oxide (MgO)."
          }
        ]
      }
    ]
  },
  chemistry: {
    title: "Chemistry",
    chapters: [
      {
        id: "atomic-structure",
        name: "Structure of Atom",
        objective: "Explore subatomic particles, Bohr's model, and quantum numbers.",
        progress: [
          { id: 1, label: "Subatomic Particles", status: "completed" },
          { id: 2, label: "Bohr's Atomic Model", status: "active" },
          { id: 3, label: "Quantum Numbers", status: "upcoming" }
        ],
        chips: ["Electrostatic attraction", "Quantized energy levels", "Why electrons don't fall"],
        initialQuestion: "Welcome! Today we are exploring the **Structure of Atom**. Atoms were once thought to be indivisible, but we now know they contain protons, neutrons, and electrons. Why do electrons stay in specific orbits instead of spiraling into the nucleus? What force keeps them there?",
        quizzes: [
          {
            question: "Who discovered the electron?",
            options: ["J.J. Thomson", "Rutherford", "Chadwick", "Goldstein"],
            answerIndex: 0,
            explanation: "J.J. Thomson discovered the electron in 1897 through cathode ray experiments."
          },
          {
            question: "Rutherford's alpha particle scattering experiment led to the discovery of:",
            options: ["Electron", "Proton", "Atomic nucleus", "Neutron"],
            answerIndex: 2,
            explanation: "The scattering of alpha particles showed that most of the mass and positive charge is concentrated in a tiny central region, the nucleus."
          },
          {
            question: "The maximum number of electrons that can be accommodated in the outermost shell is:",
            options: ["2", "8", "18", "32"],
            answerIndex: 1,
            explanation: "According to the Octet Rule, the maximum number of electrons in the outermost valence shell is 8."
          },
          {
            question: "An element has an atomic number of 11. Its electronic configuration is:",
            options: ["2, 8, 1", "2, 8, 2", "2, 9", "8, 2, 1"],
            answerIndex: 0,
            explanation: "Atomic number 11 (Sodium) fills the K-shell (2), L-shell (8), and M-shell (1), giving 2, 8, 1."
          },
          {
            question: "Neutrons were discovered by:",
            options: ["J. Chadwick", "J.J. Thomson", "Goldstein", "Rutherford"],
            answerIndex: 0,
            explanation: "James Chadwick discovered the neutron in 1932 as a neutral particle in the atomic nucleus."
          }
        ]
      }
    ]
  },
  biology: {
    title: "Biology",
    chapters: [
      {
        id: "living-world",
        name: "The Living World",
        objective: "Examine characteristics of living organisms, taxonomy, and binomial nomenclature.",
        progress: [
          { id: 1, label: "Characteristics of Life", status: "completed" },
          { id: 2, label: "Binomial Nomenclature", status: "active" },
          { id: 3, label: "Taxonomic Hierarchy", status: "upcoming" }
        ],
        chips: ["Metabolism defines life", "Binomial naming rules", "Is a virus alive?"],
        initialQuestion: "Welcome! Today we are exploring **The Living World**. What defines something as 'alive'? Is it growth, reproduction, or metabolism? Why do we need a scientific naming system for organisms?",
        quizzes: [
          {
            question: "Who is known as the father of taxonomy?",
            options: ["Aristotle", "Carolus Linnaeus", "Darwin", "Mendel"],
            answerIndex: 1,
            explanation: "Carolus Linnaeus developed the system of classification and binomial nomenclature, making him the father of taxonomy."
          },
          {
            question: "Which of the following is a defining feature of living organisms?",
            options: ["Growth", "Reproduction", "Metabolism", "Movement"],
            answerIndex: 2,
            explanation: "Metabolism is a defining feature because all living things perform chemical reactions, whereas non-living things (like crystals or mountains) can grow or move under external forces."
          },
          {
            question: "The scientific naming of an organism contains two parts: the ______ and the ______.",
            options: ["Family, Genus", "Genus, Species", "Class, Order", "Species, Variety"],
            answerIndex: 1,
            explanation: "Binomial nomenclature names organisms using their Genus (capitalized) and Species (lowercase)."
          },
          {
            question: "What is the correct order of taxonomic hierarchy from lowest to highest?",
            options: ["Species -> Genus -> Family -> Order -> Class -> Phylum -> Kingdom", "Kingdom -> Phylum -> Class -> Order -> Family -> Genus -> Species", "Species -> Family -> Genus -> Class -> Order -> Phylum -> Kingdom", "Phylum -> Class -> Order -> Family -> Genus -> Species -> Kingdom"],
            answerIndex: 0,
            explanation: "The hierarchy from lowest to highest starts with Species, up through Genus, Family, Order, Class, Phylum, to Kingdom."
          },
          {
            question: "In Mangifera indica (Mango), 'indica' represents the:",
            options: ["Generic name", "Specific epithet", "Family name", "Class name"],
            answerIndex: 1,
            explanation: "In Mangifera indica, 'Mangifera' is the genus, and 'indica' is the specific epithet."
          }
        ]
      }
    ]
  },
  history_class10: {
    title: "History",
    chapters: [
      {
        id: "rise-nationalism-europe",
        name: "The Rise of Nationalism in Europe",
        objective: "Understand the rise of nationalism in Europe, French Revolution, Napoleon, and Italian/German unification.",
        progress: [
          { id: 1, label: "The French Revolution and the Idea of the Nation", status: "completed" },
          { id: 2, label: "The Making of Nationalism in Europe", status: "active" },
          { id: 3, label: "Unification of Germany and Italy", status: "upcoming" }
        ],
        chips: ["Frédéric Sorrieu", "Treaty of Vienna", "Unification of Italy & Germany"],
        initialQuestion: "Welcome! Today we are starting **The Rise of Nationalism in Europe**. Have you ever wondered how Europe, once a patchwork of massive empires ruled by royal families, transformed into a map of separate countries? How did people start feeling like they belonged to a 'nation'? What do you think binds a group of people together as a country?",
        quizzes: [
          {
            question: "What did Frédéric Sorrieu's prints depict in 1848?",
            options: ["A world made of democratic and social republics", "The industrial revolution in England", "The partition of Germany", "The conquest of the Americas"],
            answerIndex: 0,
            explanation: "Sorrieu's series of prints visualized his dream of a world made of democratic and social republics."
          },
          {
            question: "Which country's revolution in 1789 marked the first clear expression of nationalism?",
            options: ["Germany", "Italy", "France", "Greece"],
            answerIndex: 2,
            explanation: "The French Revolution of 1789 was the first clear expression of nationalism."
          },
          {
            question: "What did the Napoleonic Code of 1804 establish?",
            options: ["Feudal privileges for the nobility", "Equality before the law and right to property", "Restricted trade guild systems", "Limited freedom of press"],
            answerIndex: 1,
            explanation: "The Civil Code of 1804 (Napoleonic Code) established equality before the law and secured the right to property."
          },
          {
            question: "Who founded the underground societies 'Young Italy' and 'Young Europe'?",
            options: ["Giuseppe Mazzini", "Count Cavour", "Otto von Bismarck", "Giuseppe Garibaldi"],
            answerIndex: 0,
            explanation: "Giuseppe Mazzini founded 'Young Italy' in Marseilles and 'Young Europe' in Berne to promote republican unification."
          },
          {
            question: "What was the main objective of the Treaty of Vienna in 1815?",
            options: ["To declare war on Russia", "To undo most of the changes brought about by the Napoleonic wars", "To unify Germany", "To grant independence to Greece"],
            answerIndex: 1,
            explanation: "The Treaty of Vienna (1815) aimed to restore Bourbon dynasties and undo changes made during the Napoleonic wars."
          }
        ]
      },
      {
        id: "nationalism-india",
        name: "Nationalism in India",
        objective: "Explore the First World War, Satyagraha, Non-Cooperation, Civil Disobedience, and Salt March in India.",
        progress: [
          { id: 1, label: "The Rowlatt Act & Satyagraha", status: "completed" },
          { id: 2, label: "Non-Cooperation Movement", status: "active" },
          { id: 3, label: "Towards Civil Disobedience", status: "upcoming" }
        ],
        chips: ["Maybe to show defiance?", "Petitions didn't work before...", "Taki sab log jud sakein?"],
        initialQuestion: "Welcome! Today we're exploring the **Salt March of 1930**. Let's start with a big question: Gandhi had many options to protest British rule — petitions, boycotts, armed rebellion. Why do you think he chose *salt* as the symbol for his protest?",
        quizzes: [
          {
            question: "What is the core meaning of Mahatma Gandhi's concept of Satyagraha?",
            options: ["Passive resistance through physical force", "The power of truth and the search for truth", "Violent protests against unjust laws", "Boycotting all foreign merchandise"],
            answerIndex: 1,
            explanation: "Satyagraha emphasized the power of truth and suggested that if the cause was true, physical force was not necessary."
          },
          {
            question: "Why did the Rowlatt Act of 1919 cause widespread anger in India?",
            options: ["It banned the import of salt", "It allowed detention of political prisoners without trial for up to two years", "It forced farmers to grow indigo", "It increased taxes on Indian textile goods"],
            answerIndex: 1,
            explanation: "The Rowlatt Act gave the government enormous powers to repress political activities and detain prisoners without trial."
          },
          {
            question: "In which city did the tragic Jallianwala Bagh massacre take place in April 1919?",
            options: ["Amritsar", "Lahore", "Delhi", "Calcutta"],
            answerIndex: 0,
            explanation: "The massacre took place at Jallianwala Bagh in Amritsar, Punjab, under the orders of General Dyer."
          },
          {
            question: "Why did Mahatma Gandhi call off the Non-Cooperation Movement in February 1922?",
            options: ["Due to the Chauri Chaura violent incident", "Due to the success of the Salt March", "Because the British accepted all demands", "Because of his arrest by the police"],
            answerIndex: 0,
            explanation: "Gandhi withdrew the movement after a violent clash occurred at Chauri Chaura in Gorakhpur where a police station was set on fire."
          },
          {
            question: "Which historic march marked the beginning of the Civil Disobedience Movement?",
            options: ["The Dandi March", "The Champaran March", "The Kheda March", "The Rowlatt March"],
            answerIndex: 0,
            explanation: "Mahatma Gandhi started the Dandi Salt March on 12 March 1930, breaking the salt law on 6 April 1930, which initiated the Civil Disobedience Movement."
          }
        ]
      },
      {
        id: "making-global-world",
        name: "The Making of a Global World",
        objective: "Analyze pre-modern trade, 19th-century economy, indentured migration, and post-war reconstruction.",
        progress: [
          { id: 1, label: "Silk Routes and Pre-modern World", status: "completed" },
          { id: 2, label: "19th Century Expansion & Colonisation", status: "active" },
          { id: 3, label: "Bretton Woods System", status: "upcoming" }
        ],
        chips: ["Silk Routes", "Conquest by Disease", "Bretton Woods twins"],
        initialQuestion: "Welcome! Today we are exploring **The Making of a Global World**. Today, we can eat noodles in India, wear clothes made in Bangladesh, and chat with friends in the US instantly. But globalization isn't new! Did you know Silk Routes connected Asia, Europe, and Africa over 2,000 years ago? How do you think diseases, food, and trade shaped our history?",
        quizzes: [
          {
            question: "Which food item is believed to have travelled from China to Europe to become spaghetti?",
            options: ["Potatoes", "Noodles", "Tomatoes", "Soybeans"],
            answerIndex: 1,
            explanation: "Noodles are believed to have travelled west from China to become spaghetti."
          },
          {
            question: "Which disease carried by Spanish conquerors decimated the native populations of America in the 16th century?",
            options: ["Smallpox", "Cholera", "Plague", "Influenza"],
            answerIndex: 0,
            explanation: "Smallpox, to which native Americans had no immunity, proved to be a deadly conqueror."
          },
          {
            question: "What were the 'Corn Laws' in 19th-century Britain?",
            options: ["Laws restricting the import of corn", "Laws forcing farmers to grow corn", "Taxes levied on domestic corn production", "Subsidies given to corn exporters"],
            answerIndex: 0,
            explanation: "The Corn Laws restricted the import of food grains (corn) into Britain to protect local landowners."
          },
          {
            question: "What does the term 'Indentured Labour' refer to?",
            options: ["Free workers migrating for jobs", "A bonded labourer under contract to work for an employer for a specific time", "Enslaved prisoners of war", "Local agricultural labourers"],
            answerIndex: 1,
            explanation: "Indentured labour refers to bonded labour under contract to work for an employer in a new country for a specific amount of time."
          },
          {
            question: "Which two international financial institutions are known as the 'Bretton Woods twins'?",
            options: ["UN and WTO", "IMF and World Bank", "WHO and UNESCO", "EU and NATO"],
            answerIndex: 1,
            explanation: "The International Monetary Fund (IMF) and the World Bank are referred to as the Bretton Woods institutions or Bretton Woods twins."
          }
        ]
      },
      {
        id: "age-industrialisation",
        name: "The Age of Industrialisation",
        objective: "Understand proto-industrialisation, steam power, colonies expansion, and labor in textile industry.",
        progress: [
          { id: 1, label: "Proto-Industrialisation Era", status: "completed" },
          { id: 2, label: "Colonial Weavers & Gomasthas", status: "active" },
          { id: 3, label: "Factories and Livelihoods", status: "upcoming" }
        ],
        chips: ["Proto-industrialisation", "Gomasthas paid agents", "Spinning Jenny opposition"],
        initialQuestion: "Welcome! Today we are exploring **The Age of Industrialisation**. When we think of factories, we think of massive steam engines and assembly lines. But did you know there was a time when large-scale industrial production happened in countryside homes without any factories? How did weavers adapt when machines started spinning yarn much faster? Let's explore!",
        quizzes: [
          {
            question: "What is the period of industrialisation before the coming of factories called?",
            options: ["Post-industrialisation", "Proto-industrialisation", "Neo-industrialisation", "Pre-capitalism"],
            answerIndex: 1,
            explanation: "Proto-industrialisation refers to the phase of large-scale industrial production for international markets before factories."
          },
          {
            question: "Who invented the Steam Engine that was later improved by James Watt?",
            options: ["Richard Arkwright", "Newcomen", "John Kay", "Hargreaves"],
            answerIndex: 1,
            explanation: "Newcomen produced the initial steam engine, which was later modified and patented by James Watt in 1781."
          },
          {
            question: "Who was a 'Gomastha' in the context of Indian textile trade?",
            options: ["A local merchant exporter", "A paid servant appointed by the East India Company to supervise weavers", "A traditional head weaver", "A cotton plantation owner"],
            answerIndex: 1,
            explanation: "Gomasthas were paid agents appointed by the British East India Company to eliminate middle traders, supervise weavers, and collect supplies."
          },
          {
            question: "Why did women workers in Britain attack the Spinning Jenny when it was introduced?",
            options: ["It was dangerous to operate", "It reduced employment opportunities in hand spinning", "It produced low-quality yarn", "It was too expensive"],
            answerIndex: 1,
            explanation: "Women opposed the Spinning Jenny because it automated spinning, threatening their jobs and traditional hand-spinning livelihoods."
          },
          {
            question: "Where was the first Indian cotton mill established in 1854?",
            options: ["Bombay", "Calcutta", "Madras", "Ahmedabad"],
            answerIndex: 0,
            explanation: "The first cotton mill in India was set up in Bombay in 1854 and went into production two years later."
          }
        ]
      },
      {
        id: "print-culture-modern-world",
        name: "Print Culture and The Modern World",
        objective: "Trace the evolution of printing, from woodblocks in China to metal press in Europe, and print spread in India.",
        progress: [
          { id: 1, label: "Woodblock and Hand Printing", status: "completed" },
          { id: 2, label: "Gutenberg's Printing Press", status: "active" },
          { id: 3, label: "Print Revolution in India", status: "upcoming" }
        ],
        chips: ["Movable metal type", "95 Theses of Luther", "Raja Rammohun Roy print"],
        initialQuestion: "Welcome! Today we are exploring **Print Culture and The Modern World**. Can you imagine a world without books, newspapers, posters, or school textbooks? Before printing presses, every book was handwritten by scribes, making them super rare. How did the invention of printing change the way people thought, spread political ideas, and even challenged religious rules?",
        quizzes: [
          {
            question: "Which country developed the earliest print technology using woodblocks?",
            options: ["India", "China", "Germany", "England"],
            answerIndex: 1,
            explanation: "The earliest kind of print technology was developed in China, Japan, and Korea, using hand printing on woodblocks."
          },
          {
            question: "Who developed the first printing press with movable metal types in Germany?",
            options: ["Johann Gutenberg", "Marco Polo", "Martin Luther", "Erasmus"],
            answerIndex: 0,
            explanation: "Johann Gutenberg developed the first printing press in Strasbourg, Germany, in the 1440s."
          },
          {
            question: "What was the first book printed by Johann Gutenberg on his press?",
            options: ["The Quran", "The Gutenberg Bible", "The Communist Manifesto", "A Latin Grammar"],
            answerIndex: 1,
            explanation: "The Bible was the first book printed by Gutenberg; he printed about 180 copies of it."
          },
          {
            question: "Who wrote the famous 95 Theses in 1517 challenging the Catholic Church?",
            options: ["John Calvin", "Martin Luther", "Jean-Jacques Rousseau", "Voltaire"],
            answerIndex: 1,
            explanation: "Martin Luther wrote 95 Theses criticizing the purchase of indulgences, posting them on a church door in Wittenberg."
          },
          {
            explanation: "Raja Rammohun Roy published the Sambad Kaumudi in Bengali to spread social reformist ideas."
          }
        ]
      }
    ]
  },
  science_class6: {
    title: "Science",
    chapters: [
      {
        id: "wonderful-world-science",
        name: "The Wonderful World of Science",
        objective: "Explore the nature of science, scientific method, observation, questioning, and basic laboratory safety.",
        progress: [
          { id: 1, label: "What is Science?", status: "completed" },
          { id: 2, label: "Observations and Questions", status: "active" },
          { id: 3, label: "Designing simple experiments", status: "upcoming" }
        ],
        chips: ["Why is the sky blue?", "How do birds fly?", "Why does ice melt?"],
        initialQuestion: "Welcome to the magical world of Science! Have you ever wondered why leaves are green, or why a ball thrown up always falls back down? Science starts with asking questions. What is one question about the world around you that you have always wanted to answer?",
        quizzes: [
          {
            question: "What is the first step in scientific study?",
            options: ["Drawing conclusions", "Asking questions and making observations", "Writing a report", "Selling an invention"],
            answerIndex: 1,
            explanation: "Scientific study always begins with asking questions and observing the world."
          },
          {
            question: "Which of our senses helps us observe the color and shape of a flower?",
            options: ["Hearing", "Sight", "Touch", "Smell"],
            answerIndex: 1,
            explanation: "We use our sense of sight to observe colors, shapes, and sizes."
          },
          {
            question: "Why do we perform scientific experiments?",
            options: ["To test our ideas and find answers", "To make a mess", "To pass exams only", "To memorize facts"],
            answerIndex: 0,
            explanation: "Experiments are designed to test our hypotheses/ideas and discover answers."
          },
          {
            question: "What should you do first before touching any chemical in a science lab?",
            options: ["Taste it to check", "Ask your teacher for guidance", "Mix it with water", "Smell it directly"],
            answerIndex: 1,
            explanation: "You must always ask your teacher for guidance before handling laboratory chemicals."
          },
          {
            question: "Science is best described as:",
            options: ["A collection of unchangeable rules", "A systematic way of exploring and understanding nature", "Only for grown-up inventors", "A magic trick"],
            answerIndex: 1,
            explanation: "Science is a systematic process of exploring, questioning, and understanding the natural world."
          }
        ]
      },
      {
        id: "diversity-living-world",
        name: "Diversity in the Living World",
        objective: "Understand plants and animals classification, habitats, biodiversity, and desert adaptions.",
        progress: [
          { id: 1, label: "Exploring Plants", status: "completed" },
          { id: 2, label: "Exploring Animals", status: "active" },
          { id: 3, label: "Grouping living organisms", status: "upcoming" }
        ],
        chips: ["How many types of plants are there?", "Can plants move?", "Why do we group animals?"],
        initialQuestion: "Look around you—from tiny ants to giant trees, life comes in so many shapes and sizes! This is called biodiversity. How do you think scientists group or organize all these different living things so they are easier to study? What makes a plant different from an animal?",
        quizzes: [
          {
            question: "Plants that have weak stems and take support on neighboring structures are called:",
            options: ["Herbs", "Shrubs", "Climbers", "Trees"],
            answerIndex: 2,
            explanation: "Climbers use support structures to climb up, while creepers spread on the ground."
          },
          {
            question: "Which of the following is a characteristic of all living organisms?",
            options: ["They can fly", "They need food, air, and water", "They remain the same size forever", "They do not breathe"],
            answerIndex: 1,
            explanation: "All living things need nutrition, respiration, and water to survive."
          },
          {
            question: "Animals that eat only plants are classified as:",
            options: ["Carnivores", "Omnivores", "Herbivores", "Decomposers"],
            answerIndex: 2,
            explanation: "Herbivores are plant-eating animals. Carnivores eat other animals."
          },
          {
            question: "What is the natural home of a plant or animal called?",
            options: ["Habit", "Habitat", "Territory", "Adaptation"],
            answerIndex: 1,
            explanation: "A habitat is the natural environment where an organism lives, grows, and reproduces."
          },
          {
            question: "Why do desert plants like cacti have spiny leaves?",
            options: ["To look beautiful", "To reduce water loss", "To catch insects", "To breathe faster"],
            answerIndex: 1,
            explanation: "Cacti leaves are modified into spines to minimize water loss through transpiration in hot deserts."
          }
        ]
      },
      {
        id: "mindful-eating",
        name: "Mindful Eating: A Path to a Healthy Body",
        objective: "Learn about nutrients, proteins, vitamins, dietary fibers, and a balanced diet.",
        progress: [
          { id: 1, label: "Nutrients in Food", status: "completed" },
          { id: 2, label: "Energy-giving foods", status: "active" },
          { id: 3, label: "Balanced Diet & Health", status: "upcoming" }
        ],
        chips: ["What are carbohydrates?", "Why are vitamins important?", "What is a junk food?"],
        initialQuestion: "We eat delicious food every day to run, play, and think. But have you ever wondered what is inside our food that gives us energy? These are called nutrients. What do you think happens if we eat only potato chips and no vegetables? What is a balanced diet?",
        quizzes: [
          {
            question: "Which nutrient is the primary source of energy for our body?",
            options: ["Proteins", "Carbohydrates", "Vitamins", "Minerals"],
            answerIndex: 1,
            explanation: "Carbohydrates and fats are energy-giving nutrients."
          },
          {
            question: "Which nutrient is known as a 'body-building' nutrient?",
            options: ["Fats", "Carbohydrates", "Proteins", "Water"],
            answerIndex: 2,
            explanation: "Proteins are essential for growth and repair of cells in our body."
          },
          {
            question: "Lack of Vitamin C in our diet causes which disease?",
            options: ["Scurvy", "Rickets", "Beriberi", "Goitre"],
            answerIndex: 0,
            explanation: "Deficiency of Vitamin C leads to Scurvy, causing bleeding gums."
          },
          {
            question: "Why is dietary fibre (roughage) important in our food?",
            options: ["It gives us extra energy", "It helps our body get rid of undigested food", "It makes our bones strong", "It contains proteins"],
            answerIndex: 1,
            explanation: "Roughage does not provide nutrients, but it helps in digestion and clearing undigested waste."
          },
          {
            question: "A diet containing all the required nutrients in correct proportions is called:",
            options: ["Heavy diet", "Balanced diet", "Fast food diet", "Liquid diet"],
            answerIndex: 1,
            explanation: "A balanced diet provides all nutrients, water, and roughage in the right amounts."
          }
        ]
      },
      {
        id: "exploring-magnets",
        name: "Exploring Magnets",
        objective: "Understand poles of magnets, magnetic/non-magnetic materials, finding directions, attraction, and repulsion.",
        progress: [
          { id: 1, label: "Discovery of Magnets", status: "completed" },
          { id: 2, label: "Magnetic and Non-magnetic", status: "active" },
          { id: 3, label: "Attraction and Repulsion", status: "upcoming" }
        ],
        chips: ["What are magnetic materials?", "Why are there North and South poles?", "How is a magnet made?"],
        initialQuestion: "Magnets are like magic! They can pull objects toward them without even touching them. Have you ever played with a magnet? What kinds of materials do you think a magnet can attract? Why do magnets always point in a specific direction when hung freely?",
        quizzes: [
          {
            question: "Which of the following materials is attracted by a magnet?",
            options: ["Plastic cup", "Iron nail", "Wooden ruler", "Paper sheet"],
            answerIndex: 1,
            explanation: "Iron, nickel, and cobalt are magnetic materials and are attracted by magnets."
          },
          {
            question: "Every magnet, no matter its shape, has how many poles?",
            options: ["One", "Two", "Three", "Four"],
            answerIndex: 1,
            explanation: "Every magnet has exactly two poles: a North pole and a South pole."
          },
          {
            question: "What happens when the North pole of one magnet is brought close to the North pole of another?",
            options: ["They attract each other", "They repel each other", "Nothing happens", "They turn into wood"],
            answerIndex: 1,
            explanation: "Like poles (North-North or South-South) repel, while opposite poles (North-South) attract."
          },
          {
            question: "A freely suspended magnet always comes to rest pointing in which direction?",
            options: ["East-West", "North-South", "Up-Down", "Randomly"],
            answerIndex: 1,
            explanation: "Due to Earth's magnetic field, a freely suspended magnet aligns in the North-South direction."
          },
          {
            question: "Which device uses a magnetic needle to help travelers find directions?",
            options: ["Thermometer", "Barometer", "Compass", "Speedometer"],
            answerIndex: 2,
            explanation: "A magnetic compass uses a freely rotating magnetic needle to find geographical directions."
          }
        ]
      },
      {
        id: "measurement-length-motion",
        name: "Measurement of Length and Motion",
        objective: "Understand measurement history, standard units of length (meter), correction, and rectilinear/periodic motion.",
        progress: [
          { id: 1, label: "History of Measurement", status: "completed" },
          { id: 2, label: "Standard Units of Measurement", status: "active" },
          { id: 3, label: "Types of Motion", status: "upcoming" }
        ],
        chips: ["What is SI unit?", "Why did standard units start?", "What are types of motion?"],
        initialQuestion: "How do you know how tall you are, or how far your school is? We need to measure! Long ago, people used hand-spans or footsteps. Why do you think we now use standard units like meters and centimeters? What happens if everyone uses their own footsteps to measure a desk?",
        quizzes: [
          {
            question: "What is the SI (International System) unit of length?",
            options: ["Foot", "Inch", "Meter", "Yard"],
            answerIndex: 2,
            explanation: "The meter (m) is the standard SI unit of length."
          },
          {
            question: "Which type of motion is shown by a falling apple?",
            options: ["Circular motion", "Rectilinear motion", "Periodic motion", "Rotational motion"],
            answerIndex: 1,
            explanation: "Rectilinear motion is motion along a straight line path."
          },
          {
            question: "The motion of a child on a swing is an example of:",
            options: ["Rectilinear motion", "Periodic motion", "Circular motion", "Non-periodic motion"],
            answerIndex: 1,
            explanation: "Periodic motion repeats itself at regular intervals of time, like a swing or pendulum."
          },
          {
            question: "How many centimeters are there in 2 meters?",
            options: ["20 cm", "200 cm", "2000 cm", "2 cm"],
            answerIndex: 1,
            explanation: "Since 1 meter = 100 centimeters, 2 meters = 200 centimeters."
          },
          {
            question: "The motion of a wheel on a moving bicycle is:",
            options: ["Only rectilinear", "Only circular", "Both circular and rectilinear", "Periodic"],
            answerIndex: 2,
            explanation: "The wheel rotates (circular motion) and moves forward along the road (rectilinear motion)."
          }
        ]
      },
      {
        id: "materials-around-us",
        name: "Materials Around Us",
        objective: "Examine transparency (opaque/translucent/transparent), solubility, hardness, luster, and density.",
        progress: [
          { id: 1, label: "Grouping Materials", status: "completed" },
          { id: 2, label: "Hardness and Solubility", status: "active" },
          { id: 3, label: "Transparency Properties", status: "upcoming" }
        ],
        chips: ["What is transparency?", "Why do some things float?", "What is luster?"],
        initialQuestion: "Look at the objects around you—a steel spoon, a wooden chair, a plastic bucket. Why do you think a bucket is made of plastic and not paper? How do we choose the right material to make an object? Let's explore how materials are grouped based on their properties!",
        quizzes: [
          {
            question: "Materials that allow light to pass through them completely are called:",
            options: ["Opaque", "Transparent", "Translucent", "Soluble"],
            answerIndex: 1,
            explanation: "Transparent materials (like clear glass or water) allow light to pass through completely, making things behind them clearly visible."
          },
          {
            question: "Which of the following is soluble in water?",
            options: ["Chalk powder", "Sand", "Sugar", "Sawdust"],
            answerIndex: 2,
            explanation: "Sugar dissolves completely in water, making it a soluble substance."
          },
          {
            question: "Why is gold used to make jewelry?",
            options: ["Because it is transparent", "Because it is lustrous (shiny)", "Because it floats on water", "Because it is very soft"],
            answerIndex: 1,
            explanation: "Gold is a metal with a bright, shiny surface (luster), which makes it popular for jewelry."
          },
          {
            question: "An object made of which material will sink in water?",
            options: ["A dry leaf", "A plastic toy", "An iron key", "A piece of cork"],
            answerIndex: 2,
            explanation: "Iron is denser than water, so an iron key will sink, whereas dry leaves and cork float."
          },
          {
            question: "Materials through which we cannot see at all are called:",
            options: ["Transparent", "Translucent", "Opaque", "Lustrous"],
            answerIndex: 2,
            explanation: "Opaque materials (like wood, cardboard, or metals) do not allow any light to pass through them."
          }
        ]
      },
      {
        id: "temperature-measurement",
        name: "Temperature and its Measurement",
        objective: "Understand body temperature, clinical vs. laboratory thermometer, mercury expansion, and Celsius/Fahrenheit scales.",
        progress: [
          { id: 1, label: "Understanding Temperature", status: "completed" },
          { id: 2, label: "Clinical Thermometer", status: "active" },
          { id: 3, label: "Laboratory Thermometer", status: "upcoming" }
        ],
        chips: ["What is temperature?", "Clinical vs. Laboratory Thermometer", "Why does mercury rise?"],
        initialQuestion: "How do you know if a cup of milk is hot or a bowl of soup is warm? Our touch can give us a guess, but it isn't always accurate. How do we measure hotness precisely? What is temperature, and how does a thermometer work?",
        quizzes: [
          {
            question: "Temperature is a measure of:",
            options: ["The weight of an object", "The degree of hotness or coldness of an object", "The speed of an object", "The color of an object"],
            answerIndex: 1,
            explanation: "Temperature is the quantitative measure of how hot or cold a body is."
          },
          {
            question: "What is the normal temperature of a healthy human body in Celsius?",
            options: ["98.6°C", "37°C", "0°C", "100°C"],
            answerIndex: 1,
            explanation: "The normal human body temperature is 37°C (or 98.6°F)."
          },
          {
            question: "Which liquid is commonly used in traditional thermometers?",
            options: ["Water", "Alcohol and Mercury", "Cooking Oil", "Milk"],
            answerIndex: 1,
            explanation: "Mercury is commonly used because it expands uniformly with heat and does not stick to glass."
          },
          {
            question: "Why is there a small kink (constriction) in a clinical thermometer's tube?",
            options: ["To make it look stylish", "To prevent mercury from falling back immediately when removed from mouth", "To make it break easily", "To measure room temperature"],
            answerIndex: 1,
            explanation: "The kink prevents the mercury level from dropping immediately, allowing the doctor to read the temperature accurately."
          },
          {
            question: "What scale is commonly used to measure body temperature in clinics?",
            options: ["Celsius and Fahrenheit", "Kelvin only", "Ruler scale", "Decibel scale"],
            answerIndex: 0,
            explanation: "Clinical thermometers are calibrated in both Celsius (°C) and Fahrenheit (°F) scales."
          }
        ]
      },
      {
        id: "states-water-journey",
        name: "A Journey through States of Water",
        objective: "Trace the water cycle: solid/liquid/gas transitions, evaporation, transpiration, condensation, and harvesting.",
        progress: [
          { id: 1, label: "States of Water", status: "completed" },
          { id: 2, label: "Evaporation & Transpiration", status: "active" },
          { id: 3, label: "The Water Cycle & Harvesting", status: "upcoming" }
        ],
        chips: ["What is evaporation?", "How do clouds form?", "Why is water conservation important?"],
        initialQuestion: "Water is amazing—it can exist as a solid (ice), a liquid (water), and a gas (water vapor). Have you ever watched wet clothes dry in the sun? Where does the water go? Let's explore the water cycle and how water changes its state!",
        quizzes: [
          {
            question: "The process of liquid water turning into water vapor upon heating is called:",
            options: ["Condensation", "Evaporation", "Freezing", "Precipitation"],
            answerIndex: 1,
            explanation: "Evaporation is the conversion of liquid water into gas/vapor state."
          },
          {
            question: "How do clouds form in the sky?",
            options: ["Water vapor condenses into tiny water droplets upon cooling", "Ice melts in the atmosphere", "Smoke from factories gathers", "Wind blows dust together"],
            answerIndex: 0,
            explanation: "When water vapor rises and cools at high altitudes, it condenses into tiny water droplets, forming clouds."
          },
          {
            question: "The release of water vapor from the leaves of plants into the air is called:",
            options: ["Respiration", "Photosynthesis", "Transpiration", "Evaporation"],
            answerIndex: 2,
            explanation: "Transpiration is the process where plants release excess water as vapor through stomata in their leaves."
          },
          {
            question: "What is the continuous movement of water from Earth's surface to the atmosphere and back called?",
            options: ["Carbon cycle", "Water cycle", "Rock cycle", "Oxygen cycle"],
            answerIndex: 1,
            explanation: "The water cycle describes the continuous circulation of water between Earth and the atmosphere."
          },
          {
            question: "Which technique collects rainwater to replenish groundwater tables?",
            options: ["Deforestation", "Rainwater Harvesting", "Drip Irrigation", "Canal Irrigation"],
            answerIndex: 1,
            explanation: "Rainwater harvesting collects and stores rainwater for recharging groundwater or direct use."
          }
        ]
      },
      {
        id: "methods-separation",
        name: "Methods of Separation in Everyday Life",
        objective: "Understand separation methods: handpicking, threshing, winnowing, decantation, filtration, and evaporation.",
        progress: [
          { id: 1, label: "Separation of Solid Mixtures", status: "completed" },
          { id: 2, label: "Separation of Insoluble Solids", status: "active" },
          { id: 3, label: "Separation of Soluble Solids", status: "upcoming" }
        ],
        chips: ["What is handpicking?", "How does sieving work?", "What is decantation?"],
        initialQuestion: "Think about how your parents filter tea leaves from tea, or pick small stones out of rice. We separate substances every day! Why do we need to separate mixtures? What are the different ways we can separate solids from liquids, or solids from other solids?",
        quizzes: [
          {
            question: "Which method is best suited to separate small stones from wheat grains?",
            options: ["Filtration", "Handpicking", "Evaporation", "Decantation"],
            answerIndex: 1,
            explanation: "Handpicking is used to separate slightly larger impurities like stones or husk when present in small quantities."
          },
          {
            question: "The process of separating grains from stalks by beating them is called:",
            options: ["Threshing", "Winnowing", "Sieving", "Handpicking"],
            answerIndex: 0,
            explanation: "Threshing is the process of beating stalks to free grain seeds."
          },
          {
            question: "Which method uses wind or blowing air to separate lighter husk particles from heavier grain seeds?",
            options: ["Sieving", "Threshing", "Winnowing", "Filtration"],
            answerIndex: 2,
            explanation: "Winnowing separates components of a mixture based on their weight differences using wind."
          },
          {
            question: "How can we separate sand and water?",
            options: ["Evaporation", "Sedimentation and Decantation", "Sieving", "Handpicking"],
            answerIndex: 1,
            explanation: "Sand is heavy and insoluble, so it settles down (sedimentation), and clean water can be poured out (decantation) or filtered."
          },
          {
            question: "To obtain pure salt from sea water, which process is used?",
            options: ["Filtration", "Decantation", "Evaporation", "Sieving"],
            answerIndex: 2,
            explanation: "Evaporation removes water as vapor, leaving solid salt crystals behind."
          }
        ]
      },
      {
        id: "living-creatures-characteristics",
        name: "Living Creatures: Exploring their Characteristics",
        objective: "Identify characteristics of living organisms: respiration, stimulus, excretion, reproduction, and adaptations.",
        progress: [
          { id: 1, label: "Respiration & Growth", status: "completed" },
          { id: 2, label: "Response to Stimulus", status: "active" },
          { id: 3, label: "Adaptations in Habitats", status: "upcoming" }
        ],
        chips: ["Do plants breathe?", "What is stimulus?", "How do desert animals adapt?"],
        initialQuestion: "What makes a dog different from a toy robot? Both can move! But a dog eats, breathes, grows, and responds when you call it. What are the key characteristics that define living organisms? Let's look at how living things adapt to survive in their surroundings!",
        quizzes: [
          {
            question: "What is respiration in living organisms?",
            options: ["Only taking in oxygen", "Only giving out carbon dioxide", "Breathing in air and using oxygen to release energy from food", "Growing in size"],
            answerIndex: 2,
            explanation: "Respiration is the cellular process where oxygen is used to break down food to release energy."
          },
          {
            question: "A plant turns its leaves toward sunlight. The sunlight is a:",
            options: ["Response", "Stimulus", "Habit", "Growth marker"],
            answerIndex: 1,
            explanation: "A stimulus is a change in the environment that causes an organism to react."
          },
          {
            question: "How do fish breathe underwater?",
            options: ["Through their lungs", "Through their skin", "Through their gills", "They do not breathe"],
            answerIndex: 2,
            explanation: "Gills absorb dissolved oxygen from water."
          },
          {
            question: "The process of getting rid of waste products by living organisms is called:",
            options: ["Reproduction", "Excretion", "Respiration", "Nutrition"],
            answerIndex: 1,
            explanation: "Excretion is the removal of toxic metabolic waste from the body."
          },
          {
            question: "Why do camels have long legs?",
            options: ["To run very fast", "To keep their bodies away from the hot sand", "To swim in water", "To climb trees"],
            answerIndex: 1,
            explanation: "The long legs of a camel keep its body raised high, keeping it cooler by avoiding heat radiating from the desert sand."
          }
        ]
      },
      {
        id: "natures-treasures",
        name: "Nature's Treasures",
        objective: "Understand natural resources: renewable (solar) vs. non-renewable (fossil fuels), forests, afforestation, and 3 R's.",
        progress: [
          { id: 1, label: "Forests: Our Green Wealth", status: "completed" },
          { id: 2, label: "Soil and Water Resources", status: "active" },
          { id: 3, label: "Conservation & 3 R's", status: "upcoming" }
        ],
        chips: ["Renewable vs Non-renewable", "Why is forest important?", "How to save water?"],
        initialQuestion: "Earth is full of treasures—clean air, fresh water, fertile soil, forests, and minerals. These are called natural resources. But did you know some resources can run out if we waste them? How can we protect nature's treasures for our future?",
        quizzes: [
          {
            question: "Which of the following is a renewable natural resource?",
            options: ["Coal", "Petroleum", "Solar energy", "Natural Gas"],
            answerIndex: 2,
            explanation: "Solar energy is renewable as it is inexhaustible, unlike fossil fuels (coal, petroleum) which take millions of years to form."
          },
          {
            question: "How do forests help prevent soil erosion?",
            options: ["Roots of trees bind the soil particles together", "Leaves block sunlight", "Animals stomp the soil hard", "Forests stop rainfall"],
            answerIndex: 0,
            explanation: "Plant roots hold soil firmly, protecting it from being washed away by water or blown away by wind."
          },
          {
            question: "What is the main cause of the depletion of groundwater?",
            options: ["Excessive rainfall", "Overuse and drilling borewells", "Planting more trees", "Water harvesting"],
            answerIndex: 1,
            explanation: "Excessive extraction of groundwater for irrigation and domestic use without recharging leads to depletion."
          },
          {
            question: "Which of the following is an eco-friendly practice?",
            options: ["Using plastic bags", "Planting more trees (Afforestation)", "Leaving taps running", "Burning dry leaves"],
            answerIndex: 1,
            explanation: "Afforestation increases green cover, controls erosion, and cleans air, supporting environmental conservation."
          },
          {
            question: "What are the three R's of waste management?",
            options: ["Read, Write, Repeat", "Reduce, Reuse, Recycle", "Run, Rest, Return", "Repair, Remove, Reject"],
            answerIndex: 1,
            explanation: "Reduce, Reuse, and Recycle are key practices to minimize waste and conserve resources."
          }
        ]
      },
      {
        id: "beyond-earth",
        name: "Beyond Earth",
        objective: "Understand the solar system, Sun, planets (Jupiter), constellations, phases of the Moon, and rotation vs. revolution.",
        progress: [
          { id: 1, label: "The Solar System", status: "completed" },
          { id: 2, label: "Stars and Constellations", status: "active" },
          { id: 3, label: "Moon Phases & Rotation", status: "upcoming" }
        ],
        chips: ["Why does the Moon shine?", "What causes day and night?", "How many planets are there?"],
        initialQuestion: "Look up at the night sky—what do you see? The glowing Moon, sparkling stars, and planets. We live on Earth, which is part of a giant family called the Solar System. Have you ever wondered why the Moon changes its shape, or why we have day and night?",
        quizzes: [
          {
            question: "What lies at the center of our Solar System?",
            options: ["The Earth", "The Sun", "The Moon", "Jupiter"],
            answerIndex: 1,
            explanation: "The Sun is a star located at the center of the Solar System, and all planets revolve around it."
          },
          {
            question: "What causes day and night on Earth?",
            options: ["Earth revolving around the Sun", "Earth rotating on its own axis", "The Moon blocking the Sun", "The Sun moving around the Earth"],
            answerIndex: 1,
            explanation: "Earth's rotation on its axis once every 24 hours brings different parts of the Earth into sunlight, causing day and night."
          },
          {
            question: "Why does the Moon shine at night?",
            options: ["It produces its own light like the Sun", "It reflects the light of the Sun", "It is made of glowing rocks", "It has electric lights"],
            answerIndex: 1,
            explanation: "The Moon does not produce its own light; it shines by reflecting sunlight."
          },
          {
            question: "Which is the largest planet in our solar system?",
            options: ["Earth", "Saturn", "Jupiter", "Mars"],
            answerIndex: 2,
            explanation: "Jupiter is the largest planet in the solar system."
          },
          {
            question: "A group of stars forming a recognizable pattern in the night sky is called:",
            options: ["Solar system", "Constellation", "Galaxy", "Nebula"],
            answerIndex: 1,
            explanation: "Constellations (like Ursa Major or Orion) are patterns formed by groups of stars."
          }
        ]
      }
    ]
  },
  history_class6: {
    title: "History",
    chapters: [
      {
        id: "what-where-how-when",
        name: "What, Where, How and When?",
        objective: "Understand history, archaeology, historical sources, dating systems, and geographical impacts.",
        progress: [
          { id: 1, label: "Why study history?", status: "completed" },
          { id: 2, label: "Archaeological Sources & Manuscripts", status: "active" },
          { id: 3, label: "Dating Systems BC/AD", status: "upcoming" }
        ],
        chips: ["Why study history?", "What is an archaeologist?", "What do BC and AD mean?"],
        initialQuestion: "Welcome to Class 6 History! Imagine finding a mysterious old coin buried in your backyard. How would you figure out who made it, or when it was used? History is like solving mysteries using clues from the past. What is one thing about people of the ancient past you've always wanted to know?",
        quizzes: [
          {
            question: "What do archaeologists use to study the past?",
            options: ["Only books", "Tools, coins, bones, and ancient ruins", "Only modern maps", "Telescopes"],
            answerIndex: 1,
            explanation: "Archaeologists look at physical objects left behind like tools, coins, pots, and ruins to understand past life."
          },
          {
            question: "Where did people first start living and farming in India?",
            options: ["Near the Thar Desert", "Along the Narmada and Indus river valleys", "In high Himalayan peaks", "Only on islands"],
            answerIndex: 1,
            explanation: "Early settlements grew near rivers like Narmada and Indus because water was available for drinking and farming."
          },
          {
            question: "Manuscripts were ancient books written by hand. What material was commonly used to write them?",
            options: ["Paper made in factories", "Palm leaves or birch bark", "Iron sheets", "Plastic boards"],
            answerIndex: 2,
            explanation: "Before paper, manuscripts were written on palm leaves or specially prepared bark of the birch tree."
          },
          {
            question: "What does the term 'AD' stand for in historical dates?",
            options: ["After Death", "Anno Domini (Year of the Lord)", "Ancient Dates", "Approximate Days"],
            answerIndex: 1,
            explanation: "AD stands for Anno Domini, meaning 'in the year of the Lord', referring to dates after the birth of Jesus Christ."
          },
          {
            question: "Why did early people travel from one place to another?",
            options: ["For vacations", "In search of food, to escape natural disasters, or for trade", "To watch movies", "To take photographs"],
            answerIndex: 1,
            explanation: "Ancient people traveled in search of livelihoods, food, to flee floods/droughts, or to trade goods."
          }
        ]
      },
      {
        id: "hunting-gathering-growing-food",
        name: "From Hunting – Gathering to Growing Food",
        objective: "Trace the transition from nomadic hunter-gatherers to settled farming communities, domestication of animals, and early tools.",
        progress: [
          { id: 1, label: "How did fire change lives?", status: "completed" },
          { id: 2, label: "Farming & Domestication", status: "active" },
          { id: 3, label: "Neolithic Settlements", status: "upcoming" }
        ],
        chips: ["How did fire change lives?", "Why did they domesticate animals?", "What is the Neolithic Age?"],
        initialQuestion: "Imagine you had to find all your food by hunting wild animals and gathering wild berries every day. You would have to move constantly! Then, one day, humans discovered how to plant seeds and wait for crops to grow. How do you think this change affected where and how they lived?",
        quizzes: [
          {
            question: "Why were early humans called hunter-gatherers?",
            options: ["Because they lived in brick houses", "Because they hunted wild animals and gathered wild plants for food", "Because they bought food from shops", "Because they grew wheat and barley"],
            answerIndex: 1,
            explanation: "They depended on hunting wild animals, catching fish, and gathering wild fruits, seeds, and leaves to survive."
          },
          {
            question: "What was the most important discovery that helped early humans cook food and scare away wild animals?",
            options: ["The wheel", "Fire", "Iron", "Computers"],
            answerIndex: 1,
            explanation: "The discovery of fire allowed humans to cook meat, get light in caves, and keep wild beasts away."
          },
          {
            question: "The transition from moving around to staying in one place happened because humans started:",
            options: ["Hunting birds", "Farming and domesticating animals", "Building stone pyramids", "Painting on cave walls"],
            answerIndex: 1,
            explanation: "Growing crops and rearing animals meant humans had to stay in one place for long periods to take care of plants and herds."
          },
          {
            question: "Which was the first animal to be domesticated by humans?",
            options: ["Wild ancestor of the dog", "Cat", "Cow", "Horse"],
            answerIndex: 0,
            explanation: "The wild ancestor of the dog was the very first animal tamed by early humans."
          },
          {
            question: "What is the name of the archaeological site in modern Pakistan where early evidence of wheat and barley farming was found?",
            options: ["Bhimbetka", "Mehrgarh", "Hunsgi", "Burzahom"],
            answerIndex: 1,
            explanation: "Mehrgarh is one of the earliest villages known, showing evidence of farming wheat, barley, and rearing sheep/goats."
          }
        ]
      },
      {
        id: "earliest-cities",
        name: "In the Earliest Cities",
        objective: "Explore Harappan civilization, town planning, drainage systems, crafts, and trade network.",
        progress: [
          { id: 1, label: "Harappan Town Planning", status: "completed" },
          { id: 2, label: "Great Bath & Bronze Crafts", status: "active" },
          { id: 3, label: "Trade Routes & Decline", status: "upcoming" }
        ],
        chips: ["What is Harappan town planning?", "Why was the Great Bath built?", "What was the script like?"],
        initialQuestion: "Nearly 4,700 years ago, amazing cities with double-story brick houses, covered streets, and advanced drainage systems existed in India. This was the Harappan civilization. How do you think they built such neat cities without modern machines?",
        quizzes: [
          {
            question: "Which of these is a unique feature of Harappan cities?",
            options: ["Houses built randomly without planning", "A well-planned grid system with covered drains", "No water wells", "Huge glass castles"],
            answerIndex: 1,
            explanation: "Harappan cities had carefully planned streets, brick houses, and covered drains running along the roads."
          },
          {
            question: "Where was the famous 'Great Bath' structure discovered?",
            options: ["Harappa", "Mohenjodaro", "Lothal", "Kalibangan"],
            answerIndex: 1,
            explanation: "The Great Bath, a special brick-lined water tank, was discovered in Mohenjodaro."
          },
          {
            question: "What metal was mixed with copper to make bronze by Harappan craftsmen?",
            options: ["Iron", "Tin", "Gold", "Silver"],
            answerIndex: 1,
            explanation: "Bronze is an alloy made by mixing copper and tin."
          },
          {
            question: "Which Harappan site in Gujarat had a dockyard showing trade through sea routes?",
            options: ["Dholavira", "Lothal", "Surkotada", "Mehrgarh"],
            answerIndex: 1,
            explanation: "Lothal had a massive brick dockyard where ships came in from the sea and nearby rivers to load and unload goods."
          },
          {
            question: "What happened to the Harappan civilization around 3,900 years ago?",
            options: ["It was converted into a modern state", "It began to decline, possibly due to rivers drying up or flooding", "People flew away", "It was conquered by Alexander"],
            answerIndex: 1,
            explanation: "The cities declined gradually. Scientists suggest reasons like drying rivers, deforestation, or ecological collapse."
          }
        ]
      },
      {
        id: "books-burials",
        name: "What Books and Burials Tell Us",
        objective: "Analyze the Vedas, Rigvedic society, megalith burials, and social differences in burials.",
        progress: [
          { id: 1, label: "Understanding Vedas & Sanskrit", status: "completed" },
          { id: 2, label: "Megaliths arrangement", status: "active" },
          { id: 3, label: "Burial Social Differences", status: "upcoming" }
        ],
        chips: ["What are the Vedas?", "How do burials show wealth?", "What is a Megalith?"],
        initialQuestion: "Long before books were printed, people memorized and sang hymns to pass down knowledge. These are the Vedas, some of the oldest books in the world. At the same time, people built large stone monuments called megaliths to bury the dead. What can ancient books and graves tell us about how people lived?",
        quizzes: [
          {
            question: "Which is the oldest of the four Vedas?",
            options: ["Samaveda", "Yajurveda", "Rigveda", "Atharvaveda"],
            answerIndex: 2,
            explanation: "The Rigveda, composed about 3,500 years ago, is the oldest Veda."
          },
          {
            question: "In what language were the hymns of the Rigveda composed?",
            options: ["Modern Hindi", "Vedic Sanskrit", "Tamil", "English"],
            answerIndex: 1,
            explanation: "The Rigveda was composed in old or Vedic Sanskrit, which is different from modern school Sanskrit."
          },
          {
            question: "What are 'Megaliths'?",
            options: ["Tiny clay pots", "Huge stone boulders used to mark burial sites", "Gold coins", "Ancient wooden houses"],
            answerIndex: 1,
            explanation: "Megaliths (literally 'big stones') were carefully arranged by people to mark graves and burial sites."
          },
          {
            question: "How do burial remains show social differences among ancient people?",
            options: ["All graves had the same items", "Some graves contained gold, copper, and beads while others had only pottery", "Graves were only for kings", "No graves have been found"],
            answerIndex: 1,
            explanation: "The variation in grave goods (e.g. 33 gold beads in one grave vs. simple pots in another) reflects differences in wealth and status."
          },
          {
            question: "Which of these was a Rigvedic term used for people who did not perform sacrifices and spoke different languages?",
            options: ["Aryas", "Dasas or Dasyus", "Rajas", "Janas"],
            answerIndex: 1,
            explanation: "The composers of hymns called themselves Aryas and their opponents Dasas or Dasyus."
          }
        ]
      },
      {
        id: "kingdoms-kings-early-republic",
        name: "Kingdoms, Kings and an Early Republic",
        objective: "Understand Ashvamedha, Janapadas, Mahajanapadas, taxation, Magadha rise, and Vajji republican government.",
        progress: [
          { id: 1, label: "Ashvamedha Horse Sacrifice", status: "completed" },
          { id: 2, label: "Rise of Mahajanapadas", status: "active" },
          { id: 3, label: "Magadha & Vajji Ganas", status: "upcoming" }
        ],
        chips: ["What is Ashvamedha?", "What is a Mahajanapada?", "How did Vajji differ from Magadha?"],
        initialQuestion: "How does someone become a leader today? We vote! But 3,000 years ago, some men became kings by performing grand rituals like the Ashvamedha (horse sacrifice). Later, powerful kingdoms called Mahajanapadas arose, along with early republics where people ruled together. Let's explore how states were formed!",
        quizzes: [
          {
            question: "What was the 'Ashvamedha' ritual?",
            options: ["A festival for harvesting crops", "A horse sacrifice ritual to establish a king's power", "A marriage ceremony", "A battle training game"],
            answerIndex: 1,
            explanation: "Ashvamedha was a sacrifice where a horse was let loose to wander, and neighboring kings had to accept the host king's power or fight."
          },
          {
            question: "What were the larger, more powerful kingdoms that developed around 2,500 years ago called?",
            options: ["Janapadas", "Mahajanapadas", "Harappan cities", "States"],
            answerIndex: 1,
            explanation: "Janapadas were the lands where people settled. The most important and fortified ones grew into Mahajanapadas."
          },
          {
            question: "Why did kings of Mahajanapadas build huge, thick walls around their capital cities?",
            options: ["To play climbing games", "For protection against enemy attacks and to show off wealth/power", "To block sunlight", "Because bricks were free"],
            answerIndex: 1,
            explanation: "Fortification walls of wood, brick, or stone were built to secure the city from invasions and display the ruler's majesty."
          },
          {
            question: "Which Mahajanapada became the most powerful and strategic empire in ancient India?",
            options: ["Magadha", "Vajji", "Avanti", "Kosala"],
            answerIndex: 0,
            explanation: "Magadha became dominant because of rivers (Ganga and Son) for transport, iron ore mines for weapons, and fertile land."
          },
          {
            question: "How was the government of Vajji different from Magadha?",
            options: ["It had no rulers", "It was a Gana or Sangha (republic) ruled by many rajas together", "It was ruled by a single queen", "It was ruled by priests only"],
            answerIndex: 1,
            explanation: "Vajji was a Gana/Sangha, where thousands of men met in assemblies, discussed, and ruled collectively."
          }
        ]
      },
      {
        id: "new-questions-ideas",
        name: "New Questions and Ideas",
        objective: "Explore Upanishads, teachings of Gautama Buddha (Buddhism), Vardhamana Mahavira (Jainism), and Sangha rules.",
        progress: [
          { id: 1, label: "Teachings of Gautama Buddha", status: "completed" },
          { id: 2, label: "Teachings of Vardhamana Mahavira", status: "active" },
          { id: 3, label: "Upanishad dialogues", status: "upcoming" }
        ],
        chips: ["Who was Buddha?", "What is Jainism?", "What do the Upanishads teach?"],
        initialQuestion: "Around 2,500 years ago, thinkers in India started asking deep questions: What happens after death? What is the true meaning of life? This led to the teachings of Buddhism by Gautama Buddha, Jainism by Vardhamana Mahavira, and the ideas of the Upanishads. Let's learn about these paths of wisdom!",
        quizzes: [
          {
            question: "What was the original name of Gautama Buddha, the founder of Buddhism?",
            options: ["Mahavira", "Siddhartha", "Ashoka", "Chandragupta"],
            answerIndex: 1,
            explanation: "Buddha's birth name was Siddhartha, also known as Gautama."
          },
          {
            question: "Where did Gautama Buddha attain enlightenment under a peepal tree?",
            options: ["Sarnath", "Bodh Gaya", "Kusinara", "Lumbini"],
            answerIndex: 1,
            explanation: "He meditated and gained true wisdom (enlightenment) at Bodh Gaya in Bihar."
          },
          {
            question: "What does the term 'Upanishad' literally mean?",
            options: ["Singing holy hymns", "Approaching and sitting near (a teacher)", "Fighting for truth", "Reading in a temple"],
            answerIndex: 1,
            explanation: "Upanishad means sitting near a teacher to receive confidential, philosophical dialogues."
          },
          {
            question: "Who was the 24th Tirthankara of the Jains who spread the teachings of Jainism?",
            options: ["Rishabhadeva", "Vardhamana Mahavira", "Gautama Buddha", "Panini"],
            answerIndex: 1,
            explanation: "Vardhamana Mahavira was the 24th and last major teacher (Tirthankara) of the Jains."
          },
          {
            question: "What was the association or community of Buddhist monks called?",
            options: ["Sangha", "Vihara", "Stupa", "Ashrama"],
            answerIndex: 0,
            explanation: "The Sangha was an organized association of those who left their homes to practice and learn spiritual teachings."
          }
        ]
      },
      {
        id: "kingdom-to-empire",
        name: "From a Kingdom to an Empire",
        objective: "Analyze the Mauryan Empire, Chandragupta Maurya, Chanakya, Ashoka's Dhamma, and Kalinga War impact.",
        progress: [
          { id: 1, label: "Mauryan Empire & Chanakya", status: "completed" },
          { id: 2, label: "Kalinga War Renunciation", status: "active" },
          { id: 3, label: "Dhamma Prakrit Inscriptions", status: "upcoming" }
        ],
        chips: ["Who was Ashoka?", "How did Chanakya help?", "What is Dhamma?"],
        initialQuestion: "An empire is much larger than a kingdom and requires more resources, officials, and armies. The Mauryan Empire was the first major empire in India, built by Chandragupta Maurya and ruled by his grandson, Ashoka. Ashoka became famous for giving up war after a big victory. Why did he do that?",
        quizzes: [
          {
            question: "Who founded the Mauryan Empire around 2,300 years ago?",
            options: ["Ashoka", "Chandragupta Maurya", "Samudragupta", "Bimbisara"],
            answerIndex: 1,
            explanation: "Chandragupta Maurya founded the empire with the guidance of his wise advisor, Chanakya."
          },
          {
            question: "Chanakya's wise ideas and rules about politics were written down in which book?",
            options: ["Indica", "Arthashastra", "Rigveda", "Ramayana"],
            answerIndex: 1,
            explanation: "Chanakya (Kautilya) wrote his political ideas in the Arthashastra."
          },
          {
            question: "Which war changed Emperor Ashoka's mind, leading him to give up conquest and violence?",
            options: ["Battle of Panipat", "Kalinga War", "Kurukshetra War", "Battle of Plassey"],
            answerIndex: 1,
            explanation: "The bloodshed and misery of the Kalinga War filled Ashoka with sorrow, prompting him to renounce war."
          },
          {
            question: "What language and script were most of Ashoka's inscriptions written in?",
            options: ["Sanskrit in Devanagari script", "Prakrit in Brahmi script", "Tamil in Vatteluttu script", "Greek in Latin script"],
            answerIndex: 1,
            explanation: "Ashoka's messages to the public were in Prakrit (the local language) written in the Brahmi script."
          },
          {
            question: "What did Ashoka's 'Dhamma' teach?",
            options: ["Worshipping specific gods and performing sacrifices", "Respecting elders, being kind to animals/slaves, and peaceful co-existence", "Fasting and leaving homes", "Going to war for the empire"],
            answerIndex: 1,
            explanation: "Ashoka's Dhamma did not involve worship of a god, but encouraged moral values, kindness, and tolerance."
          }
        ]
      },
      {
        id: "villages-towns-trade",
        name: "Villages, Towns and Trade",
        objective: "Explore iron tool development, agricultural growth, Sangam literature, and early towns/guilds.",
        progress: [
          { id: 1, label: "Iron Farming Tools", status: "completed" },
          { id: 2, label: "Madurai Sangam Poets", status: "active" },
          { id: 3, label: "Shrenis Guilds & Arikamedu", status: "upcoming" }
        ],
        chips: ["How did iron tools help?", "What is Sangam literature?", "What was Arikamedu?"],
        initialQuestion: "How did iron tools change farming 2,500 years ago? Axes cleared forests, and iron ploughshares turned hard soil. This increased crop production, helping towns and trade routes grow. At the same time, poets gathered in the south to write Sangam literature. Let's discover how everyday people lived in ancient towns and villages!",
        quizzes: [
          {
            question: "When did the use of iron tools begin to grow rapidly in the Indian subcontinent?",
            options: ["4,700 years ago", "3,000 years ago", "1,000 years ago", "500 years ago"],
            answerIndex: 1,
            explanation: "Iron use began around 3,000 years ago, with a major increase in tools/weapons around 2,500 years ago."
          },
          {
            question: "What was the assembly of Tamil poets held in Madurai called?",
            options: ["Sangha", "Sangam", "Sabha", "Samiti"],
            answerIndex: 1,
            explanation: "Sangam literature was composed and compiled at assemblies (Sangams) of poets held in Madurai."
          },
          {
            question: "What were the associations formed by merchants and craftsmen called?",
            options: ["Janas", "Shrenis", "Sanghas", "Mahajanapadas"],
            answerIndex: 1,
            explanation: "Shrenis provided training, procured raw materials, and distributed finished products for craftsmen and traders."
          },
          {
            question: "Arikamedu in modern Puducherry was famous in ancient history as a:",
            options: ["Capital city of Ashoka", "Coastal port and trading center", "Forest hermitage", "Mining town"],
            answerIndex: 1,
            explanation: "Arikamedu was an active port where goods from Rome and other Mediterranean regions were unloaded."
          },
          {
            question: "What are punch-marked coins?",
            options: ["Coins made of paper", "Coins made by punching designs onto metal sheets like silver/copper", "Gold bars", "Plastic tokens"],
            answerIndex: 1,
            explanation: "These were the earliest coins, made by punching symbols onto silver or copper sheets."
          }
        ]
      },
      {
        id: "new-empires-kingdoms",
        name: "New Empires and Kingdoms",
        objective: "Analyze the Gupta Empire, Samudragupta's Prashasti, Harshavardhana, Pallavas, and Chalukyas.",
        progress: [
          { id: 1, label: "Gupta Samudragupta Prashastis", status: "completed" },
          { id: 2, label: "Harshavardhana biography", status: "active" },
          { id: 3, label: "Kanchipuram Pallavas & Chalukyas", status: "upcoming" }
        ],
        chips: ["What is a Prashasti?", "Who was Harshavardhana?", "Who were the Pallavas?"],
        initialQuestion: "After the Mauryan Empire fell, new dynasties arose. The Guptas ruled northern India, and we learn about their kings from Prashastis (poems written in praise). In the south, the Pallavas and Chalukyas became powerful. How did these rulers govern their lands, and what made their kingdoms famous?",
        quizzes: [
          {
            question: "What is a 'Prashasti'?",
            options: ["A book of recipes", "An inscription written in praise of a ruler", "A declaration of war", "A tax document"],
            answerIndex: 1,
            explanation: "Prashasti is a Sanskrit word meaning 'in praise of', referring to inscriptions praising kings' achievements."
          },
          {
            question: "Which Gupta king's conquests are recorded on the Allahabad Pillar inscription composed by poet Harishena?",
            options: ["Chandragupta I", "Samudragupta", "Ramagupta", "Skandagupta"],
            answerIndex: 1,
            explanation: "The pillar records the campaigns and victories of Emperor Samudragupta."
          },
          {
            question: "Who was the ruler of Thanesar and Kanauj whose biography 'Harshacharita' was written by Banabhatta?",
            options: ["Ashoka", "Harshavardhana", "Pulakeshin II", "Chandragupta II"],
            answerIndex: 1,
            explanation: "Banabhatta wrote Harshacharita, the biography of King Harshavardhana in Sanskrit."
          },
          {
            question: "Who was the famous court poet of the Chalukya king Pulakeshin II?",
            options: ["Harishena", "Ravikirti", "Kalidasa", "Banabhatta"],
            answerIndex: 1,
            explanation: "Ravikirti composed the Prashasti of Pulakeshin II, describing his campaigns."
          },
          {
            question: "Which dynasty ruled with their capital at Kanchipuram in South India?",
            options: ["Guptas", "Pallavas", "Chalukyas", "Mauryas"]            ,
            answerIndex: 1,
            explanation: "The Pallavas ruled over a kingdom stretching around Kanchipuram down to the Kaveri delta."
          }
        ]
      },
      {
        id: "buildings-paintings-books",
        name: "Buildings, Paintings and Books",
        objective: "Understand ancient Indian science (Aryabhata), iron pillar of Mehrauli, stupas, Ajanta cave paintings, and epics.",
        progress: [
          { id: 1, label: "Mehrauli Iron Pillar", status: "completed" },
          { id: 2, label: "Sanchi Stupa & Ajanta", status: "active" },
          { id: 3, label: "Aryabhatiyam Astronomy & Epics", status: "upcoming" }
        ],
        chips: ["What is the Iron Pillar?", "How were Stupas built?", "What are Epics?"],
        initialQuestion: "Ancient India made incredible contributions to architecture, art, and science. The rust-free Iron Pillar of Delhi, the beautiful Stupas of Sanchi, the vibrant cave paintings of Ajanta, and grand epics like Silappadikaram show the skills of ancient Indians. Let's explore these timeless creations!",
        quizzes: [
          {
            question: "Why is the Iron Pillar at Mehrauli, Delhi, famous worldwide?",
            options: ["Because it is made of gold", "Because it has not rusted even after 1,600 years", "Because it is the tallest pillar", "Because it is hollow"],
            answerIndex: 1,
            explanation: "The Mehrauli iron pillar shows advanced metallurgical skills as it has resisted rusting for over 16 centuries."
          },
          {
            question: "What does the word 'Stupa' literally mean?",
            options: ["House", "Mound", "Pillar", "Cave"],
            answerIndex: 1,
            explanation: "Stupa literally means a mound, usually enclosing a relic casket of Buddha or his followers."
          },
          {
            question: "The famous caves of Ajanta are renowned for what kind of ancient art?",
            options: ["Stone statues", "Wall paintings depicting Jataka stories", "Glass carvings", "Wooden models"],
            answerIndex: 1,
            explanation: "Ajanta is famous for its colorful paintings drawn on cave walls under torchlight, mostly about Buddhist stories."
          },
          {
            question: "Which famous mathematician and astronomer wrote the book 'Aryabhatiyam' in Sanskrit?",
            options: ["Varahamihira", "Aryabhata", "Charaka", "Sushruta"],
            answerIndex: 1,
            explanation: "Aryabhata was a famous astronomer who calculated the Earth's rotation, eclipses, and wrote the Aryabhatiyam."
          },
          {
            question: "The famous Tamil epic 'Silappadikaram' was composed by which poet?",
            options: ["Sattanar", "Ilango Adigal", "Tiruvalluvar", "Kalidasa"],
            answerIndex: 1,
            explanation: "Ilango Adigal composed the Silappadikaram (the story of a anklet) about 1,800 years ago."
          }
        ]
      }
    ]
  },
  history_class7: {
    title: "History",
    chapters: [
      {
        id: "tracing-changes",
        name: "Introduction: Tracing Changes Through a Thousand Years",
        objective: "Explore historical terminology, sources like cartography, manuscripts, and social groups over the medieval period (700-1750 AD).",
        progress: [
          { id: 1, label: "Maps and Cartography changes", status: "completed" },
          { id: 2, label: "New and Old Terminologies", status: "active" },
          { id: 3, label: "Historians and their Sources", status: "upcoming" }
        ],
        chips: ["Why did map orientations change?", "Who were the scribes?", "New social/political groups"],
        initialQuestion: "Welcome to Class 7 History! Over a thousand years (from 700 to 1750 AD), maps of India changed dramatically. An early map by al-Idrisi actually showed South India at the top and Sri Lanka as an island above it! Why do you think geography and maps change so much over time?",
        quizzes: [
          {
            question: "Who was al-Idrisi?",
            options: ["A French cartographer", "An Arab geographer/cartographer", "A Chinese traveler", "An Indian merchant"],
            answerIndex: 1,
            explanation: "Al-Idrisi was an Arab geographer who made a famous world map in 1154, showing the Indian subcontinent."
          },
          {
            question: "What is a cartographer?",
            options: ["A person who makes maps", "A person who writes books", "A person who designs buildings", "A person who studies rocks"],
            answerIndex: 0,
            explanation: "A cartographer is a specialist who draws or produces maps."
          },
          {
            question: "Why did paper become cheaper and more widely available in the 14th century?",
            options: ["Because of plastic use", "It was imported from America", "Due to improvements in manufacturing and distribution", "No one wanted to write"],
            answerIndex: 2,
            explanation: "During the 13th and 14th centuries, paper became much cheaper and widely available, so people used it to write chronicles, holy texts, and letters."
          },
          {
            question: "Scribes were people who copied manuscripts by hand. What was a major difficulty they faced?",
            options: ["They did not have paper", "Reading the original handwriting and occasionally introducing changes in words", "They were not allowed to write", "They had to print using machines"],
            answerIndex: 1,
            explanation: "Since there were no printing presses, scribes copied manuscripts by hand, which made it hard to read different handwritings and led to small, accidental changes."
          },
          {
            question: "What did the term 'Hindustan' mean to Minhaj-i-Siraj in the 13th century?",
            options: ["The entire modern republic of India", "Only South India", "Areas of Punjab, Haryana, and the lands between Ganga and Yamuna", "The Himalayan region"],
            answerIndex: 2,
            explanation: "Minhaj-i-Siraj used 'Hindustan' in a political sense to mean lands that were part of the Delhi Sultan's dominions (mainly North India)."
          }
        ]
      },
      {
        id: "kings-kingdoms",
        name: "Kings and Kingdoms",
        objective: "Understand the emergence of new dynasties, land grants, administrative structures, and temple-building (Rashtrakutas, Cholas, etc.).",
        progress: [
          { id: 1, label: "Emergence of New Dynasties", status: "completed" },
          { id: 2, label: "Prashastis and Land Grants", status: "active" },
          { id: 3, label: "The Cholas Administration", status: "upcoming" }
        ],
        chips: ["Who were the Samantas?", "Chola bronze sculptures", "Tripartite struggle"],
        initialQuestion: "Welcome! Today we are looking at **Kings and Kingdoms** of medieval India. Powerful kings often built grand, tall stone temples. Why do you think medieval rulers spent so much wealth building temples instead of palaces or forts?",
        quizzes: [
          {
            question: "What was the term used for subordinates or big landlords under kings in the 7th century?",
            options: ["Rajas", "Samantas", "Scribes", "Sultans"],
            answerIndex: 1,
            explanation: "By the 7th century, kings acknowledged big landlords or warrior chiefs as Samantas, who brought gifts and military support."
          },
          {
            question: "Which dynasty was founded by Dantidurga after defeating his Chalukya overlord?",
            options: ["Chola", "Rashtrakuta", "Pala", "Gurjara-Pratihara"],
            answerIndex: 1,
            explanation: "Dantidurga was a Rashtrakuta chief who overthrew his Chalukya overlord in the mid-8th century and performed the 'Hiranya-garbha' ritual."
          },
          {
            question: "What does 'Hiranya-garbha' literally mean?",
            options: ["Golden Womb", "Golden Crown", "Iron Spear", "Royal Chariot"],
            answerIndex: 0,
            explanation: "Hiranya-garbha literally means the golden womb, a ritual performed to declare the transition of a non-Kshatriya chief into a Kshatriya."
          },
          {
            question: "The 'Tripartite Struggle' was a long conflict over which wealthy city?",
            options: ["Delhi", "Kanauj", "Madurai", "Thanjavur"],
            answerIndex: 1,
            explanation: "Rulers from the Gurjara-Pratihara, Rashtrakuta, and Pala dynasties fought for centuries to control Kanauj in the Ganga valley."
          },
          {
            question: "Which Chola ruler was famous for building a powerful navy and raiding Southeast Asian kingdoms?",
            options: ["Vijayalaya", "Rajaraja I", "Rajendra I", "Aditya I"],
            answerIndex: 2,
            explanation: "Rajendra I, son of Rajaraja I, expanded the navy, raided Sri Lanka and Southeast Asia, and developed the Ganga valley trade routes."
          }
        ]
      },
      {
        id: "delhi-sultanate",
        name: "Delhi: 12th to 15th Century",
        objective: "Analyze the Delhi Sultanate dynasties (Tomaras, Chauhans, Khaljis, Tughlaqs) and administrative policies (Iqta system).",
        progress: [
          { id: 1, label: "Tomaras and Chauhan Rajputs", status: "completed" },
          { id: 2, label: "Expansion under Khalji & Tughlaq", status: "active" },
          { id: 3, label: "Iqta Administration System", status: "upcoming" }
        ],
        chips: ["Who was Raziyya?", "What is an Iqta?", "Garrison towns"],
        initialQuestion: "Welcome! Today we are visiting **Delhi: 12th to 15th Century**. Did you know Delhi first became a capital under the Tomara Rajputs, and then grew into a massive empire under the Delhi Sultans? How do you think sultans defended their garrison towns from Mongol invasions?",
        quizzes: [
          {
            question: "Who was the first woman ruler of the Delhi Sultanate?",
            options: ["Rudramadevi", "Raziyya", "Didda", "Nur Jahan"],
            answerIndex: 1,
            explanation: "Raziyya, the daughter of Sultan Iltutmish, became sultan in 1236. She was removed in 1240 due to noble opposition."
          },
          {
            question: "What is a 'Tarikh' or 'Tawarikh'?",
            options: ["A type of coin", "Histories written in Persian by learned scribes and administrators", "A royal court dance", "A military rank"],
            answerIndex: 1,
            explanation: "Tawarikh (plural of Tarikh) are valuable histories written in Persian, the administrative language of the Delhi Sultanate."
          },
          {
            question: "What was a 'garrison town'?",
            options: ["A town for farming crops", "A fortified settlement with soldiers", "A market for luxury silks", "A harbor for warships"],
            answerIndex: 1,
            explanation: "A garrison town is a heavily fortified town occupied by soldiers to protect and control regions."
          },
          {
            question: "What was the administrative land grant called under the Delhi Sultans?",
            options: ["Mansab", "Iqta", "Zabt", "Samanta"],
            answerIndex: 1,
            explanation: "Sultans divided territories into land grants called Iqtas, managed by governors called Iqtadars or Muqtis."
          },
          {
            question: "Which sultan constructed the Siri Fort and introduced market control price reforms?",
            options: ["Balban", "Alauddin Khalji", "Muhammad Tughlaq", "Firoz Shah Tughlaq"],
            answerIndex: 1,
            explanation: "Alauddin Khalji built Siri garrison town and controlled prices of goods to maintain a large army against Mongol threats."
          }
        ]
      },
      {
        id: "mughals",
        name: "The Mughals (16th to 17th Century)",
        objective: "Examine the Mughal Empire (Babur to Aurangzeb), Mansabdari system, revenue policies (Zabt), and architectural achievements.",
        progress: [
          { id: 1, label: "Mughal Military Campaigns", status: "completed" },
          { id: 2, label: "Mansabdari and Jagirdari Systems", status: "active" },
          { id: 3, label: "Akbar's Policies & Sulh-i Kul", status: "upcoming" }
        ],
        chips: ["Mansabdars and Jagirdars", "Akbar's Sulh-i Kul", "What was Zabt?"],
        initialQuestion: "Welcome! Today we study **The Mughals (16th to 17th Century)**. Rulers like Akbar established a massive administration system called Mansabdari and promoted peace through 'Sulh-i kul' (universal peace). What do you think made the Mughals so successful at ruling such a diverse land like India?",
        quizzes: [
          {
            question: "Who was the founder of the Mughal Empire in India?",
            options: ["Humayun", "Akbar", "Babur", "Sher Shah Suri"],
            answerIndex: 2,
            explanation: "Babur founded the Mughal Empire by defeating Ibrahim Lodi at the First Battle of Panipat in 1526."
          },
          {
            question: "Under the Mansabdari system, what did 'Zat' represent?",
            options: ["The military rank and salary of a noble", "The number of horses kept", "A land measurement unit", "A tax on markets"],
            answerIndex: 0,
            explanation: "Zat was a numerical value that determined the rank, salary, and status of a Mansabdar in the imperial hierarchy."
          },
          {
            question: "Where did Mansabdars collect revenue from?",
            options: ["Direct cash payments", "Land assignments called Jagirs", "Custom duties at ports", "Forest products"],
            answerIndex: 1,
            explanation: "Mansabdars received salaries in the form of land assignments called Jagirs, from which their agents collected revenue."
          },
          {
            question: "Who was Akbar's famous revenue minister who introduced the Zabt system?",
            options: ["Birbal", "Todar Mal", "Abul Fazl", "Man Singh"],
            answerIndex: 1,
            explanation: "Todar Mal, Akbar's revenue minister, carried out crop surveys and introduced the Zabt system of taxation."
          },
          {
            question: "What was the administrative concept of 'Sulh-i Kul' promoted by Akbar?",
            options: ["Tax on non-Muslims", "Universal Peace and tolerance among different religions", "A military tactic", "A new religious book"],
            answerIndex: 1,
            explanation: "Sulh-i Kul was Akbar's vision of universal peace and tolerance, focusing on ethics, honesty, and justice rather than religious division."
          }
        ]
      },
      {
        id: "tribes-nomads",
        name: "Tribes, Nomads and Settled Communities",
        objective: "Understand the lifestyles of tribal societies, nomadic pastoralists, and mobile traders like Banjaras in medieval India.",
        progress: [
          { id: 1, label: "Tribal Societies vs Caste Societies", status: "completed" },
          { id: 2, label: "Nomads and Mobile Traders (Banjaras)", status: "active" },
          { id: 3, label: "Case Studies: Gonds and Ahoms", status: "upcoming" }
        ],
        chips: ["Who were the Banjaras?", "Gond kingdom administration", "Ahom state and Paiks"],
        initialQuestion: "Welcome! Today we study **Tribes, Nomads and Settled Communities**. While kings ruled big cities, tribal societies lived in forests and hills, and nomads moved with their herds. The Banjaras were mobile traders crucial for transporting grain for royal armies. How do you think nomadic life was different from city life?",
        quizzes: [
          {
            question: "Which group of mobile traders transported grains for sultans and Mughal armies?",
            options: ["Khokhars", "Banjaras", "Gonds", "Ahoms"],
            answerIndex: 1,
            explanation: "The Banjaras were the most important trader-nomads, traveling in caravans (tanda) to sell grains and goods."
          },
          {
            question: "The Gond kingdoms were divided into administrative units called:",
            options: ["Iqtas", "Chaurasis", "Jagirs", "Subas"],
            answerIndex: 1,
            explanation: "Gond kingdoms were divided into Garhs, each controlled by a Gond clan, further split into units of 84 villages called Chaurasi."
          },
          {
            question: "From which country did the Ahoms migrate to the Brahmaputra valley in the 13th century?",
            options: ["Modern Myanmar (Burma)", "Sri Lanka", "Iran", "Nepal"],
            answerIndex: 0,
            explanation: "The Ahoms migrated from modern Myanmar to the Brahmaputra valley and built a powerful state."
          },
          {
            question: "In the Ahom state, what were the forced laborers called?",
            options: ["Scribes", "Muqtis", "Paiks", "Mansabdars"],
            answerIndex: 2,
            explanation: "The Ahom state depended on forced labor, and those forced to work for the state were called Paiks."
          },
          {
            question: "Which Gond queen fought bravely against the Mughal forces of Akbar led by Asaf Khan?",
            options: ["Rani Durgavati", "Rani Lakshmibai", "Rudramadevi", "Rani Didda"],
            answerIndex: 0,
            explanation: "Rani Durgavati, the regent of Garha Katanga, refused to submit to the Mughals and died fighting heroically."
          }
        ]
      },
      {
        id: "devotional-paths",
        name: "Devotional Paths to the Divine",
        objective: "Trace the rise of the Bhakti movement, Sufism, and popular saints (Kabir, Mirabai, Baba Guru Nanak) in medieval India.",
        progress: [
          { id: 1, label: "Nayanars and Alvars of South India", status: "completed" },
          { id: 2, label: "Sufism and Islamic Mysticism", status: "active" },
          { id: 3, label: "Kabir and Baba Guru Nanak Teachings", status: "upcoming" }
        ],
        chips: ["What is Bhakti?", "Sufi Khanqahs", "Teachings of Kabir"],
        initialQuestion: "Welcome! Today we are exploring **Devotional Paths to the Divine**. During the medieval period, saints from all backgrounds rejected rigid rituals and preached love and direct devotion to God. Kabir wrote simple, powerful verses (dohes) that anyone could sing. Why do you think Bhakti and Sufi teachings became so popular among ordinary people?",
        quizzes: [
          {
            question: "Who were the Nayanars?",
            options: ["Devotees of Shiva", "Devotees of Vishnu", "Buddhist monks", "Jain scholars"],
            answerIndex: 0,
            explanation: "The Nayanars were Shiva devotees who traveled in South India preaching devotion to Lord Shiva."
          },
          {
            question: "Who were the Alvars?",
            options: ["Devotees of Shiva", "Devotees of Vishnu", "Sufi saints", "Yogis"],
            answerIndex: 1,
            explanation: "The Alvars were Vishnu devotees who composed hymns of love and devotion collected in the Divya Prabandham."
          },
          {
            question: "What is a 'Khanqah'?",
            options: ["A military weapon", "A Sufi hospice or assembly center", "A coin mint", "A tax record book"],
            answerIndex: 1,
            explanation: "Sufi masters held assemblies in hospices called Khanqahs, where disciples discussed spiritual matters."
          },
          {
            question: "Where did Mirabai, the famous Bhakti saint, compose her devotional songs?",
            options: ["Bengal", "Rajasthan and Gujarat", "Tamil Nadu", "Maharashtra"],
            answerIndex: 1,
            explanation: "Mirabai was a Rajput princess who became a disciple of Ravidas, composing emotional bhajans in Rajasthan/Gujarat."
          },
          {
            question: "What is the holy book containing compilation of teachings of Baba Guru Nanak and other Bhakti saints?",
            options: ["Gita", "Guru Granth Sahib", "Ramayana", "Quran"],
            answerIndex: 1,
            explanation: "The Guru Granth Sahib contains compiled teachings of Baba Guru Nanak, Guru Angad, Kabir, Ravidas, and Baba Farid."
          }
        ]
      },
      {
        id: "regional-cultures",
        name: "The Making of Regional Cultures",
        objective: "Explore the development of regional languages (Malayalam, Bengali), literature, painting styles (Miniatures), and temple architecture (Jagannatha cult).",
        progress: [
          { id: 1, label: "Cheras and Malayalam Language", status: "completed" },
          { id: 2, label: "The Jagannatha Cult of Orissa", status: "active" },
          { id: 3, label: "Miniature Paintings & Bengali Literature", status: "upcoming" }
        ],
        chips: ["Cheras and Malayalam", "Miniature paintings", "Growth of Bengali"],
        initialQuestion: "Welcome! Today we study **The Making of Regional Cultures**. We often identify people by the language they speak or the food they eat. But did you know that many regional languages and art styles, like Kathak dance or Miniature paintings, grew under royal patronage? How does art reflect a region's culture?",
        quizzes: [
          {
            question: "Which kingdom introduced Malayalam language in its official inscriptions in the 9th century?",
            options: ["Chola", "Chera", "Pandya", "Rashtrakuta"],
            answerIndex: 1,
            explanation: "The Chera kingdom of Mahodayapuram introduced Malayalam language and script in its official inscriptions."
          },
          {
            question: "The famous temple of Jagannatha is located in which state?",
            options: ["Kerala", "Puri, Odisha", "Tamil Nadu", "Gujarat"],
            answerIndex: 1,
            explanation: "The Jagannatha temple, dedicated to Lord Vishnu, is located in Puri, Odisha, and is a major pilgrimage center."
          },
          {
            question: "What are 'Miniature' paintings?",
            options: ["Paintings on giant stone walls", "Small-sized paintings done in water color on cloth or paper", "Paintings made using oil colors on canvas", "Glass engravings"],
            answerIndex: 1,
            explanation: "Miniatures are small-sized paintings, usually done in water color on paper or cloth, popular under Mughal and Rajput rulers."
          },
          {
            question: "The classical dance form 'Kathak' is traditionally associated with which region?",
            options: ["Kerala", "North India", "Odisha", "Tamil Nadu"],
            answerIndex: 1,
            explanation: "Kathak emerged in North India, starting as storyteller performances in temples, and evolved into a court dance."
          },
          {
            question: "The text 'Lilatilakam' deals with grammar and poetics. What language mixture did it use?",
            options: ["Prakrit and Hindi", "Mani-pravalam (Sanskrit and Tamil/Malayalam)", "Persian and Urdu", "Sanskrit and Prakrit"],
            answerIndex: 1,
            explanation: "Lilatilakam, written in the 14th century, deals with grammar and poetics and was written in Mani-pravalam ('diamonds and corals')."
          }
        ]
      },
      {
        id: "political-formations",
        name: "Eighteenth-Century Political Formations",
        objective: "Analyze the decline of the Mughal Empire and the rise of new independent states (Marathas, Sikhs, Jats, Hyderabad, Awadh).",
        progress: [
          { id: 1, label: "Decline of the Mughal Empire", status: "completed" },
          { id: 2, label: "Awadh, Bengal, and Hyderabad", status: "active" },
          { id: 3, label: "Marathas, Sikhs, and Jats", status: "upcoming" }
        ],
        chips: ["Chauth and Sardeshmukhi", "Rise of the Khalsa", "Nawabs of Awadh/Bengal"],
        initialQuestion: "Welcome! Today we look at **Eighteenth-Century Political Formations**. As the Mughal Empire declined in the 1700s, new independent kingdoms like the Marathas, the Sikhs, and regional Nawabs emerged. Shivaji built a powerful Maratha state using guerilla warfare. What challenges do you think new kingdoms faced when breaking away from a giant empire?",
        quizzes: [
          {
            question: "Which Mughal emperor was imprisoned by his son Aurangzeb?",
            options: ["Akbar", "Shah Jahan", "Jahangir", "Humayun"],
            answerIndex: 1,
            explanation: "Shah Jahan was imprisoned by Aurangzeb in Agra Fort for the remaining years of his life."
          },
          {
            question: "Who was the founder of the Asaf Jahi dynasty in Hyderabad?",
            options: ["Nizam-ul-Mulk Asaf Jah", "Saadat Khan", "Murshid Quli Khan", "Alivardi Khan"],
            answerIndex: 0,
            explanation: "Nizam-ul-Mulk Asaf Jah founded the Hyderabad state in 1724 as the Mughal control weakened."
          },
          {
            question: "What were the land taxes 'Chauth' and 'Sardeshmukhi' collected by?",
            options: ["Mughals", "Marathas", "Sikhs", "British"],
            answerIndex: 1,
            explanation: "The Marathas collected Chauth (25% of land revenue) and Sardeshmukhi (an additional 9-10%) from neighboring lands."
          },
          {
            question: "Under whose leadership did the Sikhs organize themselves into a political state in late 17th century?",
            options: ["Guru Nanak", "Guru Gobind Singh", "Banda Bahadur", "Ranjit Singh"],
            answerIndex: 1,
            explanation: "Guru Gobind Singh organized the Khalsa in 1699, leading to the rise of a sovereign Sikh state."
          },
          {
            question: "Who was the ruler of Awadh who established independent administration in 1722?",
            options: ["Saadat Khan Burhan-ul-Mulk", "Safdar Jang", "Shuja-ud-Daula", "Asaf-ud-Daula"],
            answerIndex: 0,
            explanation: "Saadat Khan was appointed governor of Awadh in 1722 and founded a prosperous, independent state."
          }
        ]
      }
    ]
  }
};
