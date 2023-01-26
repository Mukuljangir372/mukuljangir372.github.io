---
title: How To Cache In Android?
layout: post

categories: post
tags:
  - Android
  - Kotlin
  - Okio

thumbnail_url: https://mukuljangir372.github.io/files/thumbnails/how-to-cache-in-android.png

redirect_url: post/2023-01-26-how-to-cache-blog

added_date: 26 Jan 2023

description: How to cache in android with best practises?

author: Mukul Jangir
---

## How To Cache In Android?
Imagine, we are building a android app which load images from url. Everytime when we try to load bitmap from url, we need to download bitmap from url. Suppose, we don’t have any cache strategy to load bitmap from cache. Everytime user scroll, List Adapter will try to load bitmap from url everytime adapter binds, even some images are already download/loaded. Not having a cache strategy can lead to poor performance and OOM (Out of memory exception).

#### Cache
Cache is a way to store values/data. From above example, if there is already downloaded/loaded images, we can put them in cache and load them whevener needed from cache without downloading them again and again. 

#### Types of Cache
There are two types of cache : Memory cache and Disk cache

#### Memory Cache
In Memory cache, all cached data store in application memory and gets cleared with applications destroyed cycle. If we cache data in memory cache, this cache gets cleared whenever application gets destroyed. There are multiple ways to implement memory cache in your android application using LruCache, Buffers etc.

#### Disk Cache
In Disk cache, all cached data store in device storage and doesn’t clear with application destroyed cycle. It even remains after applications destroyed. There are multiple ways to implement disk cache in your android applications using Local Database (SQLite or Room), Disk I/O (Okio) etc.

#### How to Cache In Memory?
Memory cache will remain only until your application is running. If your app gets destroyed, memory cache will also gets cleared. There are multiple ways to cache data in memory. Let’s dive into examples and understand their usecases.

#### Simple Cache Manager
```kotlin
//Build a memory cache manager
class CacheManager<T> {
    private val cache = HashMap<String, T>()
    fun put(key: String, value: T) {
        cache[key] = value
    }

    fun get(key: String): T? {
        return cache[key]
    }
}

//How to use
val manager = CacheManager<User>()
//put cache
manager.put("key_1", User(id = 1))
//get from cache
val user = manager.get("key_1")
```

#### LruCache
In Android, LruCache is a way to implement memory cache. LruCache takes a maxSize of cache. It defines the possible maximum size of cache data. When queue gets filled in size, least used cache data become visible to garbage collector and ready to gets collect while garbage collection. This is good and more optimized way to implement memory cache because it takes care of memory usages and OOM exception cases.

```kotlin
//create a lruCache
val lruCache = LruCache<String, User>(1000) //maxSize = 1000
//put in cache
lruCache.put("key_1", User(id = 1))
//get from cache
val user = lruCache.get("key_1")
```

Suppose, You’r using larger maxSize Of Lrucache or smaller size, both can lead to unexcepted issues when it comes to setting a proper size of cache because cache size can be too large that can throw OOM exception and too small that can less efficient for caching. So what is the correct size of cache we should have? 

In android apps, you can get the maxsize of memory your app can hold. If you exceed this limit, you app will throw OOM Exception. It means your cache size must less than this limit. 

```kotlin
val activityManager = getSystemService(Context.ACTIVITY_SERVICE) as ActivityManager
val sizeInBytes = activityManager.memoryClass * 1024 * 1024
//taking 8th part of total size
val cache = LruCache<String, User>(sizeInBytes / 8)
```

#### How to cache In Disk?
Disk cache will remain even after applications gets destroyed. In android app, you can use Local database like SQLite (Room), File I/O to implement disk cache. 

In General, We use SQLite local database (Room) for storing application or user data. You’r also allowed to store lightweight cache data in local database. If you are working with large size of data like images, bitmaps, thousands of api calls responses etc. It will be a better choice and more optimized solution to go with File cache. 

Idea behind File cache is, we create a file inside cacheDir in android device, it can a internal or external device storage. The choice is yours, but internal storage are less in size/memory. It always recommended to use external storage for storage any type of data you have. But make sure, external storage is accessible to other apps too. If you’r storing some sensitive data there, it might not be the good choice for you. 

For reading/writing files, we use Java I/O. There is also a library called Okio by Square, it is more optimized way to handle Java I/O operations. Here we are also going to use Okio library to implement cache in disk.

#### Cache with Okio
```kotlin
//add okio in your project
implementation 'com.squareup.okio:okio:3.2.0'
```

```kotlin
//create a file
val file = File("${externalCacheDir}/cache12.txt")
if(!file.exists()) {
   file.createNewFile()
}

//write to file
val sink = file.sink() //open to write
val bufferSink = sink.buffer() //buffer is used for cache for performance
bufferSink.writeUtf8("hi, i'm cache") //utf-8 encoding supports multiple chars types
bufferSink.close() //close the stream

//read from file
val source = file.source() //open to read
val bufferSource = source.buffer()
val content = bufferSource.readUtf8() //read content
bufferSource.close()
//content = hi, i'm cache
```

Here, we’re creating a cache file in external cache dir for storing content. For reading/writing file, we are using Okio.

#### Cache Api Calls
In android apps, Local database like SQLite (Room) and File I/O can be used for cache api calls. Even if you are using retrofit with okhttp, you can use internal okhttp cache to cache api call easily. But problem with okhttp cache is, poor performance. 

Using SQLite (Room) might not be a good choice when it comes to cache thousands of api calls with different api responses. Using File I/O will be a good choice.

```kotlin
//make a api call
val apiCall = apiInterface.getUsers()

//create a file
val uid = apiCall.url + apiCall.params.toString() + apiCall.requestBody.toString()
val cacheFile = File("${externalCacheDir}/${uid}.txt")

//write to file
bufferSink.writeUtf8(apiCall.response.toString())

//read from file
val cacheResponse = bufferSource.readUtf8()

//you can also check if cache has expired or not
val time = oldCacheFile.lastModified();
val currentTime = System.currentTimeMillis();
val expirationTime = 60 * 60 * 1000; // 1 hour
val isCacheExpired = currentTime - time > expirationTime;
```

and here you done!\
Thanks for reading! Don’t forgot to share this and follow me for upcoming awesome articles for you.

**Thank you**\
**Mukul Jangir**

**Connect me on :**\
• Linkedin - [@mukuljangir372](https://www.linkedin.com/in/mukuljangir372)\
• Github - [@mukuljangir372](https://github.com/Mukuljangir372)\
• Playstore - [@mukuljangir](https://play.google.com/store/apps/developer?id=Mukul+Jangir)

[Read more blogs](https://mukuljangir372.github.io/posts.html)
