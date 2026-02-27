import { useState } from "react";

const content = [
  {
    summary: "React is a library for building UIs",
    details:
      "Dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
  {
    summary: "State management is like giving state a home",
    details:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
  {
    summary: "We can think of props as the component API",
    details:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  },
];

export default function App() {
  return (
    <div>
      <Tabbed content={content} />
    </div>
  );
}

/**
 * {console.log(<DifferentContent test={23} />);
 * this is type DifferentContent
 * console.log(DifferentContent());
 * this is type div -> raw react element not component instances}
 */

function Tabbed({ content }) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div>
      <div className="tabs">
        <Tab num={0} activeTab={activeTab} onClick={setActiveTab} />
        <Tab num={1} activeTab={activeTab} onClick={setActiveTab} />
        <Tab num={2} activeTab={activeTab} onClick={setActiveTab} />
        <Tab num={3} activeTab={activeTab} onClick={setActiveTab} />
      </div>

      {activeTab <= 2 ? (
        <TabContent
          item={content.at(activeTab)}
          key={content.at(activeTab).summary}
        />
      ) : (
        <DifferentContent />
      )}
    </div>
  );
}

function Tab({ num, activeTab, onClick }) {
  return (
    <button
      className={activeTab === num ? "tab active" : "tab"}
      onClick={() => onClick(num)}
    >
      Tab {num + 1}
    </button>
  );
}

function TabContent({ item }) {
  const [showDetails, setShowDetails] = useState(true);
  const [likes, setLikes] = useState(0);

  function handleInc() {
    setLikes((likes) => likes + 1);
  }
  function handleTripleInc() {
    // setLikes(likes + 1); like =0 later 1
    // setLikes(likes + 1); like still 0 asynchronous so later still 1
    // setLikes(likes + 1); again same at the end its 1
    // it will be increates by 1 not 3

    // setLikes(likes + 3); does works too but right ways is
    setLikes((likes) => likes + 1);
    setLikes((likes) => likes + 1);
    setLikes((likes) => likes + 1);
    // this works coz we are getting accesss to lates updated state
  }

  function handleUndo() {
    setShowDetails(true);
    setLikes(0);
  }

  function handleUndoLater() {
    setTimeout(handleUndo, 2000);
  }
  return (
    <div className="tab-content">
      <h4>{item.summary}</h4>
      {showDetails && <p>{item.details}</p>}

      <div className="tab-actions">
        <button onClick={() => setShowDetails((h) => !h)}>
          {showDetails ? "Hide" : "Show"} details
        </button>

        <div className="hearts-counter">
          <span>{likes} ❤️</span>
          <button onClick={handleInc}>+</button>
          <button onClick={handleTripleInc}>+++</button>
        </div>
      </div>

      <div className="tab-undo">
        <button onClick={handleUndo}>Undo</button>
        <button onClick={handleUndoLater}>Undo in 2s</button>
      </div>
    </div>
  );
}

function DifferentContent() {
  return (
    <div className="tab-content">
      <h4>I'm a DIFFERENT tab, so I reset state 💣💥</h4>
    </div>
  );
}

/**
 * COMPONENTS,INSTANCES,ELEMENTS
 * -> Components
 * - describe the UI
 * - component is a finction that retusn React element(element tree) ,usually written as JSX
 * - blueprint or template (using this component instances are created)
 * -> Instances
 * - instances are created when we use component
 * - instance is actual physical manifestation
 * - has its own state and prop
 * - has a lifecycle(can be born live and die)
 * -> Element
 * - as instances are executed react return a element
 * - JSX is converted to React.createElement() function call -> resulting react element
 * - it has all necessary info to create DOM element
 *
 * COMPONENT (<Tab />) -> Component instances ( Returns) -> React Element (Inserted to DOM) -> DOM Element (HTML)
 */

/**
 * $$typeof: Symbol(react.element)
 * -> this protects from cross site scripting attacts
 * -> Symbol are javaScript primitive which cant be trasnmitted via json
 * -> a symbol like this cant come from API call
 */

/**
 * How rendering works > Overview
 * -> Reacp
 * - component -> component instances -> react element -> DOM Element -> UI
 * -> how react element change into DOM element
 * => How component are displayed on the screen
 * -> Render is triggered (by updating state somewhere) => Render Phase(react calls component finction and figure out how DOM should be updated) => Commit phase (React actaully writes to the DOM ,updating ,inserting nad deleting element) => Browser paint
 * -> in react ,rendering is NOT updating the DOM or displaying element on the screen.
 * -> Rendering only happens internally inside React,it does not produce visual changes
 */

/**
 * HOW render are trigged
 * 1. Initial render of the application(when it runs for very first time)
 * 2. State is updated in one or more component instances(re-render)
 * > render process is triggered for entire application
 * > render are not triggred immediately, but scheduled for a when the JS engine has some " free time" (few  ).There is also batching of multiple setState calls in event handlers
 */

/**
 *Review: Mechanics of state in react
 -> Not true #1: Rendering is updating the screen/dom (its calling component function )
 -> Not true #2: React completely discard old view(DOM) on re-render
 */

/**
 * RENDER PHASE
 * 1. component instances that trigger re-render 
 * 2. react element
 * 3. new virtual DOM 
  - => VIRTUAL DOM (React element tree)
  - -> component tree -> react element tree(virtual DOM)
  - -> Virtual DOM: Tree of all react element created from all instances in the component tree
  - -> Cheap and fast to create multiple trees
  - -> nothing to do with Shadow DOM(brpwser technology used in web component)
  - -> in rerender new component tree is created and a new react element tree is creted
   ### Rendering a component will cause all of the child component to be rendered as well(no matter if porp changed or not) -> necessary because react doesn;t know weather children will be affected -> virtual DOM created again
* 4. Reconciliation + Diffing (Current fiber tree > before state update) 
  - its is done in react reconciler (Called Fiber)
  => WHat is reconsiliation and why do we need it?
  - creating react element tree is cheap and fast coz its just object but writing DOM is not is is relatively slow
  - usually only a small of DOM needs to be updated
  - react reuses as much of the exixtsing DOM as possible
  => how to know which DOM is changed -> reconciliation
  ### Reconciliation: Deciding which DOM elements actually need to be inserted ,deleted,or updated in order to reflect the latest state changes done by a reconciler(real engine of react current > reconciler is Fiber)
  => The Reconciler : Fiber
  - takes entire react element tree(virtual tree) -> (on initial render) -> creates Fiber tree
  ### Fiber Tree: internal tree that has a "fiber" for each component instance and DOM element
  - Fibers are not re-created on every render (its never destroyed just get mutated again and again over future reconciliation)
  [Fiber{"Unit of work"} -> [current state,Props,Side effects,Used Hooks,Queue of work,...]]
  - each fiber is linked to it parent,all other has link to there previous sibling (linked list)
  - Virtual and Fiber tree has componet with DOM element too ,they are complete representaion of DOM structure
  - Work can be done asynchronously (Rendering process can be split into chunks,tasks can be prioritized,and work can be paused,reused or thrown away)
  -- enables conurrent feater like suspense or transitions starting react18
  --long render wont block JS engine
  => Reconciliation in Action
  - is there a a state update -> new virtual DOM is created-> new dom is reconcided + Diffing [Comparing elemtn based on there position in the tree is called diffing] with current fiber tree-> updated fiber tree(workInProgress tree) 
* 5. Updated Fiber tree
* 6. List of DOM updates => Result of the render phase ("list of effects")
*/

/**
 * THE COMMIT PHASE AND BROWSER PAINT
 * 1. List of DOM update -> Update DOM
 * - React writes to the DOM: inserting ,deleting, and updates (list of DOM updates are "flushed" to the DOM)
 * - Committing is synchronous: DOM is updated in one go,it can't be interrupted.This is necessary so thta the DOM never shows partial result,ensuring a consistent UI(in sync with all times)
 * - after the commit phase is completes,the workInProgress fiber tree becomes the current tree for the next render cycle
 * (BROWSER PAINT)
 * 2. Updated UI on the screen
  > render phase (react) -> commit phase (ReactDOM) -> browser paint(browser)
  - react does not touch the DOM.react only renders.it doesnt know where the render result will go
  - react can be used on different platforms (Reactive Native -> iOS android, Remotion -> video, many more...)
 */

/**
 * RECAP
 * 1. trigger(happen only on initila render or state update)
 * 2. render phase () -> updated react element-> new virtual DOM-> reconcilied and diffing with current fiber tree-> updated fiber tree -> list of DOM update
 * - do not pruduce any visual output
 * - rendering a component also renders all of its child component
 * - render is asynchronous: work can be split,prioritised ,paused and resumed
 * 3. Commit phase
 * - Updated DOM
 * - Synchronous : DOM update are written in on go ,to keep UI consistent
 * 4.Browser Paint (updated UI on screen)
 */

/**
 * How Diffing works
 * -> 2 Fundamental Assumption
 * - Two element of different types will produce different trees
 * - Element with a stable key prop stay the same across renders
 * => this allowes reqact to go from O(n^3) to O(n) operations per 1000 element
 * -> its comparing element by element based on its position in tree
 * 1. Same position,different elelemt
 * - React assume entire sub-tree is no longer valid
 * - old component are destroyed and removed from DOM ,including state
 * - tree might be rebuilt if children stayed the same(state is reset)
 * 2. Same position ,same element
 * - element will be kept (as well as child element), including state
 * - sometimes this is not what we want.. then we can use key prop
 */

/**
 * KEY PROP
 * -> special prop that we use to tell the diffing algo that an element is unique
 * -> allow react to distinguish between multiple instances of the same component type
 * -> when a key stays the same across renders,the elelemt will be kept in DOM(even if the position in the tree changes)
 * - using key in list
 * -> when a key chnages between render,the elelemt will be destroyed and a new one will be created (even if the position in the tree is the same as before)
 * - using key to reset the state
 * 1. KEYS IN LISTS (STABLE KEY)
 * -> no key-> adding a new list item -> same element ,but different position in tree,so they are removed and recreated in the DOM(bad for performance)
 * -> with keys -> adding new lits item ->different position in the tree but the key stays the same,so the element will be kept in DOM
 * 2. KEY PROP TO RESET STATE (CHANGING KEY)
 * -> if we have the same element at the same position in the tree the dom elelemt  and state will be kept
 * -> if we have a question component with a answer and we chnage the question the answer will remain the same and irrelevent in this case coz of the rule hnece use key so that its is differentiated and the sate will be reset
 */

/**
 * TWO TYPES OF LOGIC IN REACT COMPONENT
 * 1. render logic
 * -> code that lives at the top level of th component function
 * -> participate in describing how the component view looks like
 * -> executed every time the component renders
 * 2.event handeling function
 * -> exexcuted as concequences of the event that the handler is listening for
 * -> code that actually does things
 */

/**
 * FUNCTIONAL PROGRAMMING PRINCIPLES
 * 1.Side effect: dependency on or modification of any dat outside the function scope."Interration with outside world".Example: mutating external variable,HTTP request,Writing to DOM
 * 2. Pure function:a function that has no side effects
 * -> given the same input ,a pure function will always return the same output
 */

/**
 * RULES FOR RENDER LOGIC
 * -> component must be pure when it comes to render login: given the same prop(input), a component instances should always return the same JSX (output)
 * -> render login must produce no sde effects: no interaction with the "outside world" is allwed.
 * So, in rende logic:
 * - Do not perform network request (API Calls)
 * - Do not start timer
 * - Do not directly use the DOM API
 * - Do not mutate object or variable outside of the function scope(This is why we cant mutate props)
 * - Do not uodate state(or Ref): this will create an infinite loop
 */

/**
 * STATE UPDATE BATCHING
 * => How state update are batched
 * -> Render are not triggered immediately,but scheduled for when JS engine has some "free time".There is also bacthing of multiple setState call in event handlers
 ```
 const reset=fuction(){
 setAnswer("")
 console.log(answer)
 setBest(true)
 setSolved(false)}
 ```
 -> it does not update state and render+ commit 3 times 
 -> all will be batched as one state update for entire event handler then redner+commit(just one render and commit per event handler)
 -> but what will be value of console.log 
 -> statee is stored in fiber tree during render phase 
 -> at this point,re-render has not happened yet
 -> therefore ,answer still containes current state,not the updated state(" ") -its is "Stale state"
 => that is why upadting state in react is asynchronous
 -> updated state variable are not immediately available after setState call,but only after the re-render
 -> this is also applies when only one state variable is updated
 -> if we need to update state based on previous update,we  use setState with call back(SetAnswer(answer=> ...))
 => Batching beyond event handler function
 -> automatic bathcing for event handler was in react 17 its for timeout and promises and native events too in react18+ 
 */

/**
 * How event work in react
 * => DOM refresher:event propagation and delegation
 * -> when any event is triggered en event will be created at root of tree,then it will travel to the place from where it has triggered that is target element this is called capturing phase
 * -> at target there is a event handler function
 * -> then event will travel back to the top it is called bubbling phase
 * - By default,event handlers listen to event onthe target and during the bubbling phase
 * - we can prevent bubbling with stopPropagation()
 * => Event Delegation
 * - handeling event for multiple element centrally in on single parent element
 * - better for performanc and memory as it needs onlu one handler function
 * -> react register all event handler on the root DOM container.This is where all event are handled
 * - Behind the scene,React perfomr event delegation for all events in our applications
 * => Synthetix events
 * -> wrapper around the DOM's native event object
 * -> has some interfaec as native event object,like stopPropagation() and preventDefault()
 * -> fixes browser inconsistencies ,so that event works in the exact same way in all browser
 * -> most synthetic events bubble(including focus blur and chnage),except for scroll

 */
/**
 * LIBRARY vs FRAMEWORK vs THE REACT ECOSYSTEM
 * -> Framework (all in one kit)
 * - everything you need to build a completed application is included in the framework("batteries included")
 * -> liberary (seperate ingredient)
 * - view library (react just draw component on UI)
 * - enternal library is needed
 */
