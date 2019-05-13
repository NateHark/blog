+++
title = "Grails 1.3.7, Maven, Tomcat and Conflicting SLF4J Binaries"
date = "2011-10-11"
draft = false
+++

Today, I ran into an interesting issue while attempting to test a Maven-ized Grails project (1.3.7) in Tomcat 6, and thought I’d document it here. The application was consistently failing to deploy to Tomcat and logging the following error in catalina.out.

```
Exception in thread "main" java.lang.IllegalAccessError: tried to access field
	org.slf4j.impl.StaticLoggerBinder.SINGLETON from class org.slf4j.LoggerFactory
	at org.slf4j.LoggerFactory.<clinit>(LoggerFactory.java:60)
```

The [slf4j FAQ](http://www.slf4j.org/faq.html#IllegalAccessError) indicated that this error is a result of an old slf4j-api version being used with a new version of a sl4fj binding. Sure enough, after inspecting the unpacked war file, I found that slf4j-api-1.5.2 had been included while the rest of the rest of the slf4j libraries were version 1.5.8. Running “mvn dependency:tree” shed no light on the issue as all sl4fj dependencies listed were version 1.5.8. Eliminating all other possibilities, I have to conclude that once of the grails plugins associated with the project (possibly hibernate) is the source of this jar. I was able to eventually resolve the problem by explicitly excluding slf4j-api-1.5.2 via the following snippet added to BuildConfig.groovy.

```groovy
grails.war.resources = { stagingDir ->
	delete(file:"${stagingDir}/WEB-INF/lib/slf4j-api-1.5.2.jar")
}
```

Hope this saves someone else a bit of time.
