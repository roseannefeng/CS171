1. Which graph-related tasks does an ideal GitHub Network Graph need to address? <br />
The visualization should be easily understood and convey information about the commits that would be useful. In this case, I think it would be good for the graph to be able to show the impact of commits or individual users. 

2. Get back to the GitHub network visualization you implemented and test it with the following projects on GitHub: D3, jQuery and Bootstrap. There's a lot more data, but the interaction patterns of users are also very different. What do you notice about the three repositories? <br />
With more users and commits, there's more overlap between them. Some users also tend to have a disproportionately large number of commits, ex. mbostock's d3 database has mbostock and jason davies with probably as many commits as the other users combined. I think some are also getting cut off by my graph's dimensions.

3. How does this impact your graph? <br />
It gets kind of crowded and ugly. As I said, the sheer number is also limited by the dimensions of the SVG element, and with a lot of the commits, the paths get hard to read and overlap pretty badly.

4. How would you improve your visualization to address issues with the larger and more complex data? <br />
Instead of hardcoding in the height and width values for the SVG, I could calculate them later, after figuring out how much space I need for the different users and the date range, but that could also lead to an unnecessary amount of scrolling. I could condense multiple nodes into one if there aren't any other paths between them. I could focus on only the most prolific users, which would probably be determined by the number or frequency of commits they made.