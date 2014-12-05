<p>When looking at the table's DOM or source code:</p>

<ol>
<li>What does the <code>colspan="3"</code> attribute of the <code>&lt;th&gt;</code> node do?</li>
Makes it so the top cell (i.e. the title cell) can span over three columns instead of being contained within one.<br /> <br />

<li>List all the styles (e.g. border width, text alignment, etc.) applied to the <code>th</code> element containing "Rank". For each, state whether they are set as an HTML attribute or a CSS style and describe them in a few words. Include only styles directly applied to the element, not styles inherited/cascading from parent elements or styles from the default user agent stylesheet. Exclude overwritten styles. For HTML attributes, state the CSS equivalent.</li>
<code>&lt;th align="center"&gt;</code> - centers the text <br />
<code>border="1"</code> - border is 1 pixel wide <br />
<code>cellpadding = "2"</code> - space between cell border and content is 2 pixels <br />
<code>cellspacing =  "0"</code> - space between two cells is 0 pixels <br />
<code>width = 95%</code> - sets the table's width to 95% of the surrounding element

<li>What differences do you notice between the DOM inspector and the HTML source? Why would you use the DOM inspector? Why is the HTML source useful?</li>
</ol>
The DOM inspector allows you to expand/collapse code and is pretty easy to read, allows you to modify things, and it's helpful if you want to focus on one thing in particular. The HTML source shows you what the page was like when you loaded it, so it can be helpful to use if there's problems with interactive features on the page.