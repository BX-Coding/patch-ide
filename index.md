# Welcome to the Pyatch Project!

<img src="https://bxcoding.com/wp-content/uploads/2023/02/PyatchLogo.png" width="120">

# Contextualization

## The Problem

Learning the syntax of text-based programming languages can be hard, and it is often a roadblock for many young learners looking to take their first step into text-based programming languages after being introduced to Scratch. Python is often the first recommendation because of its simplistic syntax and massive popularity as a scripting language. However, learners’ first experiences with Python after being introduced to programming with Scratch often are not positive. This is because there is a distinct loss of agency between the two experiences. Even only somewhat skilled Scratch users can create almost anything their creative minds can conjure. On the other hand, a somewhat experienced Scratch user attempting to begin learning Python will be presented with a slew of step-by-step extremely structured projects. While many of the core programming concepts that Scratch naturally teaches do translate to Python, there is still a significant loss of agency of the learner due to the pure amount of new syntax, vocabulary, and libraries that a young learner must become familiar with to produce something similar to what they could create in Scratch. 

## The Solution

Pyatch's intent is to utilize a teaching pattern that we have used at BX Coding camps numerous times with great success when making the transition from block-based programming to text-based programming. We give very explicit references between a scratch block and a function in the programming language we are transitioning to, breaking down the layout of the block and how this is related to the layout of a function call. Notably, this transition has also been seen to improve students' self-efficacy in coding in case studies such as this one. Pyatch aims to integrate this teaching pattern into an online tool optimized for helping young computer scientists learn Python syntax. Pyatch exposes the exact same API that Scratch uses for their blocks except through a Python library. Consequently, young computer scientists interested in beginning with Python that is coming from Scratch can still utilize their knowledge of the Scratch block library in their Pyatch projects. As a result, one of the major challenges of beginning text-based programming can be overcome.

## Conclusion

Scratch is an incredible tool and is widely used in CS education. More likely than not, it will be young computer scientists' first introduction to programming. Purposefully or not, by the time a student has progressed to the point where they are looking to explore text-based programming they have become familiarized with an enormous amount of Scratch concepts and vocabulary utilized within the tool itself. While some of these concepts can clearly be generalized and used in text-based programming almost all of the vocabulary is unusable during the transition. Pyatch offers an accessible online tool to help utilize this vocabulary while a young computer scientist tackles the challenging task of learning the syntax of Python. The result is a learning environment that encourages less structured creative exploration of Python and nurtures young computer scientists' self-efficacy and agency.

# Architrcture & Design

The functionality behind the Pyatch IDE React component is made of several other js modules working together in tandem. A list of these components, their functionality, and their Github repos can be found below.

#### [Pyatch VM](https://github.com/BX-Coding/pyatch-vm)

A stripped down version of the [Scratch VM](https://github.com/LLK/scratch-vm) used to manage the state of the game view and interface with the Scratch GUI component. Much of the functionality involving thread or execution management was stripped as the Pyatch worker will be handling most of this.

#### [Pyatch Worker](https://github.com/BX-Coding/pyatch-worker)

A web worker module that handles the execution and threading of the program. This module then connects to the Pyatch VM via a socket API to push block execution to the VM.

#### [**Pyatch Linker**](https://github.com/BX-Coding/pyatch-linker)

A small js module responsible for handling the pre-processing of the raw text inputted by the user.

# Development

Development is currently being tracked by the [Pyatch Github project](https://github.com/orgs/BX-Coding/projects/1/views/1)

## Developers

The Pyatch Project is currently being developed by [Elliot Roe](https://github.com/ElliotRoe)

# Want to join?

Reach out to [Elliot Roe](https://github.com/ElliotRoe)! We welcome all collaborators
