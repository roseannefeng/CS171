1. What's missing? Is this bar chart usable in its current form? 
<br /> It has no axes, labels, or way of interpreting the information.

2. What is the role of each of the three nested levels of g elements? (keep in mind you'll be adding a title to the chart) 
<br /> Each adds another data point, which then needs to be updated with the location/point information.

3. Complete the implementation section below. Is there any consequence if you add the text elements before or after the rect elements? Why?
<br /> Yes, since the bars go over the text. It's not as noticeable here since the bars are set at 80% opacity for lighter colors over darker text, but if it was fully opaque we wouldn't be able to read the text.