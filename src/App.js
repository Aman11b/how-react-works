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
        <TabContent item={content.at(activeTab)} />
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
    setLikes(likes + 1);
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
          <button>+++</button>
        </div>
      </div>

      <div className="tab-undo">
        <button>Undo</button>
        <button>Undo in 2s</button>
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
