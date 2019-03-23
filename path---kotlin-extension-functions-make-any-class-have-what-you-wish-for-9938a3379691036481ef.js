webpackJsonp([0x65c1ff01e8f1],{348:function(e,n){e.exports={data:{markdownRemark:{html:'<hr>\n<p><strong>Kotlin</strong> allows us to extend a class with new functionality at <strong>compile-time</strong> without having to inherit from any parent class using a <strong><em>extension functions</em></strong>.</p>\n<p>In <strong>Java</strong>, only mechanizm to extend a class at <strong>compile-time</strong> is to extend from another known class having the functionality (non-private methods / attributes) available to the inheriting classes. There are many options extend functionality of instance by encapsulating it at <strong>run-time</strong>, using design patterns such as Decorator, Proxy, <em>instance of</em> check and casting. We are not going to discuss them here.</p>\n<p><strong>Kotlin</strong> supports both <em>extension functions</em> and <em>extension properties</em>. You can find more on these special declarations called <em>extensions on Kotlin’s</em> official documentation <a href="https://kotlinlang.org/docs/reference/extensions.html">here</a>.</p>\n<p>We will take a simple and useful example, very common class, <code>JsonNode</code> from <code>fasterxml.jackson.</code> . Transforming <code>JsonNode</code> (tree style) object, is not convenient as modifying a <code>Map&#x3C;String, Any></code>. However, <code>ObjectMapper</code> comes with built in functions to convert <code>JsonNode</code> from / to a <code>Map&#x3C;String, Any></code>. We will extend its functionality of <code>JsonNode</code> <em>to</em> allow transforming of a <code>JsonNode</code> <em>instance</em> by setting properties as we would do on a <code>Map&#x3C;String, Any></code> object.</p>\n<p>Let us magically extend <code>JsonNode</code> class with two <em>extension functions</em>.</p>\n<ol>\n<li><code>JsonNode.toMap(): MutableMap&#x3C;String, Any></code>, which receives an instance <code>JsonNode</code> as (<em>this</em>) and can convert the <code>JsonNode</code> tree into <code>Map&#x3C;String, Any></code> using already available <code>ObjectMapper</code> functionality.</li>\n<li><code>JsonNode.transform(fn: MutableMap&#x3C;String,Any>.()-> Unit) :JsonNode</code>, which receives an instance of <code>JsonNode</code> (<em>jsonNode</em>) as (<em>this</em>) and a Function / Unit (<em>fn</em>) as an an argument to set properties on <code>Map&#x3C;String, Any></code> as its receiver.</li>\n</ol>\n<p>See the implementation below. When <em>jsonNode.transform(fn)</em> is called, it first uses <code>JsonNode.toMap()</code> extension function previously defined to create a <code>Map&#x3C;String, Any></code> (<em>map</em>) from instance of <code>JsonNode</code> (<em>jsonNode</em>) it was called upon, and then calls the <em>map.fn() [</em>aka<em>. map.also(fn)]</em>, where (<em>fn</em>) was passed in as the unit function applying all the modifications to the (<em>map</em>) built from (<em>jsonNode</em>) and finally return the resulting <code>Map&#x3C;String, Any></code> converting it to a <code>JsonNode</code> again using the <code>ObjectMapper</code></p>\n<pre><code>  private fun jsonNode(): JsonNode = mapper.readValue(\n    StringReader("""\n      {\n       "name": "Simar",\n       "country": "Canada"\n      }\n      """) // triple quoted for multi-line strings\n    )\n\n  fun JsonNode.transform(fn: MutableMap&#x3C;String, Any>.() -> Unit): JsonNode =\n          toMap().also(fn).let { _mapper_.valueToTree(_it_) } fun JsonNode.toMap(): MutableMap&#x3C;String, Any> =\n    (_mapper_.readValue(StringReader(toString())) as MutableMap&#x3C;String, Any>)\n\n  @Test\n  public fun tesJsonTransformation()\n  {\n    val jsonNode = jsonNode();\n    assertEquals("Simar", jsonNode.get("name").textValue())\n    assertEquals("Canada", jsonNode.get("country").textValue())\n    val newJsonNode: JsonNode = jsonNode.transfrorm({ set("name", "Paul")\n        remove("country")\n    });\n    assertEquals("Paul", newJsonNode.get("name").textValue())\n    assertNull(newJsonNode.get("country"))\n  }\n}\n</code></pre>',frontmatter:{path:"/kotlin-extension-functions-make-any-class-have-what-you-wish-for",title:"Kotlin | Extension Functions, make any class have what you wish for",author:"Simar Paul Singh",date:"2018-09-05"}}},pathContext:{}}}});
//# sourceMappingURL=path---kotlin-extension-functions-make-any-class-have-what-you-wish-for-9938a3379691036481ef.js.map