//Ne radi pretraga po Search polju, pa je taj deo zakomentarisan.
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import Loader from "./Loader";
import { getFlagByNationality } from "../helper/getFlag";
import Flag from "react-flagkit";
import { getColorByPosition } from "../helper/getColor";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import BasicBreadcrumbs from "./BasicBreadcrumbs";

export default function RaceDetails(props) {
    const [qualifying, setQualifying] = useState([]);
    const [races, setRaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [filteredQualifying, setFilteredQualifying] = useState([]);
    const [filteredRaces, setFilteredRaces] = useState([]);
    const [sortedByCollNameQ, setSortedByCollNameQ] = useState({ coll: "Pos", isAsc: true });
    const [sortedByCollNameR, setSortedByCollNameR] = useState({ coll: "Pos", isAsc: true });

    const params = useParams();

    const navigate = useNavigate();

    useEffect(() => {
        getRaceDetails();
    }, [props.year]);

    useEffect(() => {
        //filtriranje
        let resultQ = qualifying.filter((item) =>
            item.Driver.familyName.toLowerCase().includes(props.search.toLowerCase()) ||
            item.Constructor.name.toLowerCase().includes(props.search.toLowerCase())
        );

        let resultR = races.Results?.filter((item) =>
            item.Driver.familyName.toLowerCase().includes(props.search.toLowerCase()) ||
            item.Constructor.name.toLowerCase().includes(props.search.toLowerCase())
        );

        //sortiranje
        switch (sortedByCollNameQ.coll) {
            case "Pos":
                if (sortedByCollNameQ.isAsc) {
                    resultQ = resultQ.sort((a, b) => Number(a.position) - Number(b.position));
                } else {
                    resultQ = resultQ.sort((a, b) => Number(b.position) - Number(a.position));
                }
                break;
            case "Driver":
                if (sortedByCollNameQ.isAsc) {
                    resultQ = resultQ.sort((a, b) =>
                        (a.Driver.familyName).toLowerCase().localeCompare((b.Driver.familyName).toLowerCase()));
                } else {
                    resultQ = resultQ.sort((a, b) =>
                        (b.Driver.familyName).toLowerCase().localeCompare((a.Driver.familyName).toLowerCase()));
                }
                break;
            case "Team":
                if (sortedByCollNameQ.isAsc) {
                    resultQ = resultQ.sort((a, b) =>
                        a.Constructor.name.toLowerCase().localeCompare(b.Constructor.name.toLowerCase()));
                } else {
                    resultQ = resultQ.sort((a, b) =>
                        b.Constructor.name.toLowerCase().localeCompare(a.Constructor.name.toLowerCase()));
                }
                break;
            case "Best time":
                if (sortedByCollNameQ.isAsc) {
                    resultQ = resultQ.sort((a, b) =>
                    bestTime(a.Q1, a.Q2, a.Q3).localeCompare(bestTime(b.Q1, b.Q2, b.Q3)));
                    // resultQ = resultQ.sort((a, b) => Number(bestTime(a.Q1, a.Q2, a.Q3)) - Number(bestTime(b.Q1, b.Q2, b.Q3)));
                } else {
                    resultQ = resultQ.sort((a, b) =>
                    bestTime(b.Q1, b.Q2, b.Q3).localeCompare(bestTime(a.Q1, a.Q2, a.Q3)));
                    // resultQ = resultQ.sort((a, b) => Number(bestTime(b.Q1, b.Q2, b.Q3)) - Number(bestTime(a.Q1, a.Q2, a.Q3)));
                }
                break;
        }


        switch (sortedByCollNameR.coll) {
            case "Pos":
                if (sortedByCollNameR.isAsc) {
                    resultR = resultR?.sort((a, b) => Number(a.position) - Number(b.position));
                } else {
                    resultR = resultR.sort((a, b) => Number(b.position) - Number(a.position));
                }
                break;
            case "Driver":
                if (sortedByCollNameR.isAsc) {
                    resultR = resultR.sort((a, b) =>
                        (a.Driver.familyName).toLowerCase().localeCompare((b.Driver.familyName).toLowerCase()));
                } else {
                    resultR = resultR.sort((a, b) =>
                        (b.Driver.familyName).toLowerCase().localeCompare((a.Driver.familyName).toLowerCase()));
                }
                break;
            case "Team":
                if (sortedByCollNameR.isAsc) {
                    resultR = resultR.sort((a, b) =>
                        a.Constructor.name.toLowerCase().localeCompare(b.Constructor.name.toLowerCase()));
                } else {
                    resultR = resultR.sort((a, b) =>
                        b.Constructor.name.toLowerCase().localeCompare(a.Constructor.name.toLowerCase()));
                }
                break;
            case "Result":
                if (sortedByCollNameR.isAsc) {
                    resultR = resultR.sort((a, b) =>
                        a.Time?.time || "DNQ".toLowerCase().localeCompare(b.Time?.time || "DNQ".toLowerCase()));
                } else {
                    resultR = resultR.sort((a, b) =>
                        b.Time?.time || "DNQ".toLowerCase().localeCompare(a.Time?.time || "DNQ".toLowerCase()));
                }
                break;
            case "Points":
                if (sortedByCollNameR.isAsc) {
                    resultR = resultR.sort((a, b) => Number(a.points) - Number(b.points));
                } else {
                    resultR = resultR.sort((a, b) => Number(b.points) - Number(a.points));
                }
                break;
        }



        setFilteredQualifying(resultQ);
        setFilteredRaces(resultR);
    }, [props.search, qualifying, races, sortedByCollNameQ, sortedByCollNameR])

    const getRaceDetails = async () => {
        setIsError(false);

        try {
            const qualifyingUrl = `https://api.jolpi.ca/ergast/f1/${props.year}/${params.id}/qualifying.json`;
            const racesUrl = `https://api.jolpi.ca/ergast/f1/${props.year}/${params.id}/results.json`;

            const qualifyingResponse = await axios.get(qualifyingUrl);
            const racesResponse = await axios.get(racesUrl);


            setQualifying(qualifyingResponse.data.MRData.RaceTable.Races[0].QualifyingResults);
            setRaces(racesResponse.data.MRData.RaceTable.Races[0]);
        } catch (e) {
            console.error("error ", e);
            setIsError(true);
        } finally {
            setLoading(false);
        }
    }

    const handleClickOnHeader = (collName, sortedByCollName,setSortedByCollName) => {
        let currIsAsc = sortedByCollName.isAsc;
        let currCollName = collName;

        if (sortedByCollName.coll === currCollName) {
            currIsAsc = !currIsAsc;
        } else {
            currIsAsc = true;
        }
        setSortedByCollName({ coll: currCollName, isAsc: currIsAsc });
    }

    const bestTime = (q1, q2, q3) => {
        let min = q1;
        if (q2 < min) {
            min = q2;
        }
        if (q3 < min) {
            min = q3;
        }
        return min;
    };

    // bestTime(430,200,556);



    if (loading) {
        return <Loader />
    }

    let crumbs = [
        { label: "Races", path: "/races" },
        { label: `${races.raceName}`, path: "" }
    ];


    if (isError) {
        return (
            <div className="wrapper">

                <div className="dd-col2">
                    <div className="details">
                        <BasicBreadcrumbs crumbs={crumbs} />
                        <p><b>Race round: {params.id}</b></p>
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
                <div className="details rd-details">
                    <BasicBreadcrumbs crumbs={crumbs} />
                    <Flag country={getFlagByNationality(props.flags, "", races.Circuit.Location.country)}
                        size={200} />
                    <p><b>Race round: {params.id}</b></p>
                    <p><b>{races.raceName}</b></p>
                    <p>Location: {races.Circuit.Location.locality} </p>
                    <p>Date: {races.date}</p>
                    <p>Full Report <a href={races.url} target="_blank"><OpenInNewIcon /></a></p>
                </div>

                <div className="results rd-results">
                    <h2 style={{ textWrap: "nowrap" }}>Qualifying Results - {props.year}</h2>
                    <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th onClick={() => handleClickOnHeader("Pos",sortedByCollNameQ,setSortedByCollNameQ)}>
                                    <Link>Pos {sortedByCollNameQ.coll != "Pos" ? '' :
                                        (sortedByCollNameQ.isAsc ? '▲' : '▼')}</Link></th>

                                <th onClick={() => handleClickOnHeader("Driver",sortedByCollNameQ,setSortedByCollNameQ)}>
                                    <Link>Driver {sortedByCollNameQ.coll != "Driver" ? '' :
                                        (sortedByCollNameQ.isAsc ? '▲' : '▼')}</Link></th>

                                <th onClick={() => handleClickOnHeader("Team",sortedByCollNameQ,setSortedByCollNameQ)}>
                                    <Link>Team {sortedByCollNameQ.coll != "Team" ? '' :
                                        (sortedByCollNameQ.isAsc ? '▲' : '▼')}</Link></th>

                                <th onClick={() => handleClickOnHeader("Best time",sortedByCollNameQ,setSortedByCollNameQ)}>
                                    <Link>Best time {sortedByCollNameQ.coll != "Best time" ? '' :
                                        (sortedByCollNameQ.isAsc ? '▲' : '▼')}</Link></th>

                            </tr>
                        </thead>
                        <tbody>
                            {filteredQualifying.map((qualifier) => {
                                return (
                                    <tr key={qualifier.position}>
                                        <td>{qualifier.position}</td>
                                        <td
                                            onClick={() => navigate(`/driverDetails/${qualifier.Driver.driverId}`)}
                                        >
                                            <div className="flag link">
                                                <Flag country={getFlagByNationality(props.flags,
                                                    qualifier.Driver.nationality)}
                                                    size={30} />
                                                {qualifier.Driver.familyName}
                                            </div>
                                        </td>
                                        <td
                                            onClick={() => navigate(`/teamDetails/${qualifier.Constructor.constructorId}`)}
                                        >
                                            <div className="link">
                                                {qualifier.Constructor.name}
                                            </div>
                                        </td>
                                        <td>{bestTime(qualifier.Q1, qualifier.Q2, qualifier.Q3)}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    </div>
                </div>

                <div className="results rd-results">
                    <h2>Race Results - {props.year}</h2>
                    <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th onClick={() => handleClickOnHeader("Pos",sortedByCollNameR, setSortedByCollNameR)}>
                                    <Link>Pos {sortedByCollNameR.coll != "Pos" ? '' :
                                        (sortedByCollNameR.isAsc ? '▲' : '▼')}</Link></th>

                                <th onClick={() => handleClickOnHeader("Driver",sortedByCollNameR, setSortedByCollNameR)}>
                                    <Link>Driver {sortedByCollNameR.coll != "Driver" ? '' :
                                        (sortedByCollNameR.isAsc ? '▲' : '▼')}</Link></th>

                                <th onClick={() => handleClickOnHeader("Team",sortedByCollNameR, setSortedByCollNameR)}>
                                    <Link>Team {sortedByCollNameR.coll != "Team" ? '' :
                                        (sortedByCollNameR.isAsc ? '▲' : '▼')}</Link></th>

                                <th onClick={() => handleClickOnHeader("Result",sortedByCollNameR, setSortedByCollNameR)}>
                                    <Link>Result {sortedByCollNameR.coll != "Result" ? '' :
                                        (sortedByCollNameR.isAsc ? '▲' : '▼')}</Link></th>

                                <th onClick={() => handleClickOnHeader("Points",sortedByCollNameR, setSortedByCollNameR)}>
                                    <Link>Points {sortedByCollNameR.coll != "Points" ? '' :
                                        (sortedByCollNameR.isAsc ? '▲' : '▼')}</Link></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRaces?.map((race) => {
                                return (
                                    <tr key={race.position}>
                                        <td>{race.position}</td>
                                        <td
                                            onClick={() => navigate(`/driverDetails/${race.Driver.driverId}`)}
                                        >
                                            <div className="flag link">
                                                <Flag country={getFlagByNationality(props.flags,
                                                    race.Driver.nationality)}
                                                    size={30} />{race.Driver.familyName}
                                            </div>
                                        </td>
                                        <td
                                            onClick={() => navigate(`/teamDetails/${race.Constructor.constructorId}`)}>
                                            <div className="link">
                                                {race.Constructor.name}
                                            </div>
                                        </td>
                                        <td>{race?.Time?.time || "DNQ"}</td>
                                        <td style={{ backgroundColor: getColorByPosition(race.position) }}>{race.points}</td>
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