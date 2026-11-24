# Algebra

Algebra is the working language of GRE Quant. About a third of the questions need it directly, and the hard ones reward shortcuts: solving for a whole expression, spotting an identity, or plugging in numbers instead of solving.
Study plan (about 2 days): day 1 = read sections 1 to 3 and do practice 1 to 10. Day 2 = practice 11 to 25, then review every problem you missed or guessed.

## 1. What you must know

**Simplifying and factoring**

1. Distribute: a(b + c) = ab + ac. A minus sign in front flips every sign inside. Example: 5 - (2x - 3) = 8 - 2x.
2. FOIL: (a + b)(c + d) = ac + ad + bc + bd. Example: (x + 3)(x - 5) = x^2 - 2x - 15.
3. Factor out the common factor first. Example: 6x^2 - 9x = 3x(2x - 3).
4. Factor x^2 + bx + c by finding two numbers that multiply to c and add to b. Example: x^2 - 5x - 14 = (x - 7)(x + 2), because -7 * 2 = -14 and -7 + 2 = -5.
5. Cancel factors, never terms. Example: (x^2 - 9)/(x - 3) = (x - 3)(x + 3)/(x - 3) = x + 3 (for x not equal to 3). But (x + 3)/3 is not x + 1.

**Special identities (memorise both directions)**

6. Difference of squares: a^2 - b^2 = (a - b)(a + b). Example: 51^2 - 49^2 = 2 * 100 = 200.
7. Square of a sum: (a + b)^2 = a^2 + 2ab + b^2. Example: (x + 3)^2 = x^2 + 6x + 9.
8. Square of a difference: (a - b)^2 = a^2 - 2ab + b^2.
9. Linking them: (a + b)^2 - (a - b)^2 = 4ab, and a^2 + b^2 = (a + b)^2 - 2ab. Example: if a + b = 7 and ab = 10, then a^2 + b^2 = 49 - 20 = 29.
10. Reciprocal version: (x + 1/x)^2 = x^2 + 2 + 1/x^2. Example: if x + 1/x = 3, then x^2 + 1/x^2 = 7.

**Linear equations and systems**

11. Do the same thing to both sides. Collect x on one side. Example: 3(x - 4) = 2x + 5 gives 3x - 12 = 2x + 5, so x = 17.
12. Clear fractions by multiplying every term by the common denominator. Example: x/2 + x/3 = 10 becomes 3x + 2x = 60, so x = 12.
13. Systems, substitution: solve one equation for one variable and substitute. Example: y = 2x and x + y = 12 gives 3x = 12.
14. Systems, elimination: add or subtract the equations to remove a variable. Example: x + y = 10 and x - y = 4. Add: 2x = 14, x = 7, y = 3.
15. Solve for the expression: if the question asks for x + y or x - y, try adding or subtracting the equations first. Example: 3x + 2y = 17 and 2x + 3y = 13. Subtract: x - y = 4. Add: 5x + 5y = 30, so x + y = 6.
16. You need as many different equations as unknowns to find every unknown. But you may still be able to find a combination with fewer. Two equations that are multiples of each other count as one.

**Quadratics**

17. Set one side to 0, factor, and set each factor to 0. Example: x^2 - 5x - 14 = 0 gives (x - 7)(x + 2) = 0, so x = 7 or x = -2.
18. Never divide both sides by x. You lose the solution x = 0. Example: x^2 = 5x gives x(x - 5) = 0, so x = 0 or x = 5.
19. Quadratic formula for ax^2 + bx + c = 0: x = (-b +/- sqrt(b^2 - 4ac)) / (2a).
20. Discriminant D = b^2 - 4ac. D > 0: two real solutions. D = 0: one. D < 0: none. Example: x^2 + 4x + 5 = 0 has D = 16 - 20 < 0, so no real solution.
21. Sum and product of roots: sum = -b/a, product = c/a. Example: 2x^2 - 7x + 4 = 0 has sum 7/2 and product 2.
22. A quadratic usually gives two values. In QC, two possible values often mean answer D. Check both.
23. The vertex of y = ax^2 + bx + c is at x = -b/(2a). It is the minimum if a > 0 and the maximum if a < 0. Example: x^2 - 4x + 7 has its minimum at x = 2, where the value is 3.

**Inequalities**

24. Treat them like equations, with one extra rule: multiplying or dividing by a negative number flips the sign. Example: -2x > 6 gives x < -3.
25. Never multiply or divide an inequality by a variable unless you know its sign. Example: x/y > 1 does not mean x > y (try x = -3, y = -2).
26. You can add two inequalities that point the same way. You cannot subtract them. Example: x > 2 and y > 3 give x + y > 5.
27. Compound inequalities: do the same thing to all three parts. Example: -3 < 2x + 1 <= 9 gives -4 < 2x <= 8, so -2 < x <= 4.
28. Quadratic inequalities: find the roots, then test the regions. For (x - r)(x - s) with r < s: the product is negative between the roots and positive outside. Example: x^2 - 6x + 8 < 0 gives (x - 2)(x - 4) < 0, so 2 < x < 4.
29. For max and min of products or differences, test the extreme values. Example: if -3 <= x <= 2 and -1 <= y <= 4, the largest xy is 8 and the smallest is -12.

**Absolute value**

30. |A| = c (with c >= 0) means A = c or A = -c. Example: |2x - 3| = 9 gives 2x - 3 = 9 or 2x - 3 = -9, so x = 6 or x = -3.
31. |A| < c means -c < A < c (an "and", one interval). Example: |x - 3| < 4 gives -1 < x < 7.
32. |A| > c means A > c or A < -c (an "or", two rays). Example: |x - 3| > 4 gives x > 7 or x < -1.
33. Distance reading: |x - a| < c means "x is within c of a". This is the fastest way to solve the easy ones.
34. |A| = negative number has no solution. If an absolute value equals an expression with x, check each answer in the original equation.

**Functions and strange symbols**

35. f(x) is a rule. Replace every x with the input, in brackets. Example: f(x) = 2x^2 - 3 gives f(-2) = 2(4) - 3 = 5.
36. Composition works from the inside out. Example: f(x) = 3x + 2 and g(x) = x^2 - 1. f(g(2)) = f(3) = 11.
37. f(a + 1) means replace x by (a + 1). It is not f(a) + 1. Example: f(x) = x^2 gives f(a + 1) = a^2 + 2a + 1.
38. Strange symbols are functions in disguise. Follow the definition exactly, keeping the order. Example: if x # y = x^2 - 2y, then 3 # 2 = 9 - 4 = 5, and 2 # 3 = 4 - 6 = -2.
39. A line f(x) = ax + b is fixed by two points. Slope a = (change in f)/(change in x). Example: f(2) = 7 and f(5) = 16 give a = 3 and b = 1.

**Sequences**

40. Arithmetic sequence (constant difference d): a_n = a_1 + (n - 1)d. Example: 5, 8, 11, ... has a_20 = 5 + 19 * 3 = 62.
41. Sum of an arithmetic sequence: (number of terms) * (first + last)/2. Example: 4 + 7 + ... + 91 (30 terms) = 30 * 95/2 = 1,425.
42. Number of terms in an evenly spaced list: (last - first)/spacing + 1. Example: multiples of 7 from 105 to 294: (294 - 105)/7 + 1 = 28.
43. Geometric sequence (constant ratio r): a_n = a_1 * r^(n-1). Example: 3, 6, 12, ... has a_9 = 3 * 2^8 = 768.
44. Recursive sequence: each term is defined from the one before. Write out the first few terms and look for a pattern or a cycle. Example: a_1 = 2, a_(n+1) = 2a_n - 1 gives 2, 3, 5, 9, 17, ...
45. Repeating sequences: find the cycle length, then use the remainder. Example: 1, 2, 3, 1, 2, 3, ... the 50th term: 50 = 3*16 + 2, so it is the 2nd in the cycle, 2.

**Plugging in and back-solving**

46. Variables in the answer choices: pick easy numbers (2, 3, 5, not 0 or 1), compute the target, and test every option.
47. Numbers in the answer choices: start from option C and move up or down. This is back-solving.
48. QC with variables: test 0, 1, -1, a fraction, a negative and a large number before you trust a pattern.

## 2. Worked examples

**Example 1 (Multiple choice, one answer)**
If 5x + 3y = 31 and 3x + 5y = 25, what is the value of x + y?
(A) 5 (B) 6 (C) 7 (D) 8 (E) 9

Solution: Do not solve for x and y. Add the equations: 8x + 8y = 56, so x + y = 7.
The trap: spending two minutes finding x = 5 and y = 2 separately. That also works, but the test rewards the shortcut.
Answer: C.

**Example 2 (Quantitative Comparison)**
x^2 - 7x + 10 = 0
Quantity A: x
Quantity B: 4

Solution: Factor: (x - 2)(x - 5) = 0, so x = 2 or x = 5. If x = 2, B is greater. If x = 5, A is greater.
The trap: finding one root and stopping.
Answer: D.

**Example 3 (Multiple choice, one answer)**
If x - y = 3 and xy = 10, what is the value of x^2 + y^2?
(A) 9 (B) 19 (C) 23 (D) 29 (E) 49

Solution: (x - y)^2 = x^2 - 2xy + y^2. So x^2 + y^2 = (x - y)^2 + 2xy = 9 + 20 = 29. Check with numbers: x = 5, y = 2 gives 25 + 4 = 29.
The trap: 9, from thinking (x - y)^2 = x^2 + y^2. Subtracting 2xy instead of adding it gives -11, which is impossible for a sum of squares.
Answer: D.

**Example 4 (Select all that apply)**
Which of the following values of x satisfy x^2 - 3x - 10 <= 0?
(A) -3 (B) -2 (C) 0 (D) 4 (E) 5 (F) 6

Solution: Factor: (x - 5)(x + 2) <= 0. The product is negative between the roots and zero at the roots, so -2 <= x <= 5. That includes -2, 0, 4 and 5.
Fastest method: plug each value in. For example x = -3 gives 9 + 9 - 10 = 8, which is not <= 0.
The trap: leaving out the endpoints. "<=" includes them.
Answer: B, C, D and E.

**Example 5 (Numeric entry)**
What is the sum of all solutions of |2x - 3| = 9?

Solution: 2x - 3 = 9 gives x = 6. 2x - 3 = -9 gives x = -3. Sum = 3.
The trap: solving only the positive case and entering 6.
Answer: 3.

**Example 6 (Multiple choice, one answer)**
For all numbers a and b with a not equal to b, the operation @ is defined by a @ b = (a + b)/(a - b). If x @ 2 = 3, what is the value of x?
(A) 1 (B) 2.5 (C) 4 (D) 5 (E) 8

Solution: (x + 2)/(x - 2) = 3. So x + 2 = 3x - 6, 2x = 8, x = 4. Check: 6/2 = 3.
Fastest method: back-solve. Try C first: (4 + 2)/(4 - 2) = 3. Done.
The trap: swapping the order and computing 2 @ x.
Answer: C.

**Example 7 (Multiple choice, one answer)**
What is the sum of the first 30 terms of the arithmetic sequence 4, 7, 10, 13, ...?
(A) 1,305 (B) 1,395 (C) 1,425 (D) 1,470 (E) 2,850

Solution: d = 3. The 30th term is 4 + 29 * 3 = 91. Sum = 30 * (4 + 91)/2 = 30 * 47.5 = 1,425.
The trap: using 30 * 3 instead of 29 * 3 for the last term (gives 94 and a sum of 1,470). Or forgetting to divide by 2 (2,850).
Answer: C.

**Example 8 (Quantitative Comparison)**
f(x) = x^2 + 1 for all numbers x.
Quantity A: f(a + 1) - f(a)
Quantity B: 2a

Solution: f(a + 1) = (a + 1)^2 + 1 = a^2 + 2a + 2. f(a) = a^2 + 1. The difference is 2a + 1. That is always exactly 1 more than 2a, whatever a is.
The trap: treating f(a + 1) as f(a) + 1, or choosing D because a is unknown. The unknown cancels.
Answer: A.

## 3. Common traps

- Losing a root. x^2 = 16 gives x = 4 or x = -4. x^2 = 5x gives x = 0 or x = 5.
- Dividing an inequality by a variable or a negative without flipping or without knowing the sign.
- (x + y)^2 is not x^2 + y^2. The middle term 2xy is the source of many wrong options.
- Solving for x when the question asks for 2x, x + y or x^2. Re-read the question before you answer.
- Sign errors with minus brackets: -(x - 3) = -x + 3.
- f(a + b) is not f(a) + f(b), and f(2x) is not 2f(x), unless you check.
- Strange symbols: the order matters. a # b is usually not b # a.
- Sequences: the n-th term uses (n - 1) steps, not n.
- Absolute value inequalities: "<" gives one interval (and), ">" gives two pieces (or).
- QC with a quadratic or an absolute value: there are usually two cases. Test both before choosing A, B or C.

## 4. Practice

For every Quantitative Comparison (QC) question the answer choices are always:
A = Quantity A is greater. B = Quantity B is greater. C = The two quantities are equal. D = The relationship cannot be determined from the information given.

Time target: about 1 minute 45 seconds per question on average.

**1. (Multiple choice, one answer)**
If 3(x - 4) = 2x + 5, what is the value of x?
(A) 1 (B) 7 (C) 9 (D) 13 (E) 17

**2. (Quantitative Comparison)**
x + y = 10 and x - y = 4
Quantity A: x
Quantity B: y

**3. (Multiple choice, one answer)**
Which of the following is a solution of x^2 - 5x - 14 = 0?
(A) -7 (B) -2 (C) 2 (D) 5 (E) 14

**4. (Quantitative Comparison)**
f(x) = 2x^2 - 3 for all numbers x.
Quantity A: f(-2)
Quantity B: f(2)

**5. (Numeric entry)**
If 2x + 3y = 12 and 4x - 3y = 6, what is the value of x + y?

**6. (Multiple choice, one answer)**
For all numbers x and y, the operation # is defined by x # y = x^2 - 2y. What is the value of 3 # (2 # 1)?
(A) 1 (B) 5 (C) 7 (D) 9 (E) 14

**7. (Quantitative Comparison)**
3x - 7 > 11
Quantity A: x
Quantity B: 6

**8. (Select all that apply)**
Which of the following values of x satisfy |x - 3| < 4?
(A) -2 (B) -1 (C) 0 (D) 3 (E) 6.5 (F) 7

**9. (Multiple choice, one answer)**
The first term of an arithmetic sequence is 5 and the common difference is 3. What is the 20th term?
(A) 57 (B) 60 (C) 62 (D) 65 (E) 68

**10. (Quantitative Comparison)**
Quantity A: (x + 3)^2
Quantity B: x^2 + 9

**11. (Multiple choice, one answer)**
If 3x + 2y = 17 and 2x + 3y = 13, what is the value of x - y?
(A) 1 (B) 2 (C) 3 (D) 4 (E) 6

**12. (Quantitative Comparison)**
x^2 - 6x + 8 < 0
Quantity A: x
Quantity B: 4

**13. (Multiple choice, one answer)**
If x^2 - y^2 = 48 and x - y = 4, what is the value of x?
(A) 8 (B) 10 (C) 12 (D) 16 (E) 32

**14. (Numeric entry)**
In a geometric sequence of real numbers, the 3rd term is 12 and the 6th term is 96. What is the 9th term?

**15. (Quantitative Comparison)**
(x - 2)(x + 5) = 0
Quantity A: x
Quantity B: 3

**16. (Select all that apply)**
For which of the following values of k does the equation x^2 + kx + 9 = 0 have no real solutions?
(A) -5 (B) 0 (C) 6 (D) -8 (E) 4 (F) -6

**17. (Multiple choice, one answer)**
A sequence is defined by a_1 = 2 and a_(n+1) = 2a_n - 1 for all n >= 1. What is the value of a_6?
(A) 17 (B) 31 (C) 33 (D) 63 (E) 65

**18. (Quantitative Comparison)**
r and s are the two solutions of the equation 2x^2 - 7x + 4 = 0.
Quantity A: 1/r + 1/s
Quantity B: 3/2

**19. (Multiple choice, one answer)**
How many integers x satisfy |3x - 5| <= 10?
(A) 4 (B) 5 (C) 6 (D) 7 (E) 8

**20. (Select all that apply)**
If a < b < 0 < c, which of the following must be true?
(A) ab > 0
(B) a + c > b
(C) ac < bc
(D) a^2 < b^2
(E) a/b > 1
(F) b - a < 0

**21. (Multiple choice, one answer)**
If x + 1/x = 5, what is the value of x^2 + 1/x^2?
(A) 21 (B) 23 (C) 24 (D) 25 (E) 27

**22. (Quantitative Comparison)**
x^2 + y^2 = 25 and xy = 12
Quantity A: x + y
Quantity B: 7

**23. (Numeric entry)**
What is the sum of all the multiples of 7 between 100 and 300?

**24. (Select all that apply)**
The equation x^2 + bx + 12 = 0 has two different solutions, and both are positive integers. Which of the following could be the value of b?
(A) -13 (B) -8 (C) -7 (D) 7 (E) 8 (F) 13

**25. (Multiple choice, one answer)**
A sequence is defined by a_1 = 3 and a_n = a_(n-1) + 2n for all n >= 2. What is the value of a_20?
(A) 401 (B) 419 (C) 421 (D) 423 (E) 441

.

.

.

(Answers are below. Finish the set before you scroll.)

.

.

.

## 5. Answers and solutions

**Answer key:** 1 E, 2 A, 3 B, 4 C, 5 5, 6 B, 7 A, 8 C D E, 9 C, 10 D, 11 D, 12 B, 13 A, 14 768, 15 B, 16 A B E, 17 C, 18 A, 19 D, 20 A C E, 21 B, 22 D, 23 5586, 24 A B C, 25 C

**1. E.** 3x - 12 = 2x + 5, so x = 17. Check: 3 * 13 = 39 = 34 + 5.

**2. A.** Add the equations: 2x = 14, x = 7. Then y = 3. So x > y.

**3. B.** (x - 7)(x + 2) = 0, so x = 7 or x = -2. Only -2 is listed. Choice A has the signs reversed.

**4. C.** f(-2) = 2 * 4 - 3 = 5 and f(2) = 5. Squaring removes the sign.

**5. 5.** Add the equations: 6x = 18, x = 3. Then 6 + 3y = 12, y = 2. x + y = 5.

**6. B.** Brackets first: 2 # 1 = 4 - 2 = 2. Then 3 # 2 = 9 - 4 = 5.

**7. A.** 3x > 18, so x > 6. Quantity A is always greater than 6.

**8. C, D, E.** x is within 4 of 3, not including the ends: -1 < x < 7. So 0, 3 and 6.5 work. -1 and 7 are exactly 4 away, which is not less than 4.

**9. C.** a_20 = 5 + 19 * 3 = 62. Choice D uses 20 steps instead of 19.

**10. D.** (x + 3)^2 = x^2 + 6x + 9. Compare 6x with 0. x = 0: equal. x = 1: A greater. x = -1: B greater.

**11. D.** Subtract the second equation from the first: x - y = 4. (Full solution: x = 5, y = 1.)

**12. B.** (x - 2)(x - 4) < 0 means 2 < x < 4. So x is always less than 4.

**13. A.** x^2 - y^2 = (x - y)(x + y), so 48 = 4(x + y) and x + y = 12. With x - y = 4: 2x = 16, x = 8 (and y = 4).

**14. 768.** From the 3rd to the 6th term is 3 steps: r^3 = 96/12 = 8, so r = 2. From the 6th to the 9th is 3 more steps: 96 * 8 = 768.

**15. B.** x = 2 or x = -5. Both are less than 3. Two roots do not always mean D. Check them.

**16. A, B, E.** No real solutions when the discriminant is negative: k^2 - 36 < 0, so -6 < k < 6. That includes -5, 0 and 4. k = 6 and k = -6 give exactly one solution (x = -3 or x = 3), and k = -8 gives two.

**17. C.** Write the terms: 2, 3, 5, 9, 17, 33. a_6 = 33. (Pattern: a_n = 2^(n-1) + 1.)

**18. A.** 1/r + 1/s = (r + s)/(rs). Sum of roots = 7/2, product = 4/2 = 2. So the value is (7/2)/2 = 7/4 = 1.75, which is greater than 1.5.

**19. D.** -10 <= 3x - 5 <= 10, so -5 <= 3x <= 15, so -5/3 <= x <= 5. The integers are -1, 0, 1, 2, 3, 4, 5. That is 7.

**20. A, C, E.** Test a = -5, b = -1, c = 1. (A) two negatives multiply to a positive, true. (B) -4 > -1 is false. (C) multiply a < b by positive c: ac < bc, true. (D) a is further from 0, so a^2 > b^2, false. (E) a/b is positive and |a| > |b|, so a/b > 1, true. (F) b - a > 0 because b > a, false.

**21. B.** Square both sides: x^2 + 2 + 1/x^2 = 25. So x^2 + 1/x^2 = 23. The trap is 25 (forgetting the middle term 2 * x * 1/x = 2).

**22. D.** (x + y)^2 = x^2 + y^2 + 2xy = 25 + 24 = 49. So x + y = 7 or x + y = -7. For example x = 3, y = 4 gives 7 (equal), and x = -3, y = -4 gives -7 (B greater).

**23. 5586.** The first multiple is 105 = 7 * 15 and the last is 294 = 7 * 42. Number of terms = 42 - 15 + 1 = 28. Sum = 28 * (105 + 294)/2 = 28 * 199.5 = 5,586.

**24. A, B, C.** The product of the roots is 12 and the sum is -b. Pairs of different positive integers with product 12: (1, 12), (2, 6), (3, 4). Their sums are 13, 8, 7, so b = -13, -8 or -7. The positive options are the sign trap: they give negative roots.

**25. C.** a_20 = 3 + 2(2 + 3 + ... + 20). The sum 2 + 3 + ... + 20 = (1 + 2 + ... + 20) - 1 = 210 - 1 = 209. So a_20 = 3 + 418 = 421. Choice D adds 2(1 + ... + 20) = 420 to 3. The rule starts at n = 2, so the 2 * 1 step does not exist.
