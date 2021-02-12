import React, { lazy, Suspense } from "react";
import ReactDom from "react-dom";
import {formatMetersToKilometers, formatSecondsToMinutes} from "./funcs";
import "./index.css";
import Stat from "./Stat";

const MatchesListItem = lazy(() => import("./MatchesListItem"))

const MatchesList = props =>{
    let matchesToShow = new Array;
    props.matches.forEach(element => {
        matchesToShow.push((
                <MatchesListItem  key={element.matchID} matchData={element}/>
        ))
    });
    return (
        <div className="matches__container">
            <h2 className="matches__title--container">Last matches stats</h2>
            <Suspense fallback={<div className="info"> Loading... </div>}>
                {matchesToShow}
            </Suspense>
        </div>
    )
}

const UserSummary = props => {
    let summary = props.data.summary.all;
    let name = props.data.matches[0].player.username;
    let matcheslist = props.data.matches;
    let numberOfmatches = matcheslist.length;
    let matchesToShow;
    if (numberOfmatches > 0){
        matchesToShow = (
            <div className="matches">
                <MatchesList matches={matcheslist} />
            </div>
        )
    }
    
    return (
        <div>
            <div className="summary__spacer" id="summary"></div>
            <div className="summary">
                <div className="summary__title">
                    <h2>Last matches summary of <span className="summary__name">{name}</span></h2>
                </div>
                <div className="summary__stats">
                    <Stat title={"K/D"} value={summary.kdRatio}/>
                    <Stat title={"Kills"} value={summary.kills}/>
                    <Stat title={"Deaths"} value={summary.deaths}/>
                    <Stat title={"Assists"} value={summary.assists}/>
                    <Stat title={"Score"} value={summary.score}/>
                    <Stat title={"Score per minute"} value={summary.scorePerMinute}/>
                    <Stat title={"Team wipeds"} value={summary.objectiveTeamWiped}/>
                    <Stat title={"Headshots"} value={summary.headshots}/>
                    <Stat title={"Avarage lifetime"} value={formatSecondsToMinutes(summary.avgLifeTime)}/>
                    <Stat title={"Gulag wins"} value={summary.gulagKills}/>
                    <Stat title={"Gulag losses"} value={summary.gulagDeaths}/>
                    <Stat title={"Damage done"} value={summary.damageDone}/>
                    <Stat title={"Damage taken"} value={summary.damageTaken}/>
                    <Stat title={"Avarage kills per game"} value={summary.killsPerGame}/>
                    <Stat title={"Total time played"} value={formatSecondsToMinutes(summary.timePlayed)}/>
                    <Stat title={"Total distance traveled"} value={formatMetersToKilometers(summary.distanceTraveled)}/>
                </div>
            </div>
            {matchesToShow}
        </div>
    )
}

class Content extends React.Component{
    render(){
        if (this.props.data.error){
            return(
                <p className="info">This player was not found or these statistics are private</p>
            )
        }
        else if (this.props.data.message){
            return (<p className="info">searching...</p>)
        }
        return (
            <UserSummary data={this.props.data}/>
        )
    }
}

class App extends React.Component{
    constructor(props) {
        super(props);
        this.state = { 
        apiResponse: undefined,
        userInputValue: "",
        selectInputValue: "",
        componentInfo: (
            <div>
                <p className="info">search your stats of your last matches in warzone</p>
            </div>
        )
        };
        
        this.callAPI = this.callAPI.bind(this);
        this.handleInputOnChange = this.handleInputOnChange.bind(this);
    }
    
    handleInputOnChange(event){
        let name = event.target.name;
        this.setState({[name]: event.target.value})
    }
    
    callAPI(event) {
        event.preventDefault();
        this.setState({
            componentInfo:(
                <div>
                    <p className="info">searching...</p>
                </div>
            ), 
            apiResponse: undefined})
        let data = JSON.stringify({
            "user": this.state.userInputValue.replace("#","%"),
            "platform": this.state.selectInputValue
        });
        fetch(process.env.REACT_APP_BACKEND_REQUEST_URL, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: data
        })
            .then(res => res.json())
            .then(res => this.setState({componentInfo: undefined, apiResponse: res}))
            .then(() => {if(this.state.apiResponse.summary) document.getElementById('summary').scrollIntoView()})
            .catch(err => console.log(err));
    }
    
    render(){
        let userContent;
        if (this.state.apiResponse){
            userContent = (
                <div>
                    <Content  data={this.state.apiResponse} />
                </div>
            )
        }
        return (
            <>
                <div className="title">
                    <h1>Warzone last matches tracker</h1>
                    <img className="title__img" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgdmlld0JveD0iMCAwIDUwMy42MDcgNTAzLjYwNyIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNTAzLjYwNyA1MDMuNjA3OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8Zz4NCgk8Zz4NCgkJPGc+DQoJCQk8cGF0aCBkPSJNMzM1LjczOCw0MzYuNDU5VjE4NC42NTZjMC00LjY0Mi0zLjc1Mi04LjM5My04LjM5My04LjM5M0gxNzYuMjYzYy00LjY0MiwwLTguMzkzLDMuNzUyLTguMzkzLDguMzkzdjI1MS44MDMNCgkJCQljMCw0LjY0MiwzLjc1Miw4LjM5Myw4LjM5Myw4LjM5M3Y4LjM5M2MtNC42NDIsMC04LjM5MywzLjc1Mi04LjM5Myw4LjM5M3YzMy41NzRjMCw0LjY0MiwzLjc1Miw4LjM5Myw4LjM5Myw4LjM5M2gxNTEuMDgyDQoJCQkJYzQuNjQyLDAsOC4zOTMtMy43NTIsOC4zOTMtOC4zOTNWNDYxLjY0YzAtNC42NDItMy43NTItOC4zOTMtOC4zOTMtOC4zOTN2LTguMzkzDQoJCQkJQzMzMS45ODYsNDQ0Ljg1MywzMzUuNzM4LDQ0MS4xMDEsMzM1LjczOCw0MzYuNDU5eiIvPg0KCQkJPHBhdGggZD0iTTE4NC42NTYsMTU5LjQ3OGgxMzQuMjk1YzQuNjQyLDAsOC4zOTMtMy43NTIsOC4zOTMtOC4zOTN2LTguMzkzYzAtNTUuMTc4LTI2LjM2NC0xMDcuODg5LTcwLjUwNS0xNDEuMDENCgkJCQljLTIuOTg4LTIuMjQxLTcuMDg0LTIuMjQxLTEwLjA3MiwwYy00NC4xNDEsMzMuMTIxLTcwLjUwNSw4NS44MzEtNzAuNTA1LDE0MS4wMXY4LjM5Mw0KCQkJCUMxNzYuMjYzLDE1NS43MjYsMTgwLjAxNCwxNTkuNDc4LDE4NC42NTYsMTU5LjQ3OHoiLz4NCgkJPC9nPg0KCTwvZz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjwvc3ZnPg0K" />
                    <img className="title__img" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgdmlld0JveD0iMCAwIDUwMy42MDcgNTAzLjYwNyIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNTAzLjYwNyA1MDMuNjA3OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8Zz4NCgk8Zz4NCgkJPGc+DQoJCQk8cGF0aCBkPSJNMzM1LjczOCw0MzYuNDU5VjE4NC42NTZjMC00LjY0Mi0zLjc1Mi04LjM5My04LjM5My04LjM5M0gxNzYuMjYzYy00LjY0MiwwLTguMzkzLDMuNzUyLTguMzkzLDguMzkzdjI1MS44MDMNCgkJCQljMCw0LjY0MiwzLjc1Miw4LjM5Myw4LjM5Myw4LjM5M3Y4LjM5M2MtNC42NDIsMC04LjM5MywzLjc1Mi04LjM5Myw4LjM5M3YzMy41NzRjMCw0LjY0MiwzLjc1Miw4LjM5Myw4LjM5Myw4LjM5M2gxNTEuMDgyDQoJCQkJYzQuNjQyLDAsOC4zOTMtMy43NTIsOC4zOTMtOC4zOTNWNDYxLjY0YzAtNC42NDItMy43NTItOC4zOTMtOC4zOTMtOC4zOTN2LTguMzkzDQoJCQkJQzMzMS45ODYsNDQ0Ljg1MywzMzUuNzM4LDQ0MS4xMDEsMzM1LjczOCw0MzYuNDU5eiIvPg0KCQkJPHBhdGggZD0iTTE4NC42NTYsMTU5LjQ3OGgxMzQuMjk1YzQuNjQyLDAsOC4zOTMtMy43NTIsOC4zOTMtOC4zOTN2LTguMzkzYzAtNTUuMTc4LTI2LjM2NC0xMDcuODg5LTcwLjUwNS0xNDEuMDENCgkJCQljLTIuOTg4LTIuMjQxLTcuMDg0LTIuMjQxLTEwLjA3MiwwYy00NC4xNDEsMzMuMTIxLTcwLjUwNSw4NS44MzEtNzAuNTA1LDE0MS4wMXY4LjM5Mw0KCQkJCUMxNzYuMjYzLDE1NS43MjYsMTgwLjAxNCwxNTkuNDc4LDE4NC42NTYsMTU5LjQ3OHoiLz4NCgkJPC9nPg0KCTwvZz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjwvc3ZnPg0K" />
                    <img className="title__img" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgdmlld0JveD0iMCAwIDUwMy42MDcgNTAzLjYwNyIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNTAzLjYwNyA1MDMuNjA3OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8Zz4NCgk8Zz4NCgkJPGc+DQoJCQk8cGF0aCBkPSJNMzM1LjczOCw0MzYuNDU5VjE4NC42NTZjMC00LjY0Mi0zLjc1Mi04LjM5My04LjM5My04LjM5M0gxNzYuMjYzYy00LjY0MiwwLTguMzkzLDMuNzUyLTguMzkzLDguMzkzdjI1MS44MDMNCgkJCQljMCw0LjY0MiwzLjc1Miw4LjM5Myw4LjM5Myw4LjM5M3Y4LjM5M2MtNC42NDIsMC04LjM5MywzLjc1Mi04LjM5Myw4LjM5M3YzMy41NzRjMCw0LjY0MiwzLjc1Miw4LjM5Myw4LjM5Myw4LjM5M2gxNTEuMDgyDQoJCQkJYzQuNjQyLDAsOC4zOTMtMy43NTIsOC4zOTMtOC4zOTNWNDYxLjY0YzAtNC42NDItMy43NTItOC4zOTMtOC4zOTMtOC4zOTN2LTguMzkzDQoJCQkJQzMzMS45ODYsNDQ0Ljg1MywzMzUuNzM4LDQ0MS4xMDEsMzM1LjczOCw0MzYuNDU5eiIvPg0KCQkJPHBhdGggZD0iTTE4NC42NTYsMTU5LjQ3OGgxMzQuMjk1YzQuNjQyLDAsOC4zOTMtMy43NTIsOC4zOTMtOC4zOTN2LTguMzkzYzAtNTUuMTc4LTI2LjM2NC0xMDcuODg5LTcwLjUwNS0xNDEuMDENCgkJCQljLTIuOTg4LTIuMjQxLTcuMDg0LTIuMjQxLTEwLjA3MiwwYy00NC4xNDEsMzMuMTIxLTcwLjUwNSw4NS44MzEtNzAuNTA1LDE0MS4wMXY4LjM5Mw0KCQkJCUMxNzYuMjYzLDE1NS43MjYsMTgwLjAxNCwxNTkuNDc4LDE4NC42NTYsMTU5LjQ3OHoiLz4NCgkJPC9nPg0KCTwvZz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjwvc3ZnPg0K" />
                </div>
                <div className="searcher" onSubmit={this.callAPI}>
                    <form className="searcher__form">
                        <input className="searcher__input" type="text" placeholder="Username" value={this.state.userInputValue} name="userInputValue" required onChange={this.handleInputOnChange} />
                        <select name="selectInputValue" className="searcher__select" value={this.state.selectInputValue} onChange={this.handleInputOnChange} required>
                            <option disabled value="">Platform</option>
                            <option value="xbl" className="searcher__option">Xbox</option>
                            <option value="battle" className="searcher__option">Battle Net</option>
                            <option value="psn" className="searcher__option">Play Station</option>
                        </select>
                        <input type="submit" value="search" className="searcher__submit" />
                    </form>
                </div>
                <div className="content">
                    {this.state.componentInfo}
                    {userContent}
                </div>
            </>
        )
    }
}

ReactDom.render(
<App />
,document.getElementById("root"))
