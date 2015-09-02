DIVE Frontend
=================================================
The Data Integration and Visualization Engine (DIVE) is a platform for semi-automatically generating web-based, interactive visualizations of structured data sets. Data visualization is a useful method for understanding complex phenomena, communicating information, and informing inquiry. However, available tools for data visualization are difficult to learn and use, require a priori knowledge of what visualizations to create. See [dive.media.mit.edu](http://dive.media.mit.edu) for more information.

This repository houses the frontend interface and build codebase.

Write-up and documentation
---------
See this [Google Doc](https://docs.google.com/document/d/1J_wwbELz9l_KOoB6xRpUASH1eAzaZpHSRQvMJ_4sJgI/edit?usp=sharing).

Development task list
---------
See our [Trello](https://trello.com/b/yKWRcTqT). Currently private, PM Kevin for access.

Development Build Process
---------
1. Run `npm install` in base directory to get development and client-side dependencies.
2. In one terminal session, `gulp` in base directory (if gulp is installed globally) else `./node_modules/.bin/gulp` to build `./dist` directory and run development server. Access server at localhost:3000 in browser.
3. In another terminal session, run API (see below, default port 8888).

Deployment Build Process
---------
1. Run `gulp build` to build `./dist` directory
