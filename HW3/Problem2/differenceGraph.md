I chose this implementation because it is possible to see a consensus value among the data by looking for the bluest section for any given year. The way this works is that each value is represented not as a line but as a set of nodes, which are themselves represented by rectangles instead of circles. These rectangles are centered at the coordinates described by their corresponding year and population, and their length/opacity is directly proportional to their estimated population. In this way, we can layer different estimates on top of each other and find the consensus value by finding the bluest section (which is very simple considering the even considering the greyness of interpolated values). The more of an estimate overlaps in a particular area, the bluer it becomes. We also have two different rectangles drawn at each data point, with a shorter, darker rectangle corresponding to a smaller range. At any point, we can examine one estimate at a time or compare it to whichever other estimates we want by clearing the graph and redrawing them. 