import React, { Component, Fragment } from "react";
import { render } from "react-dom";


export default class InfiniteUsers extends Component {
  constructor(props) {
    super(props);
    
    // Sets up our initial state
    this.state = {
      activeClass: "active",
      collapsibleDisplay: "none",
      error: false,
      hasMore: true,
      isLoading: false,
      nextUrl: 'https://swapi.co/api/people/?limit=10',
      film: false,  
      users: [],
    };

    this.onClickCollapsible = this.onClickCollapsible.bind(this);


    // Binds our scroll event handler
    window.onscroll = () => {
      const {
        loadUsers,
        state: {
          error,
          isLoading,
          hasMore,
          nextUrl,
        },
      } = this;

      // Bails early if:
      // * there's an error
      // * it's already loading
      // * there's nothing left to load
      if (error || isLoading || !hasMore) return;

      // Checks that the page has scrolled to the bottom
      if (
        window.innerHeight + document.documentElement.scrollTop
        === document.documentElement.offsetHeight
      ) {
        loadUsers();
      }
    };
    
  }

  componentWillMount() {
    // Loads some users on initial load
    this.loadUsers();
  }

  loadUserFilm = (urlArray) => {
    var list = [];
    for (var i = 0; i < urlArray.length; i++) {
      fetch(urlArray[i])
      .then(response => response.json())
      .then((res)=>{
        var data = {};
        data = {
          title:res.title,
          desc:res.opening_crawl
        };
        list.push(data);

      });
    }
    return list;
  }

  loadUsers = () => {
    this.setState({ isLoading: true }, () => {
        fetch(this.state.nextUrl)
        .then(response => response.json())
        .then((results) => {          
         
          // Creates a massaged array of user data
          const nextUsers = results.results.map(user => ({
            name: user.name,
            height: user.height,
            mass: user.mass,
            film: this.loadUserFilm(user.films),
          }));

        console.log(nextUsers);
        const nextUrls = results.next;
          

          // Merges the next users into our existing users
          this.setState({
            // Note: Depending on the API you're using, this value may be
            // returned as part of the payload to indicate that there is no
            // additional data to be loaded
            hasMore: (results.next),
            film: results.film,
            isLoading: false,
            nextUrl: nextUrls,
            users: [
              ...this.state.users,
              ...nextUsers,
            ],
          });
        })
        .catch((err) => {
          this.setState({
            error: err.message,
            isLoading: false,
           });
        })
    });
  }

  onClickCollapsible(e,name,film){
      var list = ' ';
      var data = {};
      var css = (this.state.activeClass === "active") ? "active" : "inactive";
      this.state.activeClass = css;
      console.log(this);      
        if (this.state.collapsibleDisplay === "block") {
          this.setState({collapsibleDisplay:"none"});
        } else {
          this.setState({collapsibleDisplay:"block"});
        }
  }
  render() {
    const {
      error,
      hasMore,
      isLoading,
      users,
    } = this.state;

    return (
      <div>
        <h1>Infinite Users!</h1>
        <p>Scroll down to load more!!</p>
        {users.map(user => (
          <Fragment key={user.name}>
            <hr />
            <div style={{ display: 'flex' }}>
              <img
                alt={user.name}
                src={user.photo}
                style={{
                  borderRadius: '50%',
                  height: 72,
                  marginRight: 20,
                  width: 72,
                }}
              />
              <div>
                <h2 style={{ marginTop: 0 }}>
                  {user.name}
                </h2>
                <p>Mass: {user.mass}</p>
                <p>Height: {user.height}</p>
              </div>
            </div>
            
             <button key={user.films} onClick={(e) => this.onClickCollapsible(e,user.name,user.film)} type="button" className={this.state.activeClass+" collapsible"}>List Played Films</button>
              <div className="content" style={{ display :this.state.collapsibleDisplay }}>
                {user.film.map(films => ( <Fragment key={films.title}> 
                                      <p>{films.title}</p>
                                      <h4>{films.desc}</h4>
                                     </Fragment>
                                    ))}
              </div>                                    
          </Fragment>
        ))}
        <hr />
        {error &&
          <div style={{ color: '#900' }}>
            {error}
          </div>
        }
        {isLoading &&
          <div>Loading...</div>
        }
        {!hasMore &&
          <div>You did it! You reached the end!</div>
        }
      </div>
    );
  }
}

function LoginButton(props) {
  return (
    <button onClick={props.onClick}>
      Login
    </button>
  );
}
