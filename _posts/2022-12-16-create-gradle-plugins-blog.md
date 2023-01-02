---
title: Create Gradle Plugins In Android & KMM
layout: post

categories: post
tags:
  - Android
  - Kotlin
  - Gradle

thumbnail_url: https://mukuljangir372.github.io/files/thumbnails/flying-gradle.png

redirect_url: post/2022-12-16-create-gradle-plugins-blog

added_date: 16 Dec 2022

description: A guide to help you how to create gradle plugins in Android And KMM

author: Mukul Jangir
---

## Create Gradle Plugins In Android & KMM
Before dive into gradle, Let’s first understand what is Gradle? and Why we need this?

### Gradle
Gradle is a open source build automation tool that is designed to be flexible enough to build almost any type of software with certain defined configurations. Gradle uses groovy language to run and build the software. Now days gradle also supports kotlin. It means you able to run kotlin code for gradle. In Android, Android studio use Gradle to manage the build process with some certain build configurations which allows you to build apks or bundle by compile the app resources or source code.

### The Build Process
The Build Process involves many tools and processes to convert the project into Android Application Package (APK) or Android App Bundle (AAB). Under the hood, The compiler compiles the app source code and convert them into DEX (Dalvik Executable) files. Later, The Packager combines the DEX files and compiled resources into an APK or AAB, depending on the chosen build target. The packager uses the zipalign tool to optimize your app to use less memory when running on a device. Gradle build process use scripts defined with some certain build configurations like build target, product flavours etc.

A Gradle build has three distinct phases :

1. Initialization : Gradle supports single or multiple project builds. In Initialization phase, Gradle determines which projects are going to take part in build process. During initialization, gradle look for settings.gradle file in root project, Gradle checks if the current project is part of the multi-project hierarchy defined in the found settings.gradle file. If not, the build is executed as a single project build. Otherwise a multi-project build is executed. Gradle creates project object based on initilization phase process.

2. Configuration : In configuration phase, Gradle determines which configurations are going to invoke in build process. It use build.gradle.kts.

3. Execution : In execution phase, Gradle start build process with some sort of configurations of projects.

### The Gradle Plugins
Gradle plugins plays a important role in gradle build process. Plugins add some defined tasks or objects to respective build scripts. In multi-module projects, we might need to share common code between gradle scripts or providing some short of configurations. Plugins do it in better way.

In general, Plugins has two types — Binary and scripts plugins.

1. Binary Plugins : Binary plugins are written in Gradle’s DSL languages. These plugins are used with build scripts or project hierarchy to add some extra tasks. Generally, these are created by implementing Plugin interface.

2. Script Plugins : Script plugins are are additional build scripts used for manipulating the build process.

### Create a Gradle Plugin
In multi-module projects, we might need to share common code between build scripts. To take out most of gradle features, you should use gradle plugins for better management of builds. Without wasting time, Let’s have some fun and create a plugin in multi-module project.

Create a directory named `convention-plugins` in root project. You can name this anything you want. Inside convention-plugins, you also have to create `build.gradle.kts` `settings.gradle.kts` and `src/main/kotlin/<package_name_convention_plugins>`.

`settings.gradle.kts` of root project

```groovy
rootProject.name = "YouTv"

//only for version catalog
enableFeaturePreview("VERSION_CATALOGS") 

//only for typesafe
enableFeaturePreview("TYPESAFE_PROJECT_ACCESSORS") 

pluginManagement {
    repositories {
        google()
        gradlePluginPortal()
        mavenCentral()
    }
}

include(":androidApp")
include(":shared")

//add convention-plugins module to gradle builds. 
//So that this module can take part in gradle build process.
includeBuild("convention-plugins") 
```

`build.gradle.kts` of root project

```groovy
buildscript {
    repositories {
        gradlePluginPortal()
        google()
        mavenCentral()
    }
    dependencies {
        classpath(libs.kotlin.gradle.plugin)
        classpath(libs.gradle.plugin)
        classpath("com.mukul.jan.youtv:convention-plugins") //add this
    }
}

allprojects {
    repositories {
        google()
        mavenCentral()
    }
}

tasks.register("clean", Delete::class) {
    delete(rootProject.buildDir)
}
```

`settings.gradle.kts` ofconvention-plugin module.

```groovy
rootProject.name = "convention-plugins"

//enable verstion catalog feature
enableFeaturePreview("VERSION_CATALOGS")

//enable typsafe
enableFeaturePreview("TYPESAFE_PROJECT_ACCESSORS")

//used for plugin management like plugin version or repo management etc.
pluginManagement {
    repositories {
        gradlePluginPortal()
        google()
    }
}

//you only need this if you'r using version catalog
//Here, you are taking out libs.versions.toml file from root gradle directory for gradle version cataglog.
dependencyResolutionManagement {
    versionCatalogs {
        create("libs") {
            from(files("../gradle/libs.versions.toml"))
        }
    }
}
```

Create `YouTvAndroidAppLibPlugin.kt` inside `convention-plugin` `src/main/kotlin/<package>` directory.

```groovy
package com.mukul.jan.youtv.convention.plugins

import com.android.build.gradle.LibraryExtension
import org.gradle.api.JavaVersion
import org.gradle.api.Plugin
import org.gradle.api.Project

@Suppress("UnstableApiUsage")
class YouTvAndroidAppLibPlugin: Plugin<Project> {
    override fun apply(target: Project) {
        target.plugins.apply("com.android.library")
        target.plugins.apply("org.jetbrains.kotlin.android")
        target.extensions.getByType(LibraryExtension::class.java).also {
            it.compileSdk = 32
            it.compileOptions {
                targetCompatibility = JavaVersion.VERSION_1_8
                sourceCompatibility = JavaVersion.VERSION_1_8
            }
            it.defaultConfig {
                minSdk = 24
                targetSdk = 32
                testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
            }
        }
    }
}
```

`build.gradle.kts` ofconvention-plugin module.

```groovy
//To support kotlin code, we are using kotlin-dsl. 
plugins {
    `kotlin-dsl`
}
repositories {
    mavenCentral()
    google()
    gradlePluginPortal()
}
dependencies {
    implementation(libs.kotlin.gradle.plugin)
    implementation(libs.gradle.plugin)
    compileOnly(gradleApi())
}
java {
    toolchain {
        languageVersion.set(JavaLanguageVersion.of(11))
    }
}
tasks.withType<JavaCompile>().configureEach {
    options.release.set(8)
}
//creating plugins
gradlePlugin {
    plugins {
        //define a function for creating plugin 
        fun createPlugin(id: String, className: String) {
            plugins.create(id) {
                this.id = id
                implementationClass = className
            }
        }
        //finally, create the plugin with id and it's class.
        createPlugin(
            id = "youTv.android.lib",
            className = "com.mukul.jan.youtv.convention.plugins.YouTvAndroidAppLibPlugin"
        )
    }
}
```

To apply the plugin to module inside `build.gradle.kts`

```groovy
plugins {
    id("youTv.android.lib")
}
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
