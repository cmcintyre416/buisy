import React from 'react';
import MdDeleteForever from 'react-icons/lib/md/delete-forever';
import ReactCardFlip from 'react-card-flip';
import MdModeEdit from 'react-icons/lib/md/mode-edit';
import MdBusinessCenter from 'react-icons/lib/md/business-center';
import MdBusiness from 'react-icons/lib/md/business';
import MdPhoneIphone from 'react-icons/lib/md/phone-iphone';
import MdEmail from 'react-icons/lib/md/email';
import MdSpeakerNotes from 'react-icons/lib/md/speaker-notes';



export default class FormatBusinessCards extends React.Component {
    constructor() {
        super();
        this.state = {
            editing: false,
            card: {},
            isFlipped: false
        }
        this.madeEdit = this.madeEdit.bind(this);
        this.getInitials = this.getInitials.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    madeEdit(e) {
        e.preventDefault();
        const userId = firebase.auth().currentUser.uid;
        const dbRef = firebase.database().ref(`users/${userId}/cards/${this.props.card.key}`);
        dbRef.update({
            name: document.getElementById('cardName').value,
            jobTitle: document.getElementById('cardJobTitle').value,
            company: document.getElementById('cardCompany').value,
            phone: document.getElementById('cardPhone').value,
            email: document.getElementById('cardEmail').value,
            interactionNotes: document.getElementById('cardInteractionNotes').value
        })

        this.setState({
            editing: false
        })
    }

    getInitials() {
        const string = this.props.card.name;
        const matches = string.match(/\b(\w)/g);
        const acronym = matches.join('');
        return (
            <div className="circleInitial">
                <p className="initial">{acronym}</p>
            </div>
        )  
    }


    handleClick(e) {
        e.preventDefault();
        this.setState({ isFlipped: !this.state.isFlipped });
    }

    render() {
        let editingTempFront = (
            <span>
                <p className="card__name">{this.props.card.name}</p>
                <p className="card__job"><MdBusinessCenter className="iconAdjust"/>   {this.props.card.jobTitle}</p>
                <p className="card__company"><MdBusiness className="iconAdjust"/>  {this.props.card.company}</p>
                <p className="card__phone"><MdPhoneIphone className="iconAdjust"/>{this.props.card.phone}</p>
                <p className="card__email"><MdEmail className="iconAdjust"/>{this.props.card.email}</p>
            </span>
        )
        let editingTempBack = (
            <div>
                <p className="card__notes"><MdSpeakerNotes className="iconAdjust"/> {this.props.card.interactionNotes}</p>
            </div>
        )
        if(this.state.editing) {
            editingTempFront = (
                <form onSubmit={this.madeEdit}>
                    <div>
                        <input type="text" defaultValue={this.props.card.name} name="name" id="cardName" placeholder="Name" required="true"/>
                    </div>
                    <div>
                        <input type="text" defaultValue={this.props.card.jobTitle} name="jobTitle" id="cardJobTitle" placeholder="Job Title" required="true"/>
                    </div>
                    <div>
                        <input type="text" defaultValue={this.props.card.company} name="company" id="cardCompany" placeholder="Company" required="true"/>
                    </div>
                    <div>
                        <input type="text" defaultValue={this.props.card.phone} name="phone" id="cardPhone" placeholder="Phone" required="true"/>
                    </div>
                    <div>
                        <input type="text" defaultValue={this.props.card.email} name="email" id="cardEmail" placeholder="Email" required="true"/>
                    </div>
                    <input type="submit" value="Done Editing"/>
                </form>
            )
            editingTempBack = (
                <form onSubmit={this.madeEdit}>
                    <div>
                        <input type="text" defaultValue={this.props.card.interactionNotes} name="interactionNotes" id="cardInteractionNotes" placeholder="Interaction Notes" />
                    </div>
                    <input className="doneEditBack" type="submit" value="Done Editing" />
                </form>
            )
        }
        return (
            <div>
                <ReactCardFlip isFlipped={this.state.isFlipped}>
                    <div key="front">
                        <div className="card">
                            {editingTempFront}
                            <div className="gradientLine"></div>
                            {this.getInitials()}
                            <div className="card__list">
                                <div>
                                    <button className="editButton" onClick={() => this.setState({ editing: true })}>
                                        <MdModeEdit className="editIcon" />
                                        <p className="editText">Edit Card</p>
                                    </button>
                                </div>
                                <div>
                                    <button className="deleteButton" onClick={() => this.props.remove(this.props.card.key)}>
                                        <MdDeleteForever className="deleteIcon" />
                                        <p className="deleteText">Delete Card</p>
                                    </button>
                                </div>
                                <button className="notesButton" onClick={this.handleClick}>Notes</button>
                            </div>  
                        </div>
                    </div>
                    <div key="back">
                        <div className="card">
                            {editingTempBack}
                            <div className="gradientLine"></div>
                            {this.getInitials()}
                            <div className="card__list">
                                <div>
                                    <button className="editButton" onClick={() => this.setState({ editing: true })}>
                                        <MdModeEdit className="editIcon" />
                                        <p className="editText">Edit Card</p>
                                    </button>
                                </div>
                                <div>
                                    <button className="deleteButton" onClick={() => this.props.remove(this.props.card.key)}>
                                        <MdDeleteForever className="deleteIcon" />
                                        <p className="deleteText">Delete Card</p>
                                    </button>
                                </div>
                                <button className="goBack" onClick={this.handleClick}>Back</button>
                            </div>  
                        </div>
                    </div>
                </ReactCardFlip>     
            </div>
        )
    }
}
