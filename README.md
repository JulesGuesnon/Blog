# Blog

Yet another blog, yet another tech stack.

Among the objectives behind this blog, I wanted to play with [Tanstack Start](https://tanstack.com/start/latest), and [Effect](https://effect.website/).

Why bother taking 5min to manually created a `tsx` file and import the `mdx` inside, while you can make an overly complex system that has:

- [A configuration file](https://github.com/JulesGuesnon/Blog/blob/main/config.json)
- [A JSON schema for your configuration file](https://github.com/JulesGuesnon/Blog/blob/main/config.schema.json) (generated [here](https://github.com/JulesGuesnon/Blog/blob/main/scripts/generate/config-json-schema.ts))
- [Timezone supports](https://github.com/JulesGuesnon/Blog/blob/8cb90c24c617a6749230105345d8d31603e734e1/src/core/content.ts#L45)
- [An abstraction over reading the content](https://github.com/JulesGuesnon/Blog/blob/8cb90c24c617a6749230105345d8d31603e734e1/src/core/source/context.ts#L6)
- [An abstraction over the processing of the content](https://github.com/JulesGuesnon/Blog/blob/main/src/core/processor/index.ts)
- [Schema validation of way too much things](https://github.com/JulesGuesnon/Blog/blob/8cb90c24c617a6749230105345d8d31603e734e1/src/core/common/schemas.ts#L8)
- [In-Memory caching of all the content](https://github.com/JulesGuesnon/Blog/blob/main/src/core/cache.ts)
- [An exhaustive list of all the possible errors](https://github.com/JulesGuesnon/Blog/blob/main/src/core/errors.ts)

I likely forgot to mention some cool features, so feel free to have a look to the source code if you are curious about how this is working! (I mean, this is likely the main reason you are here)
