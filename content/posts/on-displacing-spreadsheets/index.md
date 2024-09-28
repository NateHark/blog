+++
title = "On Replacing Spreadsheets"
date = 2024-09-27T00:00:00Z
description = "Many startups have been founded with the goal of displacing spreadsheets. A few have succeeded, many have not. Technology has surely evolved over the last 40 years, so why is it so hard to kick spreadsheets to the curb."
tags = ["Startup", "Strategy", "Spreadsheet"]
+++


I have spent the better part of the last decade building software designed to replace traditional spreadsheets (Excel, GSheets). The business case is clear: a significant amount of work currently occurs in spreadsheets due to the lack of better solutions.

If you're looking for a startup idea, plenty of fertile ground exists here. Talk to potential customers in various industries, ask them about the business problems they primarily solve with spreadsheets, and identify the pain points they experience with this approach. You will discover ample evidence that spreadsheets are painful and need replacement. Despite the clear customer need, replacing spreadsheets remains incredibly difficult due to a combination of human factors and technical/product design challenges.

The core product strategy question to address when attempting to replace traditional spreadsheets is: how far do you stray from the core spreadsheet experience?

If you stick too closely to the core spreadsheet experience, you face two problems. First, you must compete with Excel and GSheets head-to-head in terms of features. Second, you need to justify that what you've built is differentiated enough to warrant purchasing it alongside O365 or Google Workspaces, especially since customers are likely to already have licenses for one or the other.

Straying too far from the core spreadsheet experience also presents challenges. Spreadsheets are appealing because they offer sufficient flexibility and power to address a broad set of problems. Generations of workers view Excel as a solution to nearly every problem, and even if they acknowledge its shortcomings, learning new software with different paradigms feels daunting.

A structured "on-rails" experience for specific customer problems like financial modeling may initially seem attractive. Customers often raise concerns about standardization, data quality, access control, and auditability during research calls. You might gain traction with a more guided experience, as initial customer feedback on UI prototypes or demos tends to be positive, and the value proposition of a more structured approach seems clear.

However, issues with this approach surface once users start using the product with their specific use cases and data. This quickly exposes areas where your assumptions and generalizations lack flexibility. Users' willingness to adapt their workflows is limited. Problems that may have had relatively simple, albeit ugly, workarounds in spreadsheets become show-stoppers, requiring you to ship new features to bridge teh gap. Adding complexity often worsens the problem or pushes you back toward a more generalized spreadsheet-like approach.

My takeaway is not to abandon attempts to displace spreadsheets, but rather to deeply understand customer workflows. Pay particular attention to edge cases and the ugly workarounds they currently use in their spreadsheets. The more of these you encounter, the harder it becomes to satisfy customers with a prescriptive, on-rails solution.
