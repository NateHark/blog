+++
title = "Replacing Spreadsheets"
date = 2024-09-11T18:59:38Z
description = "Many startups have been founded with the goal of displacing spreadsheets. A few have succeeded, many have not. Technology has surely evolved over the last 40 years, so why is it so hard to kick spreadsheets to the curb."
tags = ["Startup", "Strategy", "Spreadsheet"]
+++


I've spent the better part of the last decade building software that is designed to replace traditional spreadsheets (Excel, GSheets). The general business case is that there was (and still is) a ton of work that is currently being done in spreadsheets for lack of a better solution.

If you're looking for a startup idea there is plenty of fertile ground here. Talk to potential customers in various industries, ask them about what business problems they current solve predominatly with spreadsheets, and identify the pain-points they experience with this approach. I guarantee they will provide ample evidence that spreadsheets are painful and need to be replaced. Despite the clear articulation of a customer need, it's still incredibly difficult to replace spreadsheets due to combination of human factors and technical/product design challenges.

The core product strategy question that needs to be addressed when attempting to replace traditional spreadsheets is the following: how far do you stray from the core spreadsheet experience?

If you stick too closely to the core spreadsheet experience you have two problems. You have to compete with Excel and GSheets head-to-head in terms of features, and you have to justify that what you've built is differentiated enough to be worth purchasing in addition to O365 or Google Workspaces, because it's almost guaranteed that the customer already has licenses for one or the other.

Straying too far from the core spreadsheet experience comes with its own set of challenges. The main reason that spreadsheets are attractive is that they are sufficiently flexible and powerful to provide a _reasonable_ solution to a broad set of problems. There are now generations of workers for whom Excel is the solution to nearly every problem, and despite being able to acknowledge its shortcomings, learning new software with different paradigms is a daunting proposition.

It may seem attractive to provide a more structured "on-rails" experience for solving a particular customer problem like financial modeling. Standardization, data quality, access control, and auditability are likely to be raised often in customer reasearch. You may even get quite a bit of traction with a more guided experience, as hands-off customer feedback on UI prototypes or demos will tend to be positive as the value proposition of a more structured approach is clear.

The issues with this approach bubble to the surface once users start to use the product to implement their particular use case with their own data, which expose all the areas where your assumptions and generalizations are not flexible enough. The degree in which users are willing to adapt the way that they work is limited. Problems that may have had relatively simple, if ugly, workarounds in a spreadsheet are now show-stoppers requiring you to ship new features. Adding complexity tends to result in either worsening the problem, or pushing you back toward a more generalized spreadsheet-like approach.

My takeaway from all of this is not that you shouldn't attempt to displace spreadsheets, it's that you need to _deeply_ understand the customer's workflows and pay particular attention to edge cases and ugly workarounds they use in their current spreadsheets. The more of these you see the harder it's going to be to satisfy the customer with a prescriptive, on-rails solution.