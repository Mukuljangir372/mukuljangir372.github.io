---
title: Clean and Scalable Architecture in Android and KMM
layout: post

categories: post
tags:
  - Android
  - Kotlin
  - Clean Architecture

thumbnail_url: https://mukuljangir372.github.io/files/thumbnails/dave-hoefler-lsoogGC_5dg-unsplash.jpg

redirect_url: post/2022-08-16-android-clean-architecture-blog

added_date: 16 Aug 2022

description: A guide to help you how to setup clean and scalable architecture

author: Mukul Jangir
---

## Clean and Scalable Architecture in Android and KMM
There has always been an open debate on which architecture we should choose and why we need architecture, blah, blah, blah. In Android development, people are always confused when choosing MVVM, MVP, and MVC architecture.

But yeah! Most people choose MVVM because of the model-view-view-model relation. But in reality, choosing any of them is not mandatory. You can try out the architecture that suits your needs. Here, we will target an architecture design that suits large projects and uses the full power of development. In the end, you will find the architecture you were following was not as good as your own. So, let’s open the secrets of architecture.

Lots of people think we should write clean code. Of course, we should. But if we don’t understand clean code principles, it will become a serious problem/bug. Because while writing clean code, we only consider minimizing the code by putting some code into a separate class.

If you’re an Android developer, you should be careful while putting code into separate classes. Because it comes with the cost of thread safety, memory leaks, parallel execution issues, etc. Also, in Android, most things use context. It’s a bad practise to pass the context to another class.

### Clean Architecture and Modularization
Clean architecture solves the complexity of projects in a simpler and scalable form. In clean architecture, we separate the codebase of an app into different layers at different levels/scopes. By using SOLID principles, we can make it more beautiful and scalable. SOLID principles are design principles that include questions like

• Is the component scalable?
• How is DI managed?
• What patterns are used for the prevention of complexity?
• How common components are sharing code, and in which manner?

Modularization is a technique where we separate the layers/features into modules. By using multi-module architecture, complex projects can easily be converted into more readable, testable, reusable, and scalable forms. And improve the Gradle build performance.
Both clean architecture and modularization help the new team members to understand the flow of code easily. It makes adopting processes smooth and easy.

### Common Architectural Principles
As Android apps grow in size, it’s important to design architecture that allows the app to scale, increases the app’s robustness, and makes the app easier to test. Here are some design principles we can follow to design our app:

#### Separation of logic
It’s a common mistake to write all your code inside an activity or fragment. We should try to separate some code into other classes to make them reusable and readable. But it doesn’t mean we must put all the code into other classes. While separating the code, you should be very careful while passing context, proper registering or unregistering callbacks, and avoid separating activity/fragment-specific APIs-related code.

And also, try to use Kotlin design patterns like Factory, Builder, etc. If you are thinking about Singleton pattern, yes, you can use this as well. But it comes with the cost of complex testing, thread safety, etc.

#### UI and data models
This is one of the most important designs we should follow. From a clean perspective, we should separate the network and local data models and keep it like one for network and another one for local. This saves you from the overburden of unnecessary data you will present in your UI. Rather than sharing data models direct to UI from ViewModel, we should try to share only that state which holds only UI-specific data with the initial value.

In general, we put validation in activity, fragment, and Viewmodel, But in reality, This is very bad practise. To solve this, we should make a validation helper or usecase class that will validate the inputs. Also, we should try to do mapping only in a repository, not in viewmodel or activity/fragment.

#### Single source of truth
When a new data type is defined in your app, you should assign a Single Source of Truth (SSOT) to it. The SSOT is the owner of that data, and only the SSOT can modify or mutate it. To achieve this, the SSOT exposes the data using an immutable type, and to modify the data, the SSOT exposes functions or receives events that other types can call.

Generally, in apps, we’ve database and network sources of data. To implement the SSOT, we fetch the network data and insert it into a database that is not directly accessible to UI. To access the data, UI will use only the database.

#### Exposing data
While defining a new data type, you should not expose network data directly to UI. While making an API call, you should only expose the UI state or UI-related data model to the Presentation layer. By adding immutability, it makes UI only focus on a single role — reading and displaying the data.

As a result, you should never modify the UI state in the UI directly unless the UI itself is the sole source of its data. The most common mistake we make is by sharing mutable data to UI or passing data from UI to ViewModel directly via params.

### Layers of Clean Architecture
Before diving into a project structure, let’s first understand the layers of architecture. We generally have three layers: Data, Domain, and Presentation.

#### Data Layer
The data layer is a part of the business logic. It includes local storage or caching, networking, models and mappers, etc. It manages data operations like fetching data from the network or local database.

It’s a good practise if we define separate data sources for the network and database. Often, we get into the mess of merging network and database data sources. We should define separate data sources like the following:

```java
class ExampleRepository(
    private val exampleRemoteDataSource: ExampleRemoteDataSource, // network
    private val exampleLocalDataSource: ExampleLocalDataSource // database
) { /* ... */ }
```

Also, when it comes to business models, we should separate these models by network and local database cases like the following:

#### Benefits
• Prevent nullable data
• Easy mapping
• Reduce the complexity of annotations.
• Sometimes, our screens don’t need the full data from network models. In this case, we can   provide only needed data to UI.

```java
//Network Business Model
data class ArticleApiModel(
   val id: String,
   val name: String? = null,
   val users: List<User>? = null
)

//Local Database Model
data class Article(
   val id: String,
   val name: String,
)
```

While making an API call or any local database operation, it should be safe to main-thread. It’s a good practise to inject CoroutineDispatcher using DI.

```java
class NewsRemoteDataSource(
  private val newsApi: NewsApi,
  private val ioDispatcher: CoroutineDispatcher //inject 
) {
    /**
     * Fetches the latest news from the network and returns the result.
     * This executes on an IO-optimized thread pool, the function is main-safe.
     */
    suspend fun fetchLatestNews(): List<ArticleHeadline> =
        withContext(ioDispatcher) {
            newsApi.fetchLatestNews()
        }
    }
}
```

Sometimes, we need an in-memory cache to preserve the data. Suppose a new requirement is introduced for the News app: when the user opens the screen, cached news must be presented to the user if a request has been made previously. Otherwise, the app should request a network to fetch the latest news.

You can preserve data while the user is in your app by adding in-memory data caching. Caches are meant to save some information in memory for a specific time — in this case, as long as the user is in the app. Using Mutex from Kotlin Coroutines, we can lock the thread-safe write.

