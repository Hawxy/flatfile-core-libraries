---
'@flatfile/listener-driver-pubsub': patch
'@flatfile/utils-debugger': patch
'flatfile': patch
---

This version introduces some significant improvements to the capabilities of npx flatfile develop. All outgoing HTTP requests are logged in the debug stream, and we now have a much cleaner analysis of events that are received and where/how they are processed.
