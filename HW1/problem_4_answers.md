1. The <code>domain()</code> function is the data range upon which the scale is calculated. What does <code>d3.selectAll("tbody tr")[0].length-1</code> mean? <br />
It tells us how many things we need to color, which in this case is 50, by counting the rows and subtracting one for the top row (i.e. the header).

2. Add the snippet in your code. Describe, in words, what the following function calls return: <code>color(0)</code>, <code>color(10)</code> and <code>color(150)</code>? <br /> Color maps its domain along a spectrum that has a range from orangered (ff4500) to silver (c0c0c0) while the values for color are still within the domain, i.e. 0 to 50, so color(0) calls orangered and color(10) calls a color that's 1/5 of the way from orangered to silver. I have no idea what color(150) is calling besides a bright cyan. 

3. If the array passed to domain() was the minimum and maximum rate values, how would that change the scale? In what situations would this be appropriate?<br />
The color scale would map to the rates, so if we were trying to use colors to show relative positions of the ranks instead of having discrete values for the states it could be useful.
