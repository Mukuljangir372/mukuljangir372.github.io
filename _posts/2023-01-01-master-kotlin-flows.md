---
title: Master Kotlin Flows With Operators
layout: post

categories: post
tags:
  - Kotlin

thumbnail_url: https://mukuljangir372.github.io/files/thumbnails/master-kotlin-flows.png

redirect_url: post/2022-01-01-master-kotlin-flows

added_date: 1 Jan 2023

description: A guide to help you to master kotlin flows including operators in android and kotlin.

author: Mukul Jangir
---

## Master Kotlin Flows With Operators
In Modern Android Development, Coroutines And Flow are one of the ways to deal with asynchronous programming with multiple operators like Rxjava. In Android, We use coroutines for dealing with multi-threading, concurrency, thread locks etc. And Kotlin Flow used used for asynchronous data streams like RxJava. In this article, we are heading towards Kotlin Flow.

### Kotlin Flow
Kotlin Flow is a data emitter who can emit values. Kotlin Flows built on top of kotlin coroutines to support concurrency. There are three main components in kotlin flows in order to understand the mechanism of kotlin flows :

**• `Producer or Emitter` -** It emit values.\
**• `Middleware` -** It can modify values that will consumed by a consumer.\
**• `Consumer` -** Emitted values will later consumed by consumer.

### Hot vs Cold Flow
`Cold Flows` are those producers that doesn’t starting emiting values until unless it has a collector or cosumer. Simple Flow buider is a cold flow.

**•** It emits data only when there is a collector or consumer.\
**•** It does not store data.\
**•** It cannot have multiple collectors or consumers.

`Hot Flows` are those producers that emit data even there is not collector or consumer. StateFlow is a hot flow. You can convert a cold flow into hot flow using `shareIn` function.

**•** It emit data even when there is not collector or consumer.\
**•** It is possible to store values.\
**•** It can have multiple collectors or consumers.

### Flow vs StateFlow vs SharedFlow
In Kotlin, there are multiple flows types and it’s usecases. Lets try to understand these types one by one.

### Flow
Flow is a simplest flow you can create using flow builder or some extensions. Flow is a cold flow that cannot have multiple collectors. For simple usecases, like making a api call using repository pattern, we can use simple flow to handle these usecases.

```kotlin
//create a cold flow using flow builder
val users = flow {
    emit("Alex")
}

//collect
users.collect {
    //user
}.flowIn(Dispatchers.IO) //adding a dispatcher to upstream flow

//convert list to flow
listOf(1,3,4).asFlow() 

//convert intRange to flow
(0..5).asFlow() 

//convert array to flow
arrayOf("hello").asFlow()

//using builder api
val flow = flow { 
   emit(1)
   delay(100L) //delay
   emit(2)
}
```

### StateFlow
StateFlow is a flow hot that can have multiple collectors at same time. StateFlow behave like a value holder which emits the last value to all known collectors. While creating stateflow, we need to gave a initial value. Like Livedata, we can configure it with lifecycle aware coroutines scopes to attach with lifecycle. It has value property to access

```kotlin
//create a stateflow
private val _state = MutableStateFlow(State.IDLE) //assign a initial value State.IDLE
val state: StateFlow<State> get() = _state

//collect
state.collectLatest {
    //new state
}

//stateflow have value property to access latest value
val newState = state.value
```

### SharedFlow
SharedFlow is a hot flow that can have multiple collectors at same time. Unlike StateFlow, It doesn’t behave like a data holder like stateflow does. It doesn’t have any value property like stateflow has. Also, Unlike StateFlow, you cannot attach it with lifecycle components.

```kotlin
//create a sharedFlow
private val _sharedFlow = MutableSharedFlow<State>()
val sharedFlow: SharedFlow<State> get() = _sharedFlow

//collect
sharedFlow.collect {
   //collect all items
}
```

### Modifying The Flow
Middlewares are allowed to modify the stream/flow before actually consumed by consumer. 

```kotlin
//create a flow
val flow = flow { 
   emit(1)
   emit(2)
   emit(3)
}

//modify the stream
flow.map { value -> value * 2 } //each value multiply by 2 
    .filter { /* filter */ }
    .onEach { value -> storeValues(value) }
    .catch { /* catch the exception here from stream */ }

```

### Operators In Kotlin Flow
There are multiple operators in Kotlin Flow like RxJava. We will go one by one and understand the usecases of these operators.

### Retry Operator
You can retry or rerun the flow when some certain condition meet.

```kotlin
//create a flow
val flow = flow {
   emit(1)
   throw IllegalArgumentException("") //throw exception
}

//retry 3 times
flow.retry(3) { cause ->
    return@retry if(cause is IllegalArgumentException) {
          true //retry
    } else {
         false //don't retry
    }
}

//retryWhen is a another way to retry flow
flow.retryWhen { cause, attempt 
    return@retryWhen if(attempt < 3 && cause is IllegalArgumentException) true
    else false
}
```

### With Timeout
You can timeout and cancel the flow collector.

```kotlin
//cancel the collection after 3000L
withTimeout(3000L) {
  flow.collectLatest {
     //collect
  }
}
```

### Catch Operator
In Kotlin flows, you able to catch the exceptions from streams.

```kotlin
flow.catch {
  //catch exception
}.collect {
  //collect
}
```

### Debounce Operator
In Kotlin Flows, you able to debounce the each emitted item with specific time frame.

```kotlin
//debounce each item with 1000 second
flow.debounce(1000L)
.collect {
  //collect each item after 1 second
}
```

### Map Operator
Map operator used for mapping the emitted items from kotlin flow.

```kotlin
//create flow of type int
val flow = (0..1).asFlow()

//ollect
flow.map { it.toString } //convert int to string
.collect {
  //collect strings
}
```

### Filter Operator
Filter is used for filtering the emitted items from flow.

```kotlin
//create flow
val flow = (0..10).asFlow()

//filter
flow.filter { value ->
  if(value == 0 || value == 10) true
  else false
}.collect {
  //collect only 0 and 10
}

//also you can filter items by datatype
flow.filterIsInstance<Int>()
.collect {
  //collect only int data types values
}

//also you can filer notNull values
flow.filterNotNull()
```

### Zip Operator
Zip used for combine the multiple flows emissions into single flow. It only emits an item when all flows have emitted an item, and the resulting flow completes only when all input flows complete.

```kotlin
//create flows
val flow1 = (0..1).asFlow()
val flow2 = (1..5).asFlow()

//zip
flow1.zip(flow2) { a, b -> 
   a + b
}.collect {
  //a + b
}
```

### Combine Operator
Combine operator is same as zip operator. But it emits an item as soon as one of the flows emits item and only completes the flow when all flows gets completed.

```kotlin
flow1.combine(flow2) { a, b ->
   a + b 
}.collect {
  //a + b
}
```

### Merge Operator
Merge operator is same as combine operator. It emits item as soon as one of the flows emits item and only completes the flow when all flows gets completed. It keeps the order of items as they emitted from flows. But it doesn’t guarantee the order of items.

```kotlin
val mergedflows = merge(flow1, flow2)
```

**Thank you**\
**Mukul Jangir**

**Connect me on :**\
• Linkedin - [@mukuljangir372](https://www.linkedin.com/in/mukuljangir372)\
• Github - [@mukuljangir372](https://github.com/Mukuljangir372)\
• Playstore - [@mukuljangir](https://play.google.com/store/apps/developer?id=Mukul+Jangir)

[Read more blogs](https://mukuljangir372.github.io/posts.html)
