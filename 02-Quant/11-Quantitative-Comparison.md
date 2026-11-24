# Quantitative Comparison (QC): strategy

Quantitative Comparison is a major official question type, but ETS does not promise a fixed count in each section. These can be fast points when you know the method and costly traps when you assume more than the question states. Study this file in week 1, then use the method in every mixed Quant set.

## 1. The format

You get Quantity A and Quantity B, sometimes with extra information above them. The four choices never change, so memorise them now:

- **A**: Quantity A is greater
- **B**: Quantity B is greater
- **C**: the two quantities are equal
- **D**: the relationship cannot be determined from the information given

## 2. The rules

1. **You are comparing, not calculating.** Stop as soon as you know which is bigger. Most QC questions should take under 75 seconds.
2. **If both quantities are pure numbers (no variables), the answer is never D.** Something can always be computed.
3. **D means "it changes".** To prove D you need just two cases that give different results (for example A bigger once, equal once). To choose A, B or C, the result must hold in *every* allowed case.
4. **Test the special numbers.** When there are variables, try these in order: **0, 1, −1, a fraction between 0 and 1 (1/2), a negative fraction (−1/2), a big number (10), a big negative (−10).** Use the short name **ZONE-F**: Zero, One, Negative, Extreme, Fraction.
5. **Respect the constraints.** If the question says x > 0, or x is an integer, you may only test numbers that fit. Read the information above the quantities twice.
6. **Simplify both sides like an inequality.** You can add or subtract the same thing on both sides, and multiply or divide both sides by the same **positive** number. Never multiply or divide by a variable unless you know its sign.
7. **Never trust the picture.** Geometry figures in QC are not drawn to scale. If a length or angle isn't given, it can change. Redraw the figure in an extreme way and see if the answer changes.
8. **Make the two sides look alike.** Factor, expand, find a common denominator, or write both as powers of the same base before you compare.
9. **Estimate.** If Quantity A is "a bit more than 40" and Quantity B is "a bit less than 40", you're done.

## 3. Worked examples

**Example 1 (special numbers).** Quantity A: x^2. Quantity B: x.
Try x = 2: 4 vs 2, A is bigger. Try x = 1: 1 vs 1, equal. Two different results, so the answer is **D**.
The trap: testing only "normal" positive integers and answering A.

**Example 2 (constraint changes everything).** x > 1. Quantity A: x^2. Quantity B: x.
Now for every x > 1, x^2 > x (multiply both sides of x > 1 by the positive number x). Answer **A**.

**Example 3 (simplify, don't compute).** Quantity A: 49 × 51. Quantity B: 50^2.
49 × 51 = (50 − 1)(50 + 1) = 50^2 − 1. So B is bigger by 1. Answer **B**. No calculator needed.

**Example 4 (cancel the common part).** Quantity A: (1/3 + 1/5 + 1/7). Quantity B: (1/3 + 1/5 + 1/8).
Subtract 1/3 + 1/5 from both sides. Compare 1/7 with 1/8. 1/7 is bigger. Answer **A**.

**Example 5 (don't divide by an unknown sign).** xy > 0. Quantity A: x/y. Quantity B: y/x.
xy > 0 means x and y have the same sign, but nothing about size. x = 2, y = 1: 2 vs 1/2, A bigger. x = 1, y = 2: B bigger. Answer **D**.

**Example 6 (hidden equality).** x + y = 10 and x − y = 4. Quantity A: x^2 − y^2. Quantity B: 40.
x^2 − y^2 = (x + y)(x − y) = 10 × 4 = 40. Answer **C**.
Rule of thumb: when the numbers work out "too neatly", check for C. When there is a variable with no restriction, check for D.

**Example 7 (geometry, not to scale).** In triangle ABC, AB = 5 and BC = 7. Quantity A: AC. Quantity B: 8.
The third side must be between 7 − 5 = 2 and 7 + 5 = 12. AC could be 3 (B bigger) or 11 (A bigger). Answer **D**.

**Example 8 (percent wording).** Quantity A: 30% of 70. Quantity B: 70% of 30.
x% of y always equals y% of x. Both are 21. Answer **C**.

## 4. Common traps

- Forgetting that a variable can be **zero, negative or a fraction**.
- Choosing C because one test case gave equality. One case proves nothing. Test again.
- Choosing D on a question with only numbers.
- Assuming that a figure "looks like" a right angle, a square or an equal length.
- Squaring both sides or cross-multiplying without knowing the signs.
- Missing words in the given information: **integer, positive, non-zero, distinct, consecutive**.
- Spending 3 minutes computing. If you are doing heavy arithmetic on a QC question, you have missed the shortcut.

## 5. Mini drill (answers below)

1. Quantity A: 2^30. Quantity B: 4^14.
2. x < 0. Quantity A: x^3. Quantity B: x^2.
3. Quantity A: the average of 10, 20 and 60. Quantity B: the median of 10, 20 and 60.
4. 0 < x < 1. Quantity A: 1/x. Quantity B: x^2.
5. Quantity A: (x + 3)^2. Quantity B: x^2 + 9.
6. A circle has circumference 10 pi. Quantity A: the area of the circle. Quantity B: 75.
7. n is a positive integer. Quantity A: the remainder when 2n + 1 is divided by 2. Quantity B: 1.
8. Quantity A: 0.999 × 1001. Quantity B: 1000.
9. A rectangle has perimeter 20. Quantity A: the area of the rectangle. Quantity B: 25.
10. x and y are integers and x > y. Quantity A: x^2. Quantity B: y^2.

**Answers**

1. **A.** 4^14 = 2^28, and 2^30 > 2^28.
2. **B.** A negative cubed is negative, and a square is positive.
3. **A.** The average is 30 and the median is 20.
4. **A.** 1/x is greater than 1, and x^2 is less than 1.
5. **D.** (x + 3)^2 = x^2 + 6x + 9. The difference is 6x, which can be positive, zero or negative.
6. **A.** r = 5, so the area is 25 pi, about 78.5.
7. **C.** 2n + 1 is always odd, so the remainder is 1.
8. **B.** (1 − 0.001)(1000 + 1) = 1000 + 1 − 1 − 0.001 = 999.999.
9. **D.** The area is at most 25 (a 5 by 5 square, which counts as a rectangle), and it can be smaller (9 by 1 gives 9). So it is sometimes equal and sometimes less.
10. **D.** x = 2, y = 1 gives A bigger. x = 1, y = −5 gives B bigger.
