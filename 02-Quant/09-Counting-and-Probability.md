# Counting and Probability

Counting and probability give about 2 to 4 questions per test, and they are often among the hardest in the second section. The formulas are few. The skill is deciding which one applies: does order matter, are repeats allowed, and is "1 minus the opposite" faster. A 165+ score needs these to be reliable, not lucky.

Study plan: about 2 study days. Day 1: sections 1 to 3 and practice 1 to 10. Day 2: practice 11 to 25, then review every miss. For any small problem you get wrong, list the cases by hand once. It builds the instinct that formulas alone do not.

## 1. What you must know

Notation used here: n! is "n factorial". C(n, r) is the number of ways to choose r items from n when order does not matter. P(n, r) is the number of ways when order matters. P(A) is the probability of event A.

**Counting**

1. Multiplication principle: if one choice can be made in a ways and the next in b ways, both can be made in a * b ways. Example: 4 shirts and 3 trousers give 12 outfits.
2. Slot method: draw one blank per position, write the number of options in each blank, multiply. Fill the most restricted position first. Example: 3-letter codes from 26 letters with no repeats: 26 * 25 * 24.
3. Factorial: n! = n * (n - 1) * ... * 1. It counts the ways to arrange n different items in a row. 0! = 1. Memorise: 3! = 6, 4! = 24, 5! = 120, 6! = 720. Example: 5 books on a shelf: 120 orders.
4. Factorials cancel: 8! / 6! = 8 * 7 = 56. Never multiply them out fully.
5. Permutations (order matters): P(n, r) = n! / (n - r)! = n * (n - 1) * ... for r factors. Example: gold, silver and bronze among 8 runners: 8 * 7 * 6 = 336.
6. Combinations (order does not matter): C(n, r) = n! / (r! * (n - r)!) = P(n, r) / r!. Example: a team of 3 from 8: (8 * 7 * 6) / (3 * 2 * 1) = 56.
7. The test for "order matters": if swapping two chosen items gives a different result (different roles, different positions, a different number or code), use permutations. If it gives the same group, use combinations.
8. Symmetry: C(n, r) = C(n, n - r). Choosing 3 to include is the same as choosing 7 to leave out. Example: C(10, 3) = C(10, 7) = 120. Also C(n, 2) = n * (n - 1) / 2, which counts pairs, handshakes and games.
9. Repeated items: arrangements of n items where some are identical = n! / (a! * b! * ...), where a, b, ... are the sizes of the identical groups. Example: LEVEL has 5 letters with two L's and two E's: 5! / (2! * 2!) = 30.
10. Paths on a grid are arrangements with repeats. Example: 4 steps east and 3 steps north in any order: 7! / (4! * 3!) = C(7, 3) = 35.
11. Items that must be together: glue them into one block, arrange the blocks, then multiply by the arrangements inside the block. Example: 5 people in a row with A and B together: 4! * 2 = 48.
12. Items that must NOT be together: total minus together. Example: 5 people with A and B not adjacent: 120 - 48 = 72.
13. Fixed positions: place the restricted items first, then arrange the rest. Example: 5 people in a row with A in the middle: 4! = 24.
14. Circular arrangements: n people around a round table can be seated in (n - 1)! ways when rotations count as the same. Example: 5 people: 4! = 24.
15. Choosing from several groups: choose within each group and multiply. Example: 2 men from 6 and 2 women from 5: C(6, 2) * C(5, 2) = 15 * 10 = 150.
16. "At least one": total minus none. Example: committees of 3 from 5 men and 4 women with at least one woman: C(9, 3) - C(5, 3) = 84 - 10 = 74.
17. "And" between steps means multiply. "Or" between separate cases means add (make sure the cases do not overlap).

**Sets**

18. Two overlapping sets: total = (in A) + (in B) - (in both) + (in neither). Example: 40 students, 22 in A, 18 in B, 6 in both: 40 = 22 + 18 - 6 + neither, so neither = 6.
19. A Venn diagram for two sets has four regions: only A, only B, both, neither. Only A = (in A) - (in both). Fill the "both" region first.
20. Three sets: total = A + B + C - (the three pairwise overlaps) + (in all three) + neither. Fill the diagram from the centre outward.

**Probability**

21. Probability = (number of favourable outcomes) / (number of possible outcomes), when all outcomes are equally likely. It is always between 0 and 1. Example: a prime on a fair die: 2, 3, 5, so 3/6 = 1/2.
22. Complement: P(not A) = 1 - P(A). Use it for "at least one". Example: at least one head in 3 tosses = 1 - P(no heads) = 1 - 1/8 = 7/8.
23. Mutually exclusive events cannot both happen: P(A and B) = 0, so P(A or B) = P(A) + P(B). Example: rolling a 2 or a 5: 1/6 + 1/6 = 1/3.
24. General "or" rule: P(A or B) = P(A) + P(B) - P(A and B). "Or" includes the case where both happen.
25. Independent events do not affect each other: P(A and B) = P(A) * P(B). Example: two heads in two tosses: 1/2 * 1/2 = 1/4.
26. Independent is not the same as mutually exclusive. If two events with positive probability are mutually exclusive, they are NOT independent (if one happens, the other cannot).
27. If nothing is said about how A and B are related, P(A and B) can be anything from the larger of 0 and P(A) + P(B) - 1, up to the smaller of P(A) and P(B). Example: P(A) = 0.6 and P(B) = 0.7: P(A and B) is between 0.3 and 0.6.
28. With replacement: the item goes back, the draws are independent and the probabilities stay the same. Without replacement: the counts drop after each draw. Example: 5 red and 3 blue, two reds without replacement: (5/8) * (4/7) = 5/14. With replacement: (5/8) * (5/8) = 25/64.
29. Drawing several items "at once" is the same as drawing them one at a time without replacement. You can also count with combinations: P(two reds) = C(5, 2) / C(8, 2) = 10 / 28 = 5/14.
30. Conditional probability: P(A given B) = P(A and B) / P(B). In words: shrink the world to the cases where B happened, then ask how often A happens there. Also P(A and B) = P(A) * P(B given A). For independent events, P(A given B) = P(A).
31. Coins: in n fair tosses there are 2^n equally likely sequences, and C(n, k) of them have exactly k heads. Example: exactly 2 heads in 4 tosses: C(4, 2) / 16 = 6/16 = 3/8.
32. Two dice: 36 equally likely outcomes. Number of ways to get each sum: 2 has 1, 3 has 2, 4 has 3, 5 has 4, 6 has 5, 7 has 6, 8 has 5, 9 has 4, 10 has 3, 11 has 2, 12 has 1.
33. Expected value = sum of (each value * its probability). It is the long-run average. Example: win $6 with probability 1/3 and win nothing otherwise: expected value = 6 * (1/3) + 0 * (2/3) = $2.

## 2. Worked examples

**Example 1 (Multiple choice, one answer)**

How many odd 3-digit positive integers have three different digits?

(A) 280  (B) 320  (C) 360  (D) 405  (E) 450

Solution:
1. Use slots and fill the most restricted first.
2. Units digit must be odd: 1, 3, 5, 7 or 9. That is 5 options.
3. Hundreds digit cannot be 0 and cannot equal the units digit: 8 options.
4. Tens digit can be anything except the two digits used: 8 options.
5. 5 * 8 * 8 = 320. Answer: B.

The trap: filling the hundreds digit first with 9 options. Then the count for the units digit depends on whether the hundreds digit was odd, and the simple product (C) is wrong.

**Example 2 (Numeric entry)**

A committee of 3 people is to be chosen from 5 men and 4 women. How many different committees include at least one woman?

Solution:
1. Order does not matter, so use combinations.
2. All committees: C(9, 3) = (9 * 8 * 7) / 6 = 84.
3. Committees with no women (all men): C(5, 3) = 10.
4. At least one woman = 84 - 10 = 74. Answer: 74.

The trap: "pick one woman, then any 2 of the remaining 8": 4 * C(8, 2) = 112. This counts committees with two or three women more than once.

**Example 3 (Multiple choice, one answer)**

How many different arrangements of the six letters in the word LETTER are there?

(A) 90  (B) 120  (C) 180  (D) 360  (E) 720

Solution:
1. Six letters: L, E, T, T, E, R. E appears twice and T appears twice.
2. Arrangements = 6! / (2! * 2!) = 720 / 4 = 180. Answer: C.

The trap: 6! = 720 treats the two E's (and the two T's) as different letters.

**Example 4 (Quantitative Comparison)**

In a group of 60 people, 35 speak French, 30 speak Spanish and 10 speak neither language.

Quantity A: The number of people in the group who speak both languages
Quantity B: 15

Solution:
1. People who speak at least one language: 60 - 10 = 50.
2. 35 + 30 - both = 50, so both = 15.
3. Answer: C.

The trap: forgetting the 10 who speak neither and computing 35 + 30 - 60 = 5.

**Example 5 (Multiple choice, one answer)**

Five people, including Ana and Ben, are to stand in a row for a photo. In how many of the possible orders are Ana and Ben NOT next to each other?

(A) 24  (B) 48  (C) 60  (D) 72  (E) 96

Solution:
1. All orders: 5! = 120.
2. Orders with Ana and Ben together: glue them into one block. 4 blocks can be arranged in 4! = 24 ways, and inside the block there are 2 orders. 24 * 2 = 48.
3. Not together = 120 - 48 = 72. Answer: D.

The trap: stopping at 48, or forgetting the factor of 2 inside the block.

**Example 6 (Multiple choice, one answer)**

A bag contains 5 red marbles and 3 blue marbles. Two marbles are drawn at random without replacement. What is the probability that the two marbles are the same colour?

(A) 3/28  (B) 5/14  (C) 13/28  (D) 15/28  (E) 17/32

Solution:
1. Same colour means both red OR both blue. These cases do not overlap, so add.
2. Both red: (5/8) * (4/7) = 20/56.
3. Both blue: (3/8) * (2/7) = 6/56.
4. Total = 26/56 = 13/28. Answer: C.

Check with combinations: (C(5, 2) + C(3, 2)) / C(8, 2) = (10 + 3) / 28.

The trap: (E) is the answer with replacement. (B) is only the red case. (D) is the probability of different colours.

**Example 7 (Select all that apply)**

For events A and B, P(A) = 0.5 and P(B) = 0.4. Which of the following could be the value of P(A or B)? Select all that apply.

(A) 0.4  (B) 0.5  (C) 0.7  (D) 0.9  (E) 1.0

Solution:
1. P(A or B) = 0.5 + 0.4 - P(A and B) = 0.9 - P(A and B).
2. The overlap P(A and B) is at least 0 (mutually exclusive) and at most 0.4 (B lies completely inside A).
3. So P(A or B) is between 0.9 - 0.4 = 0.5 and 0.9 - 0 = 0.9, and any value in between is possible. For example, if A and B are independent, the overlap is 0.2 and P(A or B) = 0.7.
4. Answer: B, C, D.

The trap: assuming the events are independent or mutually exclusive when the question does not say so.

**Example 8 (Quantitative Comparison)**

A fair coin is tossed 4 times.

Quantity A: The probability of getting exactly 2 heads
Quantity B: 1/2

Solution:
1. There are 2^4 = 16 equally likely sequences.
2. Sequences with exactly 2 heads: C(4, 2) = 6.
3. Probability = 6/16 = 3/8, which is less than 1/2.
4. Answer: B.

The trap: "half heads is the most likely result, so the probability is 1/2". It is the most likely count, but it still happens less than half the time.

## 3. Common traps

- Using permutations when order does not matter, or combinations when it does. Ask: does swapping two chosen items change the result?
- Counting "at least one" by picking one first and then filling the rest freely. This double counts. Use total minus none.
- Forgetting the internal arrangements of a glued block (the factor of 2 for a pair).
- Forgetting to divide for identical letters or identical objects.
- A number cannot start with 0. Fill the first digit with care.
- Adding probabilities of events that overlap without subtracting the overlap.
- Multiplying probabilities of events that are not independent. Without replacement, the second probability changes.
- Confusing "mutually exclusive" (cannot happen together) with "independent" (do not affect each other).
- In "or" questions, forgetting that "A or B" includes both.
- Reading P(A given B) as P(B given A). "Probability that a defective item came from machine Y" is not "probability that an item from machine Y is defective".
- In Venn problems, forgetting the "neither" group, or treating "22 play soccer" as "22 play only soccer".

## 4. Practice

For every Quantitative Comparison question, the answer choices are always:
A = Quantity A is greater. B = Quantity B is greater. C = The two quantities are equal. D = The relationship cannot be determined from the information given.

All coins and dice are fair. A die has faces 1 to 6.

**1. (Multiple choice, one answer)**
Sam has 4 shirts, 3 pairs of trousers and 2 pairs of shoes. How many different outfits of one shirt, one pair of trousers and one pair of shoes can Sam make?

(A) 9  (B) 12  (C) 18  (D) 24  (E) 48

**2. (Quantitative Comparison)**

Quantity A: 6! / 4!
Quantity B: 5! / 3!

**3. (Numeric entry)**
A club has 8 members. In how many ways can the club choose a president, a vice president and a treasurer, if no member can hold more than one position?

**4. (Multiple choice, one answer)**
Each of the 7 people at a meeting shakes hands exactly once with each of the other people. How many handshakes take place?

(A) 7  (B) 14  (C) 21  (D) 42  (E) 49

**5. (Quantitative Comparison)**
A coin is tossed 3 times.

Quantity A: The probability of getting at least one head
Quantity B: 0.85

**6. (Multiple choice, one answer)**
In a class of 40 students, 22 play soccer, 18 play tennis and 6 play both. How many students play neither sport?

(A) 6  (B) 8  (C) 12  (D) 16  (E) 34

**7. (Quantitative Comparison)**
Events A and B are independent. P(A) = 0.3 and P(B) = 0.5.

Quantity A: The probability that both A and B occur
Quantity B: 0.2

**8. (Select all that apply)**
Which of the following are equal to the number of ways to choose 3 objects from 8 different objects, when order does not matter? Select all that apply.

(A) The number of ways to choose 5 objects from the 8 objects, when order does not matter
(B) 8 * 7 * 6
(C) 8! / (3! * 5!)
(D) C(7, 2) + C(7, 3)
(E) C(8, 4)

**9. (Select all that apply)**
Two dice are rolled. For which of the following values is the probability that the sum of the two numbers equals that value exactly 1/12? Select all that apply.

(A) 3  (B) 4  (C) 5  (D) 10  (E) 11

**10. (Quantitative Comparison)**

Quantity A: The number of different arrangements of the five letters in the word LEVEL
Quantity B: 30

**11. (Multiple choice, one answer)**
Six people are to sit in a row of 6 chairs. Two of them, Omar and Pia, must sit next to each other. How many seating orders are possible?

(A) 120  (B) 240  (C) 360  (D) 480  (E) 720

**12. (Quantitative Comparison)**

Quantity A: The number of ways to choose 4 people from a group of 9 people
Quantity B: The number of ways to choose 2 men and 2 women from a group of 6 men and 5 women

**13. (Multiple choice, one answer)**
A box contains 12 light bulbs, of which 4 are defective. Two bulbs are chosen at random without replacement. What is the probability that at least one of the two bulbs is defective?

(A) 1/11  (B) 14/33  (C) 5/9  (D) 19/33  (E) 2/3

**14. (Numeric entry)**
How many even 4-digit numbers can be formed using the digits 1, 2, 3, 4 and 5, if no digit is used more than once in a number?

**15. (Select all that apply)**
Events A and B are independent. P(A) = 0.6 and P(B) = 0.5. Which of the following statements are true? Select all that apply.

(A) The probability that both A and B occur is 0.3.
(B) The probability that A or B (or both) occurs is 1.1.
(C) The probability that neither A nor B occurs is 0.2.
(D) A and B are mutually exclusive.
(E) The probability that A occurs and B does not occur is 0.3.

**16. (Quantitative Comparison)**
For events A and B, P(A) = 0.6 and P(B) = 0.7.

Quantity A: The probability that both A and B occur
Quantity B: 0.4

**17. (Multiple choice, one answer)**
Six people are to sit around a round table with 6 seats. Two of them, Rosa and Tom, must sit next to each other. Two seatings are the same if one can be rotated into the other. How many different seatings are possible?

(A) 12  (B) 24  (C) 36  (D) 48  (E) 120

**18. (Quantitative Comparison)**
In a game, a player rolls a die once. The player wins $4 if the die shows 6 and loses $1 if it shows any other number.

Quantity A: The expected value of the player's gain from one game, in dollars
Quantity B: 0

**19. (Multiple choice, one answer)**
A robot stands at one corner of a street grid. It must reach a corner that is 4 blocks east and 3 blocks north. Each move is exactly one block east or one block north. How many different routes can the robot take?

(A) 21  (B) 35  (C) 49  (D) 70  (E) 210

**20. (Multiple choice, one answer)**
A coin is tossed 6 times. What is the probability of getting exactly 4 heads?

(A) 1/16  (B) 3/32  (C) 15/64  (D) 5/16  (E) 1/2

**21. (Quantitative Comparison)**
A box contains 10 balls. Of these, r are red and the rest are blue. Two balls are drawn at random without replacement, and the probability that both are red is 2/15.

Quantity A: r
Quantity B: 4

**22. (Select all that apply)**
Two dice are rolled. Which of the following events have a probability greater than 1/3? Select all that apply.

(A) The sum of the two numbers is at least 8.
(B) Both numbers are odd.
(C) At least one of the numbers is 6.
(D) The product of the two numbers is even.
(E) The two numbers differ by exactly 1.
(F) The sum of the two numbers is a prime number.

**23. (Numeric entry)**
A committee of 4 people is to be chosen from 5 married couples (10 people). How many different committees contain no married couple?

**24. (Multiple choice, one answer)**
A factory has two machines. Machine X makes 60 percent of the items and machine Y makes the other 40 percent. Of the items made by X, 2 percent are defective. Of the items made by Y, 5 percent are defective. An item is chosen at random and is found to be defective. What is the probability that it was made by machine Y?

(A) 2/5  (B) 1/2  (C) 4/7  (D) 5/8  (E) 5/7

**25. (Multiple choice, one answer)**
Four people are chosen at random. Assume that each person is equally likely to have been born in any of the 12 months, independently of the others. What is the probability that at least two of the four people were born in the same month?

(A) 1/4  (B) 41/96  (C) 1/2  (D) 55/96  (E) 3/4

---

Answers are below. Finish the problems before you scroll.

---

## 5. Answers and solutions

Answer key: 1 D, 2 A, 3 336, 4 C, 5 A, 6 A, 7 B, 8 A C D, 9 B D, 10 C, 11 B, 12 B, 13 D, 14 48, 15 A C E, 16 D, 17 D, 18 B, 19 B, 20 C, 21 C, 22 A D F, 23 80, 24 D, 25 B

**1. D.** Multiplication principle: 4 * 3 * 2 = 24.

**2. A.** 6! / 4! = 6 * 5 = 30. 5! / 3! = 5 * 4 = 20.

**3. 336.** The positions are different, so order matters: 8 * 7 * 6 = 336.

**4. C.** A handshake is a pair of people: C(7, 2) = 7 * 6 / 2 = 21. Choice D (42) counts every handshake twice.

**5. A.** P(at least one head) = 1 - P(no heads) = 1 - (1/2)^3 = 7/8 = 0.875, which is greater than 0.85.

**6. A.** At least one sport: 22 + 18 - 6 = 34. Neither: 40 - 34 = 6.

**7. B.** Independent, so multiply: 0.3 * 0.5 = 0.15, which is less than 0.2.

**8. A, C, D.** C(8, 3) = 56. A: C(8, 5) = C(8, 3) by symmetry. B: 8 * 7 * 6 = 336 is the count when order matters. C: this is the formula for C(8, 3). D: 21 + 35 = 56. (Fix one object: either it is chosen and you need 2 more from 7, or it is not and you need 3 from 7.) E: C(8, 4) = 70.

**9. B, D.** 1/12 = 3/36, so the sum must come up in 3 ways. Sum 4: (1,3), (2,2), (3,1). Sum 10: (4,6), (5,5), (6,4). Sums 3 and 11 have 2 ways each and sum 5 has 4 ways.

**10. C.** Five letters with two L's and two E's: 5! / (2! * 2!) = 120 / 4 = 30. Equal.

**11. B.** Glue Omar and Pia into one block. 5 blocks: 5! = 120. Two orders inside the block: 120 * 2 = 240.

**12. B.** Quantity A: C(9, 4) = (9 * 8 * 7 * 6) / 24 = 126. Quantity B: C(6, 2) * C(5, 2) = 15 * 10 = 150.

**13. D.** P(no defective) = (8/12) * (7/11) = 56/132 = 14/33. P(at least one) = 1 - 14/33 = 19/33. Choice B is the complement. Choice C is the answer with replacement.

**14. 48.** Fill the units digit first: it must be 2 or 4, so 2 options. The other three positions use the remaining 4 digits in order: 4 * 3 * 2 = 24. Total 2 * 24 = 48.

**15. A, C, E.** A: 0.6 * 0.5 = 0.3, true. B: P(A or B) = 0.6 + 0.5 - 0.3 = 0.8, and no probability can exceed 1, false. C: 0.4 * 0.5 = 0.2, true. D: mutually exclusive would mean P(A and B) = 0, but it is 0.3, false. E: 0.6 * 0.5 = 0.3, true.

**16. D.** Nothing says how A and B are related. P(A and B) is at least 0.6 + 0.7 - 1 = 0.3 and at most 0.6. If the overlap is 0.3, B is greater. If A and B are independent, the overlap is 0.42 and A is greater.

**17. D.** Glue Rosa and Tom into one block. Now 5 blocks sit around a round table: (5 - 1)! = 24. Two orders inside the block: 24 * 2 = 48.

**18. B.** Expected gain = 4 * (1/6) + (-1) * (5/6) = 4/6 - 5/6 = -1/6. Negative, so less than 0.

**19. B.** Every route is a sequence of 7 moves with 4 E's and 3 N's. Choose which 3 of the 7 moves are N: C(7, 3) = 35.

**20. C.** 2^6 = 64 sequences. Exactly 4 heads: C(6, 4) = C(6, 2) = 15. Probability 15/64.

**21. C.** (r/10) * ((r - 1)/9) = 2/15, so r * (r - 1) = 90 * 2/15 = 12. Then r = 4 (4 * 3 = 12). Equal.

**22. A, D, F.** Compare each count with 12 out of 36. A: sums 8 to 12 have 5 + 4 + 3 + 2 + 1 = 15 ways, yes. B: 3 * 3 = 9 ways, no. C: 36 - 25 = 11 ways, no. D: the product is odd only when both are odd (9 ways), so even has 27 ways, yes. E: (1,2), (2,3), (3,4), (4,5), (5,6) and their reverses, 10 ways, no. F: prime sums 2, 3, 5, 7, 11 have 1 + 2 + 4 + 6 + 2 = 15 ways, yes.

**23. 80.** The 4 members must come from 4 different couples. Choose the 4 couples: C(5, 4) = 5. From each chosen couple pick one of the 2 people: 2^4 = 16. Total 5 * 16 = 80.

**24. D.** Imagine 1,000 items. X makes 600, of which 2 percent = 12 are defective. Y makes 400, of which 5 percent = 20 are defective. There are 32 defective items and 20 of them are from Y: 20/32 = 5/8. Choice A is the share of all items made by Y, which ignores the new information.

**25. B.** Use the complement. P(all four months different) = (12/12) * (11/12) * (10/12) * (9/12) = 990 / 1,728 = 55/96. P(at least two share a month) = 1 - 55/96 = 41/96. Choice D is the complement.
