# Statistics

Statistics is one of the most tested areas on the current GRE: expect 4 to 6 questions, counting the ones inside Data Interpretation sets. Very little calculation is needed. Most questions test whether you understand what the mean, median and standard deviation do when the data changes. You will almost never compute a standard deviation by hand.

Study plan: about 2 study days. Day 1: sections 1 to 3 and practice 1 to 10. Day 2: practice 11 to 25, then review every miss. Memorise the 34 / 13.5 / 2.5 normal curve percentages on day 1.

## 1. What you must know

**Mean, median, mode, range**

1. Mean (average, arithmetic mean) = sum / count. Example: 6, 9, 11, 14, 20 has sum 60 and mean 12.
2. The key identity: sum = mean * count. Most mean questions are solved with sums, not with means. Example: 5 numbers with mean 12 have sum 60.
3. Median = the middle value after sorting. With an even count, it is the average of the two middle values. Example: 3, 5, 8, 10 has median 6.5. Always sort first.
4. Mode = the value that appears most often. A list can have more than one mode. Example: 5, 8, 8, 10 has mode 8.
5. Range = greatest value - least value. Example: 3, 7, 15 has range 12.
6. Deviations from the mean balance: the amounts above the mean and the amounts below the mean add to the same total. Example: mean 10 for the list 7, 9, 14: below by 3 and 1, above by 4.

**Changing the data**

7. Adding a value greater than the mean raises the mean. Adding a value less than the mean lowers it. Adding a value equal to the mean leaves it unchanged.
8. To find a missing or removed value, compare sums. Example: 5 numbers have mean 12 and after one is removed the other 4 have mean 10. Removed value = 60 - 40 = 20.
9. If every value has c added, the mean, median and mode go up by c. The range and standard deviation do not change.
10. If every value is multiplied by k, the mean, median and mode are multiplied by k. The range and standard deviation are multiplied by |k|.
11. Changing the greatest value changes the mean and the range, but not the median (as long as it stays the greatest).
12. The median only cares about order. Extreme values pull the mean but not the median. Example: 1, 2, 3, 4, 100 has median 3 and mean 22.

**Weighted mean**

13. Weighted mean = (sum of each group mean * group size) / (total size). Example: 20 students averaging 70 and 30 students averaging 80: (1400 + 2400) / 50 = 76.
14. The combined mean lies between the group means, closer to the bigger group. It is the plain average of the two means only when the groups are the same size.
15. Balance shortcut: the group sizes are in the inverse ratio of the distances to the combined mean. Example: means 50 and 80, combined 62. Distances are 12 and 18, so the sizes are in the ratio 18 : 12 = 3 : 2 (the group at 50 is bigger).

**Evenly spaced lists** (consecutive integers, consecutive even numbers, multiples of 7 and so on)

16. Mean = median = (first + last) / 2. Example: 10, 12, ..., 50 has mean 30.
17. Count = (last - first) / step + 1. Example: even numbers from 10 to 50: (50 - 10) / 2 + 1 = 21.
18. Sum = mean * count. Example: 30 * 21 = 630.

**Standard deviation (SD)**

19. SD measures how spread out the values are around the mean. A bigger SD means more spread. If all values are equal, the SD is 0. The SD is never negative.
20. How it is computed (know the steps, you will rarely do them): find the mean, find each value's distance from the mean, square the distances, average the squares, take the square root. Example: 2, 4, 6: mean 4, squared distances 4, 0, 4, average 8/3, SD = sqrt(8/3), about 1.63.
21. Shifting does nothing, scaling scales: see rules 9 and 10. Example: SD of 10, 20, 30 equals the SD of 110, 120, 130, and is 10 times the SD of 1, 2, 3.
22. To compare the SD of two lists without computing: check the means, then see which list has its values further from its mean. Example: 1, 5, 5, 5, 9 has a smaller SD than 1, 1, 5, 9, 9.
23. Adding a value equal to the mean (or close to it) lowers the SD. Adding a value far from the mean (well beyond one SD away) raises it.
24. Two lists with the same range can have different SDs. Range uses only the two end values. SD uses all values.

**Quartiles, boxplots, percentiles**

25. Quartiles split the sorted data into four equal parts. Q2 is the median. Q1 is the median of the lower half. Q3 is the median of the upper half. With an odd count, leave the middle value out of both halves. Example: 2, 4, 5, 7, 8, 10, 12, 13, 15, 18, 21: median 10, lower half 2, 4, 5, 7, 8 so Q1 = 5, upper half 12, 13, 15, 18, 21 so Q3 = 15.
26. Interquartile range (IQR) = Q3 - Q1. It is the spread of the middle 50 percent. In the example, IQR = 10.
27. A boxplot (box-and-whisker plot) shows five numbers: least value, Q1, median, Q3, greatest value. The box runs from Q1 to Q3 with a line at the median. The whiskers reach to the least and greatest values. Each of the four pieces holds about 25 percent of the data, however long it looks.
28. A boxplot does not show the mean, and it does not show how many values there are.
29. Percentiles: the pth percentile is the value with about p percent of the data at or below it. Q1 is the 25th percentile, the median is the 50th, Q3 is the 75th.

**Frequency distributions**

30. A frequency table lists each value with how many times it occurs. Mean = sum of (value * frequency) / total frequency. Example: value 1 five times and value 3 fifteen times: mean = (5 + 45) / 20 = 2.5.
31. Median from a frequency table: find the position of the middle value, then count through the frequencies until you reach it. Example: 20 values, so the median is the average of the 10th and 11th.

**Normal distribution**

32. A normal distribution is the bell curve. It is symmetric about the mean, so mean = median, and 50 percent of the values are on each side.
33. The 68-95-99.7 rule: about 68 percent of values are within 1 SD of the mean, about 95 percent within 2 SDs, about 99.7 percent within 3 SDs.
34. Memorise the bands on one side of the mean: 0 to 1 SD is 34 percent, 1 to 2 SDs is 13.5 percent, 2 to 3 SDs is about 2.35 percent, beyond 3 SDs is about 0.15 percent. (ETS sometimes rounds these to 34, 14 and 2.)

```
        2.5%   13.5%   34%    34%   13.5%   2.5%
      ...|-------|------|------|------|-------|...
       -2 SD   -1 SD   mean  +1 SD  +2 SD
```

35. Useful totals: above mean + 1 SD is about 16 percent. Above mean + 2 SD is about 2.5 percent. Below mean + 1 SD is about 84 percent. Below mean + 2 SD is about 97.5 percent.
36. "k standard deviations above the mean" means the value mean + k * SD. Example: mean 500, SD 100: the value 700 is 2 SDs above the mean, and 350 is 1.5 SDs below. To convert any value: (value - mean) / SD.

## 2. Worked examples

**Example 1 (Multiple choice, one answer)**

The average (arithmetic mean) of 5 numbers is 12. When one of the numbers is removed, the average of the remaining 4 numbers is 10. What number was removed?

(A) 10  (B) 12  (C) 14  (D) 20  (E) 22

Solution:
1. Sum of the 5 numbers = 5 * 12 = 60.
2. Sum of the remaining 4 = 4 * 10 = 40.
3. Removed number = 60 - 40 = 20. Answer: D.

The trap: thinking the answer is 12 + 2 = 14. Removing one value moved the average of FOUR numbers by 2, so the removed value is 12 + 4 * 2 = 20.

**Example 2 (Quantitative Comparison)**

List: 3, 7, 7, 9, 14

Quantity A: The mean of the list
Quantity B: The median of the list

Solution:
1. Sum = 40, so the mean is 8.
2. The list is sorted. The middle (third) value is 7.
3. 8 > 7. Answer: A.

Fastest method: the high value 14 sits further from the middle than the low value 3, so it drags the mean above the median.

**Example 3 (Numeric entry)**

In a class, 20 students took a test in the morning and their average score was 70. The other 30 students took it in the afternoon and their average score was 80. What was the average score for all 50 students?

Solution:
1. Morning total = 20 * 70 = 1,400. Afternoon total = 30 * 80 = 2,400.
2. Combined total = 3,800.
3. Average = 3,800 / 50 = 76. Answer: 76.

The trap: answering 75, the plain average of 70 and 80. The afternoon group is bigger, so the answer is closer to 80.

**Example 4 (Quantitative Comparison)**

List P: 1, 5, 5, 5, 9
List Q: 1, 1, 5, 9, 9

Quantity A: The standard deviation of list P
Quantity B: The standard deviation of list Q

Solution:
1. Both lists have mean 5.
2. In P, three values sit exactly on the mean and two are 4 away.
3. In Q, only one value sits on the mean and four are 4 away.
4. Q is more spread out around the mean. Answer: B.

The trap: saying "equal" because both lists have the same mean and the same range. Do not compute. Compare distances from the mean.

**Example 5 (Multiple choice, one answer)**

The scores on a test are approximately normally distributed with a mean of 500 and a standard deviation of 100. Approximately what percent of the scores are between 400 and 700?

(A) 68%  (B) 81.5%  (C) 84%  (D) 95%  (E) 97.5%

Solution:
1. 400 is 1 SD below the mean. 700 is 2 SDs above the mean.
2. From 400 to 500: 34 percent.
3. From 500 to 700: 34 + 13.5 = 47.5 percent.
4. Total = 81.5 percent. Answer: B.

The trap: the interval is not symmetric, so neither 68 nor 95 applies. Split at the mean and add the two sides.

**Example 6 (Select all that apply)**

The median of the five numbers 4, 8, 9, 12 and x is 9. Which of the following could be the value of x? Select all that apply.

(A) 2  (B) 8  (C) 9  (D) 10  (E) 15

Solution:
1. Without x the sorted list is 4, 8, 9, 12. With five numbers the median is the third.
2. If x >= 9, the sorted list starts 4, 8, 9 and the third value is 9. This works.
3. If x <= 8, the third value becomes 8. Test x = 8: 4, 8, 8, 9, 12 has median 8. This fails.
4. Answer: C, D, E.

Fastest method: plug in each option and find the median.

**Example 7 (Multiple choice, one answer)**

Data: 2, 4, 5, 7, 8, 10, 12, 13, 15, 18, 21

What is the interquartile range of the 11 values?

(A) 6  (B) 8  (C) 10  (D) 13  (E) 19

Solution:
1. The median is the 6th value, 10.
2. Lower half (leave out the median): 2, 4, 5, 7, 8. Its median is Q1 = 5.
3. Upper half: 12, 13, 15, 18, 21. Its median is Q3 = 15.
4. IQR = 15 - 5 = 10. Answer: C.

The trap: giving the range (19).

**Example 8 (Multiple choice, one answer)**

The table shows the number of errors found on each of 20 pages.

| Errors on the page | Number of pages |
|---|---|
| 0 | 2 |
| 1 | 5 |
| 2 | 8 |
| 3 | 4 |
| 4 | 1 |

By how much does the median number of errors exceed the mean number of errors?

(A) 0  (B) 0.15  (C) 0.25  (D) 0.85  (E) 1.85

Solution:
1. Mean: total errors = 0 * 2 + 1 * 5 + 2 * 8 + 3 * 4 + 4 * 1 = 37. Mean = 37 / 20 = 1.85.
2. Median: with 20 values it is the average of the 10th and 11th. Count up: pages with 0 errors are positions 1 to 2, pages with 1 error are positions 3 to 7, pages with 2 errors are positions 8 to 15. Both the 10th and 11th are 2.
3. Median - mean = 2 - 1.85 = 0.15. Answer: B.

The trap: averaging the left column (0, 1, 2, 3, 4) or the right column and ignoring the frequencies.

## 3. Common traps

- Finding the median of an unsorted list. Always sort first.
- Averaging two averages when the groups have different sizes. Use totals.
- Thinking that adding a constant to every value changes the SD. It does not. Only multiplying does.
- Thinking the same range means the same SD.
- In a frequency table, treating the frequencies as the data. The data is the value column, repeated.
- Using 68 or 95 for an interval that is not centred on the mean. Split at the mean and add the bands.
- Forgetting the tails are split in two. Outside 2 SDs is 5 percent in total, so only 2.5 percent is above mean + 2 SD.
- Assuming a longer piece of a boxplot holds more data. Every piece holds about 25 percent. A longer piece means the data there is more spread out.
- Assuming the data is normal when the question does not say so. The 68-95-99.7 rule applies only to normal distributions.
- With an unknown value x in a list, forgetting that x can fall in different positions in the sorted order. Check each case.

## 4. Practice

For every Quantitative Comparison question, the answer choices are always:
A = Quantity A is greater. B = Quantity B is greater. C = The two quantities are equal. D = The relationship cannot be determined from the information given.

"Mean" always means the average (arithmetic mean).

**1. (Multiple choice, one answer)**
What is the mean of 6, 9, 11, 14 and 20?

(A) 12  (B) 13  (C) 14  (D) 15  (E) 20

**2. (Quantitative Comparison)**
List: 2, 6, 7, 9, 11

Quantity A: The mean of the list
Quantity B: The median of the list

**3. (Numeric entry)**
A student's average score on 4 tests is 82. What score does the student need on the 5th test to bring the average of all 5 tests to 84?

**4. (Select all that apply)**
The range of the six numbers 12, 7, 3, 15, 8 and x is 14. Which of the following could be the value of x? Select all that apply.

(A) 1  (B) 3  (C) 15  (D) 17  (E) 29

**5. (Quantitative Comparison)**
The mean of 5 numbers is 20. The mean of 3 of these numbers is 18.

Quantity A: The mean of the other 2 numbers
Quantity B: 24

**6. (Multiple choice, one answer)**
In a group, the 12 men have an average weight of 80 kilograms and the 8 women have an average weight of 65 kilograms. What is the average weight, in kilograms, of all 20 people?

(A) 71  (B) 72.5  (C) 74  (D) 75.5  (E) 77

**7. (Quantitative Comparison)**
The values in a list are not all equal. Each value in the list is multiplied by -2 to form a new list.

Quantity A: The standard deviation of the new list
Quantity B: The standard deviation of the original list

**8. (Select all that apply)**
A list consists of 5 different numbers. The greatest number in the list is increased by 10 and the other four numbers are unchanged. Which of the following must increase? Select all that apply.

(A) The mean  (B) The median  (C) The range  (D) The standard deviation

**9. (Multiple choice, one answer)**
What is the sum of all the even integers from 10 to 50, inclusive?

(A) 600  (B) 610  (C) 620  (D) 630  (E) 660

**10. (Quantitative Comparison)**
The values of a variable are normally distributed with a mean of 60 and a standard deviation of 5.

Quantity A: The percent of the values that are greater than 70
Quantity B: 5%

**11. (Multiple choice, one answer)**
The heights of 2,000 adults are approximately normally distributed with a mean of 170 centimetres and a standard deviation of 8 centimetres. Approximately how many of the adults have a height between 154 and 162 centimetres?

(A) 135  (B) 270  (C) 320  (D) 680  (E) 950

**12. (Quantitative Comparison)**

Quantity A: The standard deviation of five consecutive even integers
Quantity B: The standard deviation of five consecutive integers

**13. (Multiple choice, one answer)**
The mean of n numbers is 15. When the number 27 is added to the list, the mean of the n + 1 numbers is 17. What is n?

(A) 4  (B) 5  (C) 6  (D) 10  (E) 12

**14. (Numeric entry)**
Data: 3, 5, 6, 8, 11, 12, 15, 20

What is the interquartile range of the 8 values?

**15. (Select all that apply)**
A list consists of the numbers 2, 4, 6, 8 and 10. One more number is added to the list. For which of the following added numbers is the standard deviation of the new list of six numbers greater than the standard deviation of the original list? Select all that apply.

(A) 0  (B) 5  (C) 6  (D) 8  (E) 13  (F) 20

**16. (Quantitative Comparison)**
A list of 20 values has a standard deviation of 4. A new list is formed by replacing each value x with 3x - 10.

Quantity A: The standard deviation of the new list
Quantity B: 12

**17. (Multiple choice, one answer)**
The table shows the ages of the 30 students in a class.

| Age | Number of students |
|---|---|
| 18 | 4 |
| 19 | 7 |
| 20 | 9 |
| 21 | 6 |
| 22 | 4 |

How many of the students have an age greater than the median age?

(A) 6  (B) 10  (C) 11  (D) 15  (E) 19

**18. (Quantitative Comparison)**
A list consists of 5 positive integers, not necessarily different. The mean of the list is 10 and the median is 12.

Quantity A: The greatest integer in the list
Quantity B: 14

**19. (Multiple choice, one answer)**
A list consists of 5 different positive integers. The mean of the list is 8 and the median is 9. What is the greatest possible value of the largest integer in the list?

(A) 18  (B) 22  (C) 26  (D) 28  (E) 30

**20. (Multiple choice, one answer)**
The scores on a test are approximately normally distributed with a mean of 500 and a standard deviation of 100. A score of 700 is closest to which percentile?

(A) 50th  (B) 68th  (C) 84th  (D) 95th  (E) 98th

**21. (Quantitative Comparison)**
a, b and c are three different numbers and their mean is m.

Quantity A: The standard deviation of the three numbers a, b, c
Quantity B: The standard deviation of the four numbers a, b, c, m

**22. (Select all that apply)**
A list consists of the seven integers 2, 3, 5, 8, 8, 11 and x. The mean of the list is equal to the median of the list. Which of the following could be the value of x? Select all that apply.

(A) -2  (B) 5  (C) 6  (D) 8  (E) 19

**23. (Numeric entry)**
A company has 120 employees in two divisions, A and B. The average salary is $50,000 in division A and $80,000 in division B. The average salary of all 120 employees is $62,000. How many employees are in division A?

**24. (Multiple choice, one answer)**
The values of a variable are approximately normally distributed with a mean of 40. About 16 percent of the values are greater than 46. Approximately what percent of the values are between 28 and 40?

(A) 13.5%  (B) 34%  (C) 47.5%  (D) 68%  (E) 95%

**25. (Multiple choice, one answer)**
A list consists of 7 different positive integers. The median of the list is 20 and the range is 15. What is the greatest possible sum of the 7 integers?

(A) 113  (B) 149  (C) 161  (D) 167  (E) 173

---

Answers are below. Finish the problems before you scroll.

---

## 5. Answers and solutions

Answer key: 1 A, 2 C, 3 92, 4 A D, 5 B, 6 C, 7 A, 8 A C D, 9 D, 10 B, 11 B, 12 A, 13 B, 14 8, 15 A E F, 16 C, 17 B, 18 D, 19 A, 20 E, 21 A, 22 A E, 23 72, 24 C, 25 D

**1. A.** Sum = 6 + 9 + 11 + 14 + 20 = 60. Mean = 60 / 5 = 12.

**2. C.** Sum = 35, mean = 7. The middle value of the sorted list is 7. Equal.

**3. 92.** Needed total = 5 * 84 = 420. Current total = 4 * 82 = 328. Fifth score = 420 - 328 = 92.

**4. A, D.** Without x, the least value is 3 and the greatest is 15, so the range is only 12. x must be a new extreme. If x is the greatest: x - 3 = 14, x = 17. If x is the least: 15 - x = 14, x = 1.

**5. B.** Total of all 5 = 100. Total of the 3 = 54. The other 2 total 46, so their mean is 23. 23 < 24.

**6. C.** Total weight = 12 * 80 + 8 * 65 = 960 + 520 = 1,480. Mean = 1,480 / 20 = 74. The plain average of 80 and 65 is 72.5, which ignores that there are more men.

**7. A.** Multiplying every value by k multiplies the SD by |k|. Here the SD doubles. The sign does not matter because SD is a distance. Since the values are not all equal, the original SD is positive, so twice it is greater.

**8. A, C, D.** The sum goes up by 10, so the mean goes up by 2. The greatest value moves further from the least, so the range goes up by 10. The greatest value moves further from the mean and the list is more spread out, so the SD goes up. The median is the third value, which did not change.

**9. D.** Evenly spaced. Count = (50 - 10) / 2 + 1 = 21. Mean = (10 + 50) / 2 = 30. Sum = 21 * 30 = 630. Choice A comes from counting 20 terms.

**10. B.** 70 is 2 SDs above the mean. About 95 percent of values are within 2 SDs, so 5 percent are outside, half on each side. About 2.5 percent are above 70. That is less than 5 percent.

**11. B.** 154 is 2 SDs below the mean and 162 is 1 SD below. That band holds about 13.5 percent. 0.135 * 2,000 = 270.

**12. A.** Five consecutive integers look like n, n+1, n+2, n+3, n+4: gaps of 1. Five consecutive even integers have gaps of 2. That is the same pattern scaled by 2, so the SD is twice as large. Shifting the lists does not matter.

**13. B.** Sums: 15n + 27 = 17 * (n + 1), so 15n + 27 = 17n + 17, 2n = 10, n = 5. Balance check: 27 is 10 above the new mean, and the 5 old values are each 2 below it on average.

**14. 8.** Lower half: 3, 5, 6, 8, so Q1 = (5 + 6) / 2 = 5.5. Upper half: 11, 12, 15, 20, so Q3 = (12 + 15) / 2 = 13.5. IQR = 13.5 - 5.5 = 8.

**15. A, E, F.** The mean is 6 and the SD is sqrt(8), about 2.8 (squared distances 16, 4, 0, 4, 16, average 8). Adding a value closer to the mean than the typical spread pulls the SD down: 5, 6 and 8 are only 1, 0 and 2 from the mean. Adding a value much further out than one SD raises it: 0, 13 and 20 are 6, 7 and 14 from the mean.

**16. C.** Subtracting 10 does not change the SD. Multiplying by 3 triples it: 3 * 4 = 12. Equal.

**17. B.** With 30 values the median is the average of the 15th and 16th. Positions 1 to 4 are age 18, positions 5 to 11 are age 19, positions 12 to 20 are age 20. So the median is 20. Students older than 20: 6 + 4 = 10. The trap is 15 (half the class): many students are exactly at the median.

**18. D.** The sum is 50 and the third value is 12. The list 2, 12, 12, 12, 12 fits (sum 50, median 12), and its greatest value is 12, less than 14. The list 1, 1, 12, 12, 24 also fits, and its greatest value is 24, more than 14.

**19. A.** The sum is 40. Sorted: a < b < 9 < d < e. To make e as large as possible, make the others as small as possible: a = 1, b = 2, and d = 10 (d must be more than 9). Then e = 40 - 1 - 2 - 9 - 10 = 18. Choice D (28) forgets the fourth value. Choice E (30) forgets the median.

**20. E.** 700 is 2 SDs above the mean. Below the mean: 50 percent. From the mean to 2 SDs above: 47.5 percent. Total about 97.5 percent, so the score is at about the 98th percentile. Choice D (95) confuses "within 2 SDs" with "below 2 SDs above".

**21. A.** Adding the value m does not change the mean. It adds a distance of 0 to the list of distances, so the total of the squared distances stays the same but is now averaged over 4 values instead of 3. The SD goes down. Because a, b and c are different, the original SD is not 0, so Quantity A is strictly greater.

**22. A, E.** Sum = 37 + x, so the mean is (37 + x) / 7. Sorted without x: 2, 3, 5, 8, 8, 11. Case x <= 5: the median (4th value) is 5, so 37 + x = 35 and x = -2. That fits the case. Case x >= 8: the median is 8, so 37 + x = 56 and x = 19. That fits. Case x = 6 or 7: the median is x, so 37 + x = 7x and x = 37/6, not an integer. So x is -2 or 19. Checking the other options directly: x = 5 gives mean 6 and median 5. x = 6 gives mean 43/7 and median 6. x = 8 gives mean 45/7 and median 8.

**23. 72.** Balance method: 62 is 12 above 50 and 18 below 80. The sizes are in the inverse ratio, A : B = 18 : 12 = 3 : 2. So A has 3/5 of 120 = 72. Check: (72 * 50 + 48 * 80) / 120 = (3,600 + 3,840) / 120 = 62.

**24. C.** About 16 percent of a normal distribution lies above mean + 1 SD. So 46 is 1 SD above 40 and the SD is about 6. Then 28 = 40 - 12 is 2 SDs below the mean. From 2 SDs below up to the mean: 13.5 + 34 = 47.5 percent.

**25. D.** Sorted: a1 < a2 < a3 < 20 < a5 < a6 < a7, with a7 = a1 + 15. A bigger a1 raises both a1 and a7, so make a1 as large as possible. Three different integers below 20 are needed, so a1 is at most 17, with a2 = 18 and a3 = 19. Then a7 = 32, and the best a5 and a6 are 30 and 31. Sum = 17 + 18 + 19 + 20 + 30 + 31 + 32 = 167. Choice A (113) is the least possible sum.
