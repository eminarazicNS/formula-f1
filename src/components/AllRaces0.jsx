import axios from "axios";
import { useEffect, useState } from "react";
import Loader from "./Loader";
import { useNavigate } from "react-router";
import { getFlagByNationality } from "../helper/getFlag";
import Flag from "react-flagkit";
import BasicBreadcrumbs from "./BasicBreadcrumbs";

export default function AllRaces(props) {
    const [races, setRaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filteredRaces, setFilteredRaces] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        getRaces();
    }, [props.year]);


    useEffect(() => {
        const result = races.filter((item) =>
            item.raceName.toLowerCase().includes(props.search.toLowerCase()) ||
            item.Circuit.circuitName.toLowerCase().includes(props.search.toLowerCase()) ||
            item.Results[0].Driver.familyName.toLowerCase().includes(props.search.toLowerCase())
        );

        setFilteredRaces(result);
    }, [races, props.search]);


    const getRaces = async () => {
        const url = `https://api.jolpi.ca/ergast/f1/${props.year}/results/1.json`;
        const response = await axios.get(url);
        setRaces(response.data.MRData.RaceTable.Races);
        setLoading(false);
    }

    const handleClick = (id) => {
        navigate(`/raceDetails/${id}`);
    }

    if (loading) {
        return <Loader />;
    }

    const crumbs = [
        { label: "Races", path: "" }
    ];

    return (
        <div className="wrapper">


            <div className="col2" className="results">
                <BasicBreadcrumbs crumbs={crumbs} />
                <h2>RACE CALENDAR - {props.year}</h2>
                <table>
                    <thead>
                        <tr >
                            <th>Round</th>
                            <th>Grand Prix</th>
                            <th>Circuit</th>
                            <th>Date</th>
                            <th>Winner</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRaces.map((race) => {
                            return (
                                <tr key={race.round}>
                                    <td>{race.round}</td>
                                    <td onClick={() => handleClick(race.round)}>
                                        <div className="link">
                                            <Flag country={getFlagByNationality(props.flags, "",
                                                race.Circuit.Location.country)}
                                                size={30} />{race.raceName}
                                        </div>
                                    </td>
                                    <td>{race.Circuit.circuitName}</td>
                                    <td>{race.date}</td>
                                    <td
                                        onClick={() => navigate(`/driverDetails/${race.Results[0].Driver.driverId}`)}>
                                        <div className="link">
                                            <Flag country={
                                                getFlagByNationality(props.flags, race.Results[0].Driver.nationality)}
                                                size={30} />
                                            {race.Results[0].Driver.familyName}
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

