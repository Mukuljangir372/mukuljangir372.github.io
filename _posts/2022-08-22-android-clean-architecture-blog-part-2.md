---
title: Part-2 Clean and Scalable Architecture in Android and KMM 
layout: post

categories: post
tags:
  - Android
  - Kotlin
  - Clean Architecture

thumbnail_url: https://mukuljangir372.github.io/files/thumbnails/android_clean_arch.png

redirect_url: post/2022-08-22-android-clean-architecture-blog-part-2

added_date: 22 Aug 2022

description: A guide to help you how to setup clean and scalable architecture

author: Mukul Jangir
---

## Clean and Scalable Architecture in Android and KMM
There has always been an open debate on which architecture we should choose and why we need architecture, blah, blah, blah. In Android development, people are always confused when choosing MVVM, MVP, and MVC architecture.

Before jump into Part-2, please read [Part-1 from here](https://mukuljangir372.github.io/post/2022/08/16/android-clean-architecture-blog.html)


### Presentation Layer
The presentation layer is also known as UI Layer. It is responsible for displaying application data on the screen. In simple words, it deals with the UI part of an application. In Presentation layer, UI triggers the event to viewmodel or other source or vice versa.\
Here are some principles you should know:

### UI state
It’s a bad practise to expose the data directly from viewmodel or another source to UI Layer. Rather than having multiple states or properties for updating the UI, you should consider making a single State Model that holds only required UI Data. The key benefit of this is UI able to focus on only one role of reading the data, not writing or mapping the data.\
As a result, you should never modify the UI state in the UI directly unless the UI itself is the sole source of its data. Only the source or owner of data should be allowed to update the data, not the UI directly.

### Exposing data
You should consider the immutability of the UI state because exposing the right to update/write data directly to UI is not a good idea. The key to this principle is that exposing data is only allowed to its owner, not UI.\
Here is an example of using state, combining the flows, managing the UI messages, etc.

```java
internal data class CollectionStateHolder(
    var collectionList: LazyPagingItems<Collection>? = null,
    val isRefreshing: Boolean = false,
    val uiMessage: UiMessage? = null,
){
    companion object{
        val Empty = CollectionStateHolder()
    }
}

@HiltViewModel
internal class CollectionListViewModel @Inject constructor(
    private val observeCollections: ObserveCollections
) : ViewModel() {

    private val _isRefreshing = MutableStateFlow(false)
    val isRefreshing : StateFlow<Boolean> get() = _isRefreshing

    private val _uiMessage = MutableStateFlow(UiMessage.Empty)
    val uiMessage : StateFlow<UiMessage> get() = _uiMessage

    val state : StateFlow<CollectionStateHolder> = combine(
        isRefreshing,
        uiMessage,
    ){ isRefreshing, uiMessage ->
        CollectionStateHolder(
            isRefreshing = isRefreshing,
            uiMessage = uiMessage
        )
    }.stateIn(
        scope = viewModelScope,
        started = SharingStarted.WhileSubscribed(5000),
        initialValue = CollectionStateHolder.Empty
    )

    init {
        viewModelScope.launch {
            observeCollections(ObserveCollections.Params())
        }
    }

    fun getLiveCollectionList() = observeCollections.flow

    fun refreshing(value: Boolean){
        _isRefreshing.value = value
    }
    fun pushUiMsg(msg: String) {
        _uiMessage.value = UiMessage(message = msg)
    }
    fun clearUiMsg() {
        _uiMessage.value = UiMessage(message = null)
    }

}
```

### Modularization
In an ever-growing code base, scalability, readability, testability, and overall code quality often decrease over time. This comes as a result of the codebase increasing in size without its maintainers taking active measures to enforce an easily maintainable structure. Modularization is a means of structuring your codebase in a way that improves maintainability and helps avoid these problems.

Modularization is a practise of organizing a code base into loosely coupled and self-contained parts. Each part is a module. Each module is independent and serves a clear purpose.

In Modularization, it depends on you to divide your app into different modules by the feature or by the architecture layers. At some points, you might be confused about choosing module separation. You should separate it by features with architecture layers. But each feature module should not depend on other feature modules. You should keep it independent as much as you can. It improves the reusability of modules.

In Modularization, each feature module cannot communicate directly with other feature modules. In fact, the App module has the access to all modules of the app.


### Modularization Practise
There are some practises, ideas, and solutions you can follow to create a scalable architecture with modularization.

1. Managing database: You might think, can we have multiple databases according to app features? Or should we only hold one database for an app? As a solution to this, you can adopt both approaches. It depends on your app needs. You should not go for the multiple databases approach if your app needs database tables join-related data. If your app doesn’t have to deal with multiple database’s tables joins, you can adopt the multiple databases approach easily.

2. App navigation: While dealing with app navigation, you should hold a central place where all your navigation screens are combined to make awesome app navigation. You can choose App Module as the central place and easily manage your app navigation into this.

```java
internal sealed class Screen(val route: String) {
    object Collection : Screen("collection")
    object Saved : Screen("Saved")
    object Search : Screen("Search")
}

internal sealed class NavScreen(
    private val route: String
) {
    fun createRoute(root: Screen) = "${root.route}/$route"

    object Collection : NavScreen("collection")
    object Saved : NavScreen("Saved")
    object Search : NavScreen("Search")

    object CollectionDetail : NavScreen("collectionDetail/{collectionId}") {
        fun createRoute(root: Screen, collectionId: String): String {
            return "${root.route}/collectionDetail/{$collectionId}"
        }
    }

    object AssetDetail : NavScreen("assetDetail/{assetId}") {
        fun createRoute(root: Screen, assetId: String): String {
            return "${root.route}/assetDetail/{$assetId}"
        }
    }
}

//Graph
@Composable
internal fun AppNavigation(navController: NavHostController) {
    NavHost(
        navController = navController,
        startDestination = Screen.Collection.route
    ) {
        addCollectionTopLevel(navController)
        addSavedTopLevel(navController)
        addSearchTopLevel(navController)
    }
}

//Screen
private fun NavGraphBuilder.addCollection(
    navController: NavHostController,
    root: Screen
) {
    composable(route = NavScreen.Collection.createRoute(root)) {
        CollectionList {

        }
    }
}

```

Checkout this [opensource project](https://github.com/Mukuljangir372/NFT-App) project for more details.

That's it for now.

**Thank you**\
**Mukul Jangir**

**Connect me on :**\
• Linkedin - [@mukuljangir372](https://www.linkedin.com/in/mukuljangir372)\
• Github - [@mukuljangir372](https://github.com/Mukuljangir372)\
• Playstore - [@mukuljangir](https://play.google.com/store/apps/developer?id=Mukul+Jangir)

[Read more blogs](https://mukuljangir372.github.io/posts.html)
