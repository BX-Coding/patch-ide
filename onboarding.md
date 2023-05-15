

# Patch Development Onboarding

**NOTE THIS IS CURRENTLY IN PROGRESS**

Hello and welcome to the Patch development team!

This document is a general overview of the tooling used in the Patch project and several different software diagrams.

Table of contents:
- What is Patch?
- Components of Patch
	- Patch VM
	- Patch Linker
	- Patch Worker
		- Pyodide
	- Scratch Renderer
	- Patch IDE
- The development tools of Patch
	- Javascript ESM modules  
	- Node
		- NPM
	-  React
	-  Webpack
- Running Patch
	- IDE
		- Extensions
	- Cloning the repos
	- Package Installation
	- Running dev server
	- Testing
- Development Workflow
	- Cycles
	- Daily Scrums
	- Task Workflow
		- Starting a New Ticket
		- Finishing a Ticket

## Running Patch
### Tools
Install [Volta](https://docs.volta.sh/guide/getting-started)
Install Node (v19.8.1)

    volta install node@19.8.1

Install [Oh My Zsh](https://ohmyz.sh/#install) (optional)
### IDE
The IDE that we will be using in this step by step tutorial is VSCode. 
If you don't have VSCode already, please follow the download and install instructions for the tool [here](https://code.visualstudio.com/docs/setup/setup-overview)
#### Extensions
None are needed as of right now. This will change.
### Cloning the Repos
Depending on the issue you are working on, it will require you to work with the Patch vm, the Patch IDE or both. In this section, we will go over how to clone both repos and confirm each are working.

**Patch VM**
Paste this command into your terminal in order to clone the Patch VM repository

    git clone https://github.com/BX-Coding/pyatch-vm.git

Once the repo is cloned, open the folder in VSCode.
In the VSCode terminal paste the following command.

    npm install

This will install all the node packages needed to run the Patch VM. (Aka this installs all the dependencies of the project)

Finally, in-order to confirm everything is working, run the command

    npm test
This will run the Patch VM's testing suite
Once all the test cases run and everything has a check mark by it, you are good to go!

**Patch IDE**
Paste this command into your terminal in order to clone the Patch IDE repository

    git clone https://github.com/BX-Coding/pyatch-react-ide.git

Once the repo is cloned, open the folder in VSCode.
In the VSCode terminal paste the following command.

    npm install

This will install all the node packages needed to run the Patch IDE. (Aka this installs all the dependencies of the project)

The Patch IDE does not have a formal testing suite yet, so instead the best way to test if everything is working is by running the web app. This can be done with the following command

    npm run dev

Once you see

    webpack 5.79.0 compiled successfully in XXXX ms

In the terminal, please go to [localhost:8080](http://localhost:8080) or [localhost:8081](http://localhost:8081) in order to view the web app.

## Development Workflow
For our projects at BX Coding, our team uses the [Linear method](https://linear.app/method) to guide our workflow. Essentially, this is just a flavor of [Agile](https://www.atlassian.com/agile) development with the main difference being some slight changes in vocabulary.

### Cycles

The Patch team works in Cycles which in our case are two week time boxes in which tasks oriented around a specific goal are assigned to and completed by each team member. 

For example, we could have a two-week cycle with a goal focused on frontend UI improvements. At the beginning of the two week period, a cycle planning meeting would occur where the team would set the goals of the sprint and assign tasks to each team member. After this, each team member would have the allotted two week period to complete all their tasks. Depending on [cycle velocity](https://asana.com/resources/sprint-velocity), tasks can shifted cycles.

### Daily Scrums

Each working day, the team has a scrum. A scrum is essentially a short meeting that keeps each team member update to date on the cycles progress. The meeting has a defined and simple structure.

Each team member will discuss:

 1. The progress they made the previous day
 2. Any issues or questions they may have
 3. The work that they plan on doing today

This is meant to keep each team member and the project manager updated on the cycle's progress.

### Task Workflow
#### Starting a New Task

To start and finish your work on a task, there are a couple of vital steps  important to keeping the project organized and manageable. Hopefully, Linear will make all of this quite simple and user friendly. This section is a step-by-step guide along with examples on how to start and finish a task.

 1. Select the "My Issues" tab on the menu on the left of the linear window

Here you will see all the tasks that are currently assigned to you. 
**Note: By default these are not filtered by cycle. If you haven't already please filter by current cycle**

2. Select a task!

Please make sure to select an issue that has been assigned to you and is in the current cycle.

3. Read the task's description as well as any other additional material that may be attached or commented on the ticket

4. Copy the tasks branch name with the shortcut

Each task that you work on will be associated with a git branch of the Patch repository. If you are not familiar, please read up on what [git](https://www.atlassian.com/git/tutorials/what-is-git) is and what a [git branch](https://www.atlassian.com/git/tutorials/using-branches#:~:text=In%20Git,%20branches%20are%20a,branch%20to%20encapsulate%20your%20changes.) is. Linear automatically will generate a branch name for you, all you have to do is copy it and paste it in when you create a new branch in VSCode. It is **VITALLY** important to use these names in order to keep the project organized. Furthermore, **ANY** development done on a task must be done inside its branch. If there is any development that is outside of the task's scope, the branch will not be allow to be merged into the master branch upon its review.

5. Create your new branch in VSCode
*Note: make sure to select the "new branch from" option and select the main branch after that*

6. Begin work!

#### Finishing a Task

To finish a task and mark it "done" in Linear there are a couple steps you must take. 

Once you have finished your work on a ticket:

1. Create a [Pull Request](https://www.atlassian.com/git/tutorials/making-a-pull-request) (PR)
	Make sure to:
	- Write a short but accurate description
	- No out of scope code is being committed
	- Add Elliot Roe and Duncan Johnson as a reviewer

2. If your PR is rejected, please look at the reasoning and fix your PR. After this you are welcome to make a new one

PR's and your issue status are automatically linked so whenever your PR is accepted and merged, then your ticket will automatically be marked as done in Linear.
