---
title: Kotlin Coroutines For Beginners
layout: post

categories: post
tags:
  - Kotlin

thumbnail_url: https://mukuljangir372.github.io/files/thumbnails/kotlin-coroutines-beginners.png

redirect_url: post/2023-04-02-kotlin-coroutines-beginners

added_date: 4 April 2023

description: A guide to help you in kotlin coroutines for beginners.

author: Mukul Jangir
---

## Kotlin Coroutines For Beginners

Kotlin Coroutines is a way to simply the code that executes asynchronously. Kotlin Coroutines can do all the things that a thread can do. Kotlin Coroutines do the asynchronous programming in more efficient and productive way. Coroutines includes multiple APIs like Flow, Channels etc.

### What problems do coroutines solve?

Kotlin Coroutines provide the most efficient way and productive way to deal with concurrency and threading. Coroutines are lightweight and simply the asynchronous code. In asynchronous world, coroutines solves the multiple problems that comes in while writing structured concurrency.

**• Lightweight -** Coroutines has the ability to launch multiple coroutines job inside a single thread without creating multiple thread everytime.

 **• Fewer Memeory Leaks -**  Coroutines provides the ability to deal with memory leaks and exceptions by using structured concurrency. For instance, a coroutine job launched inside a coroutine scope that can be cancelled when any exception occur.

**• Long Running Tasks -** Coroutines has the ability to run multiple background tasks without blocking the main thread.

**• Cancellation Support -** Coroutines can be cancelled when any exception occur or manualy. 

### Coroutines Terms

**• Coroutine Scope -** Coroutines Scope allows to launch new coroutine jobs within the context. It also has the ability the cancel all launched jobs inside the scope.

**• Coroutine Job -** Coroutines Job is used for doing a work with cancellation support.

**• Coroutine Context -** Coroutines Context defines the behavior of coroutine scope or job such as dispatcher, exception handler etc.

**• Coroutine Dispatcher -** It defines which thread should be used to execute the task. It involves single thread, a pool of threads, background or main threads etc.

**• Suspend Function -** A suspend function can block the current execution of code, can be resumed or paused.

### Examples Of Coroutines

Lets undersand the usecase of using coroutines:

```kotlin
class UserReaderWriter {
    private val exceptionHandler = CoroutineExceptionHandler { coroutineContext, throwable ->
        //catch the exception
        throw throwable
    }
    private val scope = CoroutineScope(Dispatchers.IO + exceptionHandler)
    
    fun fetchDetails() {
        scope.launch {
            val users = async { getUsers() }
            val updated = launch { updateUsers() }
            users.await() + updated.join()
        }
    }
    
    private suspend fun getUsers(): List<String> {
        return withContext(Dispatchers.IO) {
            // make a network api call
            emptyList()
        }
    }
    
    private suspend fun updateUsers(): Boolean {
        return withContext(Dispatchers.IO) {
            // make a network api call
            true
        }
    }
    
    fun dispose() {
        scope.cancel() //cancel all coroutine jobs
    }
}
```

In this examaple, `UserReaderWriter` is a class used for getting the details of user and updating users as well. In this, `CoroutineExceptionHandler` is used for tracking all the exceptions occured within the coroutine scope. We have created a scope with `Dispatchers.IO` and a exception handler. `Dispatchers.IO` defines which thread should be used. Here are multiple Dispatchers that can be used like -

`Dispatchers.IO` - It uses the Input/Output threads for general usage like making an api call, query from database etc.

`Dispatchers.Main` - It uses the main thread for ui operations.

`Dispatchers.Default` - It used for cpu intensive tasks like complex maths calculations because it uses the CPU cores.

In `fetchDetails` function, we’ve launched a coroutine job for doing a work by using `launch` function of scope. In `fetchDetails` , for getting the users, we’ve launched a another async coroutine job by using `async` function. `async` and `launch` functions behaviour are same but `async` has the ability to get the result from `getUsers` function. We’ve used `users.await` and `updated.join` functions. `users.await`  and `updated.join` block the current execution till the coroutine job cancelled or finished. The major difference is `await` gives the result from coroutine job. 

Inside `getUsers` , `withContext(Dispatchers.IO)` launch a job with IO dispatcher. `withContext` and `async` has same behaviour but `withContext` doesn’t requires to call `await` to get the results.  

Inside `dispose` , we’ve cancelled the scope and all launched coroutine jobs. A cancelled scope not able to launch new coroutine jobs.

and here you done!\
Thanks for reading! Don’t forgot to share this and follow me for upcoming awesome articles for you.

**Thank you**\
**Mukul Jangir**

**Connect me on :**\
• Linkedin - [@mukuljangir372](https://www.linkedin.com/in/mukuljangir372)\
• Github - [@mukuljangir372](https://github.com/Mukuljangir372)\
• Playstore - [@mukuljangir](https://play.google.com/store/apps/developer?id=Mukul+Jangir)

[Read more blogs](https://mukuljangir372.github.io/posts.html)
