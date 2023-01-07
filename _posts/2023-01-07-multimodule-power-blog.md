---
title: Top Level Flavored Multi-Module Architecture
layout: post

categories: post
tags:
  - Android
  - Kotlin
  - Architecture

thumbnail_url: https://mukuljangir372.github.io/files/thumbnails/top-level-mm-arch.png

redirect_url: post/2023-01-07-multimodule-power-blog

added_date: 7 Jan 2023

description: Increase 50x Build Times Using Flavored Modularization Architecture

author: Mukul Jangir
---

## Top Level Multi-Module Architecture
With the increasing of large codebase, multiple issues raise including code readability, scalability and overall code quality decrease with time. To maintain the large codebase, single module can be divided into multiple modules which serves a clear purpose. Each module can be a library or feature module which will merged into app shell to build a application. 

Modularization means above what you had read. In this article, i'm not going to explain, How to setup modularization in your project? Here, I will explain you, What things you are missing in your architecture and what things are making slower build times even after modularization.

In flavored modularization, we define multiple flavors before layers to achieve higher level of isolation to get the benefits of modularization with fastest build times.

### Benefits
There are multiple benefits someone can achieve with modularization but truth is these benefits can leave you as well. I will explain you later in this article.

• Scalability\
• Code Readability
• Testablity\
• Code Ownership

ops!, i forgot to mention fast build time benefit. Wait! Is gradle build times really improve in multi-module? You don't have to think about this too much, just continue to read and things will clear at end.

### Problems With Your Multi-Module
For Android Developers, Gradle build times are one of the major issues they face everyday. To solve the issue, We started to adopt Modularization in our projects. After the long file-moving process (Modularization), we ended at slow gradle build times even slower and slower then before.
Buddy, Let me clear one thing, you have done something wrong with your mult-module project structure. 

When you compare the build times, you will see, build times are good in multi-module-by-feature, not in multi-module-by-layers. Clear cut advice is, you should always go with good isolated features in your project. It doesn't matter what kind of architecture you've adopted, a good multi-module architecture defines the good isolated features. 

If you have multiple modules and they are depends on each other, It will not benefit you as well. Higher isolated features is one of the best solution you can go with to improve the build times. 

### Isolated Features
Isolated features are those features which defines a clear layer of isolation without any dependency on other features or layers. Isolated features are the part of flavored multi-module architecture.

To get the benefits of isolated features, you can start implementation of these features simply by defining the base layer for each and every isolated features. Inside a feature, you can have your own isolated business logic with touching the outer layers.

### Flavored Modularization
In Flavored Modularization, we define product flavors before defining the layers/features. For instance, you have two product flavors - `Chat` and `Teams`. Under `Chat` And `Teams` flavors, you can define your isolated features. One flavor cannot access another flavor. But multiple features can be a part of multiple flavors without having the dependency on each other. For the communication between flavors, you can have a base module and for activity/fragments/dialogs communications, you can use reflection in your flavors.
This is how you can achieve 50x faster build times in your project by switching between flavors to load or unload the features.

and here you done!\
Thanks for reading! Don’t forgot to share this and follow me for upcoming awesome articles for you.

**Thank you**\
**Mukul Jangir**

**Connect me on :**\
• Linkedin - [@mukuljangir372](https://www.linkedin.com/in/mukuljangir372)\
• Github - [@mukuljangir372](https://github.com/Mukuljangir372)\
• Playstore - [@mukuljangir](https://play.google.com/store/apps/developer?id=Mukul+Jangir)

[Read more blogs](https://mukuljangir372.github.io/posts.html)
