import React from 'react';
import AddBusinessCard from './AddBusinessCard.js';
import FormatBusinessCard from './FormatBusinessCard.js';
import * as Scroll from 'react-scroll';
import { Link, DirectLink, Element, Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll';
import MdAddToPhotos from 'react-icons/lib/md/add-to-photos';
import MdContacts from 'react-icons/lib/md/contacts';
import MdSearch from 'react-icons/lib/md/search';

function searchingFor(term) {
    return function(x){
        return x.name.toLowerCase().includes(term.toLowerCase()) || !term;
    }
}

class MainView extends React.Component {
    constructor() {
        super();

        this.state = {
            savedCards: [],
            filteredCards:[],
            createAccountCondition: false,
            addCardCondition: false,
            loginCondition: false,
            loggedIn: false,
            term: ''
        };
        this.getBusinessCardPayload = this.getBusinessCardPayload.bind(this);
        this.removeBusinessCard = this.removeBusinessCard.bind(this);
        this.toggleCreateBusinessCard = this.toggleCreateBusinessCard.bind(this);
        this.closeCreateBusinessCard = this.closeCreateBusinessCard.bind(this);
        this.showCreate = this.showCreate.bind(this);
        this.createUser = this.createUser.bind(this);
        this.showLogin = this.showLogin.bind(this);
        this.loginUser = this.loginUser.bind(this);
        this.notLoggedInMessage = this.notLoggedInMessage.bind(this);
        this.searchHandler=this.searchHandler.bind(this);
    }

    componentDidMount() {
        firebase.auth().onAuthStateChanged((user) => {
            if(user) {
                firebase.database().ref(`users/${user.uid}/cards`).on('value', (res) => {
                    const userData = res.val();
                    const dataArray = [];
                    for (let objKey in userData) {
                        userData[objKey].key = objKey;
                        dataArray.push(userData[objKey])
                    }
                    this.setState({
                        savedCards: dataArray,
                        loggedIn: true
                    })
                });
            }
            else {
                this.setState({
                    savedCards: [],
                    loggedIn: false
                })
            }
        })
    }

    getBusinessCardPayload(cardPayload) {
        const userId = firebase.auth().currentUser.uid;
        const dbRef = firebase.database().ref(`users/${userId}/cards`);

        const newCardInfo = cardPayload;

        dbRef.push(newCardInfo);
    }

    removeBusinessCard(cardID) {
        const userId = firebase.auth().currentUser.uid;
        const dbRef = firebase.database().ref(`users/${userId}/cards/${cardID}`);
        dbRef.remove();
    }

    toggleCreateBusinessCard() {
        this.setState({
            addCardCondition: !this.state.addCardCondition,
            overlayCondition: !this.state.overlayCondition
        })
    }

    closeCreateBusinessCard() {
        this.setState({
            addCardCondition: !this.state.addCardCondition,
            overlayCondition: !this.state.overlayCondition
        })
    }

    showCreate(e) {
        e.preventDefault();

        this.setState({
            createAccountCondition: !this.state.createAccountCondition,
            overlayCondition: !this.state.overlayCondition
        })
    }

    createUser(e) {
        e.preventDefault();
        const email = document.getElementById('createEmail').value;
        const password = document.getElementById('createPassword').value;
        const confirm = document.getElementById('confirmPassword').value;
        if(password === confirm) {
            firebase.auth()
                .createUserWithEmailAndPassword(email, password)
                .then((res) => {
                    this.showCreate(e);
                })
                .catch((err) => {
                    alert(err.message)
                })
        } else {
            alert("Passwords Must Match")
        }
    }

    showLogin(e) {
        e.preventDefault();

        this.setState({
            loginCondition: !this.state.loginCondition,
            overlayCondition: !this.state.overlayCondition
        })
    }

    loginUser(e) {
        e.preventDefault();
        const email = document.getElementById('userEmail').value;
        const password = document.getElementById('userPassword').value;

        firebase.auth()
            .signInWithEmailAndPassword(email, password)
            .then((res) => {
                this.showLogin(e);
            })
            .catch((err) => {
                alert(err.message);
            })
    }

    logOut() {
        firebase.auth().signOut();
    }

    notLoggedInMessage() {
        if (this.state.loggedIn === false) {
            return (
                <h3>Login to store your cards.</h3>
            )
        }
    }

    scrollToWallet(e) {
        scroll.scrollTo(1050);
    }

    searchHandler(e) {
        this.setState({
            term: e.target.value
        })
    }
    
    renderCards() {
        const {term, savedCards} = this.state;
        if (this.state.loggedIn) {
            return (
                <div>
                    <div className="formatCard__wrapper">
                        <div className="search__wrapper">
                            <div className="search__innerWrapper">
                                < MdSearch className="searchIcon"/>
                                <input id="searchBar" type="text" placeholder="Find Someone" value={term} onChange={this.searchHandler}/>
                            </div>
                        </div>
                        <div className="formatCard__scrollThrough">
                            {savedCards.filter(searchingFor(term)).map((card, i) => {
                                return (
                                    < FormatBusinessCard
                                        card={card}
                                        key={`card-${i}`}
                                        remove={this.removeBusinessCard}
                                        cardIndex={i}
                                    />
                                )
                            })}
                        </div>
                    </div>
                    <footer>
                        <div className="lowerCircle"></div>
                    </footer>
                </div>
            )
        }
    }

    render() {
        return (
            <div className="mainView">
                <div className="innerCircle">
                    <div className="headerContentWrapper">
                        <h1>Buisy</h1>
                        <h2>Your Digital Buisiness Card Wallet</h2>
                        {this.notLoggedInMessage()}
                        {
                            (() => {
                                if (this.state.loggedIn) {
                                    return (
                                        <div>
                                            <div className="mainView__button">
                                                <button onClick={() => this.toggleCreateBusinessCard()}>
                                                < MdAddToPhotos className="addIcon"/>
                                                <p>Add New Business Card</p>
                                                </button>
                                            </div>
                                            <div className="mainView__button--viewCards mainView__button">
                                                <button onClick={this.scrollToWallet}>
                                                    <p>Your Wallet</p>
                                                < MdContacts className="viewIcon"/>
                                                </button>
                                            </div>
                                            <div className="buttonWrapper">
                                                <button href="" onClick={this.logOut}>Logout</button>
                                            </div>
                                        </div>
                                    )
                                }
                                else {
                                    return (
                                        <div className="buttonWrapper">
                                            <button className="createAccountButton" href="" onClick={this.showCreate}>Create Account</button>
                                            <button className="loginButton" href="" onClick={this.showLogin}>Login</button>
                                        </div>
                                    )
                                }
                            })()
                        }
                    </div>
                </div>
                <div className={this.state.addCardCondition ? "sideBar slide-in" : "sideBar slide-out"}>
                    < AddBusinessCard
                        getBusinessCardPayload={this.getBusinessCardPayload}
                        closeCreateBusinessCard={this.closeCreateBusinessCard}
                    />
                </div>
                <div className={this.state.overlayCondition ? "overlay show" : "overlay"}></div>
                <div className={this.state.loginCondition ? "loginModal show" : "loginModal"}>
                    <div className="close" onClick={this.showLogin}>
                        <button className="accountCloseButton">X</button>
                    </div>
                    <h4>Login</h4>
                    <form action="" onSubmit={this.loginUser}>
                        <div className="labelInputContainer">
                            <label htmlFor="email">Email</label>
                            <input type="email" name="email" id="userEmail" />
                        </div>
                        <div className="labelInputContainer">
                            <label htmlFor="password">Password</label>
                            <input type="password" name="password" id="userPassword" />
                        </div>
                        <div>
                            <input className="formSubmit" type="submit" value="Login" />
                        </div>
                    </form>
                </div>
                <div className={this.state.createAccountCondition ? "createUserModal show" : "createUserModal"}>
                    <div className="close" onClick={this.showCreate}>
                        <button className="accountCloseButton">X</button>
                    </div>
                    <h4>Create Account</h4>
                    <form action="" onSubmit={this.createUser.bind(this)}>
                        <div className="labelInputContainer">
                            <label htmlFor="createEmail">Email</label>
                            <input type="email" name="createEmail" id="createEmail"/>
                        </div>
                        <div className="labelInputContainer">
                            <label htmlFor="createPassword">Password</label>
                            <input type="password" name="createPassword" id="createPassword"/>
                        </div>
                        <div className="labelInputContainer">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input type="password" name="confirmPassword" id="confirmPassword"/>
                        </div>
                        <div>
                            <input className="formSubmit" type="submit" value="Create Account"/>
                        </div>
                    </form>
                </div>
                {this.renderCards()}
            </div>
        );
    }
}

export default MainView;