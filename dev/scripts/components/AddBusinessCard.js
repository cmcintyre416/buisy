import React from 'react';
import * as Scroll from 'react-scroll';
import { Link, DirectLink, Element, Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll'


class AddBusinessCard extends React.Component {
    constructor() {
        super();
        this.state = {
            businessCard: {
                name: '',
                jobTitle: '',
                company: '',
                phone: '',
                email: '',
                interactionNotes: ''
            }
        }
    }

    updateForm(key, value) {
        const { businessCard } = this.state;
        const newCard = businessCard;
        newCard[key] = value;

        this.setState({
            businessCard: newCard,
        })
    }

    handleSubmit(e) {
        e.preventDefault();
        const { businessCard } = this.state;
        this.props.getBusinessCardPayload(businessCard);
        this.props.closeCreateBusinessCard();
        scroll.scrollTo(1100);
    }

    handleClose() {
        this.props.closeCreateBusinessCard();
    }


    render() {
        return (
            <div className="addCard">
                <button className="createCloseButton mainViewButton" onClick={this.handleClose.bind(this)}
                >X</button>
                <div className="addCard__titleWrapper">
                    <h4 className="addCard__title">Create New Card</h4>
                    <p className="addCard__description removeSpan">Don't worry about the stack of cards in your wallet. Fill in the information from your hard copy business card to save it to your digital wallet.</p>
                </div>
                <form className="addCard__form">
                    <input className="addCard__inputs"
                        type="text"
                        required="true"
                        placeholder="Person's Name"
                        onChange={(e) => this.updateForm('name', e.target.value)}
                    />
                    <input className="addCard__inputs"
                        type="text"
                        required="true"
                        placeholder="Job Title"
                        onChange={(e) => this.updateForm('jobTitle', e.target.value)}
                    />
                    <input className="addCard__inputs"
                        type="text"
                        required="true"
                        placeholder="Company"
                        onChange={(e) => this.updateForm('company', e.target.value)}
                    />
                    <input className="addCard__inputs"
                        type="text"
                        required="true"
                        placeholder="Phone"
                        onChange={(e) => this.updateForm('phone', e.target.value)}
                    />
                    <input className="addCard__inputs"
                        type="text"
                        required="true"
                        placeholder="Email"
                        onChange={(e) => this.updateForm('email', e.target.value)}
                    />
                    <input className="addCard__inputs"
                        type="text"
                        placeholder="Interaction Note / Reminder"
                        onChange={(e) => this.updateForm('interactionNotes', e.target.value)}
                    />
                    <button
                        className="addCard__inputsButton mainViewButton"
                        type="submit"
                        onClick={this.handleSubmit.bind(this)}
                        >
                        Add
                    </button>
                </form>
            </div>
        )
    }
}

export default AddBusinessCard;