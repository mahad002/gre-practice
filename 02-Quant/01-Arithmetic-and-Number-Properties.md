# Arithmetic and Number Properties

Number properties sit underneath almost every GRE Quant question, and they are the favourite source of hard Quantitative Comparison questions. The rules are simple, but the test hides them behind words like "integer", "positive", "factor" and "remainder".
Study plan (about 2 days): day 1 = read sections 1 to 3 and do practice 1 to 10. Day 2 = practice 11 to 25, then review every problem you missed or guessed.

## 1. What you must know

**Types of numbers**

1. Integers are whole numbers: ..., -2, -1, 0, 1, 2, ... Zero is an integer. It is even. It is neither positive nor negative. Example: "non-negative integers" means 0, 1, 2, 3, ...
2. "Number" on the GRE means any real number, not only integers. If the question does not say "integer", you must also test fractions and negatives. Example: x^2 > x is false for x = 1/2.
3. A factor (divisor) of n divides n with no remainder. A multiple of n is n times an integer. Example: factors of 12 are 1, 2, 3, 4, 6, 12. Multiples of 12 are 12, 24, 36, ... (and also 0, -12, ...).

**Odd and even**

4. Addition and subtraction: even +/- even = even, odd +/- odd = even, even +/- odd = odd. Example: 7 + 9 = 16.
5. Multiplication: a product is even if at least one factor is even. It is odd only if every factor is odd. Example: 3 * 5 * 7 is odd, 3 * 5 * 8 is even.
6. There are no parity rules for division. Example: 12/4 = 3 (odd), 12/2 = 6 (even), 12/8 is not an integer.
7. A power keeps the parity of its base (for positive integer exponents). Example: 7^10 is odd, 6^3 is even.

**Positive and negative**

8. Same signs multiply or divide to a positive. Different signs give a negative. Example: (-3)(-4) = 12, (-3)(4) = -12.
9. A product of several numbers is negative if it has an odd number of negative factors (and no zero). Example: (-1)(-2)(-3) = -6.
10. An even power is never negative. An odd power keeps the sign of the base. Example: (-2)^4 = 16, (-2)^3 = -8.
11. Subtracting a negative is adding. Example: 5 - (-3) = 8.

**Primes and prime factorisation**

12. A prime has exactly two positive factors: 1 and itself. 1 is not prime. 2 is the only even prime. Memorise the primes under 60: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59.
13. To test whether n is prime, try dividing by primes up to sqrt(n). Example: 97 is prime because 2, 3, 5, 7 do not divide it and 11^2 = 121 > 97.
14. Every integer greater than 1 has exactly one prime factorisation. Example: 360 = 2^3 * 3^2 * 5.
15. Number of positive factors: add 1 to each exponent in the prime factorisation and multiply. Example: 360 has (3+1)(2+1)(1+1) = 24 factors.
16. A perfect square has only even exponents in its prime factorisation, and it has an odd number of factors. Example: 36 = 2^2 * 3^2 has 9 factors.
17. A number with exactly 3 factors is the square of a prime. Example: 49 has factors 1, 7, 49.

**GCD and LCM**

18. GCD (greatest common divisor): take each shared prime with the smaller exponent. LCM (least common multiple): take every prime with the larger exponent. Example: 12 = 2^2 * 3 and 18 = 2 * 3^2, so GCD = 2 * 3 = 6 and LCM = 2^2 * 3^2 = 36.
19. For two positive integers, GCD * LCM = product of the two numbers. Example: 6 * 36 = 216 = 12 * 18.
20. If n is divisible by a and by b, then n is divisible by LCM(a, b). It is not always divisible by a * b. Example: 12 is divisible by 4 and 6 but not by 24.
21. "Things repeat together" questions (bells, lights, laps) use the LCM. "Largest equal groups" questions use the GCD.

**Divisibility rules (memorise)**

22. 2: last digit even. 5: last digit 0 or 5. 10: last digit 0.
23. 3: digit sum divisible by 3. 9: digit sum divisible by 9. Example: 2,347 has digit sum 16, so it is divisible by neither.
24. 4: last two digits divisible by 4. 8: last three digits divisible by 8. Example: 5,316 is divisible by 4 because 16 is.
25. 6: divisible by 2 and by 3. 12: divisible by 3 and by 4.
26. 11: (sum of digits in odd positions) minus (sum of digits in even positions) is 0 or a multiple of 11. Example: 2,728 gives (2 + 2) - (7 + 8) = -11, so it is divisible by 11.

**Remainders**

27. "n divided by d leaves remainder r" means n = d*q + r with 0 <= r < d. Example: 17 = 5*3 + 2, so the remainder is 2.
28. The numbers with a given remainder are evenly spaced. Example: remainder 2 when divided by 5 gives 2, 7, 12, 17, ... Do not forget the first one (2 itself, with quotient 0).
29. Remainders can be added and multiplied, then reduced again. Example: if n leaves remainder 4 when divided by 7, then 3n + 5 leaves the same remainder as 3*4 + 5 = 17, which is 3.
30. The remainder when dividing by 10 is the units digit. The remainder when dividing by 9 equals the remainder of the digit sum.
31. Fastest method for remainder questions: plug in the smallest number that fits. If n leaves remainder 4 when divided by 7, use n = 4.

**Units digit cycles (memorise)**

32. The units digit of a product or power depends only on the units digits. The cycles for powers are:
    - 0, 1, 5, 6: always the same digit.
    - 2: 2, 4, 8, 6 (repeats every 4).
    - 3: 3, 9, 7, 1 (every 4).
    - 4: 4, 6 (odd power gives 4, even power gives 6).
    - 7: 7, 9, 3, 1 (every 4).
    - 8: 8, 4, 2, 6 (every 4).
    - 9: 9, 1 (odd power gives 9, even power gives 1).
33. For a cycle of 4, divide the exponent by 4 and use the remainder. Remainder 0 means the last digit in the cycle. Example: 7^83, and 83 = 4*20 + 3, so take the third digit in 7, 9, 3, 1, which is 3.

**Consecutive integers**

34. Consecutive integers: n, n+1, n+2, ... Consecutive even or odd integers: n, n+2, n+4, ...
35. The number of integers from a to b inclusive is b - a + 1. Example: from 15 to 40 there are 26 integers.
36. For an evenly spaced list, average = median = (first + last)/2, and sum = average * number of terms. Example: 1 + 2 + ... + 100 = 50.5 * 100 = 5,050.
37. Among any k consecutive integers, exactly one is divisible by k. So the product of k consecutive integers is divisible by k! (k factorial). Example: 4 * 5 * 6 = 120 is divisible by 6.
38. Count of multiples of k from 1 to N is the integer part of N/k. Count of multiples of a or b = (multiples of a) + (multiples of b) - (multiples of LCM(a, b)).

**Number line and absolute value**

39. |x| is the distance from x to 0. It is never negative. |x - a| is the distance from x to a. Example: |3 - 8| = 5.
40. |x| = x if x >= 0, and |x| = -x if x < 0. Example: |-7| = 7.
41. |a + b| <= |a| + |b|. They are equal only when a and b have the same sign (or one is 0). Example: |5 + (-3)| = 2 but |5| + |-3| = 8.
42. On the number line, numbers to the left are smaller. For negatives the "bigger looking" number is smaller. Example: -8 < -3.

**Order of operations, decimals and rounding**

43. PEMDAS: parentheses, exponents, then multiplication and division from left to right, then addition and subtraction from left to right. Example: 18 - 12 / 3 * 2 = 18 - 4 * 2 = 10.
44. -3^2 = -9 (the exponent comes first). (-3)^2 = 9.
45. Place values: in 4,827.365 the 8 is hundreds, 2 is tens, 7 is units, 3 is tenths, 6 is hundredths, 5 is thousandths.
46. Rounding: look only at the next digit to the right. 5 or more rounds up, 4 or less rounds down. Example: 3.449 to the nearest tenth is 3.4, not 3.5.
47. Multiplying by 10^k moves the decimal point k places right. Dividing moves it left. Example: 0.0037 * 10^3 = 3.7.
48. The on-screen GRE calculator follows the order of operations, but it shows at most 8 digits. Use it for messy arithmetic, never for number-property logic.

## 2. Worked examples

**Example 1 (Quantitative Comparison)**
x is an integer greater than 1.
Quantity A: The number of distinct prime factors of x
Quantity B: The number of distinct prime factors of x^3

Solution: Cubing only triples each exponent. It adds no new primes. If x = 12 = 2^2 * 3, then x^3 = 2^6 * 3^3. Both have the primes 2 and 3.
Fastest method: plug in x = 2 and x = 12. Both give equal quantities, and the reasoning shows it is always so.
The trap: thinking a bigger number must have more prime factors.
Answer: C.

**Example 2 (Multiple choice, one answer)**
When the positive integer n is divided by 7, the remainder is 4. What is the remainder when 3n + 5 is divided by 7?
(A) 1 (B) 2 (C) 3 (D) 4 (E) 5

Solution: Plug in the easiest n, which is n = 4. Then 3n + 5 = 17, and 17 = 7*2 + 3. The remainder is 3. Check with n = 11: 38 = 7*5 + 3. Same.
The trap: answering 17 mod nothing, or choosing 4 because the remainder "stays the same".
Answer: C.

**Example 3 (Multiple choice, one answer)**
What is the units digit of 3^47 + 4^22?
(A) 1 (B) 3 (C) 5 (D) 7 (E) 9

Solution: Powers of 3 cycle 3, 9, 7, 1. 47 = 4*11 + 3, so 3^47 ends in 7. Powers of 4 end in 6 for even exponents, so 4^22 ends in 6. 7 + 6 = 13, so the units digit is 3.
The trap: using the remainder 3 as the answer digit instead of as a position in the cycle.
Answer: B.

**Example 4 (Select all that apply)**
The positive integer n is divisible by both 6 and 10. Which of the following must n be divisible by?
(A) 12 (B) 15 (C) 20 (D) 30 (E) 60

Solution: n must be divisible by LCM(6, 10) = 30. So n is divisible by every factor of 30, including 15 and 30. Test the smallest case n = 30: it is not divisible by 12, 20 or 60.
The trap: multiplying 6 * 10 = 60 and choosing 60.
Answer: B and D.

**Example 5 (Numeric entry)**
One light flashes every 12 seconds and another flashes every 18 seconds. They flash together at time 0. Counting the flash at time 0, how many times do they flash together during the first 10 minutes?

Solution: They flash together every LCM(12, 18) = 36 seconds. 10 minutes = 600 seconds. 600/36 = 16.67, so there are 16 joint flashes after time 0 (the last at 576 seconds). Add the one at time 0: 17.
The trap: forgetting the flash at time 0 (answering 16), or using 12 * 18 = 216.
Answer: 17.

**Example 6 (Quantitative Comparison)**
xy < 0
Quantity A: |x + y|
Quantity B: |x| + |y|

Solution: xy < 0 means x and y have opposite signs and neither is 0. With opposite signs, the two numbers partly cancel inside |x + y|. Try x = 5, y = -3: A = 2, B = 8. Try x = -1, y = 1: A = 0, B = 2. B is always greater.
The trap: choosing C from the rule |a + b| = |a| + |b|, which is true only for same signs, or choosing D without using the condition xy < 0.
Answer: B.

**Example 7 (Multiple choice, one answer)**
How many positive odd factors does 360 have?
(A) 4 (B) 6 (C) 8 (D) 12 (E) 24

Solution: 360 = 2^3 * 3^2 * 5. An odd factor uses no 2s. So count the factors of 3^2 * 5: (2+1)(1+1) = 6. They are 1, 3, 5, 9, 15, 45.
The trap: 24 is the total number of factors. Halving it to 12 is also wrong.
Answer: B.

**Example 8 (Numeric entry)**
How many integers n satisfy |n - 4| <= 6.5?

Solution: The distance from n to 4 is at most 6.5, so -2.5 <= n <= 10.5. The integers are -2, -1, ..., 10. Count: 10 - (-2) + 1 = 13.
The trap: forgetting the "+ 1" when counting inclusive lists, or forgetting 0 and the negatives.
Answer: 13.

## 3. Common traps

- Zero. It is an integer, it is even, it is not positive and not negative, and it is a multiple of every integer. Always test it in QC questions unless it is excluded.
- 1 is not prime. 2 is prime and even. "Prime" does not mean "odd".
- "Number" is not "integer". If the question does not say integer, test fractions like 1/2 and negatives.
- Divisible by a and by b means divisible by LCM(a, b), not by a * b.
- Remainders: the smallest number with remainder r when divided by d is r itself (quotient 0), as long as the question allows it.
- Counting inclusive lists: last - first + 1. Counting "between" (exclusive): last - first - 1.
- -3^2 is -9. Many answer choices are built on reading it as 9.
- "Factors" on the GRE means positive factors unless stated otherwise. "Distinct prime factors" counts each prime once: 72 has two (2 and 3).
- Rounding happens once, from the original number. 3.449 rounds to 3.4, not 3.45 then 3.5.
- In "or" counting (multiples of 4 or 6), subtract the overlap once. Forgetting it double-counts.

## 4. Practice

For every Quantitative Comparison (QC) question the answer choices are always:
A = Quantity A is greater. B = Quantity B is greater. C = The two quantities are equal. D = The relationship cannot be determined from the information given.

Time target: about 1 minute 45 seconds per question on average.

**1. (Quantitative Comparison)**
Quantity A: The number of positive factors of 36
Quantity B: The number of positive factors of 48

**2. (Multiple choice, one answer)**
What is the remainder when 2,347 is divided by 9?
(A) 1 (B) 4 (C) 5 (D) 7 (E) 8

**3. (Multiple choice, one answer)**
What is the least common multiple of 18 and 24?
(A) 36 (B) 48 (C) 72 (D) 144 (E) 432

**4. (Quantitative Comparison)**
n is an integer.
Quantity A: (-1)^n * (-1)^(n+1)
Quantity B: 0

**5. (Numeric entry)**
What is the greatest prime factor of 1,001?

**6. (Select all that apply)**
Which of the following integers are divisible by 12?
(A) 132 (B) 198 (C) 252 (D) 324 (E) 438 (F) 516

**7. (Multiple choice, one answer)**
If x is an odd integer and y is an even integer, which of the following must be odd?
(A) xy (B) x + y + 1 (C) x^2 + y (D) 2x + y (E) x(y + 2)

**8. (Quantitative Comparison)**
Quantity A: 0.0499 rounded to the nearest hundredth
Quantity B: 0.0451 rounded to the nearest hundredth

**9. (Multiple choice, one answer)**
The sum of five consecutive integers is 365. What is the greatest of the five integers?
(A) 69 (B) 71 (C) 72 (D) 73 (E) 75

**10. (Quantitative Comparison)**
Quantity A: 18 - 12 / 3 * 2 + 1
Quantity B: (18 - 12) / (3 * 2) + 10

**11. (Multiple choice, one answer)**
What is the units digit of 7^83?
(A) 1 (B) 3 (C) 5 (D) 7 (E) 9

**12. (Quantitative Comparison)**
When the positive integer n is divided by 6, the remainder is 5.
Quantity A: The remainder when n is divided by 3
Quantity B: The remainder when n is divided by 2

**13. (Select all that apply)**
n is a positive integer and n^2 is divisible by 72. Which of the following must be a factor of n?
(A) 4 (B) 6 (C) 8 (D) 9 (E) 12 (F) 24

**14. (Multiple choice, one answer)**
How many integers from 1 to 200, inclusive, are divisible by 4 or by 6?
(A) 66 (B) 67 (C) 75 (D) 83 (E) 84

**15. (Numeric entry)**
What is the smallest positive integer that leaves a remainder of 2 when divided by 5 and a remainder of 3 when divided by 7?

**16. (Quantitative Comparison)**
p is a prime number greater than 3.
Quantity A: The remainder when p^2 is divided by 12
Quantity B: 1

**17. (Multiple choice, one answer)**
How many positive factors does 2,520 have?
(A) 48 (B) 60 (C) 72 (D) 96 (E) 120

**18. (Quantitative Comparison)**
a and b are positive integers and the greatest common divisor of a and b is 6.
Quantity A: The least common multiple of a and b
Quantity B: 36

**19. (Select all that apply)**
Which of the following could be the remainder when the square of an integer is divided by 8?
(A) 0 (B) 1 (C) 2 (D) 3 (E) 4 (F) 5

**20. (Multiple choice, one answer)**
When the positive integer n is divided by 12, the remainder is 7. What is the remainder when n^2 + n is divided by 12?
(A) 0 (B) 2 (C) 8 (D) 9 (E) 11

**21. (Multiple choice, one answer)**
How many positive integers less than 1,000 have exactly three positive factors?
(A) 8 (B) 9 (C) 10 (D) 11 (E) 12

**22. (Quantitative Comparison)**
n is a positive integer.
Quantity A: The units digit of 3^(4n+2) + 7^(4n+1)
Quantity B: The units digit of 2^(4n+3)

**23. (Numeric entry)**
What is the greatest integer k such that 6^k is a factor of 50! (50 factorial, the product of the integers from 1 to 50)?

**24. (Select all that apply)**
a and b are integers and 3a + 5b is even. Which of the following must be true?
(A) a + b is even
(B) ab is even
(C) a - b is even
(D) a^2 + b is even
(E) ab + a is even
(F) 3a - b is divisible by 4

**25. (Multiple choice, one answer)**
How many integers from 1 to 1,000, inclusive, are divisible by none of 2, 3 and 5?
(A) 234 (B) 266 (C) 267 (D) 300 (E) 734

.

.

.

(Answers are below. Finish the set before you scroll.)

.

.

.

## 5. Answers and solutions

**Answer key:** 1 B, 2 D, 3 C, 4 B, 5 13, 6 A C D F, 7 C, 8 C, 9 E, 10 C, 11 B, 12 A, 13 A B E, 14 B, 15 17, 16 C, 17 A, 18 D, 19 A B E, 20 C, 21 D, 22 B, 23 22, 24 A C D E, 25 B

**1. B.** 36 = 2^2 * 3^2 has (2+1)(2+1) = 9 factors. 48 = 2^4 * 3 has (4+1)(1+1) = 10 factors. The smaller number has fewer factors here, but only the exponents decide that.

**2. D.** The digit sum is 2 + 3 + 4 + 7 = 16. The remainder of 16 divided by 9 is 7. Check: 9 * 260 = 2,340 and 2,347 - 2,340 = 7.

**3. C.** 18 = 2 * 3^2 and 24 = 2^3 * 3. Take the larger exponents: 2^3 * 3^2 = 72. 432 is the product, which is a common multiple but not the least.

**4. B.** Add the exponents: (-1)^(2n+1). 2n + 1 is always odd, so Quantity A is -1. That is less than 0.

**5. 13.** 1,001 = 7 * 143 = 7 * 11 * 13. The greatest prime factor is 13.

**6. A, C, D, F.** Divisible by 12 means divisible by 3 and by 4. All six have digit sums divisible by 3, so check the last two digits for 4: 32 yes, 98 no, 52 yes, 24 yes, 38 no, 16 yes.

**7. C.** Use x = 1, y = 2. (A) 2, even. (B) 4, even. (C) 1 + 2 = 3, odd. (D) 4, even. (E) 1 * 4 = 4, even. By rules: x^2 is odd, and odd + even = odd.

**8. C.** 0.0499: the thousandths digit is 9, so round up to 0.05. 0.0451: the thousandths digit is 5, so round up to 0.05. Equal.

**9. E.** The middle number is the average: 365/5 = 73. The five integers are 71, 72, 73, 74, 75. The greatest is 75. The trap is 73, the middle one.

**10. C.** A: 12 / 3 = 4, then 4 * 2 = 8, then 18 - 8 + 1 = 11. B: 6 / 6 + 10 = 11. The trap in A is doing 3 * 2 first, which gives 17.

**11. B.** Powers of 7 cycle 7, 9, 3, 1. 83 = 4 * 20 + 3, so use the third digit: 3.

**12. A.** Plug in n = 5: remainder 2 when divided by 3, remainder 1 when divided by 2. In general n = 6q + 5 = 3(2q + 1) + 2 = 2(3q + 2) + 1, so the remainders are always 2 and 1.

**13. A, B, E.** 72 = 2^3 * 3^2. In n^2 every exponent is even, so n^2 needs at least 2^4 * 3^2. So n needs at least 2^2 * 3 = 12. Every such n is divisible by 4, 6 and 12. The case n = 12 (144 = 72 * 2) shows that 8, 9 and 24 are not required.

**14. B.** Multiples of 4: 200/4 = 50. Multiples of 6: 33. Multiples of both are multiples of 12: 16. Total 50 + 33 - 16 = 67. Choice D (83) forgets to subtract the overlap.

**15. 17.** List the numbers with remainder 3 when divided by 7: 3, 10, 17, ... Check each for remainder 2 when divided by 5: 3 no, 10 no, 17 yes.

**16. C.** A prime greater than 3 is odd and not divisible by 3. p^2 - 1 = (p - 1)(p + 1). p - 1 and p + 1 are consecutive even numbers, so their product is divisible by 8. One of p - 1, p, p + 1 is divisible by 3, and it is not p. So p^2 - 1 is divisible by 24, and the remainder of p^2 on division by 12 is 1. Check: 25, 49, 121 all give 1.

**17. A.** 2,520 = 2^3 * 3^2 * 5 * 7. Number of factors = 4 * 3 * 2 * 2 = 48.

**18. D.** a = 6, b = 6 gives LCM = 6, less than 36. a = 6, b = 42 gives LCM = 42, greater than 36. (a = 12, b = 18 gives exactly 36.)

**19. A, B, E.** A square's remainder depends only on the remainder of the base. Square 0 to 7 and reduce: 0, 1, 4, 9 -> 1, 16 -> 0, 25 -> 1, 36 -> 4, 49 -> 1. Only 0, 1 and 4 appear.

**20. C.** Plug in n = 7: 49 + 7 = 56 = 12 * 4 + 8. Remainder 8. Check with n = 19: 361 + 19 = 380 = 12 * 31 + 8.

**21. D.** Exactly three factors means the square of a prime. p^2 < 1,000 means p <= 31 (31^2 = 961, 37^2 = 1,369). Primes up to 31: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31. That is 11.

**22. B.** 3 cycles 3, 9, 7, 1. Exponent 4n + 2 has remainder 2, so the digit is 9. 7 cycles 7, 9, 3, 1. Exponent 4n + 1 gives 7. 9 + 7 = 16, so A is 6. 2 cycles 2, 4, 8, 6. Exponent 4n + 3 gives 8. So B = 8 is greater.

**23. 22.** 6 = 2 * 3, and 3s are scarcer than 2s. Count the 3s in 50!: 50/3 -> 16, 50/9 -> 5, 50/27 -> 1. Total 22. (There are 47 factors of 2, more than enough.) So k = 22.

**24. A, C, D, E.** 3a + 5b even means 3a and 5b have the same parity, so a and b have the same parity (both odd or both even). (A) and (C): same parity gives an even sum and difference. (B) fails for a = b = 1. (D): a^2 has the parity of a, so a^2 + b is even. (E): ab + a = a(b + 1). If both are even, a is even. If both are odd, b + 1 is even. (F) fails for a = b = 1, which gives 2.

**25. B.** Count the integers divisible by at least one of 2, 3, 5: 500 + 333 + 200 - 166 (by 6) - 100 (by 10) - 66 (by 15) + 33 (by 30) = 734. Then 1,000 - 734 = 266. Choice E is the count before subtracting from 1,000.
