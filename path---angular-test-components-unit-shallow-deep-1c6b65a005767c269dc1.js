webpackJsonp([0xf967a84f4e95],{341:function(e,t){e.exports={data:{markdownRemark:{html:"<hr>\n<p>Typical <strong>Angular</strong> application renders and interacts with set of <strong><em>Container</em></strong> <em>(Smart / Stateful)</em> components, containing one or more re-usable <strong><em>Presentation</em></strong> <em>(Dumb / Stateless)</em> components.</p>\n<p><strong>Services</strong> contain <em>Business Logic</em>. <strong><em>Pipes</em></strong> and <strong><em>Store Selectors</em></strong> contain <em>Re-usable Data Transformers / Functions</em>.</p>\n<p><strong><em>Store</em></strong> pattern works well for managing <em>State / Model</em>. <strong><em>Ngrx</em></strong> is one such implementation for state management with <em>reducers</em> and <em>effects</em> handling state mutations and <em>selectors</em> handling retrieval.</p>\n<p><strong><em>Container</em></strong> <em>components</em> are responsible for wiring up, <em>Services</em>, data to/from <em>Store,</em> pass in <code>@Input()</code> data to <strong><em>Presentation</em></strong> <em>components</em> for rendering and process <code>@Output()</code> event(s) emitted by them by dispatching <em>actions</em>.</p>\n<p><em>Services, Pipes , Store (Reducers &#x26; Selectors)</em> are usually straight forward to <em>unit test</em> as they don’t involve any DOM <em>rendering</em> or async <em>event-handling</em> and mostly take pure functions approach for easy testability. (with the exception of <em>Effects</em> and <em>Impure-Pipes</em>).</p>\n<p>If in tests, our <em>components</em> are instantiated as simple class instance without <em>TestBed</em>, we wouldn’t have Zone to test its bindings to template. We cannot test DOM rendering and event-handling.</p>\n<p>Since a well designed component usually has all the <em>business / state manipulation &#x26; selection</em> logic abstracted away in <em>services, store, store-reducers, store-selectors / pipes respectively</em>, traditional unit tests wouldn’t have much to test, as component’s main responsibility then is to serve its template.</p>\n<p><strong>Testing</strong> of <strong><em>Container</em></strong> <em>Components</em> must be done at 2 levels, <strong>Shallow Test</strong> and <strong>Deep Test</strong>. First test any direct <em>rendering / event-handling</em> done by <strong><em>Container</em></strong> <em>component</em>, then its <strong><em>wiring</em></strong> to its <strong><em>Providers</em></strong> (ex store) and contained <strong><em>Presentation</em></strong> <em>components</em> respectively.</p>\n<p>Consider an example <code>&#x3C;Details-Container/></code> is a <em>Container</em> component, interacts with store to select and manage state slice <code>details</code>, (ex. using ngrx store, state selectors and/or actions). It contains a <em>Presentation</em> component <code>&#x3C;Contact-Presentation/></code>, which receives <code>details.contact</code> data as <code>@Input() contact</code> property for rendering, and <em>emits</em> <code>@Output() onAdd.emit(contact.id)</code> event when user clicks on a <em>Add to my Contacts</em> <code>&#x3C;button/></code>.</p>\n<pre><code>import { Component } from '@angular/core';\nimport { select, Store, Action } from '@ngrx/store';\n\n\n@Component({\n  'selector': 'Details-Container',\n  'template': `&#x3C;Details-Container *ngIf='details$ | async as details'>\n\n    &#x3C;h3>{{details.title}}&#x3C;/h3>\n    &#x3C;p>{{details.description}}&#x3C;/p>\n\n       &#x3C;Location-Presentation [location]='details.address'/>\n       &#x3C;Contact-Presentation \n         [contact]='details.contact'\n         (onAdd)='addContact($event)'\n       />\n    &#x3C;/DetailsPage-Container>`\n})\nexport class DetailsContainerComponent {\n\n  details$: Observable&#x3C;any>;\n  \n  constructor(private store: Store&#x3C;any>) {\n    this.details$ = store.pipe(select(getDetailsSelector));\n  }\n  \n  addContact(contactId: number) {\n    this.store.dispatch({ \n      type: 'add_my_contact', \n      payload: contactId  \n     } : Action)\n  }\n\n}\n</code></pre>\n<pre><code>import { Component, Input, Output EventEmitter } from '@angular/core';\n\n@Component({\n  'selector': 'Contact-Presentation',\n  'template': `&#x3C;span> \n      &#x3C;strong> {{contact.firstName}} |&#x3C;/strong>  \n      &#x3C;a href='mailto'> {{contact.email}} &#x3C;/a>\n      &#x3C;button (click)='this.onAdd.emit(contact.id)'>\n        Add to My Contacts \n      &#x3C;/button>\n    &#x3C;/span>`\n})\nexport class DetailsContainerComponent {\n  @Input() contact: {firstName: string, email?: string, id: number};\n  @Output() ontAdd = new EventEmitter&#x3C;number>(); \n}\n</code></pre>\n<h2>Testing Angular Components</h2>\n<h3>Shallow Test</h3>\n<p>Our Objective in <strong>Shallow Test(s)</strong> is to assert <em>Container Component render stuff it is responsible for rendering properly</em>.</p>\n<p>Its usual that we write our <em>Container component</em> before we figure out which presentation components to re-use or create to abstract away the DOM handling.</p>\n<p>Therefore for TDD its important for us to write unit tests for the container component ignoring all inner components at first if any to focus on the testing the containing component in isolation.</p>\n<p>The trick here is to configure <code>TestBed</code> with only <code>declarations: [DetailsContainerComponent]</code>\nAvoid the the contained presentation components with <code>schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]</code></p>\n<ol>\n<li><code>&#x3C;Details-Container/></code> instantiates properly.</li>\n<li><code>&#x3C;Details-Container/></code>, selects <code>details</code> data from store (it could be <code>ActivatedRoute</code> , some direct <em>service</em>, etc if you are not using Store / Ngrx)</li>\n<li><code>&#x3C;Details-Container/></code> renders <code>details.title</code> and <code>details.description</code>, re-renders with changes on change detection</li>\n</ol>\n<pre><code>import { TestBed, async } from '@angular/core/testing';\nimport { DetailsContainerComponent } from './details.component';\nimport { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';\nimport { BehaviourSubject } from 'rxjs';\nimport { select, Store } from '@ngrx/store';\n\n\ndescribe('DetailsContainerComponent', () => {\n\n  let details: any;\n  let details$: BehaviourSubject&#x3C;any>;\n  let store;\n  let fixture: ComponentFixture&#x3C;DetailsContainerComponent>;\n  let comp: ContainerComponent;\n\n  beforeEach(async(() => {\n    details = {\n     title: 'This is a test title',\n     description: 'This is a test description`\n     contact: {\n       id: 1,\n       name: 'Simar',\n       email: 'simar@simar.simar'\n     }\n    };\n\n    details$ = new BehaviourSubject&#x3C;any>(details);\n\n    TestBed.configureTestingModule({\n      declarations: [\n        DetailsContainerComponent\n      ],\n      providers: [\n        provide: Store,\n        useValue: {\n          pipe: jasmine.createSpy('pipe').and.return(details$)},\n          dispatch: jasmine.createSpy('dispatch')\n        }\n      ],\n      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]\n    }).compileComponents();\n    fixture = TestBed.createComponent(DetailsContainerComponent);\n    comp = fixture.debugElement.componentInstance;\n  }));\n\n  it('should create the comp', async(() => {\n    expect(comp).toBeTruthy();\n  }));\n\n  it('should select details from store', async(() => {\n    expect(store.pipe).toHaveBeenCallWith(select(getContainerDetails));\n    expect(comp.details$).subscribe((d)=> expect(d).toBe(details)); // without jasmine marbles\n    expect(comp.details$).toBeObsevable('(a|)', {a: details}); // with jasmine marbles\n  }));\n\n  it('should render title in a h3 tag', async(() => {\n    fixture.detectChanges();\n    const compiled = fixture.debugElement.nativeElement;\n    expect(compiled.querySelector('h3').textContent).toContain(details.title);\n    const title = 'Changed Title';\n    details$.next({...details, title});\n    fixture.detectChanges();\n    expect(compiled.querySelector('h3').textContent).toContain(changedTitle);\n  }));\n\n  it('should render description in a p tag', async(() => {\n    fixture.detectChanges();\n    const compiled = fixture.debugElement.nativeElement;\n    const description = 'Changed Description'\n    details.next({...details, description});\n    fixture.detectChanges();\n    expect(compiled.querySelector('p').textContent).toContain(description);\n  }));\n\n});\n</code></pre>\n<h3>Deep Test</h3>\n<p>Our Objective in <strong>Deep Test(s)</strong> is to assert <em>Interactions of Container Component with presentation Components, store, and any services if any</em>.</p>\n<ol>\n<li><code>&#x3C;Container-Details\\></code> passes the correct <code>@Input() contact</code> = <code>details.location</code> to <code>&#x3C;Contact-Presentation/></code></li>\n<li><code>&#x3C;Container-Details\\></code> can receive <code>(onAdd)</code> event from <code>&#x3C;Contact-Presentation/></code> &#x26; react by dispatching <code>add-my-contact</code> action to <code>Store</code></li>\n</ol>\n<pre><code>import { TestBed, async } from '@angular/core/testing';\nimport { DetailsContainerComponent } from './details.component';\nimport { ContactPresetationComponent } from './contact.component';\nimport { Store } from '@ngrx/store';\nimport { BehaviourSubject } from 'rxjs';\nimport { select, Store } from '@ngrx/store';\n\n\ndescribe('DetailsContainerComponent', () => {\n\n  let details : any;\n  let details$: BehaviourSubject&#x3C;any>;\n  let store;\n  let fixture: ComponentFixture&#x3C;DetailsContainerComponent>;\n  let comp: ContainerComponent;\n\n  beforeEach(async(() => {\n    details = {\n     title: 'This is a test title',\n     description: 'This is a test description`\n     contact: {\n       id: 1,\n       name: 'Simar',\n       email: 'simar@simar.simar'\n     }\n    };\n    \n    details$ = new BehaviourSubject&#x3C;any>(details);\n    \n    TestBed.configureTestingModule({\n      declarations: [\n        DetailsContainerComponent\n      ],\n      providers: [\n        provide: Store,\n        useValue: {\n          pipe: jasmine.createSpy('pipe').and.return(details$)},\n          dispatch: jasmine.createSpy('dispatch')\n        }\n      ]\n    }).compileComponents();\n    fixture = TestBed.createComponent(DetailsContainerComponent);\n    comp = fixture.debugElement.componentInstance;\n  }));\n\n  it('should pass contact.details as inpiut to &#x3C;Contact-Presentation/>', async(() => {\n    fixture.detectChanges();\n    const de = fixture.debugElement;\n    const contactEl = de.query(By.css('Contact-Presentation'));\n    const contactComp = contactEl.componentInstance as ContactPresetationComponent;\n    expect(contactComp).toBeTruhty();\n    expect(contactComp.contact).toEqual(details.contact);\n    const contact = { firstName: 'Paul', email: 'paul@paul.com' }\n    details.next({...details, contact});\n    fixture.detectChanges();\n    expect(contactComp.contact).toEqual(contact);\n  }));\n\n  it('should listen to onAdd() event from &#x3C;Contact-Presentation/>', async(() => {\n    fixture.detectChanges();\n    const de = fixture.debugElement;\n    const contactEl = de.query(By.css('Contact-Presentation'));\n    const contactComp = contactEl.componentInstance as ContactPresetationComponent;\n    expect(contactComp).toBeTruhty();\n    spyOn(comp,'addContact').and.callThrough();\n    const contactId = 10;\n    contactComp.onAdd.emit(contactId);\n    expect(comp.addContact).toHaveBeenCalledWith(contactId);\n    expect(store.dispatch).toHaveBeenCalledWith({\n        type: 'add_my_contact',\n        payload: 10\n      } : Action);\n  }));\n\n});\n</code></pre>\n<h3>How deep should we test?</h3>\n<p>We can always test the rendering and event handling of inner components in deep tests for container components.\nHowever, that is necessary if we are not writing any shallow tests for those inner components.\nAssuming we write shallow tests for all component, unit tests for store reducers, selectors and effects, writing deep tests for container components to just test the interactions is reasonable.</p>\n<p>Let us consider we don't have a shallow test for <code>&#x3C;Contact-Presentation></code>, and we don't need writing one as it is not going to be used anywhere other than <code>&#x3C;Details-Container></code>\nWe could re-write the last two tests as follows.</p>\n<pre><code>  it('should pass contact.details as inpiut to &#x3C;Contact-Presentation/>', async(() => {\n    fixture.detectChanges();\n    const contactComp = fixture.debugElement.query(By.css('Contact-Presentation'));\n    expect(contactComp).toBeTruhty();\n    const contactEl = contactComp.nativeElement;\n    // check rendering on contact element\n    expect(contactEl.querySelector('strong').textContent).toContain(details.contact.firstName);\n    expect(contactEl.querySelector('a').textContent).toContain(details.contact.email);\n    const contact = { firstName: 'Paul', email: 'paul@paul.com' }\n    details.next({...details, contact});\n    fixture.detectChanges();\n    expect(contactEl.querySelector('strong').textContent).toContain(contact.firstName);\n    expect(contactEl.querySelector('a').textContent).toContain(contact.email);\n  }));\n\n  it('should listen to onAdd() event from &#x3C;Contact-Presentation/>', async(() => {\n    fixture.detectChanges();\n    const contactComp = fixture.debugElement.query(By.css('Contact-Presentation'));\n    expect(contactComp).toBeTruhty();\n    spyOn(comp,'addContact').and.callThrough();\n    const contactId = 10;\n    // click event triggerred from contact elemnt button\n    contactComp.nativeElement.querySelector('button').click();\n    expect(comp.addContact).toHaveBeenCalledWith(contactId);\n    expect(store.dispatch).toHaveBeenCalledWith({\n        type: 'add_my_contact',\n        payload: 10\n      } : ActionWithPayload&#x3C;number>);\n  }));\n</code></pre>\n<p>Its more <em>maintainable</em> to test <em>DOM rendering and event handling</em> of <code>&#x3C;Contact-Presentation/></code> in its own spec and not have the same tests in the <code>&#x3C;Details-Container/></code></p>\n<p><strong><em>Presentation</em></strong> <em>components</em> are re-usable and may be used by many other components. It is a maintenance overhead when the same component for same cases gets tested in many different places.</p>\n<p>If you are concerned about how the whole component tree renders, <strong>E2E</strong> <em>(End to End Testing)</em> tests are a better solution than complicating our deep tests for containers.</p>\n<p>Check out <a href=\"https://github.com/angular/protractor\"><strong>Protractor</strong></a> , a popular framework / tool for Angular <em>end to end testing</em> <strong>E2E</strong> .</p>\n<p><strong>Shallow</strong> and <strong>Deep Tests</strong> fall under <strong>Unit Testing</strong> which are much easier to write, run faster and are self-contained which makes them more maintainable than <strong>E2E Tests</strong></p>\n<p><strong>E2E Tests</strong> are great for high-level validation of the entire system. But they can’t give you the comprehensive test coverage that you would expect from <strong>Unit Tests</strong>.</p>",frontmatter:{path:"/angular-test-components-unit-shallow-deep",title:"Testing Angular Components | Shallow and Deep",author:"Simar Paul Singh",date:"2018-10-01"}}},pathContext:{}}}});
//# sourceMappingURL=path---angular-test-components-unit-shallow-deep-1c6b65a005767c269dc1.js.map