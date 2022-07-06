# Platform-SDK presentation 1

This is the first presentation of the Platform SDK to Alnoor and Roby.  I want to demonstrate what local development of the Platform-SDK will look like, especially testing.

Features shown
1. Extraction of our JSONSchema/AJVTransformation pipeline from api/core into a freestanding package (lives at core/platform-sdk)
2. Very simple compiler that goes from SchemaIL -> JSONSchema.  SchemaIL (Schema Intermediate Language) is a nested JSON datastructure that describes all of the features exposed via the API (fields, validations, matching hints, UI hints).  SchemaIL is generally not expected to be written directly by developers, we will eventually write some syntatic sugar functions and classes that are more concise than raw SchemaIL.  
3. Our wrapper around jest and our whole object tree.  This allows testcases that demonstrate the behavior of the platform to be much more concise than previously possible.  This is literate code, this is (a form of) documentation

I am looking for feedback on
1. Testcases that demonstrate what validation errors you want a schema to throw
2. Feedback on all of the parts of JSONSchema that I need to expose via SchemaIL
3. other feedback


What's coming soon:
more tests and work on schemaIL
similar demonstrations of datahook tests
deployment
