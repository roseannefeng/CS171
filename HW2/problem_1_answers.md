## Website ##

1. Who is the audience? (e.g. project manager, contributor, project user, visitor, etc.) <br /> <br />
I would say that the audience for effectively all of the visualizations would be a project manager or some other overseer, since there's really nothing for a casual visitor to be interested in knowing, though an overall knowledge of the activity might be useful if they're interested in learning more about the code and when it's updated. The pulse of a repository is also a more generally useful view and could be easily used to gather information on the repository than the others simply because it's a brief overview rather than in-depth and are more usable/relevant to someone directly involved in the project or invested in its operation such as the project manager or a contributor.


2. What data have been used? How can you get the data using the GitHub API? (Note that it can be the combination of multiple queries and their processing). <br />
Pulls the commits within that time frame, including information such as which user, when they made it, number of lines added/deleted in that commit. The data can be pulled from the GitHub API by querying the associated URLs, ex. django's forks would be "https://api.github.com/repos/django/django/forks", and using all the data to draw the graphs.

3. Those visualizations are updated over time. What happens if suddenly a contributor pushes many commits in a short time interval? How would you address this particular issue? <br />
If they're updated at regular intervals, then it might not update right away, but that's not really a concern. If there are suddenly many commits in a short time interval, i.e. a short space, then I would either just let them take up that space or merge those commits into one data point and use the interaction to let the user check on the details of each individual commit by hovering over the data point.

##GitHub Network Graph ##

1. What is the role of interaction for this visualization? Would a static graph have been sufficient? <br />
The interaction allows users to find more information, such as the depth of the commits, and scroll between dates and users, while a static graph would have been limited to either a specific subsection of the graph or would have to be really big to accommodate the size of the graph.

2. What happens if many new developers suddenly join the project and push commits for the first time? How would you preserve the graph's readability in such a situation? <br />
Since the graphs appear to be drawn so that the most recent pushes cause those users to appear closer to the man branch, the user ordering shouldn't matter too much if we just redraw it, but the clustering of nodes could overlap and make it difficult to read. As said earlier, the nodes could be merged or otherwise compacted by taking advantage of the visualization's interactivity.