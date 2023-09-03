# Welcome to the Patch Github Pages!

<img src="https://bxcoding.org/wp-content/uploads/2023/07/94b695b8ef1123544cf202aa95af32f0.png" width="120">

# What is Patch?

[Patch](https://codepatch.org/) is a free and open-source online coding environment built to help Scratchers transition their skills to Python.

# Want to join?

[Join our Discord server!](https://discord.gg/c9WS6vuKUM) We welcome all collaborators!

## Become a Beta Tester!
We are looking for Beta testers to help test, improve, and suggest features for Patch. Beta testers are also able to save their projects to the cloud.

Steps to Joining the Beta:
1. Create an account in [Patch](https://codepatch.org/)
2. Join our [Discord server](https://discord.gg/c9WS6vuKUM)
3. Fill out the [Beta Test Registration Form](https://forms.gle/dhfJ7WaBM4udncc58)
4. We will update your Patch & Discord roles!

# Contextualization

## The Problem

Many young learners start with a highly intuitive learning approach to coding through Scratch, a block-based graphical programming language.  Making the transition from Scratch to text-based programming languages can be hard since learning the formal syntax that is required can be a significant roadblock.

Python is often the first programming language recommended after Scratch because of its relatively simple syntax and popularity as a scripting language. However, for those who started with Scratch, their first experiences with Python are often frustrating; after having dozens of visual blocks to build from, being met with a blinking cursor on a blank screen is intimidating leading to a distinct *loss of agency* between the two experiences. Modestly skilled Scratch users can create almost anything their creative minds can conjure while those same users must slog through a slew of step-by-step extremely structured instructions to develop equivalent outputs in Python. While many core programming concepts can be naturally translated from Scratch into Python, there is still a significant loss of the learner’s agency due to the amount of new syntax, vocabulary, and libraries that a young learner must grasp to begin exploring Python.
 

## The Solution

Patch leverages a fundamental teaching approach that we have honed through [BX Coding](https://bxcoding.com) camps. When making the transition from block-based programming to text-based programming, we create an explicit correlation between Scratch blocks and functions in the text-based programming language to which students are transitioning. For example, a simple connection can be made between the ‘Say’ block in Scratch and the ‘print’ function in Python. Through our own experiences of teaching coding, we realized that contextualizing the many new challenges of Python with a set of familiar functions can greatly improve the student experience. Notably, this has been validated by a formal study of how such transitions can improve student self-efficacy in coding such as [this case study](https://doi.org/10.1080/26939169.2022.2090467). 

Patch aims to integrate this teaching approach into an online tool optimized for helping young computer scientists learn Python syntax. Patch exposes the exact same API used for Scratch blocks except through a Python library allowing young computer scientists to use Scratch blocks in a “1-to-1” manner  in Python. Consequently, young computer scientists who are interested in beginning with Python and are familiar with Scratch can leverage their knowledge of the Scratch block library. As a result, there is less strain on the transitioning student to learn the new vocabulary of a different library. This reduces frustration and allows young coders to focus on the other more substantive and rewarding challenges of text-based programming.


## Conclusion

Scratch is a highly accessible tool that is widely used in CS education. For many young learners, it is their first introduction to programming. By the time a student has progressed to the point where they are ready to explore text-based programming, they have become familiar with an enormous amount of Scratch concepts and vocabulary utilized within the tool itself. While some of these concepts can clearly be generalized and used in text-based programming, there is an unintended consequence of Scratch’s highly intuitive, visual approach: *almost all of the vocabulary is unusable during the transition.* Patch offers an accessible online tool to leverage students’ existing knowledge of Scratch vocabulary and ease the challenging task of learning the syntax of Python. The result is a learning environment that encourages more creative exploration of Python in a less structured manner and in so doing, nurtures budding computer scientists’ self-efficacy and agency.

# Architecture & Design

The functionality behind the Patch IDE React component is made of several other JavaScript (js) modules that work in tandem. A list of these components, their functionality, and their Github repos can be found below.

#### [Patch VM](https://github.com/BX-Coding/pyatch-vm)

A stripped down version of the [Scratch VM](https://github.com/LLK/scratch-vm) used to manage the state of the game view and interface with the Scratch Renderer component. Much of the functionality involving thread or execution management was stripped as the Patch worker will be handling most of this.

#### [Patch Worker](https://github.com/BX-Coding/pyatch-worker) *internal to the Patch-VM*

A web worker module that handles the execution and threading of the program. This module then connects to the Patch VM via a socket API to push block execution to the VM.

#### [Patch Linker](https://github.com/BX-Coding/pyatch-linker) *internal to the Patch-VM*

A small js module responsible for handling the pre-processing of the raw text inputted by the user.

#### [Scratch Renderer](https://github.com/LLK/scratch-render)

A js module developed by [Scratch](https://github.com/LLK) to render the state of the Scratch VM

## Component Diagram

An informal diagram of how the components of Patch interact

![Diagram](https://bxcoding.org/wp-content/uploads/2023/02/Pyatch-2.0-Component-Diagram-2.jpg)

## Pyatch (Patch 1.0)

As a POC we created a simple version of Patch implemented as a local python library. A short demo is included below. At this point in the development stage, the project was called Pyatch, so documentation and API's refer to the project as such.
[![Patch Demo Video](http://img.youtube.com/vi/imWmAzWxp38/0.jpg)](http://www.youtube.com/watch?v=imWmAzWxp38 "Patch Quick Demo 1.0")

## Patch 2.0

Patch is [live](https://codepatch.org/)! The completely in-browser MVP of Patch is up and we would love to hear everyone's thoughts. If you have any feedback or questions, you can contact us at patch@bxcoding.org.

# Development

Development is currently being managed by [BX Coding](https://bxcoding.org). The Github for Patch's IDE can be found [here](https://github.com/BX-Coding/pyatch-react-ide). The Github for Patch's VM can be found [here](https://github.com/BX-Coding/pyatch-vm).

## Developers

- [Elliot Roe](https://github.com/ElliotRoe)
- [Duncan Johnson](https://github.com/DuncanAJohnson)
- [Benjamin Montgomery](https://github.com/benmontycomputer)
- [Ava Wandersleben](https://github.com/Snoopy219)

# Acknowledgments

Patch is built on top of the following amazing open-source projects:
- [Pyodide](https://pyodide.org/en/stable/)
- [Scratch VM](https://github.com/scratchfoundation/scratch-vm)
- [CodeMirror](https://codemirror.net/)
- [Material UI](https://mui.com/)

While our implementations are different, there is another amazing open-source project named Pytch tackling the same problem! Go check them out [here](https://www.pytch.org/app/)
