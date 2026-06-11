import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import Loader from "./Loader";
import axios from "axios";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { getFlagByNationality } from "../helper/getFlag";
import Flag from "react-flagkit";
import { getColorByPosition } from "../helper/getColor";
import BasicBreadcrumbs from "./BasicBreadcrumbs";

export default function TeamDetails(props) {
    const [teamDetails, setTeamDetails] = useState([]);
    const [teamRaces, setTeamRaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [filteredTeamRaces, setFilteredTeamRaces] = useState([]);
    const [sortedByCollName, setSortedByCollName] = useState({ coll: "Round", isAsc: true });

    const navigate = useNavigate();

    useEffect(() => {
        getTeams();
    }, [props.year]);

    useEffect(() => {
        //filtriranje
        let result = teamRaces.filter((item) => item.raceName.toLowerCase().includes(props.search.toLowerCase()));

        //sortiranje
        switch (sortedByCollName.coll) {
            case "Round":
                if (sortedByCollName.isAsc) {
                    result = result.sort((a, b) => Number(a.round) - Number(b.round));
                } else {
                    result = result.sort((a, b) => Number(b.round) - Number(a.round));
                }
                break;
            case "Grand Prix":
                if (sortedByCollName.isAsc) {
                    result = result.sort((a, b) =>
                        (a.raceName).toLowerCase().localeCompare((b.raceName).toLowerCase())
                        || (a.raceName).toLowerCase().localeCompare((b.raceName).toLowerCase())
                    );
                } else {
                    result = result.sort((a, b) =>
                        (b.raceName).toLowerCase().localeCompare((a.raceName).toLowerCase())
                        || (b.raceName).toLowerCase().localeCompare((a.raceName).toLowerCase())
                    );
                }
                break;
            case (teamRaces[0]?.Results[0]?.Driver?.familyName ?? ''):
                if (sortedByCollName.isAsc) {
                    result = result.sort((a, b) => Number(a.Results[0]?.position ?? '') - Number(b.Results[0]?.position ?? ''));
                } else {
                    result = result.sort((a, b) => Number(b.Results[0]?.position ?? '') - Number(a.Results[0]?.position ?? ''));
                }
                break;
            case (teamRaces[0]?.Results[1]?.Driver?.familyName ?? ''):
                if (sortedByCollName.isAsc) {
                    result = result.sort((a, b) => Number(a.Results[1]?.position ?? '') - Number(b.Results[1]?.position ?? ''));
                } else {
                    result = result.sort((a, b) => Number(b.Results[1]?.position ?? '') - Number(a.Results[1]?.position ?? ''));
                }
                break;
            case "Points":
                if (sortedByCollName.isAsc) {
                    result = result.sort((a, b) => Number(a.Results[0]?.points ?? '') - Number(b.Results[0]?.points ?? ''));
                } else {
                    result = result.sort((a, b) => Number(b.Results[0]?.points ?? '') - Number(a.Results[0]?.points ?? ''));
                }
                break;
        }
        setFilteredTeamRaces(result);
    }, [teamRaces, props.search, sortedByCollName]);

    const params = useParams();

    const getTeams = async () => {
        setIsError(false);
        try {
            const teamStandingUrl = `https://api.jolpi.ca/ergast/f1/${props.year}/constructors/${params.id}/constructorStandings.json`;

            const teamRacesUrl = `https://api.jolpi.ca/ergast/f1/${props.year}/constructors/${params.id}/results.json`;

            const teamStandingResponse = await axios.get(teamStandingUrl);

            const teamRacesResponse = await axios.get(teamRacesUrl);



            setTeamDetails(teamStandingResponse.data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings[0]);




            setTeamRaces(teamRacesResponse.data.MRData.RaceTable.Races);

            setLoading(false);
        } catch (e) {
            setIsError(true);
        } finally {
            setLoading(false);
        }
    }


    const handleClickOnHeader = (collName) => {
        let currIsAsc = sortedByCollName.isAsc;
        let currCollName = collName;

        if (sortedByCollName.coll === currCollName) {
            currIsAsc = !currIsAsc;
        } else {
            currIsAsc = true;
        }
        setSortedByCollName({ coll: currCollName, isAsc: currIsAsc });
    }



    if (loading) {
        return <Loader />
    }

    const crumbs = [
        { label: "Teams", path: "/teams" },
        { label: `${teamDetails.Constructor.name}`, path: "" }
    ];

    if (isError) {
        return (
            <div className="wrapper">

                <div className="dd-col2">
                    <div className="details silver-bg-shadow">
                            <BasicBreadcrumbs crumbs={crumbs} />
                            <div className="driver-header">
                                <img
                                    className="driver-img" src={`${import.meta.env.BASE_URL}img/${teamDetails.Constructor.constructorId}.png`}
                                    onError={(e) => {

                                        e.target.src = `${import.meta.env.BASE_URL}img/F1-logo.png`;
                                    }}
                                    alt={teamDetails.Constructor.constructorId}
                                    style={{ width: 150 }} />



                                <div style={{ padding: "5px", textAlign: "left" }}>
                                    <Flag country={getFlagByNationality(props.flags, teamDetails.Constructor.nationality)}
                                        size={30} />
                                    <b><p>{teamDetails.Constructor.name}</p></b>
                                </div>
                            </div>
                            <p>Country: {teamDetails.Constructor.nationality}</p>
                            <p>History: <a href={teamDetails.Constructor.url} target="_blank"><OpenInNewIcon />
                            </a></p>
                    </div>

                    <div className="results">
                        <div className="no-data-div">
                            <img src="../img/emoji-faces-sad-emoji.png" alt="sad-emoji" />
                        </div>
                    </div>

                </div>
            </div >

        );
    }


    return (
        <div className="wrapper">

            <div className="dd-col2">
                <div className="details silver-bg-shadow">
                        <BasicBreadcrumbs crumbs={crumbs} />
                        <div className="driver-header">
                            <img
                                className="driver-img"
                                src={`${import.meta.env.BASE_URL}img/${teamDetails.Constructor.constructorId}.png`}
                                onError={(e) => { e.target.src = `${import.meta.env.BASE_URL}img/F1-logo.png`; }}
                                alt={teamDetails.Constructor.constructorId}
                                style={{ width: 150 }} />
                            <div style={{ padding: "5px", textAlign: "left" }}>
                                <Flag country={getFlagByNationality(props.flags, teamDetails.Constructor.nationality)}
                                    size={30} />
                                <b><p>{teamDetails.Constructor.name}</p></b>
                            </div>
                        </div>
                        <p>Country: {teamDetails.Constructor.nationality}</p>
                        <p>Points: {teamDetails.points}</p>
                        <p>History: <a href={teamDetails.Constructor.url} target="_blank"><OpenInNewIcon />
                        </a></p>
                </div>

                <div className="results">
                    <h2>Formula 1 - {props.year} Results</h2>
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th onClick={() => handleClickOnHeader("Round")}>
                                        <Link>Round {sortedByCollName.coll != "Round" ? '' :
                                            (sortedByCollName.isAsc ? '▲' : '▼')}</Link></th>
                                    <th onClick={() => handleClickOnHeader("Grand Prix")}>
                                        <Link>Grand Prix {sortedByCollName.coll != "Grand Prix" ? '' :
                                            (sortedByCollName.isAsc ? '▲' : '▼')}</Link></th>

                                    <th onClick={() => handleClickOnHeader(teamRaces[0]?.Results[0]?.Driver?.familyName ?? '')}>
                                        <Link>{teamRaces[0]?.Results[0]?.Driver?.familyName ?? ''} {sortedByCollName.coll != (teamRaces[0]?.Results[0]?.Driver?.familyName ?? '') ? '' :
                                            (sortedByCollName.isAsc ? '▲' : '▼')}</Link></th>

                                    <th onClick={() => handleClickOnHeader(teamRaces[0]?.Results[1]?.Driver?.familyName ?? '')}>
                                        <Link>{teamRaces[0]?.Results[1]?.Driver?.familyName ?? ''} {sortedByCollName.coll != (teamRaces[0]?.Results[1]?.Driver?.familyName ?? '') ? '' :
                                            (sortedByCollName.isAsc ? '▲' : '▼')}</Link></th>

                                    <th onClick={() => handleClickOnHeader("Points")}>
                                        <Link>Points {sortedByCollName.coll != "Points" ? '' :
                                            (sortedByCollName.isAsc ? '▲' : '▼')}</Link></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTeamRaces.map((race) => {
                                    return (
                                        <tr key={race.round}>
                                            <td>{race.round}</td>
                                            <td className="link"
                                                onClick={() => navigate(`/raceDetails/${race.round}`)}>
                                                <div className="flag">
                                                    <Flag country={getFlagByNationality(props.flags, "",
                                                        race.Circuit.Location.country)}
                                                        size={30} />{race.raceName}
                                                </div>
                                            </td>
                                            <td style={{ backgroundColor: getColorByPosition(race.Results[0]?.position ?? '') }}
                                            >{race.Results[0]?.position ?? ''}</td>
                                            <td style={{ backgroundColor: getColorByPosition(race.Results[1]?.position ?? '') }}
                                            >{race.Results[1]?.position ?? ''}</td>
                                            <td>{Number(race.Results[0]?.points ?? '') + Number(race.Results[1]?.points ?? '')}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}