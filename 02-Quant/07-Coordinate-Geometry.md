# Coordinate Geometry

Coordinate geometry gives about 2 to 3 questions per test. Most are about lines: slope, intercepts and where two lines meet. The hard ones use parabolas, circles, or a region bounded by several lines. As a programmer you already think in (x, y), so this topic is mostly about fast, error-free algebra.

Study plan: about 2 study days. Day 1: sections 1 to 3 and practice 1 to 10. Day 2: practice 11 to 25, then review every miss. Sketch every problem on paper, even roughly. A 5 second sketch catches most sign errors.

## 1. What you must know

**The plane**

1. The x-axis is horizontal, the y-axis is vertical, and the origin is (0, 0). A point is written (x, y): across first, then up.
2. Quadrants are numbered counter-clockwise from the top right: I is (+, +), II is (-, +), III is (-, -), IV is (+, -). Example: (-3, 5) is in Quadrant II. Points on an axis are in no quadrant.
3. Unlike geometry figures, coordinate grids on the GRE ARE drawn to scale. You may read values from the grid.

**Distance and midpoint**

4. Distance between (x1, y1) and (x2, y2) = sqrt((x2 - x1)^2 + (y2 - y1)^2). It is Pythagoras on the horizontal and vertical gaps. Example: (1, 1) to (4, 5): gaps 3 and 4, distance 5.
5. Midpoint = ((x1 + x2) / 2, (y1 + y2) / 2). Average the x values and average the y values. Example: (-3, 7) and (5, -1) have midpoint (1, 3).
6. On a horizontal or vertical segment, the distance is just the difference of the coordinates. Example: (1, 1) to (7, 1) is 6.

**Slope**

7. Slope m = rise / run = (y2 - y1) / (x2 - x1). Example: (1, 2) to (3, 8): m = 6 / 2 = 3.
8. Positive slope goes up to the right. Negative slope goes down to the right. A horizontal line has slope 0 and equation y = c. A vertical line has undefined slope and equation x = c.
9. A steeper line has a slope with a larger absolute value. Example: slope -3 is steeper than slope 2.

**Equations of lines**

10. Slope-intercept form: y = mx + b. m is the slope and b is the y-intercept. Example: y = 2x + 3 has slope 2 and crosses the y-axis at (0, 3).
11. Point-slope form: y - y1 = m * (x - x1). Use it when you know one point and the slope. Example: slope 3 through (1, 2): y - 2 = 3 * (x - 1), so y = 3x - 1.
12. To get the slope from ax + by = c, solve for y: slope = -a / b. Example: 2x + 3y = 12 gives y = -(2/3)x + 4, slope -2/3.
13. y-intercept: set x = 0. x-intercept: set y = 0. Example: 3x + 4y = 24 has y-intercept 6 and x-intercept 8.
14. A point is on a line (or any graph) exactly when its coordinates satisfy the equation. Example: (3, 0) is on 2x - 3y = 6 because 6 - 0 = 6.
15. Parallel lines have equal slopes. Perpendicular lines have slopes that multiply to -1 (negative reciprocals). Example: slope 2 is perpendicular to slope -1/2.
16. Two lines meet where both equations hold. Set them equal or substitute. Example: y = 2x + 1 and y = -x + 7: 2x + 1 = -x + 7, x = 2, y = 5.
17. Which quadrants a line y = mx + b crosses depends on the signs of m and b. Example: m > 0 and b > 0 crosses I, II and III and misses IV. Sketch it. Do not memorise a table.

**Parabolas**

18. y = ax^2 + bx + c is a parabola. It opens upward if a > 0 (has a minimum) and downward if a < 0 (has a maximum). The y-intercept is c.
19. The vertex is at x = -b / (2a). Plug that x back in to get the y value. Example: y = x^2 - 6x + 5: x = 3, y = 9 - 18 + 5 = -4. Vertex (3, -4).
20. Vertex form: y = a * (x - h)^2 + k has vertex (h, k). Example: y = (x - 3)^2 + 2 has vertex (3, 2).
21. The roots (x-intercepts) are where y = 0. In factored form y = a * (x - r) * (x - s), the roots are r and s, and the vertex is halfway between them: x = (r + s) / 2.
22. A parabola is symmetric about the vertical line through its vertex.
23. Number of x-intercepts, from the discriminant D = b^2 - 4ac: D > 0 two, D = 0 one (the graph touches the axis), D < 0 none. The same test tells you how many times a line meets a parabola, after you set them equal.

**Circles**

24. x^2 + y^2 = r^2 is a circle with centre (0, 0) and radius r. Example: x^2 + y^2 = 25 has radius 5.
25. (x - h)^2 + (y - k)^2 = r^2 is a circle with centre (h, k) and radius r.
26. For a point (x, y) and the circle x^2 + y^2 = r^2: if x^2 + y^2 < r^2 the point is inside, = r^2 on the circle, > r^2 outside. Example: (7, 7) gives 98 < 100, so it is inside the circle of radius 10.
27. A tangent line is perpendicular to the radius at the point where it touches.

**Reflections and shifts**

28. Reflect a point across the x-axis: (x, y) becomes (x, -y). Across the y-axis: (-x, y). Across the origin: (-x, -y). Across the line y = x: (y, x).
29. Shifting a graph y = f(x): y = f(x) + k moves it up k. y = f(x - h) moves it RIGHT h. y = f(x + h) moves it LEFT h. Example: y = (x + 2)^2 is y = x^2 moved 2 to the left.
30. y = -f(x) flips the graph over the x-axis. y = f(-x) flips it over the y-axis.
31. y = |x| is a V with its corner at the origin. y = |x - h| + k is the same V with its corner at (h, k).

**Regions and areas**

32. y > mx + b is the region above the line. y < mx + b is the region below. Test a point such as (0, 0) if unsure.
33. For the area of a figure on the grid, look for a horizontal or vertical side to use as the base. Example: (1, 1), (7, 1), (4, 6): base 6, height 5, area 15.
34. If no side is horizontal or vertical, draw a box around the figure and subtract the corner triangles. Or use the shoelace formula for a triangle with one vertex at the origin and the others at (a, b) and (c, d): area = |ad - bc| / 2.
35. The triangle cut off by a line and the two axes has area (1/2) * |x-intercept| * |y-intercept|.

## 2. Worked examples

**Example 1 (Multiple choice, one answer)**

What is the distance between the points (-2, 3) and (4, -5)?

(A) 6  (B) 8  (C) 10  (D) 14  (E) 100

Solution:
1. Horizontal gap: 4 - (-2) = 6. Vertical gap: -5 - 3 = -8, so 8.
2. Distance = sqrt(36 + 64) = sqrt(100) = 10.
3. Answer: C.

Fastest method: spot the 6-8-10 triple and skip the square root.

The trap: adding the gaps (14) or forgetting the square root (100).

**Example 2 (Quantitative Comparison)**

Line k passes through the points (1, 2) and (3, 8).

Quantity A: The y-intercept of line k
Quantity B: -1

Solution:
1. Slope = (8 - 2) / (3 - 1) = 3.
2. y = 3x + b. Use (1, 2): 2 = 3 + b, so b = -1.
3. Answer: C.

Fastest method: walk back along the line. From (1, 2), go left 1 and down 3 to reach (0, -1).

**Example 3 (Multiple choice, one answer)**

Line p is perpendicular to the line 2x + 3y = 12 and passes through the point (4, 1). What is the x-intercept of line p?

(A) -5  (B) -10/3  (C) 10/3  (D) 5  (E) 10

Solution:
1. 2x + 3y = 12 becomes y = -(2/3)x + 4. Its slope is -2/3.
2. The perpendicular slope is the negative reciprocal: 3/2.
3. Line p: y - 1 = (3/2) * (x - 4).
4. Set y = 0: -1 = (3/2) * (x - 4), so x - 4 = -2/3 and x = 10/3.
5. Answer: C.

The trap: giving the y-intercept of p, which is -5 (choice A). Read which intercept is asked.

**Example 4 (Numeric entry)**

In the xy-plane, what is the area of the triangle bounded by the x-axis, the y-axis and the line 3x + 4y = 24?

Solution:
1. x-intercept: y = 0 gives x = 8. y-intercept: x = 0 gives y = 6.
2. The triangle has vertices (0, 0), (8, 0), (0, 6). It is a right triangle with legs 8 and 6.
3. Area = (1/2) * 8 * 6 = 24.
4. Answer: 24.

**Example 5 (Select all that apply)**

The graph of y = x^2 - 4x - 5 is drawn in the xy-plane. Which of the following statements are true? Select all that apply.

(A) The graph crosses the x-axis at x = 5.
(B) The vertex of the graph is (2, -9).
(C) The graph crosses the y-axis at (0, 5).
(D) The least value of y on the graph is -9.
(E) The graph is symmetric about the line x = -2.

Solution:
1. Factor: y = (x - 5) * (x + 1). The roots are 5 and -1. A is true.
2. The vertex is halfway between the roots: x = 2. y = 4 - 8 - 5 = -9. B is true.
3. At x = 0, y = -5, not 5. C is false.
4. a = 1 > 0, so the parabola opens upward and the vertex is the lowest point. D is true.
5. The line of symmetry is x = 2, not x = -2. E is false.
6. Answer: A, B, D.

The trap: sign slips. The y-intercept is c with its sign, and the vertex is at -b / (2a) = 4 / 2 = +2.

**Example 6 (Quantitative Comparison)**

In the xy-plane, the point (3, k) lies on the circle x^2 + y^2 = 25.

Quantity A: k
Quantity B: 4

Solution:
1. 9 + k^2 = 25, so k^2 = 16.
2. k = 4 or k = -4.
3. If k = 4 the quantities are equal. If k = -4, B is greater.
4. Answer: D.

The trap: taking only the positive square root.

**Example 7 (Multiple choice, one answer)**

The graph of y = (x - 3)^2 + 2 is shifted 5 units to the left and 4 units down. Which of the following is an equation of the new graph?

(A) y = (x + 2)^2 - 2
(B) y = (x - 8)^2 - 2
(C) y = (x + 2)^2 + 6
(D) y = (x - 8)^2 + 6
(E) y = (x - 2)^2 - 2

Solution:
1. The fastest method is to move the vertex. The old vertex is (3, 2).
2. 5 left and 4 down: new vertex (3 - 5, 2 - 4) = (-2, -2).
3. Vertex form with vertex (-2, -2): y = (x + 2)^2 - 2.
4. Answer: A.

The trap: "left 5" means x + 5 inside the bracket, which feels backwards. Moving the vertex avoids the issue.

**Example 8 (Multiple choice, one answer)**

In the xy-plane, what is the area of the region of all points (x, y) such that y >= |x| and y <= 4?

(A) 8  (B) 16  (C) 24  (D) 32  (E) 64

Solution:
1. y >= |x| is the region on or above the V with its corner at (0, 0).
2. y <= 4 cuts it off with a horizontal line.
3. The V meets y = 4 where |x| = 4, at (-4, 4) and (4, 4).
4. The region is a triangle with vertices (0, 0), (-4, 4), (4, 4). Base 8 (along y = 4), height 4.
5. Area = (1/2) * 8 * 4 = 16. Answer: B.

```
   (-4,4) ________ (4,4)
          \      /
           \    /
            \  /
           (0,0)
```

The trap: using 4 as the base instead of 8, which gives 8.

## 3. Common traps

- Slope upside down. It is change in y over change in x, never the other way.
- Subtracting in different orders on top and bottom of the slope formula. Keep the same point first in both.
- Perpendicular slope needs both steps: flip AND change sign. The perpendicular of 2 is -1/2, not 1/2 and not -2.
- Reading the slope from ax + by = c as a or a/b. Solve for y first: the slope is -a / b.
- Mixing up the x-intercept and the y-intercept. The x-intercept is where y = 0.
- Horizontal shifts look backwards: y = f(x - 3) moves right, y = f(x + 3) moves left.
- For x^2 + y^2 = 25, the radius is 5, not 25.
- Square roots give two values. A point on a circle or parabola with a given x often has two possible y values, which leads to answer D in Quantitative Comparison.
- With negative intercepts or slopes, "greater" means further right on the number line. -1 is greater than -5.
- "Inside the circle" does not include points on the circle.

## 4. Practice

For every Quantitative Comparison question, the answer choices are always:
A = Quantity A is greater. B = Quantity B is greater. C = The two quantities are equal. D = The relationship cannot be determined from the information given.

All problems are set in the xy-plane.

**1. (Multiple choice, one answer)**
What is the midpoint of the segment that joins (-3, 7) and (5, -1)?

(A) (1, 3)  (B) (1, 4)  (C) (2, 6)  (D) (4, -4)  (E) (-4, 4)

**2. (Quantitative Comparison)**
Line k passes through the points (0, 4) and (2, 0).

Quantity A: The slope of line k
Quantity B: -1

**3. (Multiple choice, one answer)**
Which quadrant contains no points of the line y = 2x + 3?

(A) Quadrant I  (B) Quadrant II  (C) Quadrant III  (D) Quadrant IV  (E) The line passes through all four quadrants.

**4. (Numeric entry)**
What is the x-intercept of the line y = 3x - 12?

**5. (Quantitative Comparison)**
A is the point (1, 1) and B is the point (4, 5).

Quantity A: The distance between A and B
Quantity B: 5

**6. (Multiple choice, one answer)**
Which of the following is an equation of the line that is parallel to y = -(1/2)x + 3 and passes through the point (4, 5)?

(A) y = -(1/2)x + 5
(B) y = -(1/2)x + 7
(C) y = 2x - 3
(D) y = (1/2)x + 3
(E) y = -2x + 13

**7. (Quantitative Comparison)**
The point (a, b) lies in Quadrant II.

Quantity A: a + b
Quantity B: 0

**8. (Select all that apply)**
Which of the following points lie on the line 2x - 3y = 6? Select all that apply.

(A) (0, -2)  (B) (3, 0)  (C) (6, 3)  (D) (-3, -4)  (E) (1, -1)

**9. (Multiple choice, one answer)**
At which point do the lines y = 2x + 1 and y = -x + 7 intersect?

(A) (1, 3)  (B) (2, 5)  (C) (3, 4)  (D) (2, 3)  (E) (5, 2)

**10. (Quantitative Comparison)**
Point P is (5, 2). Point Q is the reflection of P across the line y = x.

Quantity A: The distance between P and Q
Quantity B: 4

**11. (Multiple choice, one answer)**
What is the vertex of the parabola y = x^2 - 6x + 5?

(A) (-3, 32)  (B) (3, 4)  (C) (3, -4)  (D) (6, 5)  (E) (-3, -4)

**12. (Quantitative Comparison)**
The line y = mx + b passes through Quadrants I, II and IV, and does not pass through Quadrant III.

Quantity A: m * b
Quantity B: 0

**13. (Select all that apply)**
Which of the following points lie inside the circle x^2 + y^2 = 100 (not on it)? Select all that apply.

(A) (6, 8)  (B) (7, 7)  (C) (-8, 5.5)  (D) (0, -10)  (E) (9, 5)  (F) (-1, 9.9)

**14. (Numeric entry)**
What is the area of the triangle with vertices (1, 1), (7, 1) and (4, 6)?

**15. (Select all that apply)**
Which of the following lines are perpendicular to the line 4x - 2y = 7? Select all that apply.

(A) y = -(1/2)x + 3
(B) x + 2y = 10
(C) 2x + y = 1
(D) 2y = x + 4
(E) 3x + 6y = -1

**16. (Quantitative Comparison)**
Line L passes through the point (2, 3) and has a negative slope.

Quantity A: The x-intercept of line L
Quantity B: The y-intercept of line L

**17. (Multiple choice, one answer)**
The line through (2, 3) and (6, k) is perpendicular to the line through (0, 0) and (3, 6). What is the value of k?

(A) -5  (B) 1  (C) 3  (D) 5  (E) 11

**18. (Quantitative Comparison)**
The graph of y = |x - 2| - 3 crosses the x-axis at two points.

Quantity A: The distance between the two points
Quantity B: 6

**19. (Multiple choice, one answer)**
What is the area of the quadrilateral with vertices (0, 0), (6, 0), (8, 4) and (2, 4), taken in that order?

(A) 8  (B) 12  (C) 16  (D) 20  (E) 24

**20. (Multiple choice, one answer)**
The line y = x + 4 intersects the circle x^2 + y^2 = 10 at points A and B. What is the length of AB?

(A) 1  (B) sqrt(2)  (C) 2  (D) 2 * sqrt(2)  (E) 4

**21. (Quantitative Comparison)**
a > b > 0. Line 1 has equation y = ax + 5 and Line 2 has equation y = bx + 5.

Quantity A: The x-intercept of Line 1
Quantity B: The x-intercept of Line 2

**22. (Select all that apply)**
The line y = 2x + k intersects the parabola y = x^2 at two different points. Which of the following could be the value of k? Select all that apply.

(A) -3  (B) -1  (C) -1/2  (D) 0  (E) 4

**23. (Numeric entry)**
What is the area of the triangle bounded by the three lines y = 2x, y = x/2 and y = -x + 6?

**24. (Multiple choice, one answer)**
The parabola y = a * (x - 1) * (x - 5) has a highest point, and the y-coordinate of that point is 8. What is the y-intercept of the parabola?

(A) -10  (B) -2  (C) 5  (D) 8  (E) 10

**25. (Multiple choice, one answer)**
A circle has its centre at (3, 4) and passes through the origin. Which of the following is an equation of the line that is tangent to the circle at the origin?

(A) y = (4/3)x
(B) y = (3/4)x
(C) y = -(3/4)x
(D) y = -(4/3)x
(E) y = -(3/4)x + 5

---

Answers are below. Finish the problems before you scroll.

---

## 5. Answers and solutions

Answer key: 1 A, 2 B, 3 D, 4 4, 5 C, 6 B, 7 D, 8 A B D, 9 B, 10 A, 11 C, 12 B, 13 B C F, 14 15, 15 A B E, 16 D, 17 B, 18 C, 19 E, 20 D, 21 A, 22 C D E, 23 6, 24 A, 25 C

**1. A.** Average the coordinates: x = (-3 + 5) / 2 = 1, y = (7 + (-1)) / 2 = 3.

**2. B.** Slope = (0 - 4) / (2 - 0) = -2. Since -2 < -1, Quantity B is greater.

**3. D.** Slope and y-intercept are both positive. The line crosses the y-axis at (0, 3) and the x-axis at (-1.5, 0). It rises through III, II and I. For a point in Quadrant IV you need x > 0 and y < 0, but x > 0 gives y > 3.

**4. 4.** Set y = 0: 3x = 12, x = 4.

**5. C.** Gaps are 3 and 4. Distance = 5 (3-4-5 triple). Equal.

**6. B.** Parallel means slope -1/2. y - 5 = -(1/2) * (x - 4), so y = -(1/2)x + 7. Choices C, D and E also pass through (4, 5) but have the wrong slope. Choice A has the right slope but misses the point.

**7. D.** a is negative and b is positive. For (-1, 3), a + b = 2 > 0. For (-3, 1), a + b = -2 < 0. Two outcomes.

**8. A, B, D.** Plug in: (0, -2) gives 0 + 6 = 6, yes. (3, 0) gives 6, yes. (6, 3) gives 12 - 9 = 3, no. (-3, -4) gives -6 + 12 = 6, yes. (1, -1) gives 2 + 3 = 5, no.

**9. B.** 2x + 1 = -x + 7 gives 3x = 6, x = 2, y = 5. Or back-solve: only (2, 5) fits both equations.

**10. A.** Reflection across y = x swaps the coordinates: Q = (2, 5). Distance = sqrt(9 + 9) = 3 * sqrt(2), about 4.24, which is greater than 4.

**11. C.** x = -b / (2a) = 6 / 2 = 3. y = 9 - 18 + 5 = -4. Or factor: (x - 1) * (x - 5), roots 1 and 5, vertex at x = 3.

**12. B.** To pass through II and I and then go down into IV while missing III, the line must cross the y-axis above the origin (b > 0) and fall to the right (m < 0). So m * b is negative.

**13. B, C, F.** Compute x^2 + y^2 and compare with 100. (6, 8): 100, on the circle. (7, 7): 98, inside. (-8, 5.5): 64 + 30.25 = 94.25, inside. (0, -10): 100, on the circle. (9, 5): 106, outside. (-1, 9.9): 1 + 98.01 = 99.01, inside.

**14. 15.** The side from (1, 1) to (7, 1) is horizontal with length 6. The height is the vertical distance from (4, 6) to the line y = 1, which is 5. Area = (1/2) * 6 * 5 = 15.

**15. A, B, E.** 4x - 2y = 7 gives y = 2x - 3.5, slope 2. Perpendicular slope is -1/2. Slopes of the choices: A is -1/2. B is -1/2. C is -2. D is 1/2. E is -3/6 = -1/2.

**16. D.** With slope m < 0: x-intercept = 2 - 3/m and y-intercept = 3 - 2m. If m = -1, both are 5 (equal). If m = -3, the x-intercept is 3 and the y-intercept is 9 (B greater). If m = -1/2, they are 8 and 4 (A greater).

**17. B.** The second line has slope 6 / 3 = 2, so the first has slope -1/2. (k - 3) / (6 - 2) = -1/2 gives k - 3 = -2, k = 1. Choice E (11) comes from making the lines parallel.

**18. C.** Set y = 0: |x - 2| = 3, so x = 5 or x = -1. The distance is 6. Equal.

**19. E.** The sides from (0, 0) to (6, 0) and from (2, 4) to (8, 4) are both horizontal with length 6, so the shape is a parallelogram with base 6 and height 4. Area = 24.

**20. D.** Substitute y = x + 4: x^2 + (x + 4)^2 = 10, so 2x^2 + 8x + 6 = 0, x^2 + 4x + 3 = 0, x = -1 or x = -3. Points (-1, 3) and (-3, 1). Distance = sqrt(4 + 4) = 2 * sqrt(2).

**21. A.** x-intercepts: -5/a and -5/b. Since a > b > 0, 5/a < 5/b, so -5/a > -5/b. Example: a = 5, b = 1 gives -1 and -5, and -1 is greater. The steeper line reaches the x-axis sooner, closer to the origin.

**22. C, D, E.** Set x^2 = 2x + k: x^2 - 2x - k = 0. Two different solutions need the discriminant 4 + 4k > 0, so k > -1. The values -1/2, 0 and 4 work. k = -1 gives exactly one point (the line is tangent). k = -3 gives none.

**23. 6.** Find the corners. y = 2x and y = x/2 meet at (0, 0). y = 2x and y = -x + 6: 3x = 6, point (2, 4). y = x/2 and y = -x + 6: 1.5x = 6, point (4, 2). With one vertex at the origin, area = |ad - bc| / 2 = |2 * 2 - 4 * 4| / 2 = 12 / 2 = 6.

**24. A.** The roots are 1 and 5, so the vertex is at x = 3. There y = a * (2) * (-2) = -4a = 8, so a = -2. At x = 0: y = -2 * (-1) * (-5) = -10.

**25. C.** The radius to the origin runs from (3, 4) to (0, 0) and has slope 4/3. The tangent is perpendicular to it, so its slope is -3/4. It passes through the origin, so y = -(3/4)x. Choice E has the right slope but does not pass through the origin.
