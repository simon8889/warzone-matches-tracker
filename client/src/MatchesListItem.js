import React from "react";
import "./index.css";
import {getWarzoneMapByJsonName, formatMetersToKilometers, formatSecondsToMinutes} from "./funcs";
import Stat from "./Stat";

const MatchesListItem = props => {
    let matchData = props.matchData;
    let playerStats = matchData.playerStats;
    let startDate = new Date(matchData.utcStartSeconds * 1000);
    let gulagInfo;
    if (getWarzoneMapByJsonName(matchData.map) === "Verdansk"){
        gulagInfo = (
            <>
                <Stat title={"Gulag wins"} value={playerStats.gulagKills}/>
                <Stat title={"Gulag losses"} value={playerStats.gulagDeaths}/>
            </>
        )
    }
    return (
    <div className="matches__item">
        <div className="matches__title">
            <h2>Match ID: <span className="matches__id">{matchData.matchID}</span></h2>
        </div>
        <div className="match__date">
            <p>Start Date: <br /><span className="match__hour">{startDate.toLocaleString().replace(" "," - ")}</span></p>
        </div>
        <div className="matches__stat">
            <Stat title={"Map"} value={getWarzoneMapByJsonName(matchData.map)} />
            <Stat title={"K/D"} value={playerStats.kdRatio} />
            <Stat title={"Kills"} value={playerStats.kills} />
            <Stat title={"Deaths"} value={playerStats.deaths} />
            <Stat title={"Assits"} value={playerStats.assists} />
            <Stat title={"Score"} value={playerStats.score} />
            <Stat title={"Headshots"} value={playerStats.headshots} />
            <Stat title={"Longest killstreak"} value={playerStats.longestStreak} />
            {gulagInfo}
            <Stat title={"Damage done"} value={playerStats.damageDone}/>
            <Stat title={"Damage taken"} value={playerStats.damageTaken}/>
            <Stat title={"Time played"} value={formatSecondsToMinutes(playerStats.timePlayed)} />
            <Stat title={"Distance traveled"} value={formatMetersToKilometers(playerStats.distanceTraveled)}/>
        </div>
    </div>)
}


export default MatchesListItem;