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

    const navigate = useNavigate();

    useEffect(() => {
        getTeams();
    }, [props.year]);

    useEffect(() => {
        const result = teamRaces.filter((item) => item.raceName.toLowerCase().includes(props.search.toLowerCase()));
        setFilteredTeamRaces(result);
    }, [teamRaces, props.search]);

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
                    <div className="details">
                        <BasicBreadcrumbs crumbs={crumbs} />
                        <div style={{ display: "flex" }}>

                            <img src={`${import.meta.env.BASE_URL}img/${teamDetails.Constructor.constructorId}.png`}
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
                <div className="details">
                    <BasicBreadcrumbs crumbs={crumbs} />
                    <div style={{ display: "flex" }}>
                        <img src={`${import.meta.env.BASE_URL}img/${teamDetails.Constructor.constructorId}.png`}
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
                    <p>Points: {teamDetails.points}</p>
                    <p>History: <a href={teamDetails.Constructor.url} target="_blank"><OpenInNewIcon />
                    </a></p>
                </div>

                <div className="results">
                    <h2>Formula 1 - {props.year} Results</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Round</th>
                                <th>Grand Prix</th>
                                <th>{teamRaces[0]?.Results[0]?.Driver?.familyName ?? ''}</th>
                                <th>{teamRaces[0]?.Results[1]?.Driver?.familyName ?? ''}</th>
                                <th>Points</th>
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
    );
}