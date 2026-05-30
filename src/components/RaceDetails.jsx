//Ne radi pretraga po Search polju, pa je taj deo zakomentarisan.
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
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

    const params = useParams();

    const navigate = useNavigate();

    useEffect(() => {
        getRaceDetails();
    }, [props.year]);

    useEffect(() => {
        const resultQ = qualifying.filter((item) =>
            item.Driver.familyName.toLowerCase().includes(props.search.toLowerCase()) ||
            item.Constructor.name.toLowerCase().includes(props.search.toLowerCase())
        );

        const resultR = races.Results?.filter((item) =>
            item.Driver.familyName.toLowerCase().includes(props.search.toLowerCase()) ||
            item.Constructor.name.toLowerCase().includes(props.search.toLowerCase())
        );

        setFilteredQualifying(resultQ);
        setFilteredRaces(resultR);
    }, [props.search, qualifying, races])

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
                    <table>
                        <thead>
                            <tr>
                                <th>Pos</th>
                                <th>Driver</th>
                                <th>Team</th>
                                <th>Best time</th>
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

                <div className="results rd-results">
                    <h2>Race Results - {props.year}</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Pos</th>
                                <th>Driver</th>
                                <th>Team</th>
                                <th>Result</th>
                                <th>Points</th>
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
    );
}