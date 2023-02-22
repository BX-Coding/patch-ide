# Welcome to the Pyatch Project!

<img src="https://bxcoding.com/wp-content/uploads/2023/02/PyatchLogo.png" width="120">

# Contextualization

## The Problem

Many young learners start with a highly intuitive learning approach to coding through Scratch, a block-based graphical programming language.  Making the transition from Scratch to text-based programming languages can be hard since learning the formal syntax that is required can be a significant roadblock.

Python is often the first programming language recommended after Scratch because of its relatively simple syntax and popularity as a scripting language. However, for those who started with Scratch, their first experiences with Python are often frustrating; after having dozens of visual blocks to build from, being met with a blinking cursor on a blank screen is intimidating leading to a distinct *loss of agency* between the two experiences. Modestly skilled Scratch users can create almost anything their creative minds can conjure while those same users must slog through a slew of step-by-step extremely structured instructions to develop equivalent outputs in Python. While many core programming concepts can be naturally translated from Scratch into Python, there is still a significant loss of the learner’s agency due to the amount of new syntax, vocabulary, and libraries that a young learner must grasp to begin exploring Python.
 

## The Solution

Pyatch's intent is to utilize a teaching pattern that we have used at  camps numerous times with great success. When making the transition from block-based programming to text-based programming, we create a very explicit correlation between scratch blocks and functions in the programming language we are transitioning to. For example, one very simple connection you can make is between the Say block in Scratch and the print function in Python. We've felt as if contexualizing the many new challenges of Python with a set of familiar function have greatly improved student's experiences. Notably, this transition has also been seen to improve students' self-efficacy in coding in case studies such as this one. Pyatch aims to integrate this teaching pattern into an online tool optimized for helping young computer scientists learn Python syntax. Pyatch exposes the exact same API that Scratch uses for their blocks except through a Python library. Consequently, young computer scientists interested in beginning with Python who are coming from Scratch can still utilize their knowledge of the Scratch block library. As a result, there is less strain on the transitioning student to learn the new vocabulary of a different library allowing young coders to focus on the other challenges of text based programming.

Pyatch leverages a fundamental teaching approach that we have honed through [BX Coding](https://bxcoding.com) camps. When making the transition from block-based programming to text-based programming, we create an explicit correlation between Scratch blocks and functions in the text-based programming language to which students are transitioning. For example, a simple connection can be made between the ‘Say’ block in Scratch and the ‘print’ function in Python. Through our own experiences of teaching coding, we realized that contextualizing the many new challenges of Python with a set of familiar functions can greatly improve the student experience. Notably, this has been validated by a few formal studies of how such transitions can improve student self-efficacy in coding such as [this case study](https://doi.org/10.1080/26939169.2022.2090467). 

Pyatch aims to integrate this teaching approach into an online tool optimized for helping young computer scientists learn Python syntax. Pyatch exposes the exact same API used for Scratch blocks except through a Python library allowing young computer scientists to use Scratch blocks in a “1-to-1” manner  in Python. Consequently, young computer scientists who are interested in beginning with Python and are familiar with Scratch can leverage their knowledge of the Scratch block library. As a result, there is less strain on the transitioning student to learn the new vocabulary of a different library. This reduces frustration and allows young coders to focus on the other more substantive and rewarding challenges of text-based programming.


## Conclusion

Scratch is a highly accessible tool that is widely used in CS education. For many young learners, it is their first introduction to programming. By the time a student has progressed to the point where they are ready to explore text-based programming, they have become familiar with an enormous amount of Scratch concepts and vocabulary utilized within the tool itself. While some of these concepts can clearly be generalized and used in text-based programming, there is an unintended consequence of Scratch’s highly intuitive, visual approach: *almost all of the vocabulary is unusable during the transition.* Pyatch offers an accessible online tool to leverage students’ existing knowledge of Scratch vocabulary and ease the challenging task of learning the syntax of Python. The result is a learning environment that encourages more creative exploration of Python in a less structured manner and in so doing, nurtures budding computer scientists’ self-efficacy and agency.

# Architecture & Design

The functionality behind the Pyatch IDE React component is made of several other JavaScript (js) modules that work in tandem. A list of these components, their functionality, and their Github repos can be found below.

#### [Pyatch VM](https://github.com/BX-Coding/pyatch-vm)

A stripped down version of the [Scratch VM](https://github.com/LLK/scratch-vm) used to manage the state of the game view and interface with the Scratch Renderer component. Much of the functionality involving thread or execution management was stripped as the Pyatch worker will be handling most of this.

#### [Pyatch Worker](https://github.com/BX-Coding/pyatch-worker)

A web worker module that handles the execution and threading of the program. This module then connects to the Pyatch VM via a socket API to push block execution to the VM.

#### [Pyatch Linker](https://github.com/BX-Coding/pyatch-linker)

A small js module responsible for handling the pre-processing of the raw text inputted by the user.

#### [Scratch Renderer](https://github.com/LLK/scratch-render)

A js module developed by [Scratch](https://github.com/LLK) to render the state of the Scratch VM

## Component Diagram

An informal diagram of how the components of Pyatch interact

![Diagram](https://bxcoding.com/wp-content/uploads/2023/02/Pyatch-2.0-Component-Diagram-2.jpg)

# Development

Development is currently being tracked by the [Pyatch Github project](https://github.com/orgs/BX-Coding/projects/1/views/1)

## Developers

The Pyatch Project is currently being developed by [Elliot Roe](https://github.com/ElliotRoe)

# Want to join?

Reach out to [Elliot Roe](https://github.com/ElliotRoe)! We welcome all collaborators
