import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import Loader from "./Loader";
import axios from "axios";
import { getFlagByNationality } from "../helper/getFlag";
import Flag from "react-flagkit";
import { getColorByPosition } from "../helper/getColor";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import BasicBreadcrumbs from "./BasicBreadcrumbs";


export default function DriverDetails(props) {
    const [driverDetails, setDriverDetails] = useState([]);
    const [driverRaces, setDriverRaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [filteredDriverRaces, setFilteredDriverRaces] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        getDriverDetails();
    }, [props.year]);

    useEffect(() => {
        const result = driverRaces.filter((item) =>
            item.raceName.toLowerCase().includes(props.search.toLowerCase()) ||
            item.Results[0].Constructor.name.toLowerCase().includes(props.search.toLowerCase())
        );
        setFilteredDriverRaces(result);
    }, [driverRaces, props.search]);

    const params = useParams();

    const getDriverDetails = async () => {
        setIsError(false);
        try {
            const driverStandingsUrl = `https://api.jolpi.ca/ergast/f1/${props.year}/drivers/${params.id}/driverStandings.json`;

            const driverRacesUrl = `https://api.jolpi.ca/ergast/f1/${props.year}/drivers/${params.id}/results.json`;

            const driverStandingsResponse = await axios.get(driverStandingsUrl);
            const driverRacesResponse = await axios.get(driverRacesUrl);


            setDriverDetails(driverStandingsResponse.data.MRData.StandingsTable.StandingsLists[0].DriverStandings[0]);
            setDriverRaces(driverRacesResponse.data.MRData.RaceTable.Races);
        } catch (e) {
            console.error("error ", e);
            setIsError(true);
        } finally {
            setLoading(false);
        }
    }



    if (loading) {
        return <Loader />
    }


    let crumbs = [
        { label: "Drivers", path: "/drivers" },
        { label: `${driverDetails.Driver.givenName} ${driverDetails.Driver.familyName}`, path: "" }
    ];

    if (isError) {
        return (
            <div className="wrapper">
                <div className="dd-col2">
                    <div className="details">
                        <BasicBreadcrumbs crumbs={crumbs} />
                        <div style={{ display: "flex" }}>

                            <img src={`${import.meta.env.BASE_URL}img/${driverDetails.Driver.driverId}.jpg`}
                                onError={(e) => {

                                    e.target.src = `${import.meta.env.BASE_URL}img/avatar.png`;
                                }}
                                alt={driverDetails.Driver.familyName}
                                style={{ width: 150 }} />
                            <div style={{ padding: "5px", textAlign: "left" }}>
                                <Flag country={getFlagByNationality(props.flags, driverDetails.Driver.nationality)}
                                    size={30} />
                                <b> <p>{driverDetails.Driver.givenName}</p>
                                    <p>{driverDetails.Driver.familyName}</p>
                                </b>
                            </div>
                        </div>

                        <p>Country: {driverDetails.Driver.nationality}</p>
                        <p>Team: {driverDetails.Constructors[0].name} </p>
                        <p>Birth: {driverDetails.Driver.dateOfBirth}</p>
                        <p>History: <a href={driverDetails.Driver.url} target="_blank"><OpenInNewIcon /></a></p>
                    </div>

                    <div className="results">
                        <div className="no-data-div">
                            <img src={`${import.meta.env.BASE_URL}img/emoji-faces-sad-emoji.png`} alt="sad-emoji" />
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
                        <img src={`${import.meta.env.BASE_URL}img/${driverDetails.Driver.driverId}.jpg`}
                            onError={(e) => {
                                //e.target.onerror = null;
                                e.target.src = `${import.meta.env.BASE_URL}img/avatar.png`;
                            }}
                            alt={driverDetails.Driver.familyName}
                            style={{ width: 150 }} />
                        <div style={{ padding: "5px", textAlign: "left" }}>
                            <Flag country={getFlagByNationality(props.flags, driverDetails.Driver.nationality)}
                                size={30} />
                            <b> <p>{driverDetails.Driver.givenName}</p>
                                <p>{driverDetails.Driver.familyName}</p>
                            </b>
                        </div>
                    </div>

                    <p>Country: {driverDetails.Driver.nationality}</p>
                    <p>Team: {driverDetails.Constructors[0].name}</p>
                    <p>Birth: {driverDetails.Driver.dateOfBirth}</p>
                    <p>History: <a href={driverDetails.Driver.url} target="_blank"><OpenInNewIcon /></a></p>
                </div>

                <div className="results">
                    <h2>Formula 1 - {props.year} Results</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Round</th>
                                <th>Grand Prix</th>
                                <th>Team</th>
                                <th>Grid</th>
                                <th>Race</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDriverRaces.map((race) => {
                                return (
                                    <tr key={race.round}>
                                        <td>{race.round}</td>
                                        <td className="link"
                                            onClick={() => navigate(`/raceDetails/${race.round}`)}
                                        >
                                            <div className="flag">
                                                <Flag country={getFlagByNationality(props.flags, "",
                                                    race.Circuit.Location.country)}
                                                    size={30} />{race.raceName}
                                            </div>
                                        </td>
                                        <td
                                            onClick={() => navigate(`/teamDetails/${race.Results[0].Constructor.constructorId}`)}
                                        >
                                            <div className="link">
                                                {race.Results[0].Constructor.name}
                                            </div>
                                        </td>
                                        <td>{race.Results[0].grid}</td>
                                        <td
                                            style={{ backgroundColor: getColorByPosition(race.Results[0].position) }}
                                        >
                                            <div className="race-column">
                                                {race.Results[0].position}
                                                {parseInt(race.Results[0].position) > parseInt(race.Results[0].grid) ?
                                                    <span className="down">({parseInt(race.Results[0].grid) - parseInt(race.Results[0].position)})</span> :
                                                    <></>}
                                                {parseInt(race.Results[0].position) < parseInt(race.Results[0].grid) ?
                                                    <span className="up">(+{parseInt(race.Results[0].grid) - parseInt(race.Results[0].position)})</span> :
                                                    <></>}
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>


            </div>
        </div >

    );
}