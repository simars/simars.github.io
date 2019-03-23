webpackJsonp([0x72e75dc15200],{354:function(e,t){e.exports={data:{markdownRemark:{html:"<p><strong>RxJs</strong> simplifies working with event streams. In <strong>Angular</strong>, we get notified of almost all events and changes by <em>subscribing</em> to <strong>RxJs</strong> <code>Observable(s)</code> Ex (<a href=\"https://angular.io/api/router/ActivatedRoute#params\"><em>ActvatedRoute#params</em></a> , <a href=\"https://angular.io/guide/http\"><em>HttpClient</em></a><em>#get)</em>.</p>\n<p>We seldom create our own <code>Observable(s)</code> from an actual <em>event source.</em> Unless, you consider emitting known values, with of and from as we usually do in our tests.</p>\n<pre><code>import { Observable, of } from 'rxjs';\nObservable&#x3C;String> one = Observable.of('1');\nObservable&#x3C;String> oneTwoThree = Observable.from(['1','2', '3']);\n</code></pre>\n<p><strong>RxJs</strong> provides us handy utility <em>function</em> <code>from(...) : Observable&#x3C;T></code> to create <code>Observable(s)</code> from well known event sources, (Ex. a native <em>dom-event)</em>.</p>\n<p>Here is an example of<code>**_Observable.from_**_(input[click])_</code><em>,</em> implementing a text-input search-box, which can notify us of changing text.</p>\n<pre><code>import {AfterViewInit, Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';\nimport {fromEvent, Observable, Subscription} from 'rxjs';\nimport {debounceTime, distinctUntilChanged, map, startWith, tap} from 'rxjs/operators';\n@Component({\n  selector: 'search-box',\n  template: `\n    &#x3C;div>\n      &#x3C;input placeholder=\"search\" #searchInput autocomplete=\"off\"/>\n    &#x3C;/div>\n`\n})\nexport class SearchBoxComponent implements AfterViewInit, OnDestroy {\n@Output('onSearch')\nonSearch = new EventEmitter&#x3C;string>();\n@ViewChild('searchInput')\ninput: ElementRef;\nprivate subscription: Subscription;\nngAfterViewInit(): void {\n const terms$ = fromEvent&#x3C;any>(this.input.nativeElement, 'keyup')\n      .pipe(\n        map(event => event.target.value),\n        startWith(''),\n        debounceTime(400),\n        distinctUntilChanged()\n      );\n   this.subscription = term$\n      .subscribe(\n        criterion => {\n          this.onSearch.emit(criterion);\n        }\n      );\n}\nngOnDestroy() {\n    this.subscription.unsubscribe();\n  }\n}\n</code></pre>\n<h3>Custom Observable(s)</h3>\n<p>Sometimes source of your event(s) is not well known, and likely <strong>RxJs</strong> wouldn’t have any stock functions to create <code>Observable(s)</code> of it.</p>\n<p>Sometimes source of your event(s) is not well known, and likely <strong>RxJs</strong> wouldn’t have any stock functions to create <code>Observable(s)</code> of it.</p>\n<p><strong><em>Observable.create(function(observer) {</em></strong></p>\n<p><em>// create or listen to an event-source (ex promises)</em></p>\n<p><em>// decide when to call observer.(next|error|complete)</em></p>\n<p><strong><em>})</em></strong></p>\n<p>For example, Let us try creating our own <code>Observable</code> the works like Angular’s <code>Http.get</code> using the <strong>browser’s native</strong> <code>fetch</code>-api</p>\n<pre><code>import {Observable} from 'rxjs';\n\n\nexport function createHttp$(url:string) {\n  return Observable.create(observer => {\n\n    const controller = new AbortController();\n    const signal = controller.signal;\n\n    fetch(url, {signal})\n      .then(response => {\n         if (response.ok) {\n           return response.json();\n         }\n         else {\n           observer.error(`Failed HTTP : response.status`);\n         }\n      })\n      .then(body => {\n         observer.next(body);\n         observer.complete();\n      })\n      .catch(err => {\n         observer.error(err);\n       //observable which immediately errors out\n      });\n\n   return () => controller.abort()\n   // this return function? executed on unsubscribe\n  });\n}\n</code></pre>\n<p>This is how we can use it</p>\n<pre><code>const http$ = createHttp$('/some/url');\nhttp$.subscribe({\n next: (value: any) => console.log(`next ${value}`),\n complete: () => console.log(`complete`)};\n);\n</code></pre>\n<p>Everything in the above code-snippet is straightforward besides the <em>function</em> returned by <code>Observable.create(…)</code> which is the one **<em>that’s called when you unsubscribe to the observable created</em> **created by <code>createHttp$(...)</code>.</p>\n<p>Browser’s <code>fetch(…)</code> API gives us way to cancel ongoing requests by sending an abort signal. Therefore we send the abort signal when the subscriber unsubscribes before the the created observable before it completes. This will cancel long running <em>http-get-request</em> to which no one now is subscribing.</p>\n<pre><code>const url = '/some/entity';\nconst http$ = this.activatedRoute.params.pipe(\n switchMap( id => createHttp$(`${url}/${id}`))\n).subscribe({\n  next: (value: any) => console.log(`next ${value}`),\n  complete: () => console.log(`complete`)};\n);\n</code></pre>\n<p>In the example above, we listen to changing URL parameters emitted from <code>Router’s</code> from <code>activatedRoute.params</code> and issue corresponding <em>http</em> requests with newly emitted param value <code>{id}</code> using <code>Observables(s)</code> created by calling<code>createHttp$(</code>${url}/${id}<code>))</code></p>\n<p>However since we are using <code>switchMap(…)</code> to emit new <code>create_Http$(…)_</code> <code>Observales</code>, the previously emitted <code>Observable</code> is first <em>unsubscribed</em> (cancelled) before a new one is created and emitted by <code>switchMap(…)</code>.</p>\n<p>Since <code>Observable(s)</code> created from <code>createHttp$(...)</code> implements and returns function for cancellation, if <em>http</em> request inside was still on going in the <code>Observable</code> being <em>unsubscribed</em>, it will get <em>aborted</em> before new <code>_createHttp$(...)_</code> <code>Observable</code> is created and emitted by <code>switchMap</code> with in which a new <em>http</em> request gets issued.</p>",frontmatter:{path:"/rxjs-create_custom_observables_from_event_sources",title:"RxJS | Create Custom Observables from event sources directly",author:"Simar Paul Singh",date:"2018-09-23"}}},pathContext:{}}}});
//# sourceMappingURL=path---rxjs-create-custom-observables-from-event-sources-72f793d9e433f98f788e.js.map