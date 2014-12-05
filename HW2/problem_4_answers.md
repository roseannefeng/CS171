Layout: Force graph, allows for grouping by branch <br />
Features: <br />
	<ul>
		- Each node represents a commit, link to parent.<br />
		- Colors nodes by user.<br />
		- Link length calculated using the difference in time between the two commits. <br />
		- On mouseover, nodes enlarge for clarity and return to normal size on mouseout. <br />
		-  Node tooltips include branch, author, and time of commit.<br />
		-  Lists branches and # of commits on the left. <br />
		-  Can show only a specific user's commits by clicking on one of them, moves the other off the SVG. <br />
		-  Is easier to get a sense of how big each branch is, as well as which users are most active.<br /> 
	</ul>

Problems: <br />
	<ul>
		- Problems adding the arrows into this one, still don't fully understand SVG markers, but they should point to the child.<br />
		- Can't make the links disappear with the nodes when focusing on a particular user in the function hide_others. I do have a hide_others2 coded which, instead of hiding all the unneeded nodes/links, just turns the nodes white, but I don't really like the way that looks because it's still somewhat cluttered. <br />
		-  Not exactly easier to read - easy for the branches to overlap, hard to find specific branch or user, can be difficult to follow a branch due to the nature of force graphs. <br />
		-  Tried to take out extraneous commits (i.e. removing a parent if its child was created within 20 hours), did not seem to work at all. <br />
		-  In hindsight, I really wish I'd chosen to work with the hive layout linked, it sounds interesting and could have been more useful for what I wanted, if I let each branch be a radial line. <br />
		-  To be quite honest, I'm not sure if I understand the force layout and what its parameters are, so it makes it difficult for me to tweak it for repositories with even more commits.
	</ul>