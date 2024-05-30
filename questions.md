# Questions

### 1. What is the difference between Component and PureComponent? Give an example where it might break my app.
PureComponent implements shouldComponentUpdate, with a shallow prop and state comparison, which only re render when changes are detected. Component does not implement it, so it gets re-rendered any time its parents are rendered.

You must be careful with PureComponent, as it does a shallow comparison, with a change in a nested property without changing its reference, your component might not react and won't get re-rendered.

```jsx
class MyPureComponent extends PureComponent {
  render() {
    return <div>{this.props.data.value}</div>;
  }
}
data.value = 'Updated'; // this won't be detected
<MyPureComponent data={data} />
```

### 2. Context + ShouldComponentUpdate might be dangerous. Why is that?
If your component uses Context, and you control re-rendering with shouldComponentUpdate, as the context changes, it won't get affected, as you can't use context within shouldComponentUpdate condition.

### 3. Describe 3 ways to pass information from a component to its PARENT.
 - ContextAPI, where you can complement it with useReducer, and the components that are wrapped by the Provider and use useContext, as you set a value, the parents that are using this value are getting re-rendered;
 - You can share the setter from the parent to its children, and the children have control to their parent value;
 - State manager, like, zustand, mobx, redux. Pretty similar to Context API, components that are wrapped by that specific provider, and you dispatch an action from a child, parents that are listening to those attributes changed, get re-rendered.

### 4. Give 2 ways to prevent components from re-rendering.
 - React.memo, you wrap the component definition with memo() and you get a memoized version of your component.
 - shouldComponentUpdate, when in Class Components, you could compare the nextProps with the currentProps and control if that component could be updated or not.

### 5. What is a fragment and why do we need it? Give an example where it might break my app.
It's a component that you use to group together some set of components when you don't want to add a new html element around those components. Its tag usages are: `<Fragment></Fragment>` or `<></>`.

An example of when Fragments might break your app, if you use this Fragment to key a list of repeated elements, then React is not going to be able to track the changes in this list and re-render the entire list even if that key was untouched.
```jsx
{items.map(item => <Fragment key={item}>{item}</Fragment>)} // doesnt work
{items.map(item => <div key={item}>{item}</div>)} // use an element instead
```

### 6. Give 3 examples of the HOC pattern.
 - A HOC that adds more props to the component that is using it, in this case MyComponent is receiving data from withDataProps
   - ```jsx
     function withDataProps(WrappedComponent) {
       return class extends React.Component {
         constructor(props) {
           super(props);
           this.data = "Some data";
         }
      
          render() {
            return <WrappedComponent {...this.props} data={this.data} />;
          }
       };
     }
     class CustomComponent extends React.Component {
       render() {
         return <div>{this.props.data}</div>;
       }
     }
     export default withDataProps(CustomComponent);
     ``` 
 - A HOC that authenticates a component, by checking if the localStore contains the token property, if not the user would get redirected
    - ```jsx
      function withProtection(Component) {
        return class extends React.Component {
          render() {
            const isAuthenticated = localStorage.getItem('accessToken');
            return isAuthenticated? (
              <Component {...this.props} />
            ) : (
              <Redirect to="/login" />
            );
          }
        };
      }
      const ProtectedPage = ({ match }) => <h1>This is a protected page</h1>;
      export default withProtection(ProtectedPage);
      ``` 
 - We can use it to handle props changing by logging them, so we can debug a component easier;
    - ```jsx
      const withLogging = (WrappedComponent) => {
        return class extends React.Component {
          componentDidUpdate(prevProps) {
            console.log('Old props:', prevProps);
            console.log('New props:', this.props);
          }
          render() {
            return <WrappedComponent {...this.props} />;
          }
        };
      };
      const CustomComponent = ({ text }) => <div>{text}</div>;
      export default withLogging(CustomComponent);
      ``` 
There many other known libraries that provides HOC function for us, like Formik, Redux, etc.

### 7. What's the difference in handling exceptions in promises, callbacks and async…await?
 - Callbacks, usually you receive the error as parameter from this callback, and you do an if statement and handle it the way you want;
   - ```javascript
     // nodejs example, when reading a file
     fs.readFile('/path/to/file', (err, data) => {
       if (err) {
         console.error('An error occurred:', err);
         return;
       }
     });
     ```
 - Promises, you catch them with the piped function `.catch(error)`, that you can keep piping values, or just do whatever you want, like logging or notify the user somehow;
   - ```javascript
     myRejectedPromise()
     .catch(err => {
       console.error('An error occurred:', err);
     });
     ```
 - Async/await, you have to use the try/catch block, and within the catch block, you can handle your error.
   - ```javascript
     try {
       const response = await myAsyncFunction('/api/data');
       return response;
     } catch (err) {
       console.error('An error occurred:', err);
     }
     ```

### 8. How many arguments does setState take and why is it async.
 - It can be an object where you update all attributes that you have previously defined in your component;
   - ```jsx
     this.setState({counter: 1})
     ```
 - It can a function, that you have access to the previousState and you can use the previousState to increment the new value you want that attribute to be;
     - ```jsx
       this.setState((prevState) => ({counter: prevState.counter + 1})
       ```
 - A second argument is an optional callback function that runs after the state is updated.
    - ```jsx
      this.setState({counter: 2}, () => {console.log('counter set')})
      ```

It is async because react batches multiple states at a time and you can easily control what is rendered, where you can only have access to the new value after the component is fully rerendered, making sure all values are the most updated. If you need to do anything right after an attribute is set, you can use the second argument where you fire this callback.

### 9. List the steps needed to migrate a Class to Function Component.
 - Convert the class component to a function component, and remove the constructor
   - ```jsx
     class CustomComponent extends React.Component { // From
     const CustomComponent = (props) => { // To
     ```
 - Convert this.props to props, as you receive the props as your only argument in a  functional component
- ```jsx
  class CustomComponent extends Component { // From
    render () {
      return (this.props.data)
    }
  }
  
  const CustomComponent = (props) => { // To
    return props.data
  }
  ```
 - This.state now is handled with useState hook and render method to the function actual return
- ```jsx
  class CustomComponent extends Component { // From
    handleClick = () => {
        this.setState({data: 'test'});
    }
    render () {
      return <button onClick={this.handleClick}>{data}</button>
    }
  }
  
  const CustomComponent = (props) => { // To
    const [data, setData] = useState('');
    
    const handleClick = () => {
        setData('test')
    }
  
    return <button onClick={handleClick}>{data}</button>
  }
  ```
 - Lifecycles like componentDidMount and componentWillUnmount are useEffect hook now
- ```jsx
  class CustomComponent extends Component { // From
    componentDidMount() {}
  
    componentDidMount() {}
  
    componentWillUnmount() {}
  }
  
  const CustomComponent = (props) => { // To
    useEffect(() => {}, []); // componentDidMount
  
    useEffect(() => {}, [myProp]); // componentDidMount
  
    useEffect(() => { return () => {} }, []); // componentWillUnmount
  }
  ```

### 10. List a few ways styles can be used with components.
 - You can use a regular inline style;
   - ```html
     <div style={{background: 'red'}}></div>
     ```
 - You can load a stylesheet globally or in your component and define your ids or classes and use them in your components;
   - ```html
     <div className='redBackground'></div>
     ```
 - With css modules you can import this stylesheet in your component, and use the exported classes on it
   - ```jsx
     import styles from 'mystyle.module.css'
     return (<div className={styles.redBackground}></div>)
     ```
 - With styled-components you define a styled component as the name says and it will already have the styles you have defined on it
    - ```jsx
      import styled from 'styled-components'
      const CustomComponent = styled.div`background: red`;
      
      return (<CustomComponent />)
      ```

### 11. How to render an HTML string coming from the server
I believe this is an ambiguous question. So i'm answering the possible answers it might have.
 - If this question mean you want to fetch a string HTML from an api and you want to print it on the screen, then you can use `<div dangerouslySetInnerHTML={{ __html: stringHTML }} />`, since you correctly sanitize it, making sure there is no malicious code on it, it should be enough;
 - But if this question mean, SSR (server side rendering), we can use nextjs for example, v14 by using the app router based application, you can fetch your request straight into the component, like:
`const Page = () => { const myList =  await fetchList()}`, and it will be handled by nextjs, no need to use states in this case, whatever is not using "use client" in the top of the file is going to be pre rendered in server.
